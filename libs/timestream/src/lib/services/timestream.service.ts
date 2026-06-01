import { configService } from '@fronyx/configurations';
import { Injectable } from '@nestjs/common';
import { TimestreamWriteClient, WriteRecordsCommand, WriteRecordsCommandInput } from '@aws-sdk/client-timestream-write';
import { TimestreamQueryClient, QueryCommand } from '@aws-sdk/client-timestream-query';
import { OcpiStatusLog } from '../../../../../apps/cdk-apps/src/shared';
import { groupIntoChunk } from '../../../../../apps/cdk-apps/src/shared/utils/group-into-chunk';

@Injectable()
export class TimestreamService {
    private client: TimestreamWriteClient;
    private queryClient: TimestreamQueryClient;

    constructor(
    ) {
        this.client = new TimestreamWriteClient(configService.getAwsConfigurations());
        this.queryClient = new TimestreamQueryClient(configService.getAwsConfigurations());
    }

    async storeStatusLogs(logs: Partial<OcpiStatusLog>[]): Promise<void> {
        const records = logs.map(log => {
            const dimensions = [
                { Name: 'evse_id', Value: log.evse_id },
                { Name: 'location_id', Value: log.location_id },
                { Name: 'evse_primary_id', Value: log.evse_primary_id },
            ];

            return {
                Dimensions: dimensions,
                MeasureName: 'status',
                MeasureValue: log.status,
                MeasureValueType: 'VARCHAR',
                Time: new Date(log.last_updated).getTime().toString(),
                TimeUnit: 'MILLISECONDS',
            };
        });

        const params: WriteRecordsCommandInput = {
            DatabaseName: 'LogsDb',
            TableName: 'ocpi_status_logs',
            Records: records as any,
        }; 
        const command = new WriteRecordsCommand(params);

        await this.client.send(command);
    }

    async getLogsForLastMinute(): Promise<OcpiStatusLog[]> {
        const command = new QueryCommand({
            QueryString: `SELECT evse_primary_id, time, measure_value::varchar
            FROM "LogsDb".ocpi_status_logs
            WHERE time >= ago(1m)`,
        });
        const results = await this.queryClient.send(command);

        const statusLogs = results?.Rows
        ?.map(({ Data }: any) => Data)
        ?.map(([{ ScalarValue: evse_primary_id }, { ScalarValue: last_updated }, { ScalarValue: status }]) => ({ evse_primary_id, last_updated, status }))
        ?.map(log => OcpiStatusLog.create(log)) ?? [];

        return statusLogs;
    }

    async getLogsForPredictionsProcessing(toolkitScopeIds: Partial<{ primary_id }>[]): Promise<OcpiStatusLog[]> {
        const statusLogs = [];

        for (const scopedIds of groupIntoChunk({ data: toolkitScopeIds.map(({ primary_id }) => `'${primary_id}'`), chunkSize: 2000 })) {
            const command = new QueryCommand({
                QueryString: `SELECT evse_primary_id, time, measure_value::varchar
                FROM "LogsDb".ocpi_status_logs
                WHERE ( evse_primary_id IN (${scopedIds.join(', ')})
                    AND time >= ago(8h) )
                    UNION ALL
                    SELECT evse_primary_id, time, measure_value::varchar
                FROM (
                  SELECT evse_primary_id, time, measure_value::varchar,
                ROW_NUMBER() OVER (PARTITION BY evse_primary_id ORDER BY time DESC) as rnk
                  FROM "LogsDb".ocpi_status_logs
                WHERE ( evse_primary_id IN (${scopedIds.join(', ')})
                    AND time > ago(7d+8h) AND time <= ago(8h)))`,
            });
            const results = await this.queryClient.send(command);

            statusLogs.push(...results?.Rows
                ?.map(({ Data }: any) => Data)
                ?.map(([{ ScalarValue: evse_primary_id }, { ScalarValue: last_updated }, { ScalarValue: status }]) => ({ evse_primary_id, last_updated, status }))
                ?.map(log => OcpiStatusLog.create(log)));
        }

        return statusLogs;
    }
}

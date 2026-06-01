import { Controller, UseInterceptors, Delete, Param, Get, Patch, Body } from '@nestjs/common';
import { SentryInterceptor } from '../../../sentry/sentry.interceptor';
import { OcpiConnectorsService } from '@fronyx/persistence';
import { OcpiConnector } from '../../../cdk-apps/src/shared/domain/logging/update-create/models/ocpi-connector';
import {
  OcpiConnectorPrimaryId
} from '../../../cdk-apps/src/shared/domain/logging/update-create/models/ocpi-connector-primary-id';
import { ApiExcludeController } from '@nestjs/swagger';

interface ConnectorRequestParam {
  locationId: string;
  uid: string;
  connectorId: string;
}

@ApiExcludeController()
@UseInterceptors(SentryInterceptor)
@Controller('connectors')
export class ConnectorsController {
  constructor(
    private readonly ocpiConnectorsService: OcpiConnectorsService,
  ) {
  }

  @Get(':locationId/:uid/:connectorId')
  async getConnector(@Param() params: ConnectorRequestParam): Promise<OcpiConnector> {
    return this.ocpiConnectorsService.getConnector({
      primaryId: OcpiConnectorPrimaryId.create({
        locationId: params.locationId,
        uid: params.uid,
        connectorId: params.connectorId,
      }),
    });
  }

  @Delete(':locationId/:uid/:connectorId')
  async deleteConnector(@Param() params: ConnectorRequestParam): Promise<void> {
    await this.ocpiConnectorsService.deleteByPrimaryId({
      primaryId: OcpiConnectorPrimaryId.create({
        locationId: params.locationId,
        uid: params.uid,
        connectorId: params.connectorId,
      }),
    });
  }
}

import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  FindPredictionByEvseParams,
  FindPredictionByLocationParams,
  TimeframeQueryParams,
} from '@fronyx/data-transfer-object';
import { SentryInterceptor } from '../../../sentry/sentry.interceptor';
import {
  ProjectScopeByEvseIdGuard,
  ProjectScopeGuard,
  ProjectScopeLocationIdsGuard,
  ProjectScopeMultipleEvseParamsGuard,
  ProjectTokensAuthorizationsGuard,
  ReqTokenDecorator,
} from '@fronyx/authentications';
import {
  ChargingStationPrediction,
  EvsePrediction,
  InvalidRequestParameterError,
} from '../../../cdk-apps/src/shared';
import { CloudWatchLoggerInterceptor } from '@fronyx/cloudwatch-logger';
import { isEmptyString } from '../../../cdk-apps/src/shared/utils/is-empty-string.function';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { PredictionsQueryService } from '@fronyx/predictions';
import { ApiResponseInterceptor } from './services/api-response.interceptor';
import { ToolkitProject } from '@fronyx/toolkit';

@ApiTags('Availability prediction')
@UseInterceptors(SentryInterceptor, ApiResponseInterceptor)
@Controller('predictions')
@UsePipes(new ValidationPipe({ transform: true }))
export class PredictionsController {
  private readonly exceededQueryLimitErrorMessage =
    'Too many query parameters. Please provide a maximum of 42 query parameters.';

  constructor(private readonly predictionsService: PredictionsQueryService) {}

  @ApiOperation({ summary: 'Get predictions for EVSE by EVSE ID' })
  @ApiParam({
    name: 'evseId',
    required: true,
    description: 'ID of the EVSE.',
    schema: { oneOf: [{ type: 'string' }] },
    example: 'DEALLEGO0025132',
  })
  @ApiQuery({
    name: 'timeframe',
    required: false,
    description:
      'The prediction timeframe value is in minutes.\n \n Required when requesting a prediction at a certain time.\n \n Requesting without the timeframe will return a prediction of location for the whole timeframe configured for your API key.\n \n Note: Value is in minutes in 15 minutes intervals starting from 0.',
    schema: { oneOf: [{ type: 'number' }] },
    example: '15',
  })
  @ApiSecurity('apiToken')
  @ApiResponse({
    status: 500,
    description:
      '<li>Sorry, we couldn\'t predict this ID now, try again later.</li>' +
      '<ul>The prediction of the requested EVSE is not available.</ul>' +
      '<li>Duplicated entities for the same EVSE ID were found.</li>' +
      '<ul>There is more than 1 EVSE with the given EVSE ID.</ul>',
  })
  @ApiResponse({
    status: 400,
    description:
      '<li>Invalid query parameter. EVSE id is missing.</li>' +
      '<ul>URL parameter is either an empty string, undefined or null.</ul>' +
      '<li>This ID couldn\'t be found. {evseId}</li>' +
      '<ul>Unknown entity</ul>',
  })
  @ApiResponse({
    status: 403,
    description:
      '<li>Your plan doesn\'t allow to access predictions more than 6 hours ahead. Please check with your administrator.</li>' +
      '<ul>The timeframe is not within your project scope.</ul>' +
      '<li>Your plan doesn\'t allow access to the requested key: {params.evseId}</li>' +
      '<ul>The EVSE is not within your project scope.</ul>',
  })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        evseId: 'DEALLEGO0025132',
        predictions: [
          {
            timestamp: '2022-10-20T05:00:00.000Z',
            status: 'AVAILABLE',
          },
        ],
      },
    },
  })
  @Get('evse-id/:evseId')
  @UseGuards(ProjectTokensAuthorizationsGuard, ProjectScopeByEvseIdGuard)
  @UseInterceptors(CloudWatchLoggerInterceptor)
  async findByEvseId(
    @ReqTokenDecorator() project: ToolkitProject,
    @Param() params: { evseId: string },
    @Query() queryParams: TimeframeQueryParams
  ): Promise<EvsePrediction> {
    const [prediction] =
      await this.predictionsService.getEvsePredictionsByEvseIds(
        [params.evseId],
        project,
        queryParams.value()
      );

    return prediction;
  }

  @ApiOperation({
    summary: 'Get predictions for EVSE by location ID with EVSE ID',
  })
  @ApiParam({
    name: 'locationId',
    required: true,
    description: 'ID of the charging station.',
    schema: { oneOf: [{ type: 'string' }] },
    example: 'DE-ALL-EGO002513',
  })
  @ApiParam({
    name: 'evseId',
    required: true,
    description: 'ID of the EVSE.',
    schema: { oneOf: [{ type: 'string' }] },
    example: 'DEALLEGO0025132',
  })
  @ApiQuery({
    name: 'timeframe',
    required: false,
    description:
      'The prediction timeframe value is in minutes.\n \n Required when requesting a prediction at a certain time.\n \n Requesting without the timeframe will return a prediction of location for the whole timeframe configured for your API key.\n \n Note: Value is in minutes in 15 minutes intervals starting from 0.',
    schema: { oneOf: [{ type: 'number' }] },
    example: '15',
  })
  @ApiSecurity('apiToken')
  @ApiResponse({
    status: 500,
    description:
      '<li>Sorry, we couldn\'t predict this ID now, try again later.</li>' +
      '<ul>The prediction of the requested location ID and EVSE ID is not available.</ul>' +
      '<li>Duplicated entities for the same EVSE ID were found.</li>' +
      '<ul>There is more than 1 EVSE with the given EVSE ID.</ul>',
  })
  @ApiResponse({
    status: 400,
    description:
      '<li>Missing locationId from URL parameters.</li>' +
      '<ul>URL parameter is either an empty string, undefined or null.</ul>' +
      '<li>This ID couldn\'t be found. {locationId_evseId}</li>' +
      '<ul>Unknown entity</ul>',
  })
  @ApiResponse({
    status: 403,
    description:
      '<li>Your plan doesn\'t allow to access predictions more than 6 hours ahead. Please check with your administrator.</li>' +
      '<ul>The timeframe is not within your project scope.</ul>' +
      '<li>Your plan doesn\'t allow access to the requested ID {params.locationId}_{params.evseId}</li>' +
      '<ul>The location ID and EVSE ID are not within your project scope.</ul>',
  })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        evseId: 'DEALLEGO0025132',
        predictions: [
          {
            timestamp: '2022-10-20T05:00:00.000Z',
            status: 'AVAILABLE',
          },
        ],
      },
    },
  })
  @Get(':locationId/evses/:evseId')
  @UseGuards(ProjectTokensAuthorizationsGuard, ProjectScopeGuard)
  @UseInterceptors(CloudWatchLoggerInterceptor)
  async findByLocationAndEvse(
    @ReqTokenDecorator() project: ToolkitProject,
    @Param() params: FindPredictionByEvseParams,
    @Query() timeframeQueryParams: TimeframeQueryParams
  ): Promise<EvsePrediction> {
    const [prediction] =
      await this.predictionsService.getEvsePredictionsByLocationIdsEvseIds(
        [`${params.locationId}_${params.evseId}`],
        project,
        timeframeQueryParams.value()
      );

    return prediction;
  }

  @ApiOperation({
    summary: 'Get predictions for EVSE by location ID with EVSE UID',
  })
  @ApiParam({
    name: 'locationId',
    required: true,
    description: 'ID of the charging station.',
    schema: { oneOf: [{ type: 'string' }] },
    example: 'DE-ALL-EGO002513',
  })
  @ApiParam({
    name: 'uid',
    required: true,
    description: 'UID of the EVSE.',
    schema: { oneOf: [{ type: 'string' }] },
    example: '6160ed381f0238952e1ebdb9',
  })
  @ApiQuery({
    name: 'timeframe',
    required: false,
    description:
      'The prediction timeframe value is in minutes.\n \n Required when requesting a prediction at a certain time.\n \n Requesting without the timeframe will return a prediction of location for the whole timeframe configured for your API key.\n \n Note: Value is in minutes in 15 minutes intervals starting from 0.',
    schema: { oneOf: [{ type: 'number' }] },
    example: '15',
  })
  @ApiSecurity('apiToken')
  @ApiResponse({
    status: 500,
    description:
      '<li>Sorry, we couldn\'t predict this ID now, try again later.</li>' +
      '<ul>The prediction of the requested location ID and EVSE ID is not available.</ul>' +
      '<li>Duplicated entities for the same EVSE ID were found.</li>' +
      '<ul>There is more than 1 EVSE with the given EVSE ID.</ul>',
  })
  @ApiResponse({
    status: 400,
    description:
      '<li>Missing locationId from URL parameters.</li>' +
      '<ul>URL parameter is either an empty string, undefined or null.</ul>' +
      '<li>This ID couldn\'t be found. {locationId_uid}</li>' +
      '<ul>Unknown entity</ul>',
  })
  @ApiResponse({
    status: 403,
    description:
      '<li>Your plan doesn\'t allow to access predictions more than 6 hours ahead. Please check with your administrator.</li>' +
      '<ul>The timeframe is not within your project scope.</ul>' +
      '<li>Your plan doesn\'t allow access to the requested ID {params.locationId}_{params.uid}</li>' +
      '<ul>The location ID and EVSE UID are not within your project scope.</ul>',
  })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        uid: '6160ed381f0238952e1ebdb9',
        predictions: [
          {
            timestamp: '2022-10-20T05:00:00.000Z',
            status: 'AVAILABLE',
          },
        ],
      },
    },
  })
  @Get(':locationId/uid/:uid')
  @UseGuards(ProjectTokensAuthorizationsGuard, ProjectScopeGuard)
  @UseInterceptors(CloudWatchLoggerInterceptor)
  async findByLocationAndUid(
    @ReqTokenDecorator() project: ToolkitProject,
    @Param() params: any,
    @Query() timeframeQueryParams: TimeframeQueryParams
  ): Promise<EvsePrediction> {
    const [prediction] =
      await this.predictionsService.getEvsePredictionsByLocationIdsUids(
        [`${params.locationId}_${params.uid}`],
        project,
        timeframeQueryParams.value()
      );

    return prediction;
  }

  @ApiOperation({
    summary:
      'Get predictions for multiple EVSEs by location ID with EVSE ID or location ID with EVSE UID or EVSE ID',
  })
  @ApiQuery({
    name: 'evseIds',
    required: false,
    description: 'EVSE IDs separates by ,',
    schema: { oneOf: [{ type: 'string' }] },
    example: 'DEEBWE9067002,DEALLEGO0025132',
  })
  @ApiQuery({
    name: 'locationIdsEvseIds',
    required: false,
    description:
      'Combination of location ID and EVSE ID separate by _ for one prediction. \n \n To separate each locationIdsEvseIds you need to separate it by ,',
    schema: { oneOf: [{ type: 'string' }] },
    example: 'DESWML000172821_DESWME028001,DE-ALL-EGO002513_DEALLEGO0025132',
  })
  @ApiQuery({
    name: 'locationIdsUids',
    required: false,
    description:
      'Combination of location ID and EVSE UID separate by _ for one prediction. \n \n To separate each locationIdsUids you need to separate it by ,',
    schema: { oneOf: [{ type: 'string' }] },
    example: 'DE-CHC-DELVPE30008_61e9fe2f1ab2caa98343ccb3,DE-ALL-EGO002513_6160ed381f0238952e1ebdb9',
  })
  @ApiQuery({
    name: 'timeframe',
    required: false,
    description:
      'The prediction timeframe value is in minutes.\n \n Required when requesting a prediction at a certain time.\n \n Requesting without the timeframe will return a prediction of location for the whole timeframe configured for your API key.\n \n Note: Value is in minutes in 15 minutes intervals starting from 0.',
    schema: { oneOf: [{ type: 'number' }] },
    example: '15',
  })
  @ApiSecurity('apiToken')
  @ApiResponse({
    status: 500,
    description:
      '<li>No predictions are available at the moment. Please try again later.</li>' +
      '<ul>The prediction of the requested location IDs are not available.</ul>',
  })
  @ApiResponse({
    status: 400,
    description:
      '<li>Too many query parameters. Please provide a maximum of 42 query parameters.</li>' +
      '<ul>Enters more than 42 location IDs in the query parameter.</ul>' +
      '<li>URL params are not supported for this endpoint.</li>' +
      '<ul>A user enters parameters to the URL.</ul>' +
      '<li>Invalid query parameter. Only locationIds and timeframe are supported.</li>' +
      '<ul>location ID and timeframe are either empty strings, undefined, null, or not provided in the URL</ul>' +
      '<li>Invalid query parameter. Supported query parameters: evseIds OR locationIdsEvseIds OR locationIdsUids.</li>' +
      '<ul>URL query parameter(s) are either empty strings, undefined, null, or not provided in the URL</ul>' +
      '<li>Invalid query parameter. Only either one of evseIds OR locationIdsEvseIds OR locationIdsUids are supported.</li>' +
      '<ul>User enter more than 2 query parameter. Enter evseIds with timeframe or locationIdsEvseIds with timeframe or locationIdsUids with timeframe</ul>' +
      '<li>This ID couldn\'t be found. {id}</li>' +
      '<ul>Unknown entity</ul>',
  })
  @ApiResponse({
    status: 403,
    description:
      '<li>Your plan doesn\'t allow to access predictions more than 6 hours ahead. Please check with your administrator.</li>' +
      '<ul>The timeframe is not within your project scope.</ul>' +
      '<li>Your plan doesn\'t allow access to the requested key: {id}}</li>'  +
      '<ul>The location ID with EVSE ID or location ID with EVSE UID or EVSE ID are not within your project scope.</ul>',
  })
  @ApiResponse({
    status: 200,
    schema: {
      example: [
        {
          locationId: 'DESWML000172821',
          evseId: 'DESWME028001',
          predictions: [
            {
              timestamp: '2022-10-20T05:00:00.000Z',
              status: 'AVAILABLE',
            },
          ],
        },
        {
          locationId: 'DE-ALL-EGO002513',
          evseId: 'DEALLEGO0025132',
          predictions: [
            {
              timestamp: '2022-10-20T05:00:00.000Z',
              status: 'NOT AVAILABLE',
            },
          ],
        },
      ],
    },
  })
  @Get('evses')
  @UseGuards(
    ProjectTokensAuthorizationsGuard,
    ProjectScopeMultipleEvseParamsGuard
  )
  @UseInterceptors(CloudWatchLoggerInterceptor)
  async findMultipleEvsesPredictions(
    @ReqTokenDecorator() project: ToolkitProject,
    @Query()
    queryParams: {
      locationIdsUids?: string;
      locationIdsEvseIds?: string;
      evseIds?: string;
      timeframe?: string;
    }
  ): Promise<EvsePrediction[]> {
    const limit = 42;
    let evsePredictions = [];
    const timeframe = isEmptyString(queryParams.timeframe)
      ? null
      : Number(queryParams.timeframe);

    if (!isEmptyString(queryParams.locationIdsUids)) {
      const primaryIds = queryParams.locationIdsUids
        .replace(/\s+/g, '')
        .split(',')
        .filter((val) => !isEmptyString(val));

      if (primaryIds.length > limit) {
        throw new InvalidRequestParameterError(
          this.exceededQueryLimitErrorMessage
        );
      }

      evsePredictions =
        await this.predictionsService.getEvsePredictionsByLocationIdsUids(
          primaryIds,
          project,
          timeframe
        );
    } else if (!isEmptyString(queryParams.locationIdsEvseIds)) {
      const locationIdsEvseIds = queryParams.locationIdsEvseIds
        .replace(/\s+/g, '')
        .split(',')
        .filter((val) => !isEmptyString(val));

      if (locationIdsEvseIds.length > limit) {
        throw new InvalidRequestParameterError(
          this.exceededQueryLimitErrorMessage
        );
      }

      evsePredictions =
        await this.predictionsService.getEvsePredictionsByLocationIdsEvseIds(
          locationIdsEvseIds,
          project,
          timeframe
        );
    } else if (!isEmptyString(queryParams.evseIds)) {
      const evseIds = queryParams.evseIds
        .replace(/\s+/g, '')
        .split(',')
        .filter((val) => !isEmptyString(val));

      if (evseIds.length > limit) {
        throw new InvalidRequestParameterError(
          this.exceededQueryLimitErrorMessage
        );
      }

      evsePredictions =
        await this.predictionsService.getEvsePredictionsByEvseIds(
          evseIds,
          project,
          timeframe
        );
    }

    return evsePredictions;
  }

  @ApiOperation({ summary: 'Get predictions for location by location ID' })
  @ApiParam({
    name: 'locationId',
    required: true,
    description: 'ID of the charging station.',
    schema: { oneOf: [{ type: 'string' }] },
    example: 'DE-ALL-EGO002513',
  })
  @ApiQuery({
    name: 'timeframe',
    required: false,
    description:
      'The prediction timeframe value is in minutes.\n \n Required when requesting a prediction at a certain time.\n \n Requesting without the timeframe will return a prediction of location for the whole timeframe configured for your API key.\n \n Note: Value is in minutes in 15 minutes intervals starting from 0.',
    schema: { oneOf: [{ type: 'number' }] },
    example: '15',
  })
  @ApiSecurity('apiToken')
  @ApiResponse({
    status: 500,
    description:
      '<li>Sorry, we couldn\'t predict this ID now, try again later.</li>' +
      '<ul>The prediction of the requested location is not available.</ul>' +
      '<li>Duplicated entities for the same ID were found.</li>' +
      '<ul>There is more than 1 location with the given location ID.</ul>',
  })
  @ApiResponse({
    status: 400,
    description:
      '<li>Missing URL parameters.</li>' +
      '<ul>The URL parameter is empty.</ul>' +
      '<li>Missing locationId from URL parameters.</li>' +
      '<ul>URL parameter is either an empty string, undefined or null</ul>' +
      '<li>This ID couldn\'t be found. {locationId}</li>' +
      '<ul>Unknown entity</ul>',
  })
  @ApiResponse({
    status: 403,
    description:
      '<li>Your plan doesn\'t allow to access predictions more than 6 hours ahead. Please check with your administrator.</li>' +
      '<ul>The timeframe is not within your project scope.</ul>' +
      '<li>Your plan doesn\'t allow access to the requested ID.</li>' +
      '<ul>The location ID is not within your project scope.</ul>',
  })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        id: 'DDE-ALL-EGO002513',
        predictions: [
          {
            timestamp: '2022-10-20T05:00:00.000Z',
            status: 'AVAILABLE',
          },
        ],
      },
    },
  })
  @Get(':locationId')
  @UseGuards(ProjectTokensAuthorizationsGuard, ProjectScopeGuard)
  @UseInterceptors(CloudWatchLoggerInterceptor)
  async findLocation(
    @ReqTokenDecorator() project: ToolkitProject,
    @Param() params: FindPredictionByLocationParams,
    @Query() queryParams: TimeframeQueryParams
  ): Promise<ChargingStationPrediction> {
    const [prediction] = await this.predictionsService.getLocationsPredictions(
      [params.locationId],
      project,
      queryParams.value()
    );

    return prediction;
  }

  @ApiOperation({
    summary: 'Get predictions for multiple locations by location ID',
  })
  @ApiQuery({
    name: 'locationIds',
    required: true,
    description: 'IDs of the charging station separates in ,',
    schema: { oneOf: [{ type: 'string' }] },
    example: 'DE-EBW-906700,DE-ALL-EGO002513',
  })
  @ApiQuery({
    name: 'timeframe',
    required: false,
    description:
      'The prediction timeframe value is in minutes.\n \n Required when requesting a prediction at a certain time.\n \n Requesting without the timeframe will return a prediction of location for the whole timeframe configured for your API key.\n \n Note: Value is in minutes in 15 minutes intervals starting from 0.',
    schema: { oneOf: [{ type: 'number' }] },
    example: '15',
  })
  @ApiSecurity('apiToken')
  @ApiResponse({
    status: 500,
    description:
      '<li>No predictions are available at the moment. Please try again later.</li>' +
      '<ul>The prediction of the requested location IDs are not available.</ul>' +
      '<li>Duplicated entities for the same ID were found.</li>' +
      '<ul>There is more than 1 location with the given location ID.</ul>',
  })
  @ApiResponse({
    status: 400,
    description:
      '<li>Invalid query parameters. No locationIds are provided.</li>' +
      '<ul>URL query parameter is either an empty string, undefined or null.</ul>' +
      '<li>Too many query parameters. Please provide a maximum of 42 query parameters.</li>' +
      '<ul>Enters more than 42 location IDs in the query parameter.</ul>' +
      '<li>Invalid parameter. URL params are not supported for this endpoint.</li>' +
      '<ul>A user enters parameters to the URL.</ul>' +
      '<li>Invalid query parameter. Only locationIds and timeframe are supported.</li>' +
      '<ul>location ID and timeframe are either empty strings, undefined, null, or not provided in the URL</ul>' +
      '<li>This ID couldn\'t be found. {locationId}</li>' +
      '<ul>Unknown entity</ul>',
  })
  @ApiResponse({
    status: 403,
    description:
      '<li>Your plan doesn\'t allow to access predictions more than 6 hours ahead. Please check with your administrator.</li>' +
      '<ul>The timeframe is not within your project scope.</ul>' +
      '<li>Your plan doesn\'t allow access to the requested ID {params.locationId}_{params.uid}</li>' +
      '<ul>The location ID and EVSE UID are not within your project scope.</ul>',
  })
  @ApiResponse({
    status: 200,
    schema: {
      example: [
        {
          id: 'DE-EBW-906700',
          predictions: [
            {
              timestamp: '2022-10-20T05:00:00.000Z',
              status: 'AVAILABLE',
            },
          ],
        },
        {
          id: 'DDE-ALL-EGO002513',
          predictions: [
            {
              timestamp: '2022-10-20T05:00:00.000Z',
              status: 'NOT AVAILABLE',
            },
          ],
        },
      ],
    },
  })
  @Get('locations')
  @UseGuards(
    ProjectTokensAuthorizationsGuard,
    ProjectScopeLocationIdsGuard
  )
  @UseInterceptors(CloudWatchLoggerInterceptor)
  async findByLocationIds(
    @ReqTokenDecorator() project: ToolkitProject,
    @Query() queryParams: { locationIds: string; timeframe?: string }
  ): Promise<EvsePrediction[]> {
    const limit = 42;
    const timeframe = isEmptyString(queryParams.timeframe)
      ? null
      : Number(queryParams.timeframe);
    const locationIds = queryParams.locationIds.replace(/\s+/g, '').split(',');

    if (locationIds.length > limit) {
      throw new InvalidRequestParameterError(
        this.exceededQueryLimitErrorMessage
      );
    }

    return this.predictionsService.getLocationsPredictions(
      locationIds,
      project,
      timeframe
    );
  }
}

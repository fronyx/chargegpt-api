import { Controller, UseInterceptors, UseGuards, Post, Body } from '@nestjs/common';
import {
  ProjectScopeRecommendationsAddressCoordinatesGuard,
  ProjectScopeRecommendationsPowerTypeGuard,
  ProjectScopeRecommendationsTimestampGuard,
  ProjectTokensAuthorizationsGuard,
  ReqTokenDecorator
} from '@fronyx/authentications';
import {
  ApiBody,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags
} from '@nestjs/swagger';
import { SentryInterceptor } from '../../../../../apps/sentry/sentry.interceptor';
import { RecommendationService } from '../services/scoring-services/recommendation.service';
import { Coordinate } from '@fronyx/data-transfer-object';
import { Location } from '../models/prompt';
import { destinationDocs } from './api-docs/recommendations-api-docs';
import { ToolkitProject } from '@fronyx/toolkit';


@ApiTags('Recommendations')
@UseInterceptors(SentryInterceptor)
@Controller('recommendations')
export class RecommendationsController {
  constructor(
    private readonly recommendationService: RecommendationService,
  ) {
  }

  @ApiOperation(destinationDocs.operation)
  @ApiSecurity('apiToken')
  @ApiBody(destinationDocs.body)
  @ApiResponse(destinationDocs.response['200'])
  @ApiResponse(destinationDocs.response['403'])
  @ApiResponse(destinationDocs.response['500'])
  @Post('destination')
  @UseGuards(
    ProjectTokensAuthorizationsGuard,
    ProjectScopeRecommendationsAddressCoordinatesGuard,
    ProjectScopeRecommendationsTimestampGuard,
    ProjectScopeRecommendationsPowerTypeGuard
  )
  async searchDestinationRecommendation(
    @ReqTokenDecorator() project: ToolkitProject,
    @Body() body: {
      timestamp: number;
      coordinates?: Coordinate
      address?: string;
      powerType?: string;
      operatorName?: string;
      connectorType?: string;
      minPower?: number;
      maxPower?: number;
    },
  ): Promise<Location[]> {
    return await this.recommendationService.searchDestinationRecommendation({
      project,
      timestamp: body.timestamp,
      coordinates: body.coordinates,
      address: body.address,
      powerType: body.powerType,
      operatorName: body.operatorName,
      connectorType: body.connectorType,
      minPower: body.minPower,
      maxPower: body.maxPower,
    });
  }

  @ApiExcludeEndpoint()
  @Post('route')
  @UseGuards(ProjectTokensAuthorizationsGuard)
  async searchRoutingRecommendation(
    @ReqTokenDecorator() project: ToolkitProject,
    @Body() body: {
      originAddress?: string;
      destinationAddress?: string;
      originCoordinates?: Coordinate,
      destinationCoordinates?: Coordinate,
      distance?: number;
      maxSearchDistance?: number;
      routeNeed?: string;
    }): Promise<{
    chargingStations: Location[],
    navigationLink?: string
  }> {
    return await this.recommendationService.searchRoutingRecommendation({
      project,
      originAddress: body.originAddress,
      destinationAddress: body.destinationAddress,
      originCoordinates: body.originCoordinates,
      destinationCoordinates: body.destinationCoordinates,
      distance: body.distance,
      maxSearchDistance: body.maxSearchDistance,
      routeNeed: body.routeNeed,
    });


  }
}

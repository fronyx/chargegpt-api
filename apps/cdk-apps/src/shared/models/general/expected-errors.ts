import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException, UnauthorizedException, UnsupportedMediaTypeException,
} from '@nestjs/common';

class BaseExpectedError {
  publicErrorClass: any;
  message: string;
  internalMessage: string;

  getErrorType(): string {
    const endIndex = this.internalMessage.indexOf(']');

    if (endIndex < 1) {
      return '-';
    }

    return this.internalMessage.slice(1, endIndex);
  }

  getPublicError(): any {
    return new this.publicErrorClass(this.message);
  }

  getStatusCode(): number {
    const error = this.getPublicError();
    return error.getStatus();
  }
}

export class DuplicatedEvseError extends BaseExpectedError {
  publicErrorClass = InternalServerErrorException;
  message: string;
  internalMessage: string;

  constructor(id: string) {
    super();

    this.message = `Duplicated entities for the same ID: ${id} were found.`;
    this.internalMessage = `[DUPLICATED_EVSE_REQUEST] ${this.message}`;
  }
}

export class DuplicatedLocationError extends BaseExpectedError {
  publicErrorClass = InternalServerErrorException;
  message: string;
  internalMessage: string;

  constructor(id: string) {
    super();

    this.message = `Duplicated entities for the same ID: ${id} were found.`;
    this.internalMessage = `[DUPLICATED_LOCATION_REQUEST] ${this.message}`;
  }
}

export class InternalServerError extends BaseExpectedError {
  publicErrorClass = InternalServerErrorException;
  message: string = 'Unknown error. Please check your query parameters. If problem persists, please contact us at support@example.com';

  constructor(info: string) {
    super();

    this.internalMessage = `[INTERNAL_SERVER_ERROR_REQUEST] ${info}`;
  }
}

export class NoPredictionInCacheError extends BaseExpectedError {
  publicErrorClass = InternalServerErrorException;
  message = 'Sorry, we couldn\'t predict this ID now, try again later.';

  constructor(id: string) {
    super();

    this.internalMessage = `[NO_PREDICTIONS_GENERATED_REQUEST] No prediction found in cache for: ${id}. https://eu-central-1.console.aws.amazon.com/cloudwatch/home?region=eu-central-1#logsV2:logs-insights$3FqueryDetail$3D~(end~0~start~-3600~timeType~'RELATIVE~unit~'seconds~editorString~'fields*20*40timestamp*2c*20*40message*0a*7c*20sort*20*40timestamp*20desc*0a*7c*20limit*20100*0a*7c*20filter*20*40message*20like*20*2f${id}*2f~queryId~'8d3616a2-2f6e-421e-b741-9a6702e1205c~source~(~'AI_Process_Monitoring))`;
  }
}

export class PredictionInCacheExpiredError extends BaseExpectedError {
  publicErrorClass = InternalServerErrorException;
  message = 'Sorry, we couldn\'t predict this ID now, try again later.';

  constructor(id: string) {
    super();

    this.internalMessage = `[PREDICTIONS_EXPIRED_REQUEST] Prediction in cache expired for: ${id}. https://eu-central-1.console.aws.amazon.com/cloudwatch/home?region=eu-central-1#logsV2:logs-insights$3FqueryDetail$3D~(end~0~start~-3600~timeType~'RELATIVE~unit~'seconds~editorString~'fields*20*40timestamp*2c*20*40message*0a*7c*20sort*20*40timestamp*20desc*0a*7c*20limit*20100*0a*7c*20filter*20*40message*20like*20*2f${id}*2f~queryId~'8d3616a2-2f6e-421e-b741-9a6702e1205c~source~(~'AI_Process_Monitoring))`;
  }
}

export class UnknownEntityError extends BaseExpectedError {
  publicErrorClass = BadRequestException;

  constructor(id: string) {
    super();

    this.message = `This ID couldn't be found. ${id}`;
    this.internalMessage = `[UNKNOWN_ENTITY_REQUEST] ${this.message}`;
  }
}

export class InvalidRequestParameterError extends BaseExpectedError {
  publicErrorClass = BadRequestException;

  constructor(info: string) {
    super();

    this.message = info;
    this.internalMessage = `[INVALID_PARAMETER_REQUEST] Invalid parameter info: ${info}`;
  }
}

export class ForbiddenRequestError extends BaseExpectedError {
  publicErrorClass = ForbiddenException;

  constructor(info: string) {
    super();

    this.message = info;
    this.internalMessage = `[FORBIDDEN_REQUEST] Invalid parameter info: ${info}`;
  }
}

export class UnprocessedRequestError extends BaseExpectedError {
  publicErrorClass = InternalServerError;

  constructor(info: string) {
    super();

    this.message = info;
    this.internalMessage = `[UNPROCESSED_REQUEST] ${info}`;
  }
}

export class UnsupportedAudioFormatError extends BaseExpectedError {
  publicErrorClass = UnsupportedMediaTypeException;

  constructor(info: string) {
    super();

    this.message = info;
    this.internalMessage = `[CHARGEGPT_UNSUPPORTED_AUDIO_FORMAT] ${info}`;
  }

  static isValid(format: string): boolean {
    const supportedFormats = ['mp3', 'mp4', 'mpeg', 'mpga', 'm4a', 'wav', 'webm'];
    return supportedFormats.includes(format.toLowerCase());
  }
}

export class InvalidAddressRequestError extends BaseExpectedError {
  publicErrorClass = InternalServerErrorException;

  constructor(info: string) {
    super();

    this.message = info;
    this.internalMessage = `[CHARGEGPT_ADDRESS_NOT_FOUND] Address / POI not found in google maps info: ${info}`;
  }
}

export class InvalidDateTimeRequestError extends BaseExpectedError {
  publicErrorClass = InternalServerErrorException;

  constructor(info: string) {
    super();

    this.message = info;
    this.internalMessage = `[CHARGEGPT_DATE_TIME_IN_PAST] Requested date and time is in the past info: ${info}`;
  }
}

export class NoChargePointsAvailableError extends BaseExpectedError {
  publicErrorClass = InternalServerErrorException;

  constructor(info: string) {
    super();

    this.message = info;
    this.internalMessage = `[CHARGEGPT_UNAVAILABLE_LOCATION] No available charge points from availability predictions: ${info}`;
  }
}

export class NoChargePointsInDBError extends BaseExpectedError {
  publicErrorClass = InternalServerErrorException;

  constructor(info: string) {
    super();

    this.message = info;
    this.internalMessage = `[CHARGEGPT_CHARGER_NOT_FOUND] No charging station found in DB: ${info}`;
  }
}

export class ChargeGPTInternalServerError extends BaseExpectedError {
  publicErrorClass = InternalServerErrorException;

  constructor(info: string) {
    super();

    this.message = info;
    this.internalMessage = `[CHARGEGPT_INTERNAL_SERVER_ERROR] ${info}`;
  }
}

export class ChargeGPTInvalidRequestParameterError extends BaseExpectedError {
  publicErrorClass = BadRequestException;

  constructor(info: string) {
    super();

    this.message = info;
    this.internalMessage = `[CHARGEGPT_INVALID_PARAMETER_REQUEST] Invalid parameter info: ${info}`;
  }
}

export class ChargeGPTForbiddenRequestError extends BaseExpectedError {
  publicErrorClass = ForbiddenException;

  constructor(info: string) {
    super();

    this.message = info;
    this.internalMessage = `[CHARGEGPT_FORBIDDEN_REQUEST] Forbidden request info: ${info}`;
  }
}

export class ChargeGPTRoutingSearchError extends BaseExpectedError {
  publicErrorClass = InternalServerErrorException;

  constructor(info: string) {
    super();

    this.message = info;
    this.internalMessage = `[CHARGEGPT_ROUTING_REQUEST_ERROR] Routing request info: ${info}`;
  }
}

export class ChargeGPTUnauthorizedRequestError extends BaseExpectedError {
  publicErrorClass = UnauthorizedException;

  constructor(info: string) {
    super();

    this.message = info;
    this.internalMessage = `[CHARGEGPT_UNAUTHORIZED_REQUEST] Unauthorized request info: ${info}`;
  }
}

export class RecommendationInternalServerError extends BaseExpectedError {
  publicErrorClass = InternalServerErrorException;

  constructor(info: string) {
    super();

    this.message = info;
    this.internalMessage = `[RECOMMENDATION_INTERNAL_SERVER_ERROR] ${info}`;
  }
}

export class RecommendationForbiddenRequestError extends BaseExpectedError {
  publicErrorClass = ForbiddenException;

  constructor(info: string) {
    super();

    this.message = info;
    this.internalMessage = `[RECOMMENDATION_FORBIDDEN_REQUEST] Forbidden request info: ${info}`;
  }
}

export const isExpectedError = (error: any): boolean => {
  const expectedErrors = [DuplicatedEvseError, DuplicatedLocationError, InternalServerError, NoPredictionInCacheError, PredictionInCacheExpiredError, UnknownEntityError, InvalidRequestParameterError, ForbiddenRequestError, UnprocessedRequestError, UnsupportedAudioFormatError, ChargeGPTInternalServerError, ChargeGPTInvalidRequestParameterError, ChargeGPTForbiddenRequestError, RecommendationInternalServerError, RecommendationForbiddenRequestError, ChargeGPTRoutingSearchError, ChargeGPTUnauthorizedRequestError];

  return expectedErrors.some(exception => error instanceof exception);
};

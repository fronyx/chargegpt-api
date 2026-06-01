import { IParsedBody } from '../../../../../apps/cdk-apps/src/shared/models/general/parsed-body';
import {
  ProcessedPrediction
} from "../../../../../apps/cdk-apps/src/shared/domain/logging/update-create/models/processed-prediction";

export interface IMessageParserService {
  parse: (args: { records: IParsedBody[] }) => ProcessedPrediction[];
}

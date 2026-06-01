export enum QueueEnums {
  PredictionProcessed = 'EvsePredictionProcessed',
  PredictionsSaved = 'EvsePredictionsSaved',
  FullLoadReceived = 'NeutralPartnerFullLoadReceived',
  StatusUpdatedReceived = 'NeutralPartnerEvseStatusUpdateReceived',
  OcpiPatchQueue = 'LogsProcessorStack-production-OCPIPatchproductionB935F891-Rbe0zzJ8APut',
  OcpiPutQueue = 'LogsProcessorStack-production-OcpiPutproduction993AA455-6J4VfJnBmV1s',
  ClassificationStorageQueue = 'ClassificationStorageQueue',
  RegressionStorageQueue = 'RegressionStorageQueue',
}


export const connectorTypeToTechnicaConnectorName: Record<string, string> = {
  type2: 'iec_62196_t2',
  ccs: 'iec_62196_t2_combo',
  iec_62196_t2_combo: 'iec_62196_t2_combo',
  iec_62196_t2: 'iec_62196_t2',
  chademo: 'chademo',
  schuko: 'schuko',
};

export const technicalConnectorNameToConnectorType: Record<string, string> = {
  iec_62196_t2: 'Type 2',
  iec_62196_t2_combo: 'CCS',
  chademo: 'CHADEMO',
  schuko: 'SCHUKO',
};
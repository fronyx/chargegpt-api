export interface FilterConfig {
  name: string;
  description: string;
  type: 'string' | 'number' | 'array' | 'boolean';
  valueType: 'range' | 'acceptedValues';
  defaultValue: string;
  minAcceptedValue: number;
  maxAcceptedValue: number;
  acceptedValues: string;
}
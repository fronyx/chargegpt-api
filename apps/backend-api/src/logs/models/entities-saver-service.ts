import { OcpiCommandPayloadConversions } from './ocpi-command-payload-convertions';

export interface EntitiesSaverService {
  save: (args: Partial<OcpiCommandPayloadConversions> ) => Promise<void>;
}

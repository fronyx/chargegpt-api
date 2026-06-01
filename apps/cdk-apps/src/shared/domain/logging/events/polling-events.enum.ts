export enum PollingEventsEnum {
  LocationsPolledEvent = 'io.fronyx.event.EvFreaksLocationsPolled',
  LocationsByPeerIDFiltered = 'io.fronyx.event.EvFreaksLocationsByPeerIdFiltered',
  InvalidLocationsIdentified = 'io.fronyx.event.EvFreaksInvalidLocationsIdentified',
  LocationsToBeSavedIdentified = 'io.fronyx.event.EvFreaksLocationsToBeSavedIdentified',
  LocationsToBeFilteredForDuplicatesIdentified = 'io.fronyx.event.EvFreaksLocationsToBeFilteredForDuplicatesIdentified',
  NewLocationsIdentified = 'io.fronyx.event.NewEvFreaksLocationsIdentified',
  ExistingLocationsIdentified = 'io.fronyx.event.ExistingEvFreaksLocationsIdentified',
  LocationsForPUTOCPIRequestToCustomerIdentified = 'io.fronyx.event.LocationsForPUTOcpiRequestIdentified',
  LocationsForPATCHOCPIRequestToCustomerIdentified = 'io.fronyx.event.LocationsForPATCHOcpiRequestIdentified',
}

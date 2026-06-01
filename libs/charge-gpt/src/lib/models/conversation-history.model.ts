import { SubComponentEnums } from '../services/reasoning.constants';
import { Coordinates, Dialog } from './prompt';
import { isEmptyString } from '../../../../../apps/cdk-apps/src/shared/utils/is-empty-string.function';
import { format, isValid } from 'date-fns';
import { replaceAssistantName } from '../services/replace-assistant-name.utils';
import {
  connectorTypeToTechnicaConnectorName,
  technicalConnectorNameToConnectorType,
} from './connector-type-to-standard-connector';
import { chargeGPTLogger } from './chat-utilities';
import { SupportedLanguage } from '../services/audio-services/azure-audio.service';
import { Location } from '@fronyx/data-transfer-object';
import { AddressCharacteristics } from '../services/address-identifiers/address-characteristics.model';
import { ChargingStationWithScoreDetails } from './charging-stations.model';

export enum SupportedStateMachineEnum {
  SHOWED_ADDRESS_OPTIONS = 'showedAddressOptions',
  SHOWED_CHARGE_POINT_RECOMMENDATIONS = 'showedChargePointRecommendations',
  SHOWED_CHARGE_POINT_ALONG_ROUTE_RECOMMENDATIONS = 'showedChargePointAlongRouteRecommendations',
}

export class ConversationHistory {
  static prefix = 'charge_gpt_conversation_';
  private currentSubComponent: string;
  clientTimestamp: number;
  timezoneOffset: number;
  private updatedAt?: string;
  private filterDialogs: Dialog[] = [];
  private overtConversation: Dialog[] = [];
  private overtConversationSummary: string;
  private acquiredData: Record<string, any> = {};
  private conversationProjectName: string;
  numberOfTurnsSubcomponent: number;
  language: SupportedLanguage;
  assistantName: string;
  companyName: string;
  id: string;
  projectName: string;
  private recommendedChargingStations: any[] = [];
  private isConversationFinished = false;
  private projectOutputType: string = null;

  constructor(payload: any) {
    this.clientTimestamp = payload.clientTimestamp
      ? Number(payload.clientTimestamp)
      : Date.now();
    this.timezoneOffset =
      payload.timezoneOffset && payload.timezoneOffset !== '0'
        ? Number(payload.timezoneOffset)
        : 0;
    this.filterDialogs = payload.filterDialogs ?? [];
    this.overtConversation = payload.overtConversation ?? [];
    this.overtConversationSummary = payload.overtConversationSummary ?? '';
    this.acquiredData = payload.acquiredData ?? {};
    this.conversationProjectName = payload.projectName;
    this.updatedAt = payload.updatedAt;
    this.numberOfTurnsSubcomponent = payload.numberOfTurnsSubcomponent
      ? Number(payload.numberOfTurnsSubcomponent)
      : 0;
    this.language = payload.language ?? 'de';
    this.assistantName = payload.assistantName ?? 'ChargeGPT';
    this.companyName = payload.companyName ?? 'Fronyx';
    this.currentSubComponent = SubComponentEnums.FILTER;
    this.id = payload.id;
    this.projectName = payload.projectName;
    this.projectOutputType = payload.projectOutputType;
    this.recommendedChargingStations =
      payload.recommendedChargingStations ?? [];
  }

  reInitializeState(keepLocation = false) {
    const {
      locationEnabled,
      current_coordinates,
      origin,
      destination,
      address,
      latitude,
      longitude,
    } = this.acquiredData;

    this.acquiredData = {};
    this.currentSubComponent = SubComponentEnums.FILTER;
    this.numberOfTurnsSubcomponent = 1;

    this.filterDialogs = [];
    this.overtConversation = [];
    this.overtConversationSummary = '';

    // reinstate location information
    if (keepLocation) {
      this.setLocationEnabled(locationEnabled);
      this.setCurrentCoordinates(current_coordinates);
      this.setAddress(address);
      this.setOriginAddress(origin);
      this.setDestinationAddress(destination);
      this.setLatitude(latitude);
      this.setLongitude(longitude);
    }
  }

  getJSON(): any {
    return {
      projectName: this.conversationProjectName,
      filterDialogs: this.filterDialogs,
      overtConversation: this.overtConversation,
      overtConversationSummary: this.overtConversationSummary,
      acquiredData: this.acquiredData,
      updatedAt: Date.now(),
      id: this.id,
      currentSubComponent: this.currentSubComponent,
      clientTimestamp: this.clientTimestamp,
      timezoneOffset: this.timezoneOffset,
      numberOfTurnsSubcomponent: this.numberOfTurnsSubcomponent,
      language: this.language,
      assistantName: this.assistantName,
      companyName: this.companyName,
      isConversationFinished: this.isConversationFinished,
      recommendedChargingStations: this.recommendedChargingStations ?? [],
      projectOutputType: this.projectOutputType,
      partitionKey: `${this.getConversationStage()}:${
        this.conversationProjectName
      }`,
    };
  }

  getUpdatedAt(): Date | null {
    return this.updatedAt ? new Date(Number(this.updatedAt)) : null;
  }

  getProjectName(): string {
    return this.conversationProjectName ?? this.projectName;
  }

  getCurrentSubComponent(): string {
    return this.currentSubComponent;
  }

  getClientTimestampAsDate(): Date {
    return new Date(this.clientTimestamp - this.timezoneOffset * 60000);
  }

  getClientTimestampAsDateWithBuffer(): Date {
    return new Date(
      this.clientTimestamp - this.timezoneOffset * 60000 - 5 * 60000
    );
  }

  getOvertConversation(): Dialog[] {
    return this.overtConversation ?? [];
  }

  latestText(): string {
    const propertyName = `${this.currentSubComponent}Dialogs`;
    if (this[propertyName]) {
      if (this[propertyName][this[propertyName].length - 1].role !== 'system') {
        return this[propertyName][this[propertyName].length - 1].content;
      }
    }

    return '';
  }

  addDialog(dialog: Dialog, log = false): void {
    const propertyName = `${this.currentSubComponent}Dialogs`;
    if (this[propertyName]) {
      const updatedDialog = {
        ...dialog,
        content: replaceAssistantName(dialog.content, this.assistantName),
      };
      this[propertyName].push(updatedDialog);
      if (log) {
        switch (dialog.role) {
          case 'assistant':
            this.overtConversation.push(updatedDialog);
            chargeGPTLogger(
              this.id,
              this.conversationProjectName,
              'assistant',
              dialog.content
            );
            break;
          case 'user':
            this.overtConversation.push(updatedDialog);
            chargeGPTLogger(
              this.id,
              this.conversationProjectName,
              'user',
              dialog.content
            );
            break;
          default:
            break;
        }
      }
    }
  }

  getCurrentDialogs(): Dialog[] {
    const propertyName = `${this.currentSubComponent}Dialogs`;
    return this[propertyName];
  }

  public cleanCurrentDialogs(): void {
    const propertyName = `${this.currentSubComponent}Dialogs`;
    this[propertyName] = [];
  }

  getResponseId(): string {
    return `${this.id}_${Date.now().toString()}`;
  }

  // Origin address provided in the user request. The address is still not validated.
  setOriginAddress(value: string): void {
    const validatedValue = new UnConfirmedAddressValueObject(value).value();
    this.acquiredData['origin'] = validatedValue;
  }

  getOriginAddress(): string | null {
    if (!this.acquiredData['origin']) {
      return null;
    }

    return this.acquiredData['origin'];
  }

  // Destination address provided in the user request. The address is still not validated.
  setDestinationAddress(value: string): void {
    const validatedValue = new UnConfirmedAddressValueObject(value).value();
    this.acquiredData['destination'] = validatedValue;
  }

  getDestinationAddress(): string | null {
    if (!this.acquiredData['destination']) {
      return null;
    }

    return this.acquiredData['destination'];
  }

  setFoundOriginAddressName(value: string): void {
    const validatedValue = new AddressValueObject(value).value();
    this.acquiredData['originAddress'] = validatedValue;
  }

  getFoundOriginAddressName(): string | null {
    if (!this.acquiredData['originAddress']) {
      return null;
    }

    return this.acquiredData['originAddress'];
  }

  setFoundDestinationAddressName(value: string): void {
    const validatedValue = new AddressValueObject(value).value();
    this.acquiredData['destinationAddress'] = validatedValue;
  }

  getFoundDestinationAddressName(): string | null {
    if (!this.acquiredData['destinationAddress']) {
      return null;
    }

    return this.acquiredData['destinationAddress'];
  }

  setOriginCoordinates(value: Coordinates): void {
    this.acquiredData['origin_coordinates'] = value;
  }

  getOriginCoordinates(): Coordinates | null {
    if (!this.acquiredData['origin_coordinates']) {
      return null;
    }
    return this.acquiredData['origin_coordinates'];
  }

  setDestinationCoordinates(value: Coordinates): void {
    this.acquiredData['destination_coordinates'] = value;
  }

  getDestinationCoordinates(): Coordinates | null {
    if (!this.acquiredData['destination_coordinates']) {
      return null;
    }
    return this.acquiredData['destination_coordinates'];
  }

  setIsDestinationAPOI(value: boolean): void {
    const booleanValue = new BooleanValueObject(value);
    if (booleanValue.isValid()) {
      this.acquiredData['isDestinationAPOI'] = booleanValue.value();
    }
  }

  getIsDestinationAPOI(): boolean | undefined {
    return new BooleanValueObject(
      this.acquiredData['isDestinationAPOI']
    ).value();
  }

  setPostfixText(value: string): void {
    const validatedValue = new PostfixValueObject(value).value();
    this.acquiredData['postfix'] = validatedValue;
  }

  getPostfixText() {
    return new PostfixValueObject(this.acquiredData['postfix']).value();
  }

  // Final address that is used for charging stations search
  setAddress(value: string): void {
    const validatedValue = new AddressValueObject(value).value();
    this.acquiredData['address'] = validatedValue;
  }

  getAddress(): string {
    return new AddressValueObject(this.acquiredData['address']).value();
  }

  setCountryCode(value: string): void {
    const validatedValue = new CountryCodeValueObject(value).value();
    this.acquiredData['country_code'] = validatedValue;
  }

  getCountryCode(): string {
    return new CountryCodeValueObject(
      this.acquiredData['country_code']
    ).value();
  }

  setConversationStage(value: 'production' | 'staging'): void {
    this.acquiredData['conversationStage'] = value;
  }

  getConversationStage(): 'production' | 'staging' {
    if (this.projectName.includes('whatsapp')) {
      // TODO fix this after we have production instance for whatsapp
      return 'production';
    }

    return this.acquiredData['conversationStage'] ?? 'staging';
  }

  setIsCurrentCoordinatesRequested(value: boolean) {
    const booleanValue = new BooleanValueObject(value);

    if (booleanValue.isValid()) {
      this.acquiredData['isCurrentCoordinatesRequested'] = booleanValue.value();
    }
  }

  isCurrentCoordinatesRequested() {
    return new BooleanValueObject(
      this.acquiredData['isCurrentCoordinatesRequested']
    ).value();
  }

  setLocationsAreSearchBasedOnAddressOptions(value: boolean) {
    const booleanValue = new BooleanValueObject(value);

    if (booleanValue.isValid()) {
      this.acquiredData['isLocationsAreSearchBasedOnAddressOption'] =
        booleanValue.value();
    }
  }

  getIsLocationsAreSearchBasedOnAddressOptions(): boolean {
    return new BooleanValueObject(
      this.acquiredData['isLocationsAreSearchBasedOnAddressOption']
    ).value();
  }

  setIsNearbyRequested(value: boolean) {
    const booleanValue = new BooleanValueObject(value);

    if (booleanValue.isValid()) {
      this.acquiredData['isNearbyRequested'] = booleanValue.value();
    }
  }

  getIsNearbyRequested() {
    return new BooleanValueObject(
      this.acquiredData['isNearbyRequested']
    ).value();
  }

  setDepartureDateTime(value: string): void {
    // TODO add validation
    this.acquiredData['departure_date_time'] = value;
  }

  setLatitude(value: string): void {
    const validatedValue = new CoordinateValueObject(value).value();
    this.acquiredData['latitude'] = validatedValue;
  }

  getLatitude(): number | null {
    if (!this.acquiredData['latitude']) {
      return null;
    }

    return Number(this.acquiredData['latitude']);
  }

  setLongitude(value: string): void {
    const validatedValue = new CoordinateValueObject(value).value();
    this.acquiredData['longitude'] = validatedValue;
  }

  getLongitude(): number | null {
    if (!this.acquiredData['longitude']) {
      return null;
    }

    return Number(this.acquiredData['longitude']);
  }

  setPowerType(value: string, lastUserInput?: string): void {
    const validatedValue = new PowerTypeValueObject(
      value,
      lastUserInput
    ).value();
    this.acquiredData['power_type'] = validatedValue;
  }

  getPowerType(): string {
    return new PowerTypeValueObject(this.acquiredData['power_type']).value();
  }

  setOperatorName(value: string): void {
    const validatedValue = new OperatorNameValueObject(value).value();
    this.acquiredData['operator_name'] = validatedValue;
  }

  getOperatorName(): string {
    return new OperatorNameValueObject(
      this.acquiredData['operator_name']
    ).value();
  }

  setConnectorType(value: string): void {
    const validatedValue = new ConnectorTypeValueObject(value).value();
    this.acquiredData['connector_type'] = validatedValue;
  }

  getConnectorType(): string | null {
    if (!this.acquiredData['connector_type']) {
      return null;
    }

    return this.acquiredData['connector_type'];
  }

  getRequestConnectorTypeValue(): string | null {
    if (!this.acquiredData['connector_type']) {
      return null;
    }

    return new ConnectorTypeValueObject(
      this.acquiredData['connector_type']
    ).requestedValue();
  }

  setDateTime(value: string): void {
    const validatedValue = new DateTimeValueObject(
      this.clientTimestamp - this.timezoneOffset * 60000,
      value
    ).rawValue();
    this.acquiredData['date_time'] = validatedValue;
  }

  getProcessedDateTime(): string {
    return new DateTimeValueObject(
      this.clientTimestamp - this.timezoneOffset * 60000,
      this.acquiredData['date_time']
    ).fallbackIfNullValue();
  }

  getRawDateTime(): string | null {
    return new DateTimeValueObject(
      this.clientTimestamp - this.timezoneOffset * 60000,
      this.acquiredData['date_time']
    ).rawValue();
  }

  isLocationEnabled(): boolean {
    return new BooleanValueObject(this.acquiredData['locationEnabled']).value();
  }

  setLocationEnabled(value: unknown): void {
    const booleanValue = new BooleanValueObject(value);
    if (booleanValue.isValid()) {
      this.acquiredData['locationEnabled'] = booleanValue.value();
    }
  }

  setCurrentCoordinates(value: any) {
    // TODO add validation
    this.acquiredData['current_coordinates'] = value;
  }

  getCurrentCoordinates(): Coordinates | null {
    const data = this.acquiredData['current_coordinates'];
    if (!data || data === '') {
      return null;
    }

    if (isNaN(Number(data.lat)) || isNaN(Number(data.lng))) {
      return null;
    }

    return {
      lat: Number(data.lat),
      lng: Number(data.lng),
    };
  }

  setLastUserInput(value: string): void {
    const validatedValue = new LastUserInputValueObject(value).value();
    this.acquiredData['lastUserInput'] = validatedValue;
  }

  getLastUserInput(): string {
    return this.acquiredData['lastUserInput'];
  }

  setSwitchReason(value: string): void {
    const validatedValue = new SwitchReasonValueObject(value).value();
    this.acquiredData['switch_reason'] = validatedValue;
  }

  getSwitchReason(): string {
    return new SwitchReasonValueObject(
      this.acquiredData['switch_reason']
    ).value();
  }

  getProjectOutputType(): string {
    return this.projectOutputType;
  }

  setRecommendedChargingStations(
    value: ChargingStationWithScoreDetails[]
  ): void {
    if (!value) {
      return;
    }

    value.forEach((location) => {
      this.recommendedChargingStations.push(location);
    });
  }

  getRecommendedChargingStations(): ChargingStationWithScoreDetails[] {
    return this.recommendedChargingStations;
  }

  setAvailableChargingStations(locations: Location[]): void {
    if (!locations?.length) {
      return;
    }

    this.acquiredData['availableChargePoints'] = locations;
  }

  getAvailableChargingStations() {
    if (!this.acquiredData['availableChargePoints']?.length) {
      return [];
    }

    return this.acquiredData['availableChargePoints'];
  }

  setIsConversationFinished(value: boolean) {
    const booleanValue = new BooleanValueObject(value);
    this.isConversationFinished = booleanValue.value();
  }

  getIsConversationFinished(): boolean {
    return new BooleanValueObject(this.isConversationFinished).value();
  }

  // the number of API called made by the user
  setUserNumberOfTurns(value: number): void {
    const validatedValue = new UserNumberOfTurnsValueObject(value).value();
    this.acquiredData['userNumberOfTurns'] = validatedValue;
  }

  getUserNumberOfTurns(): number | undefined {
    const validatedValue = new MaxPowerValueObject(
      this.acquiredData['userNumberOfTurns']
    );

    if (validatedValue.value() === undefined) {
      return undefined;
    }
    return Number(validatedValue.value());
  }

  setRefinementCounter(value: number): void {
    const validatedValue = new RefinementCounterValueObject(value).value();
    this.acquiredData['refinementCounter'] = validatedValue;
  }

  setSuccessCounter(value: number): void {
    const validatedValue = new SuccessConversationCountValueObject(
      value
    ).value();
    this.acquiredData['successConversationCount'] = validatedValue;
  }

  setErrorCounter(value: number): void {
    const validatedValue = new ErrorConversationCountValueObject(value).value();
    this.acquiredData['errorConversationCount'] = validatedValue;
  }

  resetNumberOfTurnsSubcomponent(): void {
    this.numberOfTurnsSubcomponent = 0;
  }

  setDone(value: boolean): void {
    const booleanValue = new BooleanValueObject(value);

    if (booleanValue.isValid()) {
      this.acquiredData['done'] = booleanValue.value();
    }
  }

  setIsRefinement(value: boolean): void {
    const booleanValue = new BooleanValueObject(value);

    if (booleanValue.isValid()) {
      this.acquiredData['isRefinement'] = booleanValue.value();
    }
  }

  setIsAddressChanged(value: boolean): void {
    const booleanValue = new BooleanValueObject(value);

    if (booleanValue.isValid()) {
      this.acquiredData['isAddressChanged'] = booleanValue.value();
    }
  }

  setIsSpeechToText(value: boolean): void {
    const booleanValue = new BooleanValueObject(value);
    if (booleanValue.isValid()) {
      this.acquiredData['isSpeechToText'] = booleanValue.value();
    }
  }

  setIsRequestOutOfScope(value: boolean): void {
    const booleanValue = new BooleanValueObject(value);
    if (booleanValue.isValid()) {
      this.acquiredData['isRequestOutOfScope'] = booleanValue.value();
    }
  }

  setHelpLevel(value: string): void {
    const validatedValue = new HelpLevelValueObject(value);
    this.acquiredData['helpLevel'] = validatedValue.value();
  }

  setIsHelpRequested(value: boolean): void {
    const booleanValue = new BooleanValueObject(value);
    if (booleanValue.isValid()) {
      this.acquiredData['isHelpRequested'] = booleanValue.value();
    }
  }

  getIsHelpRequested(): boolean {
    return new BooleanValueObject(this.acquiredData['isHelpRequested']).value();
  }

  setMinPower(value: number): void {
    const validatedValue = new MinPowerValueObject(value);
    if (validatedValue.isValid()) {
      this.acquiredData['min_power'] = validatedValue.value();
    }
  }

  getMinPower(): number | undefined {
    const validatedValue = new MinPowerValueObject(
      this.acquiredData['min_power']
    );
    if (validatedValue.isValid() && validatedValue.value() === undefined) {
      return undefined;
    }
    return validatedValue.isValid()
      ? Number(validatedValue.value())
      : undefined;
  }

  getMaxPower(): number | undefined {
    const validatedValue = new MaxPowerValueObject(
      this.acquiredData['max_power']
    );
    if (validatedValue.isValid() && validatedValue.value() === undefined) {
      return undefined;
    }
    return validatedValue.isValid()
      ? Number(validatedValue.value())
      : undefined;
  }

  setMaxPower(value: number): void {
    const validatedValue = new MaxPowerValueObject(value);
    if (validatedValue.isValid()) {
      this.acquiredData['max_power'] = validatedValue.value();
    }
  }

  setPowerEnabled(value: boolean): void {
    const booleanValue = new BooleanValueObject(value);
    if (booleanValue.isValid()) {
      this.acquiredData['power_enabled'] = booleanValue.value();
    }
  }

  setOnlyFree(value: boolean): void {
    const booleanValue = new BooleanValueObject(value);
    if (booleanValue.isValid()) {
      this.acquiredData['only_free'] = booleanValue.value();
    }
  }

  setOnlyPayWithneutral-payment-provider(value: boolean): void {
    const booleanValue = new BooleanValueObject(value);
    if (booleanValue.isValid()) {
      this.acquiredData['only_pay_with_neutral-payment-provider'] = booleanValue.value();
    }
  }

  setOnlyFavorites(value: boolean): void {
    const booleanValue = new BooleanValueObject(value);
    if (booleanValue.isValid()) {
      this.acquiredData['only_favorites'] = booleanValue.value();
    }
  }

  setOnly4Or5Stars(value: boolean): void {
    const booleanValue = new BooleanValueObject(value);
    if (booleanValue.isValid()) {
      this.acquiredData['only_4_or_5_stars'] = booleanValue.value();
    }
  }

  setOnlyPublic(value: boolean): void {
    const booleanValue = new BooleanValueObject(value);
    if (booleanValue.isValid()) {
      this.acquiredData['only_public'] = booleanValue.value();
    }
  }

  setOnlyTariffKwh(value: boolean): void {
    const booleanValue = new BooleanValueObject(value);
    if (booleanValue.isValid()) {
      this.acquiredData['only_tariff_kwh'] = booleanValue.value();
    }
  }

  setOnlyTariffMin(value: boolean): void {
    const booleanValue = new BooleanValueObject(value);
    if (booleanValue.isValid()) {
      this.acquiredData['only_tariff_min'] = booleanValue.value();
    }
  }

  setOnlyRemoteStartCapable(value: boolean): void {
    const booleanValue = new BooleanValueObject(value);
    if (booleanValue.isValid()) {
      this.acquiredData['only_remote_start_capable'] = booleanValue.value();
    }
  }

  setOnlyAutoCharge(value: boolean): void {
    const booleanValue = new BooleanValueObject(value);
    if (booleanValue.isValid()) {
      this.acquiredData['only_auto_charge'] = booleanValue.value();
    }
  }

  setHideNotAvailable(value: boolean): void {
    const booleanValue = new BooleanValueObject(value);
    if (booleanValue.isValid()) {
      this.acquiredData['hide_not_available'] = booleanValue.value();
    }
  }

  setHideNoState(value: boolean): void {
    const booleanValue = new BooleanValueObject(value);
    if (booleanValue.isValid()) {
      this.acquiredData['hide_no_state'] = booleanValue.value();
    }
  }

  setHideUnknown(value: boolean): void {
    const booleanValue = new BooleanValueObject(value);
    if (booleanValue.isValid()) {
      this.acquiredData['hide_unknown'] = booleanValue.value();
    }
  }

  setHideComingSoon(value: boolean): void {
    const booleanValue = new BooleanValueObject(value);
    if (booleanValue.isValid()) {
      this.acquiredData['hide_coming_soon'] = booleanValue.value();
    }
  }

  setHideNoStateExceptions(value: string[]): void {
    const validatedValue = new TypeOfHideNoStateExceptionsValueObject(value);
    this.acquiredData['hide_no_state_exceptions'] = validatedValue.value();
  }

  setTypeOfLocations(value: string[]): void {
    const validatedValue = new TypeOfLocationsValueObject(value);
    this.acquiredData['type_of_locations'] = validatedValue.value();
  }

  setTypeOfLocationsEnabled(value: boolean): void {
    const booleanValue = new BooleanValueObject(value);
    if (booleanValue.isValid()) {
      this.acquiredData['type_of_locations_enabled'] = booleanValue.value();
    }
  }

  setPlugTypesEnabled(value: boolean): void {
    const booleanValue = new BooleanValueObject(value);
    if (booleanValue.isValid()) {
      this.acquiredData['plug_types_enabled'] = booleanValue.value();
    }
  }

  getAddressOptions() {
    if (!this.acquiredData['address_options']) {
      this.acquiredData['address_options'] = [];
    }

    return this.acquiredData['address_options'];
  }

  setAddressOptions(
    value: {
      address: string;
      addressId: string;
      lat: number;
      lng: number;
    }[]
  ): void {
    const validatedValue = new AddressOptionsValueObject(value);
    if (validatedValue.isValid()) {
      const options = removeBlockedLocationsByIds(
        validatedValue.value(),
        this.getBlockedLocations()
      );
      this.acquiredData['address_options'] = options;
    }
  }

  setEnglishTranslation(value: string): void {
    const validatedValue = new EnglishTranslationValueObject(value);
    if (validatedValue.isValid()) {
      this.acquiredData['english_translation'] = validatedValue.value();
    }
  }

  setIsCityRequested(value: boolean): void {
    const booleanValue = new BooleanValueObject(value);
    if (booleanValue.isValid()) {
      this.acquiredData['isCityRequested'] = booleanValue.value();
    }
  }

  setLastAddressQueryString(value: string): void {
    this.acquiredData['lastAddressQueryString'] = value;
  }

  setLastCurrentCoordinatesQueryString(value: string): void {
    this.acquiredData['lastCurrentCoordinatesQueryString'] = value;
  }

  isCurrentCoordinatesSameWithPreviousQueryString(value: string): boolean {
    if (!this.acquiredData['lastCurrentCoordinatesQueryString']) {
      return false;
    }

    if (!value) {
      return false;
    }

    return this.acquiredData['lastCurrentCoordinatesQueryString'] === value;
  }

  isAddressSameWithPreviousQueryString(value: string): boolean {
    return (
      `${this.getOriginAddress()}:${
        this.acquiredData['lastAddressQueryString']
      }` === value
    );
  }

  isOriginSameWithPreviousQueryString(value: string): boolean {
    return this.acquiredData['lastOriginQueryString'] === value;
  }

  setIsAddressInvalid(value: boolean): void {
    const booleanValue = new BooleanValueObject(value);
    if (booleanValue.isValid()) {
      this.acquiredData['isAddressInvalid'] = booleanValue.value();
    }
  }

  getIsAddressInvalid(): boolean | undefined {
    return new BooleanValueObject(
      this.acquiredData['isAddressInvalid']
    ).value();
  }

  setIsAddressConfirmationNecessary(value: boolean): void {
    const booleanValue = new BooleanValueObject(value);
    if (booleanValue.isValid()) {
      this.acquiredData['isAddressConfirmationNecessary'] =
        booleanValue.value();
    }
  }

  getIsAddressConfirmationNecessary(): boolean | undefined {
    return new BooleanValueObject(
      this.acquiredData['isAddressConfirmationNecessary']
    ).value();
  }

  setAddressOptionsDecisionNecessary(value: boolean): void {
    const booleanValue = new BooleanValueObject(value);
    if (booleanValue.isValid()) {
      this.acquiredData['isAddressOptionsDecisionNecessary'] =
        booleanValue.value();
    }
  }

  setIsStartedMetricSent(value: boolean): void {
    const booleanValue = new BooleanValueObject(value);
    this.acquiredData['isStartedMetricSent'] = booleanValue.value();
  }

  getIsStartedMetricSent(): boolean | undefined {
    return new BooleanValueObject(
      this.acquiredData['isStartedMetricSent']
    ).value();
  }

  getIsAddressOptionsDecisionNecessary(): boolean | undefined {
    return new BooleanValueObject(
      this.acquiredData['isAddressOptionsDecisionNecessary']
    ).value();
  }

  setOvertConversationSummary(value: string): void {
    this.overtConversationSummary = value;
  }

  getOvertConversationSummary(): string {
    return this.overtConversationSummary;
  }

  setIsLocationConfirmed(value: boolean): void {
    const booleanValue = new BooleanValueObject(value);
    if (booleanValue.isValid()) {
      this.acquiredData['isLocationConfirmed'] = booleanValue.value();
    }
  }

  getIsLocationConfirmed(): boolean | undefined {
    return new BooleanValueObject(
      this.acquiredData['isLocationConfirmed']
    ).value();
  }

  addBlockedLocation(value: string): void {
    if (!this.acquiredData['blockedLocations']) {
      this.acquiredData['blockedLocations'] = [];
    } else {
      this.acquiredData['blockedLocations'].push(value);
    }
  }

  getBlockedLocations(): string[] {
    if (!this.acquiredData['blockedLocations']) {
      this.acquiredData['blockedLocations'] = [];
    }
    return this.acquiredData['blockedLocations'];
  }

  setRouteNeeds(value: string): void {
    this.acquiredData['routeNeeds'] = value;
  }

  getRouteNeeds(): string | null {
    if (!this.acquiredData['routeNeeds']) {
      return null;
    }

    return this.acquiredData['routeNeeds'];
  }

  setStateMachine(value: SupportedStateMachineEnum): void {
    const validatedValue = new StateMachineValueObject(value).value();
    this.acquiredData['stateMachine'] = validatedValue;
  }

  getStateMachine(): string | null {
    return new StateMachineValueObject(
      this.acquiredData['stateMachine']
    ).value();
  }

  setAddressCharacteristics(value: {
    country: string;
    countryCode: string;
    city: string;
    addressLine: string;
    district: string;
    cardinalDirection: string;
    poiName: string;
    isHighwayRequested: boolean;
    isCityCenter: boolean;
    poiCategories: string[];
    addressSummary: string;
  }): void {
    this.acquiredData['addressCharacteristics'] = value;
  }

  getAddressCharacteristics(): Partial<AddressCharacteristics> {
    if (
      !this.acquiredData['addressCharacteristics'] ||
      this.acquiredData['addressCharacteristics'] === 'null'
    ) {
      return null;
    }

    return this.acquiredData['addressCharacteristics'];
  }

  getData(): Record<string, any> {
    const data = this.acquiredData ?? {};
    if ('refinementCounter' in data) {
      if (isNaN(Number(data.refinementCounter))) {
        data.refinementCounter = 0;
      } else {
        data.refinementCounter = Number(data.refinementCounter);
      }
    }

    if (isNaN(data?.successConversationCount)) {
      data.successConversationCount = 0;
    } else {
      data.successConversationCount = Number(data.successConversationCount);
    }

    if (isNaN(data?.errorConversationCount)) {
      data.errorConversationCount = 0;
    } else {
      data.errorConversationCount = Number(data.errorConversationCount);
    }

    if ('isCurrentCoordinatesRequested' in data) {
      this.acquiredData['isCurrentCoordinatesRequested'] =
        new BooleanValueObject(
          this.acquiredData['isCurrentCoordinatesRequested']
        ).value();
    }

    if ('isNearbyRequested' in data) {
      this.acquiredData['isNearbyRequested'] = new BooleanValueObject(
        this.acquiredData['isNearbyRequested']
      ).value();
    }

    if ('isRequestOutOfScope' in data) {
      this.acquiredData['isRequestOutOfScope'] = new BooleanValueObject(
        this.acquiredData['isRequestOutOfScope']
      ).value();
    }

    if ('isHelpRequested' in data) {
      this.acquiredData['isHelpRequested'] = new BooleanValueObject(
        this.acquiredData['isHelpRequested']
      ).value();
    }

    if ('isLocationConfirmed' in data) {
      this.acquiredData['isLocationConfirmed'] = new BooleanValueObject(
        this.acquiredData['isLocationConfirmed']
      ).value();
    }
    return data;
  }

  setRouteLengthInMeters(value: number): void {
    const validatedValue = new RouteLengthInMetersValueObject(value).value();
    this.acquiredData['routeLengthInMeters'] = validatedValue;
  }

  getRouteLengthInMeters(): number | undefined {
    return new RouteLengthInMetersValueObject(
      this.acquiredData['routeLengthInMeters']
    ).value();
  }
}

export class CoordinateValueObject {
  private readonly val: string;

  constructor(unverifiedValue?: string) {
    this.val = unverifiedValue;
  }

  value(): string {
    const number = Number(this.val);

    if (isNaN(number)) {
      return '';
    }

    if (number === 0) {
      return '';
    }

    return String(this.val);
  }

  isValid(): boolean {
    return this.value() !== '';
  }
}

export class PowerTypeValueObject {
  private readonly val: string;
  private readonly lastUserInputVal: string;

  constructor(unverifiedValue?: string, lastUserInput?: string) {
    this.val = unverifiedValue;
    this.lastUserInputVal = lastUserInput;
  }

  value(): 'both' | 'AC' | 'DC' {
    if (isEmptyString(this.val)) {
      return 'both';
    }

    if (
      ['fast', 'schnell', 'dc', 'rapid', 'hpc'].some((val) =>
        val.includes(this.val.toLowerCase())
      )
    ) {
      return 'DC';
    }

    if (
      ['slow', 'langsam', 'ac'].some((val) =>
        val.includes(this.val.toLowerCase())
      )
    ) {
      return 'AC';
    }

    if (!isEmptyString(this.lastUserInputVal)) {
      const userInputsWords = this.lastUserInputVal
        .split(' ')
        .map((val) => val.toLowerCase());

      if (userInputsWords.some((word) => ['dc', 'hpc'].includes(word))) {
        return 'DC';
      }

      if (userInputsWords.some((word) => ['ac'].includes(word))) {
        return 'AC';
      }
    }

    return 'both';
  }

  isRawValueInvalid(): boolean {
    return this.val !== 'both' && this.val !== 'AC' && this.val !== 'DC';
  }
}

export class OperatorNameValueObject {
  private readonly val: string;

  constructor(unverifiedValue?: string) {
    this.val = unverifiedValue;
  }

  value(): string {
    if (isEmptyString(this.val) || this.val === 'null') {
      return undefined;
    }

    if (this.val.toLowerCase() === 'all') {
      return undefined;
    }

    return this.val;
  }
}

export class ConnectorTypeValueObject {
  private readonly val: string;

  constructor(unverifiedValue?: string) {
    this.val = unverifiedValue;
  }

  value(): string | null {
    if (isEmptyString(this.val) || this.val === 'null') {
      return null;
    }

    const convertedConnectorType =
      connectorTypeToTechnicaConnectorName[
        this.val.replace(/\s/g, '').toLowerCase()
      ];

    return convertedConnectorType;
  }

  requestedValue(): string {
    return technicalConnectorNameToConnectorType[this.val];
  }
}

export class UnConfirmedAddressValueObject {
  private readonly val: string;

  constructor(unverifiedValue?: string) {
    this.val = unverifiedValue;
  }

  value(): string {
    if (isEmptyString(this.val)) {
      return '';
    }

    return this.val;
  }

  isValid() {
    return this.value() !== '';
  }
}

export class AddressValueObject {
  private readonly val: string;

  constructor(unverifiedValue?: string) {
    this.val = unverifiedValue;
  }

  value(): string {
    if (isEmptyString(this.val)) {
      return '';
    }

    return this.val;
  }

  isValid() {
    return this.value() !== '';
  }
}

export class PostfixValueObject {
  private readonly val: string;

  constructor(unverifiedValue?: string) {
    this.val = unverifiedValue;
  }

  value(): string {
    if (isEmptyString(this.val)) {
      return '';
    }

    return this.val;
  }
}

export class CountryCodeValueObject {
  private readonly val: string;

  constructor(unverifiedValue?: string) {
    this.val = unverifiedValue;
  }

  value(): string {
    if (isEmptyString(this.val)) {
      return '';
    }

    return this.val;
  }

  isValid() {
    return this.value() !== '';
  }
}

export class LastUserInputValueObject {
  private readonly val: string;

  constructor(unverifiedValue?: string) {
    this.val = unverifiedValue;
  }

  value(): string {
    if (isEmptyString(this.val)) {
      return '';
    }

    return this.val;
  }

  isValid() {
    return this.value() !== '';
  }
}

export class BooleanValueObject {
  private readonly val: unknown;

  constructor(unverifiedValue: unknown) {
    this.val = unverifiedValue;
  }

  value(): boolean {
    if (this.isValid()) {
      return this.val === 'true' || this.val === true;
    }

    return undefined;
  }

  isValid(): boolean {
    return (
      this.val === 'true' ||
      this.val === 'false' ||
      this.val === true ||
      this.val === false
    );
  }
}

export class UserNumberOfTurnsValueObject {
  private readonly val: number;

  constructor(unverifiedValue: number) {
    this.val = unverifiedValue;
  }

  value(): number {
    const validatedValue = Number(this.val);

    if (isNaN(validatedValue)) {
      throw new Error('Invalid user number of turns value');
    }

    return validatedValue;
  }
}

export class RefinementCounterValueObject {
  private readonly val: number;

  constructor(unverifiedValue: number) {
    this.val = unverifiedValue;
  }

  value(): string {
    const validatedValue = Number(this.val);

    if (isNaN(validatedValue)) {
      throw new Error('Invalid refinement counter value');
    }

    return String(validatedValue);
  }
}

export class SuccessConversationCountValueObject {
  private readonly val: number;

  constructor(unverifiedValue: number) {
    this.val = unverifiedValue;
  }

  value(): string {
    const validatedValue = Number(this.val);

    if (isNaN(validatedValue)) {
      throw new Error('Invalid success conversation value');
    }

    return String(validatedValue);
  }
}

export class ErrorConversationCountValueObject {
  private readonly val: number;

  constructor(unverifiedValue: number) {
    this.val = unverifiedValue;
  }

  value(): string {
    const validatedValue = Number(this.val);

    if (isNaN(validatedValue)) {
      throw new Error('Invalid string value. Expected a number');
    }

    return String(validatedValue);
  }
}

export class DateTimeValueObject {
  private readonly val: string;
  private readonly currentTimestamp: number;
  private readonly dateFormat = 'yyyy-MM-dd HH:mm:ss';

  constructor(currentTimestamp: number, unverifiedValue?: string) {
    this.val = unverifiedValue;
    this.currentTimestamp = currentTimestamp;
  }

  rawValue(): string | null {
    if (this.isInvalid()) {
      return null;
    }

    return format(new Date(this.val), this.dateFormat);
  }

  fallbackIfNullValue(): string {
    if (this.isInvalid()) {
      return format(this.currentTimestamp, this.dateFormat);
    }

    return format(new Date(this.val), this.dateFormat);
  }

  isInvalid(): boolean {
    if (
      this.val === undefined ||
      this.val === null ||
      this.val === '' ||
      this.val === 'null'
    ) {
      return true;
    }

    return !isValid(new Date(this.val));
  }
}

export class SwitchReasonValueObject {
  private readonly val: string;

  constructor(unverifiedValue?: string) {
    this.val = unverifiedValue;
  }

  value(): string {
    if (isEmptyString(this.val)) {
      return '';
    }

    return this.val;
  }

  isValid() {
    return this.value() !== '';
  }
}

export class MinPowerValueObject {
  private readonly val: number;

  constructor(unverifiedValue: number) {
    this.val = unverifiedValue;
  }

  value(): string {
    const validatedValue = Number(this.val);

    if (isNaN(validatedValue)) {
      return undefined;
    }

    return String(validatedValue);
  }

  isValid() {
    if (this.val === null || (this.val as any) === 'null') {
      return false;
    }

    if (this.val === undefined) {
      return true;
    }

    return this.val >= 0 && this.val <= 500;
  }
}

export class MaxPowerValueObject {
  private readonly val: number;

  constructor(unverifiedValue: number) {
    this.val = unverifiedValue;
  }

  value(): string {
    const validatedValue = Number(this.val);

    if (isNaN(validatedValue)) {
      return undefined;
    }

    return String(validatedValue);
  }

  isValid() {
    if (this.val === null || (this.val as any) === 'null') {
      return false;
    }

    if (this.val === undefined) {
      return true;
    }

    return this.val >= 0 && this.val <= 500;
  }
}

export class TypeOfHideNoStateExceptionsValueObject {
  private readonly val: string[];

  constructor(unverifiedValue: string[]) {
    this.val = unverifiedValue.filter(this.isValid) ?? [];
  }

  value(): string[] {
    return this.val;
  }

  private isValid(val: string): boolean {
    return [
      'free',
      'occupied',
      'reserved',
      'charging',
      'error',
      'unknown',
      'coming_soon',
    ].includes(val);
  }
}

export class TypeOfLocationsValueObject {
  private readonly val: string[];

  constructor(unverifiedValue: string[]) {
    const capitalizeFirstLetter = (str) =>
      str.charAt(0).toUpperCase() + str.slice(1);
    this.val = (unverifiedValue.filter(this.isValid) ?? []).map(
      capitalizeFirstLetter
    );
  }

  value(): string[] {
    return this.val;
  }

  private isValid(val: string): boolean {
    return [
      'Restaurant',
      'Hotel',
      'Supermarket',
      'Shopping center',
      'Service station',
      'Motorway service station',
      'Paid parking',
      'Free car park',
      'Dealer',
      'Taxi',
      'Company',
      'Store',
      'Workshop',
      'Camping',
      'Airport',
    ]
      .map((val) => val.toLowerCase())
      .includes(val.toLowerCase());
  }
}

export class AddressOptionsValueObject {
  private readonly val: {
    address: string;
    addressId: string;
    lat: number;
    lng: number;
  }[];

  constructor(
    unverifiedValue: {
      address: string;
      addressId: string;
      lat: number;
      lng: number;
    }[]
  ) {
    this.val = unverifiedValue;
  }

  value(): {
    address: string;
    addressId: string;
    lat: number;
    lng: number;
  }[] {
    return this.val;
  }

  isValid() {
    return Array.isArray(this.val);
  }
}

export class EnglishTranslationValueObject {
  private readonly val: string;

  constructor(unverifiedValue?: string) {
    this.val = unverifiedValue;
  }

  value(): string {
    if (isEmptyString(this.val)) {
      return '';
    }

    return this.val;
  }

  isValid() {
    return this.value() !== '';
  }
}

export const removeBlockedLocationsByIds = (
  addressOptions: { addressId: string }[],
  blockedLocationIds: string[]
) => {
  return addressOptions.filter(
    (option) => !blockedLocationIds.includes(option.addressId)
  );
};

export class HelpLevelValueObject {
  private readonly val: string;

  constructor(unverifiedValue?: string) {
    this.val = this.isValid(unverifiedValue) ? unverifiedValue : '';
  }

  value(): string {
    return this.val;
  }

  isValid(val: string): boolean {
    return ['', 'level 1', 'level 2', 'level 3'].includes(val);
  }
}

export const coordinates2String = (coordinates: Coordinates): string => {
  if (!coordinates) {
    return null;
  }

  return `${coordinates.lat},${coordinates.lng}`;
};

export class StateMachineValueObject {
  private readonly val: string;

  constructor(unverifiedValue?: string) {
    this.val = unverifiedValue;
  }

  value(): string {
    if (isEmptyString(this.val)) {
      return '';
    }

    if (
      this.val !== SupportedStateMachineEnum.SHOWED_ADDRESS_OPTIONS &&
      this.val !==
        SupportedStateMachineEnum.SHOWED_CHARGE_POINT_RECOMMENDATIONS &&
      this.val !==
        SupportedStateMachineEnum.SHOWED_CHARGE_POINT_ALONG_ROUTE_RECOMMENDATIONS
    ) {
      return '';
    }

    return this.val;
  }
}

export class RouteLengthInMetersValueObject {
  private readonly val: number;

  constructor(unverifiedValue: number) {
    this.val = unverifiedValue;
  }

  value(): number {
    const validatedValue = Number(this.val);

    if (isNaN(validatedValue)) {
      return undefined;
    }

    return validatedValue;
  }
}


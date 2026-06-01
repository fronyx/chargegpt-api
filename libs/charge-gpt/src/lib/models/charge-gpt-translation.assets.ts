import { format } from 'date-fns';
import { ConversationHistory } from './conversation-history.model';
import { isEmptyString } from '../../../../../apps/cdk-apps/src/shared/utils/is-empty-string.function';
import { getTranslation, TranslationsService } from '@fronyx/translations';
import {
  AddressTimeTips,
  ChargingSpeedTips,
  OperatorNameTips,
} from '../../../../../apps/cdk-apps/src/shared/models/general/chargegpt-translation';
import { Coordinates } from './prompt';
import { getRandomElement } from './chat-utilities';
import { DEFAULT_MAX_POWER, DEFAULT_MIN_POWER } from './power-kw.constants';
import { ToolkitProject } from '@fronyx/toolkit';

const datesAreOnSameDay = (first, second) =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate();

export const getChargeGptRecommendationText = (
  history: ConversationHistory,
  isSearchRadiusIncreased = false
): string => {
  const powerType = history.getPowerType();
  const operatorName = history.getOperatorName();
  const dateTime = history.getProcessedDateTime();
  const requestedDateTime = new Date(dateTime ?? Date.now());
  const clientTimestampWith5MinBuffer = new Date(
    history.clientTimestamp - history.timezoneOffset * 60000 + 5 * 60000
  );
  const isNow = requestedDateTime < clientTimestampWith5MinBuffer;
  const isSpecificPowerType =
    history.getPowerType() !== 'both' && history.getPowerType() !== undefined;
  const isKwPowerRequested =
    history.getMinPower() !== undefined &&
    history.getMaxPower() !== undefined &&
    !(
      history.getMaxPower() === DEFAULT_MAX_POWER &&
      history.getMinPower() === DEFAULT_MIN_POWER
    );

  const time = format(requestedDateTime, 'HH:mm');
  const date = format(requestedDateTime, 'dd.MM.yyyy');
  const connectorType = history.getRequestConnectorTypeValue();

  switch (history.language) {
    case 'es': {
      let timeAndDate = ' a las ' + time + ' del ' + date;

      if (datesAreOnSameDay(clientTimestampWith5MinBuffer, requestedDateTime)) {
        timeAndDate = ' a las ' + time;
      }
      return `${insertIncreasedSearchRadiusPrefix(
        isSearchRadiusIncreased,
        history.language
      )}Basándome en la disponibilidad ${insertCurrentOrPredicted(
        isNow,
        history.language
      )} de puntos de recarga${insertPowerType(
        powerType,
        isSpecificPowerType
      )}${insertConnectorType(connectorType)}${insertOperatorName(
        operatorName
      )}${
        isKwPowerRequested
          ? generateMessageForPowerTypeWithMinMaxPower(history)
          : ''
      }${timeAndDate}, recomiendo:`;
    }
    case 'fr': {
      let timeAndDate = ' à ' + time + ' le ' + date;

      if (datesAreOnSameDay(clientTimestampWith5MinBuffer, requestedDateTime)) {
        timeAndDate = ' à ' + time + ' heures';
      }
      return `${insertIncreasedSearchRadiusPrefix(
        isSearchRadiusIncreased,
        history.language
      )}En fonction de la disponibilité ${insertCurrentOrPredicted(
        isNow,
        history.language
      )} des${insertPowerType(
        powerType,
        isSpecificPowerType
      )}${insertConnectorType(connectorType)}${insertOperatorName(
        operatorName
      )}${
        isKwPowerRequested
          ? generateMessageForPowerTypeWithMinMaxPower(history)
          : ''
      }${timeAndDate}, je recommande:`;
    }
    case 'pt': {
      let timeAndDate = ' às ' + time + ' do dia ' + date;

      if (datesAreOnSameDay(clientTimestampWith5MinBuffer, requestedDateTime)) {
        timeAndDate = ' às ' + time;
      }
      return `${insertIncreasedSearchRadiusPrefix(
        isSearchRadiusIncreased,
        history.language
      )}Com base na ${insertCurrentOrPredicted(
        isNow,
        history.language
      )} disponibilidade de postos de carregamento${insertPowerType(
        powerType,
        isSpecificPowerType
      )}${insertConnectorType(connectorType)}${insertOperatorName(
        operatorName
      )}${
        isKwPowerRequested
          ? generateMessageForPowerTypeWithMinMaxPower(history)
          : ''
      }${timeAndDate}, recomendo esta opção:`;
    }
    case 'de': {
      let timeAndDate = ' um ' + time + ' Uhr am ' + date;

      if (datesAreOnSameDay(clientTimestampWith5MinBuffer, requestedDateTime)) {
        timeAndDate = ' um ' + time + ' Uhr';
      }

      return `${insertIncreasedSearchRadiusPrefix(
        isSearchRadiusIncreased,
        history.language
      )}Basierend auf der ${insertCurrentOrPredicted(
        isNow,
        history.language
      )} Verfügbarkeit von${insertPowerType(
        powerType,
        isSpecificPowerType
      )}${insertConnectorType(connectorType)}${insertOperatorName(
        operatorName
      )} Ladepunkten ${
        isKwPowerRequested
          ? generateMessageForPowerTypeWithMinMaxPower(history)
          : ''
      }${timeAndDate} empfehle ich:`;
    }
    case 'cz': {
      let timeAndDate = ' ve ' + time + ' dne ' + date;

      if (datesAreOnSameDay(clientTimestampWith5MinBuffer, requestedDateTime)) {
        timeAndDate = ' ve ' + time;
      }
      return `${insertIncreasedSearchRadiusPrefix(
        isSearchRadiusIncreased,
        history.language
      )}Na základě ${insertCurrentOrPredicted(
        isNow,
        history.language
      )} dostupnosti${insertPowerType(
        powerType,
        isSpecificPowerType
      )} nabíjecích bodů${insertConnectorType(
        connectorType
      )} od${insertOperatorName(operatorName)}${
        isKwPowerRequested
          ? generateMessageForPowerTypeWithMinMaxPower(history)
          : ''
      }${timeAndDate}, doporučuji:`;
    }
    default: {
      const timeAMPM = requestedDateTime.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      });
      const date = format(requestedDateTime, 'yyyy-MM-dd');
      const timeAndDate = datesAreOnSameDay(
        clientTimestampWith5MinBuffer,
        requestedDateTime
      )
        ? 'at ' + timeAMPM
        : 'at ' + timeAMPM + ' on ' + date;

      return `${insertIncreasedSearchRadiusPrefix(
        isSearchRadiusIncreased,
        history.language
      )}Based on ${insertCurrentOrPredicted(
        isNow,
        history.language
      )} availability of${insertPowerType(
        powerType,
        isSpecificPowerType
      )}${insertConnectorType(connectorType)}${insertOperatorName(
        operatorName
      )} charge points ${timeAndDate}${
        isKwPowerRequested
          ? generateMessageForPowerTypeWithMinMaxPower(history)
          : ''
      }, I recommend:`;
    }
  }
};

export const welcomeMessage = (language: string) => {
  return getTranslation(language, 'whatsApp.welcomeMessage');
};

const insertIncreasedSearchRadiusPrefix = (
  isIncreasedSearchRadius: boolean,
  language: string
) => {
  if (!isIncreasedSearchRadius) {
    return '';
  }

  switch (language) {
    case 'es': {
      return 'Como no he podido encontrar un punto de carga adecuado a poca distancia, he aumentado el radio de búsqueda a 15 kilómetros. ';
    }
    case 'fr': {
      // eslint-disable-next-line quotes
      return "Comme je n'ai pas trouvé de point de charge approprié à distance de marche, j'ai augmenté le rayon de recherche à 15 kilomètres. ";
    }
    case 'pt': {
      return 'Como não consegui encontrar um ponto de carregamento adequado a uma curta distância, aumentei o raio de pesquisa para 15 quilómetros. ';
    }
    case 'de': {
      return 'Da ich keine geeignete Ladestation in fußläufiger Entfernung finden konnte, habe ich den Suchradius auf 15 Kilometer erweitert. ';
    }
    case 'cz': {
      return 'Protože se mi nepodařilo najít vhodné nabíjecí místo v docházkové vzdálenosti, zvětšil jsem okruh hledání na 15 kilometrů. ';
    }
    default: {
      // eslint-disable-next-line quotes
      return "As I couldn't find a suitable charge point in walking distance, I've increased the search radius to 15 kilometers. ";
    }
  }
};

const insertCurrentOrPredicted = (isNow: boolean, language: string): string => {
  switch (language) {
    case 'es': {
      return isNow ? 'actual' : 'prevista';
    }
    case 'fr': {
      return isNow ? 'actuelle' : 'prévue';
    }
    case 'pt': {
      return isNow ? 'atual' : 'prevista';
    }
    case 'de': {
      return isNow ? 'aktuellen' : 'prognostizierten';
    }
    case 'cz': {
      return isNow ? 'aktuální' : 'předpokládané';
    }
    default: {
      return isNow ? 'current' : 'predicted';
    }
  }
};

const insertPowerType = (
  powerType: string,
  isSpecificPowerType: boolean
): string => {
  return isSpecificPowerType ? ` ${powerType}` : '';
};

const insertConnectorType = (connectorType: string): string => {
  return !isEmptyString(connectorType) ? ` ${connectorType}` : '';
};

const insertOperatorName = (operatorName: string): string => {
  return !!operatorName && operatorName !== 'all' ? ` ${operatorName} ` : '';
};

export const invalidDateTime = (payload: {
  language: string;
  requestedDateTime: Date;
}): string => {
  const date = format(payload.requestedDateTime, 'yyyy-MM-dd');
  const time = format(payload.requestedDateTime, 'HH:mm');

  switch (payload.language) {
    case 'es': {
      return `No se permiten solicitudes de carga en el pasado (${time} el ${date}). ¿Quieres intentarlo de nuevo?`;
    }
    case 'fr': {
      return `Les demandes de recharge dans le passé (${time} le ${date}) ne sont pas autorisées. Souhaitez-vous réessayer?`;
    }
    case 'pt': {
      return `Pedidos de carregamento no passado (${time} em ${date}) não são permitidos. Queres tentar novamente?`;
    }
    case 'de': {
      return `Anfragen zum Laden in der Vergangenheit (${time} Uhr am ${date}) sind nicht erlaubt. Möchtest du es noch mal probieren?`;
    }
    case 'cz': {
      return `Požadavek na účtování v ${time} dne ${date} není možný. Zkuste to prosím znovu.`;
    }
    default: {
      const timeAMPM = payload.requestedDateTime.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      });

      return `Request for charging at ${timeAMPM} on ${date} is not possible. Please try again.`;
    }
  }
};

const insertNoChargingStationFoundWithinIncreasedRadiusSearch = (
  isIncreasedSearchRadius: boolean,
  language: string
): string => {
  if (!isIncreasedSearchRadius) {
    return ' ';
  }

  return ` ${getTranslation(
    language,
    'recommendationText.increaseRadiusSearchText'
  )} `;
};

export const noChargePointsInDB = (
  history: ConversationHistory,
  isSearchRadiusIncreased
): string => {
  const address = history.getAddress();
  const operatorName = history.getOperatorName();
  const language = history.language.toLowerCase();
  const connectorType = history.getRequestConnectorTypeValue();
  const isKwPowerRequested =
    history.getMinPower() !== undefined &&
    history.getMaxPower() !== undefined &&
    !(
      history.getMaxPower() === DEFAULT_MAX_POWER &&
      history.getMinPower() === DEFAULT_MIN_POWER
    );

  switch (language) {
    case 'es': {
      return `No pude encontrar ninguna estación de carga${
        !isKwPowerRequested
          ? generateMessageForPowerTypeWithoutMinMaxPower(history)
          : ''
      }${insertConnectorType(connectorType)}${insertOperatorName(
        operatorName
      )}${
        isKwPowerRequested
          ? generateMessageForPowerTypeWithMinMaxPower(history)
          : ''
      }${insertNoChargingStationFoundWithinIncreasedRadiusSearch(
        isSearchRadiusIncreased,
        language
      )}de ${
        !isEmptyString(address) ? address : 'usted'
      }. ${generateFinalLocationErrorMessage(history)}`;
    }
    case 'fr': {
      return `Je n'ai trouvé aucune${
        !isKwPowerRequested
          ? generateMessageForPowerTypeWithoutMinMaxPower(history)
          : ''
      }${insertConnectorType(connectorType)}${insertOperatorName(
        operatorName
      )}${
        isKwPowerRequested
          ? generateMessageForPowerTypeWithMinMaxPower(history)
          : ''
      } station de recharge autour${insertNoChargingStationFoundWithinIncreasedRadiusSearch(
        isSearchRadiusIncreased,
        language
      )}de ${
        !isEmptyString(address) ? address : 'vous'
      }. ${generateFinalLocationErrorMessage(history)}`;
    }
    case 'pt': {
      return `Não consegui encontrar nenhum posto de carregamento${
        !isKwPowerRequested
          ? generateMessageForPowerTypeWithoutMinMaxPower(history)
          : ''
      }${insertConnectorType(connectorType)}${insertOperatorName(
        operatorName
      )}${
        isKwPowerRequested
          ? generateMessageForPowerTypeWithMinMaxPower(history)
          : ''
      } ${insertNoChargingStationFoundWithinIncreasedRadiusSearch(
        isSearchRadiusIncreased,
        language
      )}de ${
        !isEmptyString(address) ? address : 'si'
      }. ${generateFinalLocationErrorMessage(history)}`;
    }
    case 'de': {
      return `Ich konnte keine${
        !isKwPowerRequested
          ? generateMessageForPowerTypeWithoutMinMaxPower(history)
          : ''
      }${insertConnectorType(connectorType)}${insertOperatorName(
        operatorName
      )} Ladestation${
        isKwPowerRequested
          ? generateMessageForPowerTypeWithMinMaxPower(history)
          : ''
      }${insertNoChargingStationFoundWithinIncreasedRadiusSearch(
        isSearchRadiusIncreased,
        language
      )}in der Nähe von ${
        !isEmptyString(address) ? address : 'dir'
      } finden. ${generateFinalLocationErrorMessage(history)}`;
    }
    case 'cz': {
      return `Nemohl jsem najít žádné${
        !isKwPowerRequested
          ? generateMessageForPowerTypeWithoutMinMaxPower(history)
          : ''
      }${
        isKwPowerRequested
          ? generateMessageForPowerTypeWithMinMaxPower(history)
          : ''
      }${insertOperatorName(operatorName)}${insertConnectorType(
        connectorType
      )} nabíjecí stanice${insertNoChargingStationFoundWithinIncreasedRadiusSearch(
        isSearchRadiusIncreased,
        language
      )}kolem ${
        !isEmptyString(address) ? address : 'vás'
      }. ${generateFinalLocationErrorMessage(history)}`;
    }
    default: {
      return `I couldn't find any ${insertOperatorName(
        operatorName
      )}charging stations ${
        !isKwPowerRequested
          ? generateMessageForPowerTypeWithoutMinMaxPower(history)
          : ''
      }${
        isKwPowerRequested
          ? generateMessageForPowerTypeWithMinMaxPower(history)
          : ''
      }${insertConnectorType(
        connectorType
      )}${insertNoChargingStationFoundWithinIncreasedRadiusSearch(
        isSearchRadiusIncreased,
        language
      )}around ${
        !isEmptyString(address) ? address : 'you'
      }. ${generateFinalLocationErrorMessage(history)}`;
    }
  }
};

export const noChargePointsInDBForAllAddressOptions = (
  history: ConversationHistory
): string => {
  const destination = history.getDestinationAddress();
  const operatorName = history.getOperatorName();
  const language = history.language.toLowerCase();
  const connectorType = history.getRequestConnectorTypeValue();
  const isKwPowerRequested =
    history.getMinPower() !== undefined &&
    history.getMaxPower() !== undefined &&
    !(
      history.getMaxPower() === DEFAULT_MAX_POWER &&
      history.getMinPower() === DEFAULT_MIN_POWER
    );

  switch (language) {
    case 'de': {
      return `An mehreren potenziellen Zieloptionen konnte ich keine${
        !isKwPowerRequested
          ? generateMessageForPowerTypeWithoutMinMaxPower(history)
          : ''
      }${insertConnectorType(connectorType)}${insertOperatorName(
        operatorName
      )} Ladestation${
        isKwPowerRequested
          ? generateMessageForPowerTypeWithMinMaxPower(history)
          : ''
      } in der Nähe von ${
        !isEmptyString(destination) ? destination : 'dir'
      } finden. ${generateFinalLocationErrorMessage(history)}`;
    }
    case 'es': {
      return `En varias opciones de destino potenciales no pude encontrar ninguna estación de carga${
        !isKwPowerRequested
          ? generateMessageForPowerTypeWithoutMinMaxPower(history)
          : ''
      }${insertConnectorType(connectorType)}${insertOperatorName(
        operatorName
      )}${
        isKwPowerRequested
          ? generateMessageForPowerTypeWithMinMaxPower(history)
          : ''
      } alrededor de ${
        !isEmptyString(destination) ? destination : 'usted'
      }. ${generateFinalLocationErrorMessage(history)}`;
    }
    case 'fr': {
      return `A plusieurs destinations potentielles je n'ai trouvé aucune${
        !isKwPowerRequested
          ? generateMessageForPowerTypeWithoutMinMaxPower(history)
          : ''
      }${insertConnectorType(connectorType)}${insertOperatorName(
        operatorName
      )}${
        isKwPowerRequested
          ? generateMessageForPowerTypeWithMinMaxPower(history)
          : ''
      } station de recharge autour de ${
        !isEmptyString(destination) ? destination : 'vous'
      }. ${generateFinalLocationErrorMessage(history)}`;
    }
    case 'pt': {
      return `Em várias opções de destino potenciais não consegui encontrar nenhum posto de carregamento${
        !isKwPowerRequested
          ? generateMessageForPowerTypeWithoutMinMaxPower(history)
          : ''
      }${insertConnectorType(connectorType)}${insertOperatorName(
        operatorName
      )}${
        isKwPowerRequested
          ? generateMessageForPowerTypeWithMinMaxPower(history)
          : ''
      } em torno de ${
        !isEmptyString(destination) ? destination : 'si'
      }. ${generateFinalLocationErrorMessage(history)}`;
    }
    case 'cz': {
      return `Na několika potenciálních možnostech cíle nemohl jsem najít žádné${
        !isKwPowerRequested
          ? generateMessageForPowerTypeWithoutMinMaxPower(history)
          : ''
      }${
        isKwPowerRequested
          ? generateMessageForPowerTypeWithMinMaxPower(history)
          : ''
      }${insertOperatorName(operatorName)}${insertConnectorType(
        connectorType
      )} nabíjecí stanice kolem ${
        !isEmptyString(destination) ? destination : 'vás'
      }. ${generateFinalLocationErrorMessage(history)}`;
    }
    default: {
      return `At several potential destination options, I couldn't find any charging stations ${
        !isKwPowerRequested
          ? generateMessageForPowerTypeWithoutMinMaxPower(history)
          : ''
      }${
        isKwPowerRequested
          ? generateMessageForPowerTypeWithMinMaxPower(history)
          : ''
      }${insertConnectorType(connectorType)}${insertOperatorName(
        operatorName
      )} around ${
        !isEmptyString(destination) ? destination : 'you'
      }. ${generateFinalLocationErrorMessage(history)}`;
    }
  }
};

export const noChargePointsAvailable = (
  history: ConversationHistory,
  numberOfChargingStations: number,
  isSearchRadiusIncreased: boolean
): string => {
  const address = history.getAddress();
  const dateTime = history.getProcessedDateTime();
  const requestedDateTime = new Date(dateTime);
  const language = history.language.toLowerCase();
  const isNow = isRequestedDateTimeIsCurrentTime(
    requestedDateTime,
    history.clientTimestamp,
    history.timezoneOffset
  );
  const operatorName = history.getOperatorName();
  const connectorType = history.getRequestConnectorTypeValue();
  const isKwPowerRequested =
    history.getMinPower() !== undefined &&
    history.getMaxPower() !== undefined &&
    !(
      history.getMaxPower() === DEFAULT_MAX_POWER &&
      history.getMinPower() === DEFAULT_MIN_POWER
    );

  const time = format(requestedDateTime, 'HH:mm');
  const date = format(requestedDateTime, 'dd.MM.yyyy');

  switch (language) {
    case 'es': {
      return `Encontré${
        ' ' +
        translateNumberOfChargingStations(
          history.language,
          numberOfChargingStations
        )
      }${
        !isKwPowerRequested
          ? generateMessageForPowerTypeWithoutMinMaxPower(history)
          : ''
      }${
        isKwPowerRequested
          ? generateMessageForPowerTypeWithMinMaxPower(history)
          : ''
      }${insertConnectorType(connectorType)}${insertOperatorName(
        operatorName
      )} estaciones de carga${insertNoChargingStationFoundWithinIncreasedRadiusSearch(
        isSearchRadiusIncreased,
        language
      )}de ${
        !isEmptyString(address) ? address : 'usted'
      }, pero ninguna de ellas está${
        !isNow ? ' prevista para estar' : ''
      } disponible en ${date} ${time}. ${generateFinalLocationErrorMessage(
        history
      )}`;
    }
    case 'fr': {
      return `J'ai trouvé${
        ' ' +
        translateNumberOfChargingStations(
          history.language,
          numberOfChargingStations
        )
      }${
        !isKwPowerRequested
          ? generateMessageForPowerTypeWithoutMinMaxPower(history)
          : ''
      }${
        isKwPowerRequested
          ? generateMessageForPowerTypeWithMinMaxPower(history)
          : ''
      }${insertConnectorType(connectorType)}${insertOperatorName(
        operatorName
      )} des stations de recharge autour${insertNoChargingStationFoundWithinIncreasedRadiusSearch(
        isSearchRadiusIncreased,
        language
      )}de ${
        !isEmptyString(address) ? address : 'vous'
      }, mais aucune d'entre elles n'est${
        !isNow ? ' prévue pour être' : ''
      } disponible à ${date} ${time}. ${generateFinalLocationErrorMessage(
        history
      )}`;
    }
    case 'pt': {
      return `Encontrei ${
        ' ' +
        translateNumberOfChargingStations(
          history.language,
          numberOfChargingStations
        )
      }${
        !isKwPowerRequested
          ? generateMessageForPowerTypeWithoutMinMaxPower(history)
          : ''
      }${
        isKwPowerRequested
          ? generateMessageForPowerTypeWithMinMaxPower(history)
          : ''
      }${insertConnectorType(connectorType)}${insertOperatorName(
        operatorName
      )} postos de carregamento${insertNoChargingStationFoundWithinIncreasedRadiusSearch(
        isSearchRadiusIncreased,
        language
      )}de ${!isEmptyString(address) ? address : 'si'}, mas nenhum deles está${
        !isNow ? ' previsto para estar' : ''
      } disponível às ${date} ${time}. ${generateFinalLocationErrorMessage(
        history
      )}`;
    }
    case 'de': {
      return `Von ${
        ' ' +
        translateNumberOfChargingStations(
          history.language,
          numberOfChargingStations
        )
      }${
        !isKwPowerRequested
          ? generateMessageForPowerTypeWithoutMinMaxPower(history)
          : ''
      }${
        isKwPowerRequested
          ? generateMessageForPowerTypeWithMinMaxPower(history)
          : ''
      }${insertConnectorType(connectorType)}${insertOperatorName(
        operatorName
      )} Ladepunkten${insertNoChargingStationFoundWithinIncreasedRadiusSearch(
        isSearchRadiusIncreased,
        language
      )}in der Nähe von ${
        !isEmptyString(address) ? address : 'dir'
      } ist am ${date} um ${time}${
        !isNow ? ' vorraussichtlich' : ''
      } keine verfügbar. ${generateFinalLocationErrorMessage(history)}`;
    }
    case 'cz': {
      return `Našel jsem${
        ' ' +
        translateNumberOfChargingStations(
          history.language,
          numberOfChargingStations
        )
      }${
        !isKwPowerRequested
          ? generateMessageForPowerTypeWithoutMinMaxPower(history)
          : ''
      }${
        isKwPowerRequested
          ? generateMessageForPowerTypeWithMinMaxPower(history)
          : ''
      }${insertConnectorType(connectorType)}${insertOperatorName(
        operatorName
      )} nabíjecí stanice${insertNoChargingStationFoundWithinIncreasedRadiusSearch(
        isSearchRadiusIncreased,
        language
      )}v okolí ${
        !isEmptyString(address) ? address : 'vy'
      } ale žádná z nich není v ${date} ${time}. ${generateFinalLocationErrorMessage}`;
    }
    default: {
      return `I found${
        ' ' +
        translateNumberOfChargingStations(
          history.language,
          numberOfChargingStations
        )
      }${
        !isKwPowerRequested
          ? generateMessageForPowerTypeWithoutMinMaxPower(history)
          : ''
      }${
        isKwPowerRequested
          ? generateMessageForPowerTypeWithMinMaxPower(history)
          : ''
      }${insertConnectorType(connectorType)}${insertOperatorName(
        operatorName
      )} charging stations${insertNoChargingStationFoundWithinIncreasedRadiusSearch(
        isSearchRadiusIncreased,
        language
      )}around ${
        !isEmptyString(address) ? address : 'you'
      } but none of them is${
        !isNow ? ' predicted to be' : ''
      } available at ${date} ${time}. ${generateFinalLocationErrorMessage(
        history
      )}`;
    }
  }
};

export const translateNumberOfChargingStations = (lang, count: number) => {
  if (!count) {
    return getTranslation(lang, 'errorMessages.multipleWord');
  }

  return count;
};

export const noChargePointsAvailableWithinAddressOptions = (
  history: ConversationHistory,
  numberOfChargePoint: number
): string => {
  const destination = history.getDestinationAddress();
  const dateTime = history.getProcessedDateTime();
  const requestedDateTime = new Date(dateTime);
  const language = history.language.toLowerCase();
  const isNow = isRequestedDateTimeIsCurrentTime(
    requestedDateTime,
    history.clientTimestamp,
    history.timezoneOffset
  );
  const operatorName = history.getOperatorName();
  const connectorType = history.getRequestConnectorTypeValue();
  const isKwPowerRequested =
    history.getMinPower() !== undefined &&
    history.getMaxPower() !== undefined &&
    !(
      history.getMaxPower() === DEFAULT_MAX_POWER &&
      history.getMinPower() === DEFAULT_MIN_POWER
    );
  const time = format(requestedDateTime, 'HH:mm');
  const date = format(requestedDateTime, 'dd.MM.yyyy');

  switch (language) {
    case 'de': {
      return `An mehreren potenziellen Zieloptionen von${
        ' ' + translateNumberOfChargingStations(language, numberOfChargePoint)
      }${
        !isKwPowerRequested
          ? generateMessageForPowerTypeWithoutMinMaxPower(history)
          : ''
      }${
        isKwPowerRequested
          ? generateMessageForPowerTypeWithMinMaxPower(history)
          : ''
      }${insertConnectorType(connectorType)}${insertOperatorName(
        operatorName
      )} Ladepunkten in der Nähe von ${
        !isEmptyString(destination) ? destination : 'dir'
      } ist am ${date} um ${time}${
        !isNow ? ' vorraussichtlich' : ''
      } keine verfügbar. ${generateFinalLocationErrorMessage(history)}`;
    }
    case 'es': {
      return `En varias opciones de destino potenciales encontré${
        ' ' + translateNumberOfChargingStations(language, numberOfChargePoint)
      }${
        !isKwPowerRequested
          ? generateMessageForPowerTypeWithoutMinMaxPower(history)
          : ''
      }${
        isKwPowerRequested
          ? generateMessageForPowerTypeWithMinMaxPower(history)
          : ''
      }${insertConnectorType(connectorType)}${insertOperatorName(
        operatorName
      )} estaciones de carga alrededor de ${
        !isEmptyString(destination) ? destination : 'usted'
      }, pero ninguna de ellas está${
        !isNow ? ' prevista para estar' : ''
      } disponible en ${date} ${time}. ${generateFinalLocationErrorMessage(
        history
      )}`;
    }
    case 'fr': {
      return `A plusieurs destinations potentielles j'ai trouvé${
        ' ' + translateNumberOfChargingStations(language, numberOfChargePoint)
      }${
        !isKwPowerRequested
          ? generateMessageForPowerTypeWithoutMinMaxPower(history)
          : ''
      }${
        isKwPowerRequested
          ? generateMessageForPowerTypeWithMinMaxPower(history)
          : ''
      }${insertConnectorType(connectorType)}${insertOperatorName(
        operatorName
      )} des stations de recharge autour de ${
        !isEmptyString(destination) ? destination : 'vous'
      }, mais aucune d'entre elles n'est${
        !isNow ? ' prévue pour être' : ''
      } disponible à ${date} ${time}. ${generateFinalLocationErrorMessage(
        history
      )}`;
    }
    case 'pt': {
      return `Em várias opções de destino potenciais encontrei ${
        ' ' + translateNumberOfChargingStations(language, numberOfChargePoint)
      }${
        !isKwPowerRequested
          ? generateMessageForPowerTypeWithoutMinMaxPower(history)
          : ''
      }${
        isKwPowerRequested
          ? generateMessageForPowerTypeWithMinMaxPower(history)
          : ''
      }${insertConnectorType(connectorType)}${insertOperatorName(
        operatorName
      )} postos de carregamento em torno de ${
        !isEmptyString(destination) ? destination : 'si'
      }, mas nenhum deles está${
        !isNow ? ' previsto para estar' : ''
      } disponível às ${date} ${time}. ${generateFinalLocationErrorMessage(
        history
      )}`;
    }
    case 'cz': {
      return `Na několika potenciálních možnostech cíle našel jsem${
        ' ' + translateNumberOfChargingStations(language, numberOfChargePoint)
      }${
        !isKwPowerRequested
          ? generateMessageForPowerTypeWithoutMinMaxPower(history)
          : ''
      }${
        isKwPowerRequested
          ? generateMessageForPowerTypeWithMinMaxPower(history)
          : ''
      }${insertConnectorType(connectorType)}${insertOperatorName(
        operatorName
      )} nabíjecí stanice v okolí ${
        !isEmptyString(destination) ? destination : 'vy'
      } ale žádná z nich není v ${date} ${time}. ${generateFinalLocationErrorMessage}`;
    }
    default: {
      return `At several potential destination options, I found${
        ' ' + translateNumberOfChargingStations(language, numberOfChargePoint)
      }${
        !isKwPowerRequested
          ? generateMessageForPowerTypeWithoutMinMaxPower(history)
          : ''
      }${
        isKwPowerRequested
          ? generateMessageForPowerTypeWithMinMaxPower(history)
          : ''
      }${insertConnectorType(connectorType)}${insertOperatorName(
        operatorName
      )} charging stations around ${
        !isEmptyString(destination) ? destination : 'you'
      } but none of them is${
        !isNow ? ' predicted to be' : ''
      } available at ${date} ${time}. ${generateFinalLocationErrorMessage(
        history
      )}`;
    }
  }
};

export const generateFinalLocationErrorMessage = (
  history: ConversationHistory
): string => {
  const language = history.language;
  const operatorName = history.getOperatorName();
  const powerType = history.getPowerType();
  const minPower = history.getMinPower();
  const maxPower = history.getMaxPower();
  const translation = new TranslationsService(language);

  translation.setAsset('AddressTimeTips', AddressTimeTips);
  translation.setAsset('ChargingSpeedTips', ChargingSpeedTips);
  translation.setAsset('OperatorNameTips', OperatorNameTips);

  if (isEmptyString(operatorName) || operatorName === 'all') {
    if (!isEmptyString(powerType)) {
      return translation.get('ChargingSpeedTips');
    } else if (!isNaN(minPower) && !isNaN(maxPower)) {
      return translation.get('ChargingSpeedTips');
    } else {
      return translation.get('AddressTimeTips');
    }
  } else {
    return translation.get('OperatorNameTips');
  }
};

export const generateCountryPermissionErrorMessage = (
  language: string,
  countryCode: string
): string => {
  const countryName = getTranslation(language, `countryName.${countryCode}`);

  if (isEmptyString(countryName)) {
    return getTranslation(
      language.toLowerCase(),
      'errorMessages.unsupportedCountry.unspecific'
    );
  } else {
    return getTranslation(
      language.toLowerCase(),
      'errorMessages.unsupportedCountry.specific',
      { countryName }
    );
  }
};

export const generateCharacterLimitErrorMessage = (
  history: ConversationHistory,
  characterLimit: number
): string => {
  const language = history.language.toLowerCase();

  switch (language) {
    case 'es': {
      return `La entrada que proporcionaste excede el límite máximo de caracteres de ${characterLimit}. Por favor, acorta tu entrada para cumplir con el límite de caracteres especificado e intenta nuevamente.`;
    }
    case 'fr': {
      return `La saisie que vous avez fournie dépasse la limite de caractères maximale de ${characterLimit}. Veuillez raccourcir votre saisie pour respecter la limite de caractères spécifiée et réessayer.`;
    }
    case 'pt': {
      return `A entrada que forneceu excede o limite máximo de caracteres de ${characterLimit}. Por favor, encurte a sua entrada para cumprir com o limite de caracteres especificado e tente novamente.`;
    }
    case 'de': {
      return `Die eingegebene Eingabe überschreitet das maximale Zeichenlimit von ${characterLimit}. Bitte kürzen Sie Ihre Eingabe, um das angegebene Zeichenlimit einzuhalten, und versuchen Sie es erneut.`;
    }
    case 'cz': {
      return `Váš vstup přesahuje maximální povolený limit ${characterLimit} znaků. Zkraťte prosím svůj vstup na uvedený limit a zkuste to znovu.`;
    }
    default: {
      return `The input you provided exceeds the maximum character limit of ${characterLimit}. Please shorten your input to meet the specified character limit and try again.`;
    }
  }
};

export const isRequestedDateTimeIsCurrentTime = (
  date_time: Date,
  clientTimestamp: number,
  timezoneOffset: number
): boolean => {
  const requestedDateTime = new Date(date_time);
  const clientTimestampWith5MinBuffer = new Date(
    clientTimestamp - timezoneOffset * 60000 + 5 * 60000
  );

  return requestedDateTime < clientTimestampWith5MinBuffer;
};

export const getPowerInfoKey = (minPower, maxPower) => {
  if (minPower === maxPower) {
    return 'exactSpeed';
  } else if (DEFAULT_MAX_POWER !== maxPower && DEFAULT_MIN_POWER === minPower) {
    return 'maxSpeed';
  } else {
    return 'minSpeed';
  }
};

export const generateMessageForPowerTypeWithMinMaxPower = (
  history: ConversationHistory
): string => {
  const minPower = history.getMinPower();
  const maxPower = history.getMaxPower();

  const language = history.language.toLowerCase();

  return ` ${getTranslation(
    language,
    `recommendationText.powerInfo.${getPowerInfoKey(minPower, maxPower)}`,
    {
      minPower,
      maxPower,
      exactPower: maxPower,
    }
  )}`;
};

const generateMessageForPowerTypeWithoutMinMaxPower = (
  history: ConversationHistory
): string => {
  const powerType = history.getPowerType();
  return powerType !== 'both' ? ` ${powerType}` : '';
};

export const generateInvalidAddressErrorMessage = (
  language: string,
  invalidAddress: string
): string => {
  if (invalidAddress) {
    return getTranslation(language, 'errorMessages.invalidAddress', {
      address: invalidAddress,
    });
  } else {
    return getTranslation(language, 'errorMessages.genericInvalidAddress');
  }
};

export const getChargeGptFilterText = (
  project: ToolkitProject,
  language: string,
  address: string,
  currentCoordinates: Coordinates,
  isNearbyRequested: boolean,
  postfix: string
): string => {
  let text = '';

  if (
    isNearbyResponseTextRequired({
      currentCoordinates: currentCoordinates,
      isNearbyRequested: isNearbyRequested,
    })
  ) {
    text = getRandomElement(
      project.chargegpt_filter_text_nearby[language.toLowerCase()]
        .split('\n')
        .map((element) => element.trim())
    );
  } else if (!isEmptyString(address)) {
    text = getRandomElement(
      project.chargegpt_filter_text_address[language.toLowerCase()]
        .split('\n')
        .map((element) => element.trim())
    ).replace('(location)', address);
  } else {
    text = getRandomElement(
      project.chargegpt_filter_text[language.toLowerCase()]
        .split('\n')
        .map((element) => element.trim())
    );
  }

  if (!isEmptyString(postfix)) {
    return `${text} ${postfix}`;
  } else {
    return text;
  }
};

export const getChargeGptFilterStart = (
  project: ToolkitProject,
  language: string
): string => {
  return getRandomElement(
    project.chargegpt_filter_start[language.toLowerCase()]
      .split('\n')
      .map((element) => element.trim())
  );
};

export const getChargeGptFilterMaliciousTermErrorMessage = (
  project: ToolkitProject,
  language: string
): string => {
  return getRandomElement(
    project.chargegpt_filter_malicious_term[language.toLowerCase()]
      .split('\n')
      .map((element) => element.trim())
  );
};

export const getChargeGptFilterExceedTurnsLimitErrorMessage = (
  project: ToolkitProject,
  language: string
): string => {
  return getRandomElement(
    project.chargegpt_filter_turns_limit[language.toLowerCase()]
      .split('\n')
      .map((element) => element.trim())
  );
};

export const getChargeGptRestartConversation = (
  project: ToolkitProject,
  language: string
): string => {
  return getRandomElement(
    project.chargegpt_restart_conversation[language.toLowerCase()]
      .split('\n')
      .map((element) => element.trim())
  );
};

function isNearbyResponseTextRequired(args: {
  currentCoordinates: Coordinates;
  isNearbyRequested: boolean;
}): boolean {
  return (
    isCurrentCoordinatesValid(args.currentCoordinates) && args.isNearbyRequested
  );
}

function isCurrentCoordinatesValid(currentCoordinates: Coordinates): boolean {
  return (
    !isEmptyString(currentCoordinates?.lat?.toString()) &&
    !isEmptyString(currentCoordinates?.lng?.toString())
  );
}

export const generateRouteRecommendationText = (
  history: ConversationHistory
) => {
  const language = history.language;
  const powerType = history.getPowerType();
  const operatorName = history.getOperatorName();
  const connectorType = history.getRequestConnectorTypeValue();
  const dateTime = history.getProcessedDateTime();
  const requestedDateTime = new Date(dateTime ?? Date.now());
  const clientTimestampWith5MinBuffer = new Date(
    history.clientTimestamp - history.timezoneOffset * 60000 + 5 * 60000
  );
  const isNow = requestedDateTime < clientTimestampWith5MinBuffer;
  const minPower = history.getMinPower();
  const maxPower = history.getMaxPower();
  const isSpecificPowerType =
    powerType !== 'both' && powerType !== undefined && powerType !== null;

  return getTranslation(language, 'recommendationText.routing.structures', {
    prefixText: generateRouteRecommendationPrefix(language, isNow),
    powerInfoText: insertPowerType(powerType, isSpecificPowerType),
    connectorTypeText: insertConnectorType(connectorType),
    operatorNameText: insertOperatorName(operatorName),
    chargingStationInfoText: getTranslation(
      language,
      'recommendationText.chargePointWord.plural'
    ),
    dateTimeText: generateDateTimeText(
      language,
      requestedDateTime,
      clientTimestampWith5MinBuffer
    ),
    speedInfoText: generateSpeedInfoText(language, minPower, maxPower),
    postfixText: generatePostfixText(
      language,
      isRouteMoreThan50KM(history.getRouteLengthInMeters())
    ),
  });
};

export const generateNoAvailableChargePointAlongRouteText = (
  history: ConversationHistory,
  numberOfChargingStations: number,
  isSearchRadiusIncreased: boolean
) => {
  const language = history.language;
  const powerType = history.getPowerType();
  const operatorName = history.getOperatorName();
  const connectorType = history.getRequestConnectorTypeValue();
  const routeNeed = history.getRouteNeeds();
  const dateTime = history.getProcessedDateTime();
  const requestedDateTime = new Date(dateTime ?? Date.now());
  const minPower = history.getMinPower();
  const maxPower = history.getMaxPower();
  const isSpecificPowerType =
    powerType !== 'both' && powerType !== undefined && powerType !== null;

  const isPluralWords = numberOfChargingStations > 1;
  const originAddress = history.getFoundOriginAddressName();
  const destinationAddress = history.getFoundDestinationAddressName();

  return getTranslation(
    language,
    'recommendationText.routing.error.noChargingPointAvailable.structures',
    {
      prefixText: getTranslation(
        language,
        'recommendationText.routing.error.noChargingPointAvailable.prefixText',
        { numberOfChargingStations }
      ),
      powerInfoText: insertPowerType(powerType, isSpecificPowerType),
      connectorTypeText: insertConnectorType(connectorType),
      operatorNameText: insertOperatorName(operatorName),
      chargingStationInfoText: generateChargePointErrorText(
        language,
        isPluralWords
      ),
      speedInfoText: generateSpeedInfoText(
        language,
        history.getMinPower(),
        history.getMaxPower()
      ),
      addressInformationText: generateAddressInformationText(
        language,
        routeNeed
      ),
      routingText: generateRoutingText(
        language,
        isRouteMoreThan50KM(history.getRouteLengthInMeters()),
        originAddress,
        destinationAddress
      ),
      timeframeRequestText: generateAvailabilityText(
        language,
        requestedDateTime
      ),
      suggestionText: generateSuggestionText(
        language,
        powerType,
        minPower,
        maxPower,
        operatorName,
        routeNeed
      ),
    }
  );
};

export const generateNoAvailableChargePointAlongRouteInDBText = (
  history: ConversationHistory
) => {
  const language = history.language;
  const powerType = history.getPowerType();
  const operatorName = history.getOperatorName();
  const connectorType = history.getRequestConnectorTypeValue();
  const routeNeed = history.getRouteNeeds();
  const minPower = history.getMinPower();
  const maxPower = history.getMaxPower();
  const isSpecificPowerType =
    powerType !== 'both' && powerType !== undefined && powerType !== null;
  const isPluralWords = true;
  const originAddress = history.getFoundOriginAddressName();
  const destinationAddress = history.getFoundDestinationAddressName();

  return getTranslation(
    language,
    'recommendationText.routing.error.noChargePointAvailableInDB.structures',
    {
      prefixText: getTranslation(
        language,
        'recommendationText.routing.error.noChargePointAvailableInDB.prefixText'
      ),
      operatorNameText: insertOperatorName(operatorName),
      chargingStationInfoText: generateChargePointErrorText(
        language,
        isPluralWords
      ),
      speedInfoText: generateSpeedInfoText(
        language,
        history.getMinPower(),
        history.getMaxPower()
      ),
      powerInfoText: insertPowerType(powerType, isSpecificPowerType),
      connectorTypeText: insertConnectorType(connectorType),
      addressInformationText: generateAddressInformationText(
        language,
        routeNeed
      ),
      routingText: generateRoutingText(
        language,
        isRouteMoreThan50KM(history.getRouteLengthInMeters()),
        originAddress,
        destinationAddress
      ),
      suggestionText: generateSuggestionText(
        language,
        powerType,
        minPower,
        maxPower,
        operatorName,
        routeNeed
      ),
    }
  );
};

export const generateSpeedInfoText = (language, minPower, maxPower) => {
  if (
    !isNaN(minPower) &&
    !isNaN(maxPower) &&
    !(minPower === DEFAULT_MIN_POWER && maxPower === DEFAULT_MAX_POWER) &&
    minPower !== null &&
    maxPower !== null &&
    minPower !== undefined &&
    maxPower !== undefined
  ) {
    return getTranslation(
      language,
      `recommendationText.powerInfo.${getPowerInfoKey(minPower, maxPower)}`,
      {
        minPower,
        maxPower,
        exactPower: minPower,
      }
    );
  }
};

export const generateAddressInformationText = (
  language: string,
  poi: string
) => {
  if (!isEmptyString(poi)) {
    return ` ${getTranslation(
      language,
      'recommendationText.addressInformationText.poi',
      { poi }
    )}`;
  }
};

export const generateRoutingText = (
  language: string,
  isRoutingMoreThan50KM: boolean,
  origin: string,
  destination: string
) => {
  return isRoutingMoreThan50KM
    ? getTranslation(
        language,
        'recommendationText.addressInformationText.route',
        { origin, destination }
      )
    : getTranslation(
        language,
        'recommendationText.addressInformationText.shortenRoute',
        { origin, destination }
      );
};

export const generateAvailabilityText = (
  language: string,
  requestedDateTime: Date
) => {
  const time = format(requestedDateTime, 'HH:mm');
  const date = format(requestedDateTime, 'dd.MM.yyyy');

  return getTranslation(
    language,
    'recommendationText.routing.error.noChargingPointAvailable.availabilityText',
    {
      date,
      time,
    }
  );
};

export const generateSuggestionText = (
  language: string,
  powerType: string,
  minPower: number,
  maxPower: number,
  operatorName: string,
  routeNeed: string
) => {
  if (routeNeed) {
    return getTranslation(
      language,
      'recommendationText.suggestionText.addressTips',
      { poi: routeNeed }
    );
  }

  if (!isEmptyString(operatorName) && operatorName !== 'all') {
    return getTranslation(
      language,
      'recommendationText.suggestionText.operatorNameTips'
    );
  }

  if (!isEmptyString(powerType) && powerType !== 'all') {
    return getTranslation(
      language,
      'recommendationText.suggestionText.chargingSpeedTips'
    );
  }

  if (
    !isNaN(minPower) &&
    !isNaN(maxPower) &&
    !(minPower === DEFAULT_MIN_POWER && maxPower === DEFAULT_MAX_POWER) &&
    minPower !== null &&
    maxPower !== null &&
    minPower !== undefined &&
    maxPower !== undefined
  ) {
    return getTranslation(
      language,
      'recommendationText.suggestionText.chargingSpeedTips'
    );
  }

  return getTranslation(
    language,
    'recommendationText.suggestionText.dateTimeTips'
  );
};

export const generateDateTimeText = (
  language: string,
  requestedDateTime: Date,
  clientTimestampWith5MinBuffer: Date
) => {
  const time = format(requestedDateTime, 'HH:mm');
  const date = format(requestedDateTime, 'dd.MM.yyyy');

  if (datesAreOnSameDay(clientTimestampWith5MinBuffer, requestedDateTime)) {
    return getTranslation(language, 'recommendationText.timeText', {
      time,
    });
  }

  return getTranslation(language, 'recommendationText.dateTimeText', {
    time,
    date,
  });
};

export const getCurrentPredictionText = (
  language: string,
  isNow: boolean
): string => {
  const key = isNow ? 'currentText' : 'predictionText';
  return getTranslation(language, `recommendationText.${key}`);
};

export const generateRouteRecommendationPrefix = (
  language: string,
  isNow: boolean
) => {
  return getTranslation(
    language,
    'recommendationText.routing.recommendationPrefix',
    {
      currentPredictionText: getCurrentPredictionText(language, isNow),
    }
  );
};

export const generateChargePointErrorText = (
  language: string,
  isPluralWords: boolean
) => {
  return getTranslation(
    language,
    `recommendationText.routing.error.chargePointWord.${
      isPluralWords ? 'plural' : 'singular'
    }`
  );
};

export const generatePostfixText = (
  language: string,
  isRoutingMoreThan50KM: boolean
) => {
  return isRoutingMoreThan50KM
    ? getTranslation(
        language,
        'recommendationText.routing.recommendationPostfix'
      )
    : getTranslation(
        language,
        'recommendationText.routing.shortenRecommendationPostfix'
      );
};

const isRouteMoreThan50KM = (routeDistance: number | undefined): boolean => {
  if (isNaN(routeDistance)) {
    return false;
  }
  return routeDistance >= 50000;
};

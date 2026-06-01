import { writeFileSync, readFileSync } from 'fs';
import { resolve } from 'path';
import { CategoryPropertiesEnum as Cat2PropEnum } from '../filters-identifiers/request-identifier-cat2.service';
import { CategoryPropertiesEnum as Cat3PropEnum } from '../filters-identifiers/request-identifier-cat3.service';
import { CategoryPropertiesEnum as Cat4PropEnum } from '../filters-identifiers/request-identifier-cat4.service';
import { CategoryPropertiesEnum as Cat5PropEnum } from '../filters-identifiers/request-identifier-cat5.service';
import { CategoryPropertiesEnum as Cat6PropEnum } from '../filters-identifiers/request-identifier-cat6.service';

export const cat1FewShotRegimentFileName = 'cat1-few-shots-regiment.json';
export const cat2FewShotRegimentFileName = 'cat2-few-shots-regiment.json';
export const cat3FewShotRegimentFileName = 'cat3-few-shots-regiment.json';
export const cat4FewShotRegimentFileName = 'cat4-few-shots-regiment.json';
export const cat5FewShotRegimentFileName = 'cat5-few-shots-regiment.json';
export const cat6FewShotRegimentFileName = 'cat6-few-shots-regiment.json';
export const postfixFewShotRegimentFileName = 'postfix-few-shots-regiment.json';

export const getCsv = () => {
    return readFileSync(getTestRegimentFilePath('test-regiment.csv'), 'utf-8');
}

export const getTestRegimentFilePath = (fileName): string => {
    return resolve(__dirname, `./${fileName}`);
};

export const csvToObject = (csvData: string): Record<string, unknown>[] => {
    const lines = csvData.split('\n');
    const headerLine = lines.shift();
    const headers = headerLine.split(',');

    return lines.map((line) => {
        const payload = {};
        line.split(',').forEach((val, index) => {
            const header = headers[index];
            if (header) {
                payload[header] = parseValue(val);
            }
        });
        return payload;
    });
}

const parseValue = (val) => {
    if (val === 'true') return true;
    if (val === 'false') return false;
    if (val === '') return null;
    if (val === 'null') return null;

    if (isNaN(Number(val)) && val.includes('.')) return val.split('.');
    if (isNaN(Number(val))) return val;
    if (!isNaN(Number(val))) return Number(val);

    throw new Error(`Unsupported value ${val}`);
};

interface Cat1Output {
    power_enabled: boolean;
    min_power: number;
    max_power: number;
}

interface Cat2Output {
    [Cat2PropEnum.HIDE_COMING_SOON]: boolean;
    [Cat2PropEnum.ONLY_FREE]: boolean;
    [Cat2PropEnum.HIDE_NOT_AVAILABLE]: boolean;
}

interface Cat3Output {
    [Cat3PropEnum.ONLY_4_OR_5_STARS]: boolean;
    [Cat3PropEnum.ONLY_PUBLIC]: boolean;
}

interface Cat4Output {
    [Cat4PropEnum.ONLY_TARIFF_KWH]: boolean;
    [Cat4PropEnum.ONLY_TARIFF_MIN]: boolean;
}

interface Cat5Output {
    [Cat5PropEnum.ONLY_AUTO_CHARGE]: boolean;
    [Cat5PropEnum.ONLY_REMOTE_START_CAPABLE]: boolean;
    [Cat5PropEnum.RESET]: boolean;
}

interface Cat6Output {
    [Cat6PropEnum.TYPE_OF_LOCATIONS]?: string[];
    [Cat6PropEnum.TYPE_OF_LOCATIONS_ENABLED]: boolean;
    [Cat6PropEnum.PLUG_TYPES_ENABLED]: boolean;
}

type TestRegimentOutput = Cat1Output | Cat2Output | Cat3Output | Cat4Output | Cat5Output | Cat6Output | boolean | null;

export const getCat1ExpectedResults = (csvObject: Record<string, unknown>[]): (Cat1Output | null)[] => {
    const payloads = csvObject.map((obj) => {
        if (obj.power_enabled === null) {
            return null;
        }

        if (obj.power_enabled === false) {
            return null;
        }

        let min_power = undefined;
        let max_power = undefined;
        if (obj.power_enabled) {
            if (obj.max_power !== null) {
                max_power = obj.max_power as number;
            }

            if (obj.min_power !== null) {
                min_power = obj.min_power as number;
            }
        }

        return { power_enabled: obj.power_enabled as boolean, min_power, max_power };
    });

    return payloads;
}

export const getCat2ExpectedResults = (csvObject: Record<string, unknown>[]): (Cat2Output | null)[] => {
    const payloads = csvObject.map((obj) => {
        if ([obj.hide_coming_soon, obj.only_free, obj.hide_not_available].every(val => !val)) {
            return null;
        }

        const hideComingSoon = obj.hide_coming_soon === false ? undefined : true;
        const onlyFree = obj.only_free === false ? undefined : true;
        const hideNotAvailable = obj.hide_not_available === false ? undefined : true;

        return {
            [Cat2PropEnum.HIDE_COMING_SOON]: hideComingSoon,
            [Cat2PropEnum.ONLY_FREE]: onlyFree,
            [Cat2PropEnum.HIDE_NOT_AVAILABLE]: hideNotAvailable,
        };
    });

    return payloads;
}

export const getCat3ExpectedResults = (csvObject: Record<string, unknown>[]): (Cat3Output | null)[] => {
    const payloads = csvObject.map((obj) => {
        if ([obj.only_public, obj.only_4_or_5_stars].every(val => !val)) {
            return null;
        }

        const only4Or5Stars = obj.only_4_or_5_stars === false ? undefined : true;
        const onlyPublic = obj.only_public === false ? undefined : true;

        return {
            [Cat3PropEnum.ONLY_4_OR_5_STARS]: only4Or5Stars,
            [Cat3PropEnum.ONLY_PUBLIC]: onlyPublic,
        };
    });

    return payloads;
}

export const getCat4ExpectedResults = (csvObject: Record<string, unknown>[]): (Cat4Output | null)[] => {
    const payloads = csvObject.map((obj) => {
        if ([obj.only_tariff_kwh, obj.only_tariff_min].every(val => !val)) {
            return null;
        }

        const onlyMin = obj.only_tariff_min === false ? undefined : true;
        const onlyKwh = obj.only_tariff_kwh === false ? undefined : true;

        return {
            [Cat4PropEnum.ONLY_TARIFF_MIN]: onlyMin,
            [Cat4PropEnum.ONLY_TARIFF_KWH]: onlyKwh,
        };
    });

    return payloads;
}

export const getCat5ExpectedResults = (csvObject: Record<string, unknown>[]): (Cat5Output | null)[] => {
    const payloads = csvObject.map((obj) => {
        if ([obj.only_remote_start_capable, obj.only_remote_start_capable, obj.reset].every(val => !val)) {
            return null;
        }

        const remoteStart = obj.only_remote_start_capable === false ? undefined : true;
        const autoCharge = obj.only_auto_charge === false ? undefined : true;
        const reset = obj.reset === false ? undefined : true;

        return {
            [Cat5PropEnum.ONLY_REMOTE_START_CAPABLE]: remoteStart,
            [Cat5PropEnum.ONLY_AUTO_CHARGE]: autoCharge,
            [Cat5PropEnum.RESET]: reset,
        };
    });

    return payloads;
}

export const getCat6ExpectedResults = (csvObject: Record<string, unknown>[]): (Cat6Output | null)[] => {
    const payloads = csvObject.map((obj) => {
        if ([obj.type_of_locations, obj.type_of_locations_enabled, obj.plug_types_enabled].every(val => !val)) {
            return null;
        }

        let typeOfLocations = undefined;
        if (!!obj.type_of_locations && !Array.isArray(obj.type_of_locations)) {
            typeOfLocations = [obj.type_of_locations];
        }
        if (!!obj.type_of_locations && Array.isArray(obj.type_of_locations)) {
            typeOfLocations = obj.type_of_locations;
        }

        const typeOfLocationsEnabled = obj.type_of_locations_enabled === false ? undefined : true;
        const plugTypesEnabled = obj.plug_types_enabled === false ? undefined : true;

        return {
            [Cat6PropEnum.TYPE_OF_LOCATIONS]: typeOfLocations,
            [Cat6PropEnum.TYPE_OF_LOCATIONS_ENABLED]: typeOfLocationsEnabled,
            [Cat6PropEnum.PLUG_TYPES_ENABLED]: plugTypesEnabled,
        };
    });

    return payloads;
}

export const getPostfixExpectedResults = (csvObject: Record<string, unknown>[]): (boolean | null)[] => {
    const payloads = csvObject.map((obj) => {
        if (obj.isPostfix === null) {
            return null;
        }

        if (obj.isPostfix === false) {
            return null;
        }

        return obj.isPostfix as boolean;
    });

    return payloads;
}

export const generateTestRegimentPayloadFile = (fileName: string, userRequests: string[], outputs: TestRegimentOutput[]): void => {
    const filePath = getTestRegimentFilePath(fileName);
    const payload = userRequests.map((request, index) => ({
        summary: '',
        request,
        response: outputs[index],
    }));
    return writeFileSync(filePath, JSON.stringify(payload));
};

export const getTestRegimentsPayload = (fileName: string) => {
    return JSON.parse(readFileSync(getTestRegimentFilePath(fileName), 'utf-8'));
}

export const getUserRequestsFromCsv = (csvObject: Record<string, unknown>[]): string[] => {
    return csvObject.map((obj) => obj.conversationText) as string[];
}

import { ProjectOutputType } from '../../chat-gpt.service';
import { getTestRegimentsPayload } from '../../__test__/test-regiment-utils.service';
import { identifyAddressCharacteristics } from '../../address-identifiers/address-characterisitics.service';
import { disconnectRagClient } from '../../rag-services/rag-client.service';
import { getTestCounter } from './test-counter.utils';
import { isEmptyString } from '../../../../../../../apps/cdk-apps/src/shared/utils/is-empty-string.function';
import { AddressCharacteristics } from '../../address-identifiers/address-characteristics.model';

jest.mock('../../models/chat-utilities');

const requests = getTestRegimentsPayload(
  'addressCharacteristics-unit-tests.json'
);
const language = 'en';
const conversationId = 'test-conversation-id';
const projectName = 'test-project-name';
const projectOutputType = 'recommendations' as ProjectOutputType;

const testCounter = getTestCounter(requests);

describe.each(requests)(
  'Regiment: Address Characteristics Service',
  ({ request, response, id }) => {
    it(`Request: [[${id}]] "${request}" should return "${
      response === null ? response : JSON.stringify(response)
    }"`, async () => {
      testCounter.log();

      const expectedOutput = await cleanAndTrimOutputWrapper(() =>
        Promise.resolve(response)
      );

      if (request === null) {
        expect(true).toBeTruthy();
      } else {
        const llmResults = await cleanAndTrimOutputWrapper(() =>
          identifyAddressCharacteristics(
            request,
            conversationId,
            projectName,
            projectOutputType,
            language
          )
        );

        if (expectedOutput === null) {
          expect(llmResults).toEqual(expectedOutput);
        } else {
          // if (!isEmptyString(llmResults.country)) {
          //   const cleanedCountry = llmResults.country;

          //   const expectedCountryAvailable =
          //     expectedOutput.country.includes(cleanedCountry);

          //   if (expectedCountryAvailable) {
          //     expect(true).toBeTruthy();
          //   } else {
          //     expect(cleanedCountry).toEqual(expectedOutput.country);
          //   }
          // } else {
          //   expect(llmResults.country).toBeFalsy();
          //   expect(expectedOutput.country).toBeFalsy();
          // }

          // if (!isEmptyString(llmResults.countryCode)) {
          //   expect(llmResults.countryCode).toEqual(expectedOutput.countryCode);
          // } else {
          //   expect(llmResults.countryCode).toBeFalsy();
          //   expect(expectedOutput.countryCode).toBeFalsy();
          // }

          if (!isEmptyString(llmResults.city)) {
            expect(llmResults.city).toEqual(expectedOutput.city);
          } else {
            expect(llmResults.city).toBeFalsy();
            expect(expectedOutput.city).toBeFalsy();
          }

          if (!isEmptyString(llmResults.addressLine)) {
            expect(llmResults.addressLine).toEqual(expectedOutput.addressLine);
          } else {
            expect(llmResults.addressLine).toBeFalsy();
            expect(expectedOutput.addressLine).toBeFalsy();
          }

          if (!isEmptyString(llmResults.district)) {
            expect(llmResults.district).toEqual(expectedOutput.district);
          } else {
            expect(llmResults.district).toBeFalsy();
            expect(expectedOutput.district).toBeFalsy();
          }

          if (!isEmptyString(llmResults.cardinalDirection)) {
            expect(llmResults.cardinalDirection).toEqual(
              expectedOutput.cardinalDirection
            );
          } else {
            expect(llmResults.cardinalDirection).toBeFalsy();
            expect(expectedOutput.cardinalDirection).toBeFalsy();
          }

          if (!isEmptyString(llmResults.poiName)) {
            expect(llmResults.poiName).toEqual(expectedOutput.poiName);
          } else {
            expect(llmResults.poiName).toBeFalsy();
            expect(expectedOutput.poiName).toBeFalsy();

            if (llmResults.poiCategories?.length) {
              expect(llmResults.poiCategories).toEqual(
                expectedOutput.poiCategories
              );
            } else {
              expect(llmResults.poiCategories).toBeFalsy();
              expect(expectedOutput.poiCategories).toBeFalsy();
            }
          }

          if (llmResults.isHighwayRequested) {
            expect(llmResults.isHighwayRequested).toBe(
              expectedOutput.isHighwayRequested
            );
          } else {
            expect(llmResults.isHighwayRequested).toBeFalsy();
            expect(expectedOutput.isHighwayRequested).toBeFalsy();
          }

          if (llmResults.isCityCenter) {
            expect(llmResults.isCityCenter).toBe(expectedOutput.isCityCenter);
          } else {
            expect(llmResults.isCityCenter).toBeFalsy();
            expect(expectedOutput.isCityCenter).toBeFalsy();
          }

          // if (!isEmptyString(llmResults.addressSummary)) {
          //   const expectedSummary = parseUnconfirmedAddresses(
          //     expectedOutput.addressSummary
          //   );
          //   const receivedSummary = parseUnconfirmedAddresses(
          //     llmResults.addressSummary
          //   );

          //   if (expectedSummary === receivedSummary) {
          //     expect(receivedSummary).toEqual(expectedSummary);
          //   } else {
          //     expect(llmResults.addressSummary).toEqual(
          //       expectedOutput.addressSummary
          //     );
          //   }
          // } else {
          //   expect(llmResults.addressSummary).toBeFalsy();
          //   expect(expectedOutput.addressSummary).toBeFalsy();
          // }
        }
      }
    });

    afterAll(async () => {
      await disconnectRagClient();
    });
  }
);

const cleanAndTrimOutputWrapper = async (
  llmQueryFn: any
): Promise<AddressCharacteristics> => {
  const results = await llmQueryFn();
  return Object.keys(results).reduce((acc, key) => {
    if (typeof results[key] === 'string') {
      acc[key] = removeAccents(results[key].trim());
    } else {
      acc[key] = results[key];
    }
    return acc;
  }, {}) as unknown as AddressCharacteristics;
};

const removeAccents = (str: string): string => {
  if (!str) {
    return str;
  }

  return replaceCentreWithCenter(
    str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  );
};

const replaceCentreWithCenter = (str: string): string => {
  if (!str) {
    return str;
  }

  return str.replace('centre', 'center');
};

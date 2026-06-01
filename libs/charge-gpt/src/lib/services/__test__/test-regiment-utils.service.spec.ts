import { existsSync } from 'fs';
import {
  cat1FewShotRegimentFileName,
  csvToObject,
  generateTestRegimentPayloadFile,
  getCat1ExpectedResults,
  getTestRegimentsPayload,
  getCsv,
  getTestRegimentFilePath,
  getUserRequestsFromCsv,
  getCat2ExpectedResults,
  cat2FewShotRegimentFileName,
  getCat3ExpectedResults,
  cat3FewShotRegimentFileName,
  getCat4ExpectedResults,
  cat4FewShotRegimentFileName,
  getCat5ExpectedResults,
  cat5FewShotRegimentFileName,
  getCat6ExpectedResults,
  cat6FewShotRegimentFileName,
  getPostfixExpectedResults,
  postfixFewShotRegimentFileName,
} from './test-regiment-utils.service';

describe('getTestRegimentsPayload', () => {
  it('it should read and parse the json file', () => {
    const payload = getTestRegimentsPayload(cat1FewShotRegimentFileName);
    expect(payload[0].response.power_enabled).toBe(true);
  });
});

describe('generateTestRegimentPayloadFile', () => {
  it('should generate the json files', () => {
    const userRequests = getUserRequestsFromCsv(csvToObject(getCsv()));

    const cat1Outputs = getCat1ExpectedResults(csvToObject(getCsv()));
    generateTestRegimentPayloadFile(
      cat1FewShotRegimentFileName,
      userRequests,
      cat1Outputs
    );

    const cat2Outputs = getCat2ExpectedResults(csvToObject(getCsv()));
    generateTestRegimentPayloadFile(
      cat2FewShotRegimentFileName,
      userRequests,
      cat2Outputs
    );

    const cat3Outputs = getCat3ExpectedResults(csvToObject(getCsv()));
    generateTestRegimentPayloadFile(
      cat3FewShotRegimentFileName,
      userRequests,
      cat3Outputs
    );

    const cat4Outputs = getCat4ExpectedResults(csvToObject(getCsv()));
    generateTestRegimentPayloadFile(
      cat4FewShotRegimentFileName,
      userRequests,
      cat4Outputs
    );

    const cat5Outputs = getCat5ExpectedResults(csvToObject(getCsv()));
    generateTestRegimentPayloadFile(
      cat5FewShotRegimentFileName,
      userRequests,
      cat5Outputs
    );

    const cat6Outputs = getCat6ExpectedResults(csvToObject(getCsv()));
    generateTestRegimentPayloadFile(
      cat6FewShotRegimentFileName,
      userRequests,
      cat6Outputs
    );

    const postfixOutputs = getPostfixExpectedResults(csvToObject(getCsv()));
    generateTestRegimentPayloadFile(
      postfixFewShotRegimentFileName,
      userRequests,
      postfixOutputs,
    );

    expect(
      existsSync(getTestRegimentFilePath(cat1FewShotRegimentFileName))
    ).toBeTruthy();
    expect(
      existsSync(getTestRegimentFilePath(cat2FewShotRegimentFileName))
    ).toBeTruthy();
    expect(
      existsSync(getTestRegimentFilePath(cat3FewShotRegimentFileName))
    ).toBeTruthy();
    expect(
      existsSync(getTestRegimentFilePath(cat4FewShotRegimentFileName))
    ).toBeTruthy();
    expect(
      existsSync(getTestRegimentFilePath(cat5FewShotRegimentFileName))
    ).toBeTruthy();
    expect(
      existsSync(getTestRegimentFilePath(cat6FewShotRegimentFileName))
    ).toBeTruthy();
    expect(
      existsSync(getTestRegimentFilePath(postfixFewShotRegimentFileName))
    ).toBeTruthy();
  });
});

describe('getUserRequests', () => {
  it('should return user requests', () => {
    const userRequests = getUserRequestsFromCsv(csvToObject(getCsv()));
    expect(userRequests[0]).toEqual(
      'Eu quero carregar em Aveiro até 50kW num supermercado onde posso encontrar esses pontos de carregamento?'
    );
    expect(userRequests[4]).toEqual(
      'Eu quero carregar em Aveiro num supermercado até 50kW'
    );
  });
});

describe('getCat1ExpectedResults', () => {
  it('should return only cat 1 payload', () => {
    const cat1Payload = getCat1ExpectedResults(csvToObject(getCsv()));
    expect(cat1Payload[0]).toEqual({
      power_enabled: true,
    });

    expect(cat1Payload[2]).toEqual(null);
  });
});

describe('getCat2ExpectedResults', () => {
  it('should return only cat 2 payload', () => {
    const cat2Payload = getCat2ExpectedResults(csvToObject(getCsv()));
    expect(cat2Payload[0]).toEqual({
      hide_coming_soon: true,
      hide_not_available: false,
      only_free: false,
    });
  });
});

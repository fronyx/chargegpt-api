import { Injectable } from '@nestjs/common';
import { AvailabilityEnum, OcpiEvse, OcpiEvsePrimaryIdValue } from '../../../../cdk-apps/src/shared';
import { UtilisationStatusCacheKey } from '../../../../cdk-apps/src/shared/models/cache/utilisation-status-cache-key';
import { CacheService } from '@fronyx/cache';
import * as AWS from 'aws-sdk';
import { OcpiEvsesService, OcpiLocationsService } from '@fronyx/persistence';
import { isObjectEmpty } from '../../../../cdk-apps/src/shared/utils/is-object-empty.function';
import * as csvjson from 'csvjson';
import { configService } from '@fronyx/configurations';
import { isNull } from '../../../../cdk-apps/src/shared/utils/is-null.function';
import { UtilisationGroup } from '../../../../cdk-apps/src/shared/models/general/utilisation-group.interface';
import { IGrid } from '../../../../cdk-apps/src/shared/models/general/grid.interface';
import {
  PredictionsClassificationKey
} from '../../../../cdk-apps/src/shared/models/cache/predictions-classification-key';
import {
  PredictionCacheValue
} from '../../../../cdk-apps/src/shared/domain/cache/prediction-cache-value';
import { generateUUID } from '../../../../cdk-apps/src/shared/models/general/generate-uuid';

const s3 = new AWS.S3(configService.getAwsCredentials());

@Injectable()
export class UtilisationsRadarService {
  private deGrid = {
    topRight: {
      lat: 54.79039281037679,
      lng: 14.985351562499998,
    },
    topLeft: {
      lat: 54.79039281037679,
      lng: 5.9765625,
    },
    bottomRight: {
      lat: 47.35650163792198,
      lng: 14.985351562499998,
    },
    bottomLeft: {
      lat: 47.35650163792198,
      lng: 5.9765625,
    },
  };
  private groupSizeInKm = 25;
  private readonly earthRadiusInKm = 6371.0;
  private locationId2CoordinateCache: Record<string, { latitude: number; longitude: number }> = {};
  private primaryId2ConnectorTypeCache: Record<string, 'DC' | 'AC'> = {};
  private utilisationThresholdPercentage = 90;
  private readonly bucketName = 'utilisation-radar.report';
  private readonly fileNameSeparator = '_predicted_';

  constructor(
    private readonly cache: CacheService,
    private readonly evsesService: OcpiEvsesService,
    private readonly locationsService: OcpiLocationsService,
  ) {
  }

  getTotalGroupCount(): number {
    return this.gridColumnCount * this.gridRowCount;
  }

  getGroupNumberFromCoordinate(args: { lat: number; lng: number; }): number {
    const horizontalDistance = this.getHorizontalDistanceInKm({
      lat0: this.deGrid.topLeft.lat,
      lng0: this.deGrid.topLeft.lng,
      lng: args.lng
    });
    const verticalDistance = this.getVerticalDistanceInKm({ lat: args.lat, lat0: this.deGrid.topLeft.lat });

    const rowCount = Math.max(1, Math.ceil(verticalDistance / this.groupSizeInKm));
    const columnCount = Math.max(1, Math.ceil(horizontalDistance / this.groupSizeInKm));

    if (rowCount <= 1) {
      return columnCount;
    }

    return (rowCount * this.gridColumnCount) + columnCount;
  }

  getGridFromGroupNumber(gridNumber: number): IGrid {
    const rowCount = Math.max(1, Math.floor(gridNumber / this.gridColumnCount));
    const remainingColumnCount = gridNumber % this.gridColumnCount;

    let columnCount;
    if (remainingColumnCount === 0 && rowCount > 1) {
      columnCount = this.gridColumnCount;
    } else if (remainingColumnCount === 0 && rowCount === 1) {
      columnCount = 1;
    } else {
      columnCount = remainingColumnCount;
    }

    const verticalDistance = (rowCount - 1) * this.groupSizeInKm;
    const horizontalDistance = (columnCount - 1) * this.groupSizeInKm;

    const topLeft = {
      lat: this.addDistanceToLat({ lat: this.deGrid.topLeft.lat, distance: verticalDistance }),
      lng: this.addDistanceToLng({
        lat: this.deGrid.topLeft.lat,
        lng: this.deGrid.topLeft.lng,
        distance: horizontalDistance
      }),
    };

    const topRight = {
      lat: topLeft.lat,
      lng: this.addDistanceToLng({ lat: topLeft.lat, lng: topLeft.lng, distance: this.groupSizeInKm }),
    };

    const grid = {
      topLeft,
      topRight,
      bottomLeft: {
        lat: this.addDistanceToLat({ lat: topLeft.lat, distance: this.groupSizeInKm }),
        lng: topLeft.lng,
      },
      bottomRight: {
        lat: this.addDistanceToLat({ lat: topRight.lat, distance: this.groupSizeInKm }),
        lng: topRight.lng,
      },
    };

    return grid;
  }

  getVerticalDistanceInKm(args: { lat: number; lat0: number; }): number {
    return (args.lat0 - args.lat) * this.earthRadiusInKm * Math.PI / 180;
  }

  getHorizontalDistanceInKm(args: { lat0: number; lng0: number; lng: number; }): number {
    return ((args.lng - args.lng0) * (Math.PI * this.earthRadiusInKm * Math.cos(Math.PI / 180 * args.lat0))) / 180;
  }

  addDistanceToLat(args: { lat: number; distance: number; }): number {
    return args.lat - (180 / Math.PI * ((args.distance) / this.earthRadiusInKm));
  }

  addDistanceToLng(args: { lng: number; distance: number; lat: number; }): number {
    return args.lng + (180 / Math.PI * (args.distance / this.earthRadiusInKm) / Math.cos(Math.PI / 180 * args.lat));
  }

  get gridRowCount(): number {
    return Math.ceil(this.gridVerticalDistance / this.groupSizeInKm);
  }

  get gridColumnCount(): number {
    return Math.ceil(this.gridHorizontalDistance / this.groupSizeInKm);
  }

  get gridHorizontalDistance(): number {
    return this.getHorizontalDistanceInKm({
      lat0: this.deGrid.topLeft.lat,
      lng0: this.deGrid.topLeft.lng,
      lng: this.deGrid.topRight.lng
    });
  }

  get gridVerticalDistance(): number {
    return this.getVerticalDistanceInKm({
      lat: this.deGrid.bottomLeft.lat,
      lat0: this.deGrid.topLeft.lat,
    });
  }

  getUnavailableEvses(args: { evses: OcpiEvse[] }) {
    return args.evses.filter(evse => this.isUnavailable(evse.status as unknown as AvailabilityEnum));
  }

  isUnavailable(status: AvailabilityEnum): boolean {
    return [
      AvailabilityEnum.BLOCKED,
      AvailabilityEnum.UNAVAILABLE,
      AvailabilityEnum.CHARGING,
      AvailabilityEnum.RESERVED,
      AvailabilityEnum.OUTOFORDER,
    ].includes(status);
  }

  isIgnorable(status: AvailabilityEnum): boolean {
    return [
      AvailabilityEnum.UNKNOWN,
      AvailabilityEnum.PLANNED,
      AvailabilityEnum.INOPERATIVE,
      AvailabilityEnum.REMOVED,
    ].includes(status);
  }

  isGroupUtilised(args: {
    totalCount: number;
    unavailableCount: number;
    utilisationPercentage: number;
  }): boolean {
    if (args.totalCount > 10) { // If more than 10 primaryId per group, use the threshold percentage
      return args.utilisationPercentage >= this.utilisationThresholdPercentage;
    } else {
      return args.unavailableCount >= args.totalCount - 1;
    }
  }

  isPrimaryIdKey(key: string): boolean {
    return key !== 'lastUpdated' && key !== 'isUtilised';
  }

  async processUtilisationForEachGroup(): Promise<void> {
    const totalCount = this.getTotalGroupCount();
    const utilisations = [];
    const predictedUtilisations = {};

    for (let groupNumber = 0; groupNumber <= totalCount; groupNumber++) {
      const utilisationStatuses = await this.getUtilisationStatuses({ groupNumber });

      if (isObjectEmpty(utilisationStatuses) || Object.values(utilisationStatuses).length < 3) {
        continue;
      }

      const primaryIds = this.getPrimaryIds({ utilisationStatuses });
      const predictions = await this.getPredictions({ primaryIds });

      // Processing the current utilisation group report
      {
        const results = this.aggregateUtilisations({ utilisationStatuses, groupNumber });
        utilisations.push(results.report);

        await Promise.all([
          this.storeLastUpdatedAndGroupStatusInCache({
            isUtilised: results.isUtilised,
            lastUpdated: results.lastUpdated,
            utilisationStatusKey: this.getUtilisationStatusKey({ groupNumber }),
          }),
          this.initializeUtilisationStatusForTheGroup({ groupNumber })
        ]);
      }

      // Processing the utilisation report for each timeframe
      Object.keys(predictions)
        .filter(timeframe => Object.keys(predictions[timeframe]).length > 3)
        .forEach(timeframe => {
          const results = this.aggregateUtilisations({ utilisationStatuses: predictions[timeframe], groupNumber });
          if (predictedUtilisations[timeframe] === undefined) {
            predictedUtilisations[timeframe] = [];
          }
          predictedUtilisations[timeframe].push(results.report);
        });
    }

    const fileName = this.fileName;

    await this.storeInS3({ reports: utilisations, fileName, });

    const timeframes = Object.keys(predictedUtilisations);
    for (const timeframe of timeframes) {
      await this.storeInS3({ reports: predictedUtilisations[timeframe], timeframe, fileName });
    }
  }

  aggregateUtilisations(args: { utilisationStatuses: Record<string, string>; groupNumber: number; }): { report: UtilisationGroup; isUtilised: boolean; lastUpdated: string; } {
    const utilisationStatuses = args.utilisationStatuses;
    const unavailableCount = Object
      .values(utilisationStatuses)
      .filter(status => this.isUnavailable(status as unknown as AvailabilityEnum))
      .length;
    const totalCount = Object.keys(utilisationStatuses)
      .filter(key => this.isPrimaryIdKey(key))
      .filter(key => !this.isIgnorable(utilisationStatuses[key] as unknown as AvailabilityEnum))
      .length;
    const utilisationPercentage = Number((unavailableCount / totalCount * 100).toFixed(2));
    const isUtilised = this.isGroupUtilised({ totalCount, utilisationPercentage, unavailableCount });

    // We are showing locationIds in the report just for human readable purpose
    const locationIds = Object.keys(
      Object.keys(utilisationStatuses)
        .filter(key => this.isPrimaryIdKey(key))
        .filter(key => utilisationStatuses[key] !== AvailabilityEnum.AVAILABLE)
        .map(primaryId => OcpiEvsePrimaryIdValue.createFromPrimaryId({ primaryId }).locationId)
        .reduce((acc: unknown, val: string) => {
          acc[val] = true;
          return acc;
        }, {}),
    );

    const utilisationStatus = utilisationStatuses['isUtilised'] === 'false' ? false : true;
    const now = new Date().toISOString();
    let lastUpdated = !isNull(utilisationStatuses['lastUpdated']) ? utilisationStatuses['lastUpdated'] : now;
    if (isUtilised !== utilisationStatus) {
      lastUpdated = now;
    }

    const report: UtilisationGroup = {
      utilisationPercentage,
      utilisedLocationCount: unavailableCount,
      totalLocationCount: totalCount,
      grid: this.getGridFromGroupNumber(args.groupNumber),
      locationIds,
      isUtilised,
      lastUpdated,
    };

    return {
      report,
      isUtilised,
      lastUpdated,
    };
  }

  getPrimaryIds(args: { utilisationStatuses: Record<string, string> }): string[] {
    return Object.keys(
      Object.keys(args.utilisationStatuses)
        .filter(key => this.isPrimaryIdKey(key))
        .reduce((acc: unknown, val: string) => {
          acc[val] = true;
          return acc;
        }, {}),
    )
      .filter(key => key !== undefined);
  }

  async getPredictions(args: { primaryIds: string[]; }): Promise<Record<string, Record<string, string>>> {
    const predictions: Record<string, Record<string, string>> = {};
    const now = Date.now();

    for (let i = 0; i < args.primaryIds.length; i++) {
      const primaryIdValue = OcpiEvsePrimaryIdValue.createFromPrimaryId({ primaryId: args.primaryIds[i] });
      const locationId = primaryIdValue.locationId;
      const uid = primaryIdValue.uid;

      const predictionCacheKey = PredictionsClassificationKey.create({
        locationId,
        uid,
        predictionFrequency: 'PERIODIC',
      });

      const allPredictions = await this.cache.hGetAll(predictionCacheKey.value);

      if (isNull(allPredictions)) {
        return {};
      }

      Object.keys(allPredictions)
        .filter(key => Number(key) <= 360 && Number(key) > 0) // only get the first 6 hours of predictions
        .map(key => {
          return PredictionCacheValue.createFromCacheValue({
            cacheValue: allPredictions[key],
            timeframe: Number(key),
          });
        })
        .filter(({ updated_at }) => ((now - updated_at.getTime()) / 1000) > 900) // Remove predictions older than 15 mins
        .forEach(prediction => {
          if (predictions[prediction.timeframe] === undefined) {
            predictions[prediction.timeframe] = {};
          }
          predictions[prediction.timeframe][primaryIdValue.value] = prediction.status;
        });
    }

    return predictions;
  }

  getUtilisationStatusKey(args: { groupNumber: number; }): string {
    return UtilisationStatusCacheKey.create(args).value;
  }

  async getUtilisationStatuses(args: { groupNumber: number; }): Promise<Record<string, string>> {
    const utilisationStatusKey = this.getUtilisationStatusKey(args);
    const utilisationStatuses = await this.cache.hGetAll(utilisationStatusKey);

    return utilisationStatuses;
  }

  async getUtilisedGroup(args: { timeframe: number; }): Promise<UtilisationGroup[]> {
    const filePath = this.filePath;

    return new Promise((resolve, reject) => {
      s3.listObjectsV2({
        Bucket: this.bucketName,
        Prefix: filePath,
      }, (err1, data1) => {
        if (data1.Contents.length < 1) {
          return reject(new Error('No file found! Go back one hour'));
        }

        const files = data1.Contents
          .map(file => ({
            ...file,
            LastModified: new Date(file.LastModified).getTime(),
          }));

        files.sort(({ LastModified: a }, { LastModified: b }) => b - a);

        let fileName;
        const [prefix, suffix] = files[0].Key.split('.');
        const [name] = prefix.split(this.fileNameSeparator);

        if (args.timeframe === 0 || args.timeframe === undefined) {
          fileName = `${name}.${suffix}`;
        } else {
          fileName = `${name}${this.fileNameSeparator}${args.timeframe}.${suffix}`;
        }

        s3.getObject({
          Bucket: this.bucketName,
          Key: fileName,
        }, (err2, data2) => {
          if (err2) {
            return reject(err2);
          }

          const report = csvjson
            .toObject(data2.Body.toString(), {
              delimiter: ';',
            })
            .filter(({ isUtilised }) => isUtilised === 'true')
            .map(row => ({
              lastUpdated: row.lastUpdated,
              grid: {
                topLeft: {
                  lat: row['Top left lat'],
                  lng: row['Top left lng'],
                },
                topRight: {
                  lat: row['Top right lat'],
                  lng: row['Top right lng'],
                },
                bottomLeft: {
                  lat: row['Bottom left lat'],
                  lng: row['Bottom left lng'],
                },
                bottomRight: {
                  lat: row['Bottom right lat'],
                  lng: row['Bottom right lng'],
                },
              }
            }));

          resolve(report);
        });
      });
    });
  }

  async initializeUtilisationStatusForTheGroup(args: { groupNumber: number; }): Promise<void> {
    const utilisationStatusCacheKeyValue = UtilisationStatusCacheKey.create(args);
    const utilisationStatuses = await this.cache.hGetAll(utilisationStatusCacheKeyValue.value);

    if (!isObjectEmpty(utilisationStatuses)) {
      const primaryIdsKey = Object.keys(utilisationStatuses)
        .filter(key => this.isPrimaryIdKey(key))
        .map(primaryId => OcpiEvsePrimaryIdValue.createFromPrimaryId({ primaryId }));

      const evses = await this.evsesService.findStatusByPrimaryIdsForUtilisationRadarService({ primaryIds: primaryIdsKey.map(key => key.value) });

      for (const evse of evses) {
        await this.cache.hSet(utilisationStatusCacheKeyValue.value, OcpiEvsePrimaryIdValue.create({
          locationId: evse.locationId,
          uid: evse.uid,
        }).value, evse.status);
      }
    } else {
      const gridCoordinates = this.getGridFromGroupNumber(args.groupNumber);
      const locations = await this.locationsService.findLocationsWithinGridForUtilisationRadarService(gridCoordinates);

      for (const location of locations) {
        const locationWithEvses = await this.locationsService.findLocationEvsesForUtilisationRadarService({ locationId: location.id });

        const dcEvsePrimaryIds = await this.getDCEvsePrimaryIds({ evsePrimaryIds: locationWithEvses.evses.map(evse => OcpiEvsePrimaryIdValue.create(evse).value) });
        const dcEvses = locationWithEvses.evses.filter(evse => {
          const primaryId = OcpiEvsePrimaryIdValue.create(evse).value;
          return dcEvsePrimaryIds.includes(primaryId);
        });

        for (const evse of dcEvses) {
          await this.cache.hSet(utilisationStatusCacheKeyValue.value, OcpiEvsePrimaryIdValue.create({
            locationId: locationWithEvses.id,
            uid: evse.uid,
          }).value, evse.status);
        }

        await this.storeLastUpdatedAndGroupStatusInCache({
          lastUpdated: new Date().toISOString(),
          isUtilised: true,
          utilisationStatusKey: utilisationStatusCacheKeyValue.value,
        });
      }
    }
  }

  async storeLastUpdatedAndGroupStatusInCache(args: { isUtilised: boolean; lastUpdated: string; utilisationStatusKey: string; }): Promise<void> {
    await this.cache.hSet(args.utilisationStatusKey, 'isUtilised', args.isUtilised.toString());
    await this.cache.hSet(args.utilisationStatusKey, 'lastUpdated', args.lastUpdated);
  }

  async initializeCacheData(): Promise<void> {
    const maxCount = this.getTotalGroupCount();

    for (let groupNumber = 1; groupNumber <= maxCount; groupNumber++) {
      console.log(`Initializing cache data for utilisation radar group ${groupNumber}`);
      await this.initializeUtilisationStatusForTheGroup({ groupNumber });
    }
  }

  async storeInS3(args: { reports: UtilisationGroup[]; fileName: string; timeframe?: string; }): Promise<void> {
    let fileName;
    if (args.timeframe === undefined) {
      fileName = `${args.fileName}.csv`;
    } else {
      fileName = `${args.fileName}${this.fileNameSeparator}${args.timeframe}.csv`;
    }

    const csvJsonData = [];

    for (const row of args.reports) {
      const {
        grid,
        ...data
      } = row;
      csvJsonData.push({
        ...data,
        'Top left lat': grid.topLeft.lat,
        'Top left lng': grid.topLeft.lng,
        'Top right lat': grid.topRight.lat,
        'Top right lng': grid.topRight.lng,
        'Bottom left lat': grid.bottomLeft.lat,
        'Bottom left lng': grid.bottomLeft.lng,
        'Bottom right lat': grid.bottomRight.lat,
        'Bottom right lng': grid.bottomRight.lng,
        link: `https://maps.google.com/?q=${grid.topLeft.lat},${grid.topLeft.lng}`,
      });
      csvJsonData.sort(({ utilisationPercentage: a }, { utilisationPercentage: b }) => b - a);
    }

    const formattedJsonData = csvJsonData.map(row => ({
      ...row,
      utilisationPercentage: new Intl.NumberFormat('de-DE').format(row.utilisationPercentage),
    }));

    const csvData = csvjson.toCSV(formattedJsonData, { headers: 'key', delimiter: ';' });
    const params = {
      Bucket: this.bucketName,
      Key: fileName,
      Body: csvData,
    };

    s3.upload(params, (s3Err, data) => {
      if (s3Err) {
        throw s3Err;
      }
    });
  }

  async performUtilisationStatusUpdateProcess(args: {
    evses: OcpiEvse[],
  }): Promise<void> {
    if (args.evses.length < 1) {
      return;
    }

    let evses = this.getUnavailableEvses({ evses: args.evses });

    if (evses.length < 1) {
      return;
    }

    evses = await this.getEvsesInGermany({ evses });

    if (evses.length < 1) {
      return;
    }

    const dcEvsePrimaryIds = await this.getDCEvsePrimaryIds({ evsePrimaryIds: evses.map(evse => OcpiEvsePrimaryIdValue.create(evse).value) });
    evses = evses.filter(evse => dcEvsePrimaryIds.includes(OcpiEvsePrimaryIdValue.create(evse).value));

    if (evses.length < 1) {
      return;
    }

    for (const evse of evses) {
      const locationId = evse.locationId;
      await this.memoizeLocationId2Coordinates({ locationId });

      if (this.isUnavailable(evse.status as unknown as AvailabilityEnum)) {
        await this.storeUtilisationStatus({
          primaryId: OcpiEvsePrimaryIdValue.create(evse).value,
          status: evse.status as AvailabilityEnum,
        });
      }
    }
  }

  async storeUtilisationStatus(args: {
    primaryId: string;
    status: AvailabilityEnum,
  }): Promise<void> {
    if (!this.isUnavailable(args.status)) {
      return;
    }

    const primaryIdKey = OcpiEvsePrimaryIdValue.createFromPrimaryId(args);

    const locationCoordinates = this.locationId2CoordinateCache[primaryIdKey.locationId];
    const groupNumber = this.getGroupNumberFromCoordinate({
      lat: locationCoordinates.latitude,
      lng: locationCoordinates.longitude,
    });
    const utilisationStatusCacheKeyValue = UtilisationStatusCacheKey.create({ groupNumber });

    await this.cache.hSet(utilisationStatusCacheKeyValue.value, primaryIdKey.value, args.status);
  }

  async getDCEvsePrimaryIds(args: { evsePrimaryIds: string[]; }): Promise<string[]> {
    const evsePrimaryIds = [];

    for (const primaryId of args.evsePrimaryIds) {
      if (this.primaryId2ConnectorTypeCache[primaryId] === undefined) {
        const evse = await this.evsesService.findPowerTypeForEvseForUtilisationRadarService({ primaryId });
        if (evse.connectors.some(({ power_type }) => power_type.toLowerCase().startsWith('dc'))) {
          this.primaryId2ConnectorTypeCache[primaryId] = 'DC';
        } else {
          this.primaryId2ConnectorTypeCache[primaryId] = 'AC';
        }
      }

      if (this.primaryId2ConnectorTypeCache[primaryId] === 'DC') {
        evsePrimaryIds.push(primaryId);
      }
    }

    return evsePrimaryIds;
  }

  async getEvsesInGermany(args: { evses: OcpiEvse[]; }): Promise<OcpiEvse[]> {
    const evses = [];

    for (const evse of args.evses) {
      const locationId = evse.locationId;
      await this.memoizeLocationId2Coordinates({ locationId });

      if (this.isCoordinateInGermany({
        lat: this.locationId2CoordinateCache[locationId].latitude,
        lng: this.locationId2CoordinateCache[locationId].longitude
      })) {
        evses.push(evse);
      }
    }

    return evses;
  }

  async memoizeLocationId2Coordinates(args: { locationId: string; }): Promise<void> {
    if (this.locationId2CoordinateCache[args.locationId] === undefined) {
      const location = await this.locationsService.findLocationEvsesForUtilisationRadarService({ locationId: args.locationId });

      if (location !== null) {
        this.locationId2CoordinateCache[args.locationId] = {
          latitude: location.latitude,
          longitude: location.longitude,
        };
      } else {
        this.locationId2CoordinateCache[args.locationId] = null;
      }
    }
  }

  isCoordinateInGermany(args: { lat: number; lng: number; }): boolean {
    return args.lat <= this.deGrid.topLeft.lat
      && args.lat >= this.deGrid.bottomLeft.lat
      && args.lng >= this.deGrid.topLeft.lng
      && args.lng <= this.deGrid.topRight.lng;
  }

  get fileName(): string {
    return `${this.filePath}${generateUUID()}`;
  }

  get filePath(): string {
    return `${this.filePathPrefix}${this.currentHour}/`;
  }

  get filePathPrefix(): string {
    return `${new Date().getFullYear()}/${this.currentMonth}/${this.currentDay}/`;
  }

  get currentMonth(): string {
    return ('0' + (new Date().getUTCMonth() + 1)).slice(-2);
  }

  get currentDay(): string {
    return ('0' + new Date().getUTCDate()).slice(-2);
  }

  get currentHour(): string {
    return ('0' + new Date().getUTCHours()).slice(-2);
  }
}

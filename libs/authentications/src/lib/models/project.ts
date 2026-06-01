import { CacheService } from '@fronyx/cache';
import { isEmptyString } from '../../../../../apps/cdk-apps/src/shared/utils/is-empty-string.function';
import {
    OcpiEvseEntity,
} from '../../../../../apps/cdk-apps/src/shared';
import { cleanId } from '../../../../../apps/cdk-apps/src/shared/database/entities/crawling/ocpi-location.entity';

interface LocationWithEvsePrimaryId {
    id: string;
    city: string;
    country: string;
    evses: {
        uid: string;
        evse_id: string;
        evse_id_stripped: string;
        primary_id: string;
        connectors: {
            power_type: string;
        }[];
    }[];
}

export class Project {
    private cache: CacheService;
    private prefix: string;
    private storageCandidates: string[] = [];
    private storageSchedule: any = null;

    constructor(cacheService: CacheService, projectId: string) {
        this.cache = cacheService;
        this.prefix = `access_scope:project:${projectId}`;
    }

    async addLocation(location: LocationWithEvsePrimaryId): Promise<void> {
        await this.addLocationId(cleanId(location.id));

        for (const evse of location.evses) {
            let evseIdStripped = evse.evse_id_stripped;
            if (isEmptyString(evseIdStripped)) {
                evseIdStripped = OcpiEvseEntity.cleanEvseId(evse.evse_id);
            }
            await this.addEvseId(evseIdStripped);
            await this.addLocationIdEvseId(`${location.id}_${evseIdStripped}`);
            await this.addPrimaryId(evse.primary_id);
        }
    }

    async removeKey(primaryIdsToBeRemoved): Promise<void> {
        await this.cache.sRem({
            key: this.getKey('all'),
            members: primaryIdsToBeRemoved,
        });
    }

    async hasId(id: string): Promise<boolean> {
        let isIdIncluded = await this.cache.sIsMember(this.getKey('all'), id);

        if (!isIdIncluded) {
            const result = await this.cache.sScan(
                this.getKey('all'),
                cleanId(id)
            );
            isIdIncluded = result.length > 0;
        }
        return isIdIncluded;
    }

    async getAllMembers(): Promise<string[]> {
        const primaryIds = await this.cache.sMembers({
            key: this.getKey('all'),
        });
        return primaryIds;
    }

    async deleteKey(): Promise<void> {
        await this.cache.delete({ key: this.getKey('all') });
    }

    getAllListKey(): string {
        return this.getKey('all');
    }

    /*
     * For now commented out adding keys to separate list to increase
     * the speed of filling in the data into the cache.
     */
    private async addLocationId(id: string): Promise<void> {
        // await this.cache.sAdd(this.getKey('location_id'), id);
        await this.addToAllList(id);
    }

    private async addPrimaryId(id: string): Promise<void> {
        // await this.cache.sAdd(this.getKey('primary_id'), id);
        await this.addToAllList(id);
    }

    private async addEvseId(id: string): Promise<void> {
        // await this.cache.sAdd(this.getKey('evse_id'), id);
        await this.addToAllList(id);
    }

    private async addLocationIdEvseId(id: string): Promise<void> {
        // await this.cache.sAdd(this.getKey('location_id_evse_id'), id);
        await this.addToAllList(id);
    }

    private async addToAllList(id: string) {
        this.storageCandidates.push(id);

        if (this.storageCandidates.length > 1000) {
            this.storageSchedule && clearTimeout(this.storageSchedule);

            await this.cache.sAdd(this.getAllListKey(), this.storageCandidates);
            this.storageCandidates = [];
        } else if (!this.storageSchedule) {
            this.storageSchedule = setTimeout(async () => {
                await this.cache.sAdd(
                    this.getAllListKey(),
                    this.storageCandidates
                );

                this.storageSchedule = null;
                this.storageCandidates = [];
            }, 1000);
        }
    }

    private getKey(type: string): string {
        return `${this.prefix}:${type}`;
    }
}

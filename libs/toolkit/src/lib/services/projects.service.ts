import { Injectable } from '@nestjs/common';
import { ToolkitsService } from './toolkits.service';
import { ToolkitProject } from '../models';

@Injectable()
export class ProjectsService {
    private readonly localCache: Map<string, ToolkitProject> = new Map<string, ToolkitProject>();

    constructor(
        private readonly toolkitService: ToolkitsService,
    ) {
        // set interval every 15 minutes to clear cache
        setInterval(() => {
            this.localCache.forEach((value, key) => {
                this.localCache.set(key, undefined);
            });
        }, 1000 * 60 * 15);
    }
    
    async getProjectByApiToken(apiToken: string): Promise<ToolkitProject>{
        if (this.localCache.get(apiToken)) {
            return this.localCache.get(apiToken);
        } else {
            const project = await this.toolkitService.findProjectByApiToken({ apiToken });
            this.localCache.set(apiToken, project);
            return this.localCache.get(apiToken);
        }
    }
}



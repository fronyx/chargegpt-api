import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ToolkitsService, ProjectsService } from './services';
import { CacheModule } from '@fronyx/cache';

@Module({
  providers: [ToolkitsService, ProjectsService],
  exports: [ToolkitsService, ProjectsService],
  imports: [HttpModule, CacheModule],
})
export class ToolkitModule {
}

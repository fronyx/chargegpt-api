import { configService } from '@fronyx/configurations';
import { sendRequestTimeMetric } from './conversation-quality.service';

export class Tracer {
  startTime: Date;
  identifier: string;
  projectName: string;

  constructor(identifier: string, projectName: string) {
    this.identifier = identifier;
    this.projectName = projectName;
  }

  start() {
    this.startTime = new Date();
  }

  end() {
    if (!this.startTime) {
      return;
    }

    const endTime = new Date();
    const timeDifferenceInSeconds = calculateTimeDifferentInMilliseconds(this.startTime, endTime);

    // console.log('timeDiff', timeDifferenceInSeconds, this.startTime, endTime, this.identifier);
    
    if (configService.isProduction()) {
      sendRequestTimeMetric(this.projectName, this.identifier, timeDifferenceInSeconds);
    }
  }
}

export const calculateTimeDifferentInMilliseconds = (start: Date, end: Date) => {
  return end.getTime() - start.getTime();
}
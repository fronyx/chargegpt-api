export class ArrivalTime implements Readonly<ArrivalTime> {
  arrival_time: number;
  timeframe: number;
  human_readable_time: string;

  constructor(args: { arrival_time: number; timeframe: number }) {
    Object.assign(this, args);

    this.human_readable_time = this.getHumanReadableTime();
  }

  private getHumanReadableTime(): string {
    const hour = Math.floor(this.arrival_time);
    const minutes = this.arrival_time % 1 * 60;

    minutes.toFixed(2);
    return String(hour).padStart(2, '0') + ':' + String(minutes).padStart(2, '0');
  }
}

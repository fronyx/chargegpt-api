import { IsString } from 'class-validator';

export class PeerLiveStatus implements Readonly<PeerLiveStatus> {
  @IsString()
  isRealtime: boolean;

  @IsString()
  lastUpdated: Date;

  constructor(args: Partial<PeerLiveStatus>) {
    Object.assign(this, args);
  }
}

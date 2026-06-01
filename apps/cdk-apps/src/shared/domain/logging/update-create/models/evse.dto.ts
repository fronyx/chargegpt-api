export class EvseDto implements Readonly<EvseDto> {
  evsename: string;
  evseid: string;
  chargingfacilitytype: string;
  currenttype: string;
  isbookable: boolean;
  status: string;
  plugs: string;
  payments: string;
  createdAt: Date;

  constructor(args: {
    evsename: string;
    evseid: string;
    chargingfacilitytype: string;
    currenttype: string;
    isbookable: boolean;
    status: string;
    plugs: string;
    payments: string;
    createdAt: Date;
  }) {
    Object.assign(this, args);
  }
}

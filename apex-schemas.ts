export interface ApexStatusValue {
  istat: {
    hostname: string;
    software: string;
    hardware: string;
    serial: string;
    type: String;
    timesone: string;
    date: number;
    extra: Record<string, any>;
    feed: {
      name: number;
      active: number;
    };
    power: {
      failed: number;
      restored: number;
    };
    link: {
      linkState: number;
      linkKey: string;
      link: boolean;
    };
    inputs: ApexInputValue[];
    outputs: ApexOutputValue[];
  };
}

export interface ApexInputValue {
  did: string;
  type: string;
  name: string;
  value: number;
}

export interface ApexOutputValue {
  status: Array<string>;
  name: string;
  gid: string;
  type: string;
  ID: string;
  did: string;
}

import { ApexStatusSnapshotMessage } from "./apex-events";

export interface DataSink<T extends object> {
  write(data: T): Promise<void>;
  name: string;
}

export const createConsoleDataSink = <T extends object>(): DataSink<T> => {
  return {
    write: async (data: T) => {
      console.log(data);
    },
    name: "console",
  };
};

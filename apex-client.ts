import axios from "axios";
import { ApexStatusValue } from "./apex-schemas";

export type ApexClientConfig = {
  localServerHostname?: string;
};

export const getClient = (config: ApexClientConfig) => {
  const client = axios.create({
    baseURL: `http://${config.localServerHostname ?? "apex.local"}/cgi-bin/`,
    timeout: 10000,
  });
  return {
    status: {
      get: () => client.get<ApexStatusValue>("status.json"),
    },
  };
};

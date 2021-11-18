import axios from 'axios'

export type ApexClientConfig = {
        localServerHostname?: string
}

export const getClient = (config: ApexClientConfig) => {
  const client = axios.create({
          baseURL: `http://${config.localServerHostname ?? 'apex.local'}/cgi-bin/`,
       timeout: 10000
  })
       return {
               status: {
                       get: () => client.get('status.json')
               }
        }
}

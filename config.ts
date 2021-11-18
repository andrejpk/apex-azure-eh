import {config} from 'dotenv'

config()


export const {
        LOCAL_SERVER_HOSTNAME,
        TARGET_EH_CONNECTION_STRING
} = process.env

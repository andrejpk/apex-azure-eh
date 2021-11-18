import {getClient} from './apex-client'
import {EventHubProducerClient} from '@azure/event-hubs'
import {ApexStatusSnapshotMessage, type_status_snapshot} from './events'
import {LOCAL_SERVER_HOSTNAME,TARGET_EH_CONNECTION_STRING} from './config'


async function main() {
console.log("apex-event-hubs")

if (!TARGET_EH_CONNECTION_STRING) throw new Error("TARGET_EH_CONNECTION_STRING must be defined")

const apexClient = getClient({localServerHostname: LOCAL_SERVER_HOSTNAME})
const ehProducerClient = new EventHubProducerClient(TARGET_EH_CONNECTION_STRING)
const sampleIntervalMs = 15000

const workFunction = async () => {
  const eventDataBatch = await ehProducerClient.createBatch();
  const resp = await apexClient.status.get()
  const statusSnapshot: ApexStatusSnapshotMessage = {
          type: type_status_snapshot,
          time_generated: (new Date()).getTime(),
          payload: resp.data
  }


  console.log('resp', resp.data)
  eventDataBatch.tryAdd({body: statusSnapshot}) // check return val
  await ehProducerClient.sendBatch(eventDataBatch)

}

// start the polling loop
const loopInt = setInterval(workFunction, sampleIntervalMs)


}


main().catch(console.error)

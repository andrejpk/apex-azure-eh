import { getClient } from "./apex-client";
import { EventHubProducerClient } from "@azure/event-hubs";
import { ApexStatusSnapshotMessage, type_status_snapshot } from "./events";
import { LOCAL_SERVER_HOSTNAME, TARGET_EH_CONNECTION_STRING } from "./config";

async function main() {
  console.log("apex-event-hubs");

  if (!TARGET_EH_CONNECTION_STRING)
    throw new Error("TARGET_EH_CONNECTION_STRING must be defined");

  const apexClient = getClient({ localServerHostname: LOCAL_SERVER_HOSTNAME });
  const ehProducerClient = new EventHubProducerClient(
    TARGET_EH_CONNECTION_STRING
  );
  const sampleIntervalMs = 15000;

  const workFunction = async () => {
    const readTime = new Date();
    const eventDataBatch = await ehProducerClient.createBatch();
    const resp = await apexClient.status.get();
    const payload = resp.data;
    const statusSnapshot: ApexStatusSnapshotMessage = {
      type: type_status_snapshot,
      time_generated: readTime.getTime(),
      payload,
    };

    const { hostname, serial, date } = payload.istat;

    console.log(`${readTime.toISOString()}: message sent`, {
      hostname,
      serial,
      date: new Date(date * 1000).toISOString(),
    });
    if (
      eventDataBatch.tryAdd({
        body: Buffer.from(JSON.stringify(statusSnapshot), "utf8"),
        properties: {
          contentType: "application/json",
          contentEncoding: "utf8",
        },
      })
    ) {
      // check return val
      await ehProducerClient.sendBatch(eventDataBatch);
    } else {
      throw new Error("Failed to add event to batch");
    }
  };

  // start the polling loop
  const loopInt = setInterval(workFunction, sampleIntervalMs);
}

main().catch(console.error);

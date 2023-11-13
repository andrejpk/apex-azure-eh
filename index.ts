import { getClient } from "./apex-client";
import { ApexStatusSnapshotMessage, type_status_snapshot } from "./apex-events";
import {
  LOCAL_APEX_SERVER_HOSTNAME,
  TARGET_EH_CONNECTION_STRING,
} from "./config";
import { DataSink, createConsoleDataSink } from "./data-sink";
import { createEventHubDataSink } from "./event-hub-data-sink";

async function main() {
  console.log("apex-event-hubs");

  //build out sinks based on what's configured
  const eventHubSink =
    TARGET_EH_CONNECTION_STRING &&
    createEventHubDataSink<ApexStatusSnapshotMessage>(
      TARGET_EH_CONNECTION_STRING
    );

  const consoleSink = createConsoleDataSink<ApexStatusSnapshotMessage>();

  const sinks = [eventHubSink, consoleSink].filter(
    (s) => s !== undefined
  ) as DataSink<ApexStatusSnapshotMessage>[];

  const apexClient = getClient({
    localServerHostname: LOCAL_APEX_SERVER_HOSTNAME,
  });
  const sampleIntervalMs = 15000;

  console.info(
    `Starting polling loop with sample interval of ${sampleIntervalMs}ms with sinks: ${sinks
      .map((s) => s.name)
      .join(", ")}`
  );

  const workFunction = async () => {
    const readTime = new Date();
    const resp = await apexClient.status.get();
    const payload = resp.data;
    const statusSnapshot: ApexStatusSnapshotMessage = {
      type: type_status_snapshot,
      time_generated: readTime.getTime(),
      payload,
    };

    const { hostname, serial, date } = payload.istat;

    // send the data to all sinks
    await Promise.all(sinks.map((sink) => sink.write(statusSnapshot)));

    console.log(`${readTime.toISOString()}: message sent`, {
      hostname,
      serial,
      date: new Date(date * 1000).toISOString(),
    });
  };

  // start the polling loop
  const loopInt = setInterval(workFunction, sampleIntervalMs);
}

main().catch(console.error);

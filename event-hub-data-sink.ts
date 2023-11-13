import { EventHubProducerClient } from "@azure/event-hubs";
import { DataSink } from "./data-sink";

/**
 * Creates a data sink that writes data to an Azure Event Hub. The data is written as an object with a single property,
 * `payload`, which is the data passed to the `write` method.
 * @template T The type of data to be written.
 * @param {string} eventHubConnectionString The connection string for the Event Hub.
 * @returns {DataSink<T>} A data sink that writes data to the Event Hub.
 */
export const createEventHubDataSink = <T extends object>(
  eventHubConnectionString: string
): DataSink<T> => {
  const ehProducerClient = new EventHubProducerClient(eventHubConnectionString);
  return {
    write: async (data: T) => {
      const eventDataBatch = await ehProducerClient.createBatch();
      if (
        eventDataBatch.tryAdd({
          body: Buffer.from(JSON.stringify(data), "utf8"),
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
    },
    name: "event-hub",
  };
};

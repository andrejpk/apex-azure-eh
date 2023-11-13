
export interface ApexMessage {
        time_generated: number
        type: string
        payload: any
}

export const type_status_snapshot = "apex_status_snapshot"

export interface ApexStatusSnapshotMessage extends ApexMessage {
  type: typeof type_status_snapshot
}

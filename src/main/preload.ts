import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels =
  | 'ipc-example'
  | 'makeConnection'
  | 'csvToTable'
  | 'readTables'
  | 'scanTableFeature'
  | 'mappingFK'
  | 'mappingPK'
  | 'deleteFeature'
  | 'modifyFeatureDataType'
  | 'findTableJoinCandidate'
  | 'tableJoin'
  | 'tableJoinMany'
  | 'showResult'
  | 'downloadResult'
  | 'isDBConnected'
  | 'readScanTable';

contextBridge.exposeInMainWorld('db', {
  command: {
    request(channel: Channels, args?: unknown[]): Promise<any> {
      return ipcRenderer.invoke(channel, args);
    },
    sendMessage(channel: Channels, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
});

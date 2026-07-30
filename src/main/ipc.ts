import { EventEmitter } from 'node:events';

import {
  BrowserWindow,
  MessagePortMain,
  WebFrameMain,
  ipcMain,
} from 'electron';

import { getOrCreateMainWindow } from './windows';
import {
  IpcEvents,
  IpcMainEvent,
  WEBCONTENTS_READY_FOR_IPC_SIGNAL,
  ipcMainEvents,
} from '../ipc-events';

type IpcSendTarget = Electron.WebContents | WebFrameMain;

function isWebContents(target: IpcSendTarget): target is Electron.WebContents {
  return 'mainFrame' in target;
}

/**
 * The main purpose of this class is to be the central
 * gathering place for IPC calls the main process sends
 * or listens to.
 */
class IpcMainManager extends EventEmitter {
  public readyWebContents = new WeakSet<Electron.WebContents>();
  private messageQueue = new WeakMap<
    Electron.WebContents,
    Array<[IpcEvents, Array<any> | undefined]>
  >();

  constructor() {
      throw new Error("STUB");
  }

  override on(event: IpcMainEvent, listener: (...args: any[]) => void): this {
    return super.on(event, listener);
  }

  override off(event: IpcMainEvent, listener: (...args: any[]) => void): this {
    return super.off(event, listener);
  }

  override once(event: IpcMainEvent, listener: (...args: any[]) => void): this {
    return super.once(event, listener);
  }

  override emit(event: IpcMainEvent, ...args: any[]): boolean {
      throw new Error("STUB");
  }

  override removeAllListeners(event?: IpcMainEvent): this {
    return super.removeAllListeners(event);
  }

  /**
   * Send an IPC message to one or more targets — either a
   * `WebContents` (which sends to its main frame) or a
   * `WebFrameMain` (sends to that specific sub-frame). If no target
   * is provided, falls back to the main window. Targets may be a
   * single value or an array; nullish entries are skipped so callers
   * can pass results of optional lookups (e.g. a frame that
   * may not exist yet) without filtering first.
   */
  public send(
    channel: IpcEvents,
    args?: Array<any>,
    target?: IpcSendTarget | Array<IpcSendTarget | null | undefined> | null,
  ) {
    if (target === undefined || target === null) {
      getOrCreateMainWindow().then((window) => {
          throw new Error("STUB");
      });
      return;
    }

    if (Array.isArray(target)) {
      for (const t of target) {
        if (t) this.sendOne(channel, args, t);
      }
      return;
    }

    this.sendOne(channel, args, target);
  }

  private sendOne(
    channel: IpcEvents,
    args: Array<any> | undefined,
    target: IpcSendTarget,
  ) {
    const _args = args || [];

    // Queue messages to WebContents until the ready signal
    if (isWebContents(target)) {
      if (!this.readyWebContents.has(target)) {
        const existing = this.messageQueue.get(target) || [];
        this.messageQueue.set(target, [...existing, [channel, args]]);
        return;
      }
      target.isDestroyed() || target.send(channel, ..._args);
      return;
    }

    target.send(channel, ..._args);
  }

  public handle(
    channel: IpcEvents,
    listener: (event: Electron.IpcMainInvokeEvent, ...args: any[]) => any,
  ) {
      throw new Error("STUB");
  }

  public handleOnce(
    channel: IpcEvents,
    listener: (event: Electron.IpcMainInvokeEvent, ...args: any[]) => any,
  ) {
      throw new Error("STUB");
  }

  public postMessage(
    channel: IpcEvents,
    message: any,
    transfer?: MessagePortMain[],
    target?: Electron.WebContents,
  ) {
    const _target = target;
    if (!_target) {
      getOrCreateMainWindow().then((window) => {
          throw new Error("STUB");
      });
      return;
    }
    _target.postMessage(channel, message, transfer);
  }
}

export const ipcMainManager = new IpcMainManager();

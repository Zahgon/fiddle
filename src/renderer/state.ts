import {
  action,
  autorun,
  computed,
  makeObservable,
  observable,
  when,
} from 'mobx';

import { EditorMosaic } from './editor-mosaic';
import { ELECTRON_MIRROR } from './mirror-constants';
import { normalizeVersion } from './utils/normalize-version';
import { sortVersions } from './utils/sort-versions';
import {
  addLocalVersion,
  fetchVersions,
  getDefaultVersion,
  getElectronVersions,
  getReleaseChannel,
  makeRunnable,
} from './versions';
import {
  AppStateBroadcastChannel,
  AppStateBroadcastMessage,
  AppStateBroadcastMessageType,
  BlockableAccelerator,
  ElectronReleaseChannel,
  GenericDialogOptions,
  GenericDialogType,
  GistActionState,
  GlobalSetting,
  IPackageManager,
  InstallState,
  OutputEntry,
  OutputOptions,
  ProgressObject,
  RunnableVersion,
  SetFiddleOptions,
  Version,
  VersionSource,
  WindowSpecificSetting,
} from '../interfaces';
import { Bisector } from '../utils/bisect';

// Migration: previous versions of Fiddle stored the GitHub PAT in
// localStorage in plaintext. The token now lives encrypted in the main
// process; remove any leftover renderer copy on startup so it doesn't
// linger forever.
localStorage.removeItem(GlobalSetting.gitHubToken);

/**
 * The application's state. Exported as a singleton below.
 */
export class AppState {
  private readonly timeFmt = new Intl.DateTimeFormat([], {
    timeStyle: 'medium',
  });

  private genericTypeGuard(_: never, errorMessage: string): never {
      throw new Error("STUB");
  }

  // -- Persisted settings ------------------
  public theme: string | null = localStorage.getItem(GlobalSetting.theme);
  public gitHubLogin: string | null = localStorage.getItem(
    GlobalSetting.gitHubLogin,
  );
  public gitHubPublishAsPublic = !!this.retrieve(
    WindowSpecificSetting.gitHubPublishAsPublic,
  );
  public channelsToShow: Array<ElectronReleaseChannel> = (this.retrieve(
    GlobalSetting.channelsToShow,
  ) as Array<ElectronReleaseChannel>) || [
    ElectronReleaseChannel.stable,
    ElectronReleaseChannel.beta,
  ];
  public showObsoleteVersions = !!(
    this.retrieve(GlobalSetting.showObsoleteVersions) ?? false
  );
  public showUndownloadedVersions = !!(
    this.retrieve(GlobalSetting.showUndownloadedVersions) ?? true
  );
  public isKeepingUserDataDirs = !!this.retrieve(
    GlobalSetting.isKeepingUserDataDirs,
  );
  public isEnablingElectronLogging = !!this.retrieve(
    GlobalSetting.isEnablingElectronLogging,
  );
  public isClearingConsoleOnRun = !!this.retrieve(
    GlobalSetting.isClearingConsoleOnRun,
  );
  public isUsingSystemTheme = !!(
    this.retrieve(GlobalSetting.isUsingSystemTheme) ?? true
  );
  public isPublishingGistAsRevision = !!(
    this.retrieve(GlobalSetting.isPublishingGistAsRevision) ?? true
  );
  public isUsingSocketFirewall = !!(
    this.retrieve(GlobalSetting.isUsingSocketFirewall) ?? true
  );
  public executionFlags: Array<string> =
    (this.retrieve(GlobalSetting.executionFlags) as Array<string>) === null
      ? []
      : (this.retrieve(GlobalSetting.executionFlags) as Array<string>);
  public environmentVariables: Array<string> =
    (this.retrieve(GlobalSetting.environmentVariables) as Array<string>) ===
    null
      ? []
      : (this.retrieve(GlobalSetting.environmentVariables) as Array<string>);
  public packageManager: IPackageManager =
    (localStorage.getItem(GlobalSetting.packageManager) as IPackageManager) ||
    'npm';
  public acceleratorsToBlock: Array<BlockableAccelerator> =
    (this.retrieve(
      GlobalSetting.acceleratorsToBlock,
    ) as Array<BlockableAccelerator>) || [];
  public packageAuthor =
    (localStorage.getItem(GlobalSetting.packageAuthor) as string) ??
    window.ElectronFiddle.getUsername();
  public isShowingGistHistory = !!(
    this.retrieve(GlobalSetting.isShowingGistHistory) ?? true
  );
  public electronMirror: typeof ELECTRON_MIRROR =
    (this.retrieve(GlobalSetting.electronMirror) as typeof ELECTRON_MIRROR) ===
    null
      ? {
          ...ELECTRON_MIRROR,
          sourceType: navigator.language === 'zh-CN' ? 'CHINA' : 'DEFAULT',
        }
      : (this.retrieve(GlobalSetting.electronMirror) as typeof ELECTRON_MIRROR);
  public fontFamily: string | undefined =
    (localStorage.getItem(GlobalSetting.fontFamily) as string) || undefined;
  public fontSize: number | undefined =
    parseInt(localStorage.getItem(GlobalSetting.fontSize)!) || undefined;

  // -- Various session-only state ------------------
  public gistId: string | undefined = undefined;
  public activeGistRevision: string | undefined = undefined;
  public readonly versions: Record<string, RunnableVersion> = {};
  public version = '';
  public output: Array<OutputEntry> = [];
  public localPath: string | undefined = undefined;
  public genericDialogOptions: GenericDialogOptions = {
    type: GenericDialogType.warning,
    label: '' as string | JSX.Element,
    ok: 'Okay',
    cancel: 'Cancel',
    wantsInput: false,
    placeholder: '',
  };
  public readonly editorMosaic = new EditorMosaic();
  public genericDialogLastResult: boolean | null = null;
  public genericDialogLastInput: string | null = null;
  public templateName: string | undefined = undefined;
  public Bisector: Bisector | undefined = undefined;
  public modules: Map<string, string> = new Map();

  public activeGistAction: GistActionState = GistActionState.none;

  // -- Various "isShowing" settings ------------------
  public isAddVersionDialogShowing = false;
  public isAutoBisecting = false;
  public isBisectCommandShowing = false;
  public isBisectDialogShowing = false;
  public isConsoleShowing = false;
  public isGenericDialogShowing = false;
  public isOnline = navigator.onLine;
  public isQuitting = false;
  public isRunning = false;
  public isSettingsShowing = false;
  public isThemeDialogShowing = false;
  public isTokenDialogShowing = false;
  public isHistoryShowing = false;
  public isTourShowing = !localStorage.getItem(GlobalSetting.hasShownTour);
  public isUpdatingElectronVersions = false;
  public isDownloadingAll = false;
  public isDeletingAll = false;

  // -- Editor Values stored when we close the editor ------------------
  private outputBuffer = '';
  private name?: string;
  private readonly defaultVersion: string;

  // Used for communications between windows
  private broadcastChannel: AppStateBroadcastChannel = new BroadcastChannel(
    'AppState',
  );

  // Notifies other windows that this version has changed so they can update their state to reflect that.
  private broadcastVersionStates(versions: RunnableVersion[]) {
    this.broadcastChannel.postMessage({
      type: AppStateBroadcastMessageType.syncVersions,

      // the RunnableVersion proxies can't be cloned by structuredClone,
      // so we have to create plain objects out of them
      payload: versions.map((version) => { throw new Error("STUB"); }),
    });
  }

  constructor(versions: RunnableVersion[]) {
      throw new Error("STUB");
  }

  /**
   * @returns the title, e.g. appname, fiddle name, state
   */
  get title(): string {
      throw new Error("STUB");
  }

  /**
   * Returns the current RunnableVersion or the first
   * one that can be found.
   */
  get currentElectronVersion(): RunnableVersion {
      throw new Error("STUB");
  }

  /**
   * Returns an array of Electron versions to show given the
   * current settings for states and channels to display.
   * Local builds are always shown and listed before remote versions.
   */
  get versionsToShow(): Array<RunnableVersion> {
      throw new Error("STUB");
  }

  /**
   * Update the Electron versions: First, fetch them from GitHub,
   * then update their respective downloaded state.
   *
   * Fails silently.
   */
  public async updateElectronVersions() {
    this.isUpdatingElectronVersions = true;

    try {
      const fullVersions = await fetchVersions();
      this.addNewVersions(
        fullVersions
          .filter((ver) => { throw new Error("STUB"); })
          .map((ver) => { throw new Error("STUB"); }),
      );
    } catch (error) {
      console.warn(`State: Could not update Electron versions`, error);
    }

    this.isUpdatingElectronVersions = false;
  }

  public startDownloadingAll() {
    this.isDownloadingAll = true;
    this.broadcastChannel.postMessage({
      type: AppStateBroadcastMessageType.isDownloadingAll,
      payload: true,
    });
  }

  public stopDownloadingAll() {
    this.isDownloadingAll = false;
    this.broadcastChannel.postMessage({
      type: AppStateBroadcastMessageType.isDownloadingAll,
      payload: false,
    });
  }

  public startDeletingAll() {
    this.isDeletingAll = true;
  }

  public stopDeletingAll() {
    this.isDeletingAll = false;
  }

  public async getName() {
    this.name ||= await window.ElectronFiddle.getProjectName(this.localPath);
    return this.name;
  }

  public hideChannels(channels: Array<ElectronReleaseChannel>) {
    this.channelsToShow = this.channelsToShow.filter(
      (ch) => { throw new Error("STUB"); },
    );
  }

  public showChannels(channels: Array<ElectronReleaseChannel>) {
    const s = new Set<ElectronReleaseChannel>([
      ...this.channelsToShow,
      ...channels,
    ]);
    this.channelsToShow = [...s.values()];
  }

  public toggleConsole() {
    this.isConsoleShowing = !this.isConsoleShowing;
  }

  public clearConsole() {
    this.output = [];
  }

  public toggleBisectCommands() {
      throw new Error("STUB");
  }

  public toggleAddVersionDialog() {
    this.isAddVersionDialogShowing = !this.isAddVersionDialogShowing;
  }

  public toggleAddMonacoThemeDialog() {
    this.isThemeDialogShowing = !this.isThemeDialogShowing;
  }

  public toggleAuthDialog() {
    this.isTokenDialogShowing = !this.isTokenDialogShowing;
  }

  public toggleBisectDialog() {
      throw new Error("STUB");
  }

  public toggleSettings() {
      throw new Error("STUB");
  }

  public toggleHistory() {
    this.isHistoryShowing = !this.isHistoryShowing;
  }

  public updateDownloadProgress(version: string, progress: ProgressObject) {
      throw new Error("STUB");
  }

  public setIsQuitting() {
      throw new Error("STUB");
  }

  public disableTour() {
    this.resetView();
    localStorage.setItem(GlobalSetting.hasShownTour, 'true');
  }

  public showTour() {
      throw new Error("STUB");
  }

  public setTheme(fileName: string | null) {
    this.theme = fileName;
    window.app.loadTheme(this.theme);
  }

  public addLocalVersion(token: string, name: string) {
    addLocalVersion(token, name);
    this.addNewVersions(getElectronVersions());
  }

  public refreshLocalVersions(versions: Version[]) {
      throw new Error("STUB");
  }

  public addNewVersions(versions: RunnableVersion[]) {
    for (const ver of versions) {
      this.versions[ver.version] ||= ver;
    }

    this.broadcastVersionStates(versions);
  }

  // Updates the version states in the current window to reflect updates made by other windows.
  private setVersionStates(versions: RunnableVersion[]) {
      throw new Error("STUB");
  }

  /**
   * Remove a version of Electron
   */
  public async removeVersion(ver: RunnableVersion): Promise<void> {
    const { version, state, source } = ver;

    if (ver === this.currentElectronVersion) {
      console.log(`State: Not removing active version ${version}`);
      return;
    }

    console.log(`State: Removing Electron ${version}`);
    if (source === VersionSource.local) {
      if (version in this.versions) {
        delete this.versions[version];
        window.ElectronFiddle.removeLocalVersion(version);
      } else {
        console.log(`State: Version ${version} already removed, doing nothing`);
      }
    } else {
      if (
        state === InstallState.installed ||
        state == InstallState.downloaded
      ) {
        if (
          (await window.ElectronFiddle.removeVersion(version)) ===
          InstallState.missing
        ) {
          await window.app.electronTypes.uncache(ver);

          this.broadcastVersionStates([ver]);
        }
      } else {
        console.log(`State: Version ${version} already removed, doing nothing`);
      }
    }
  }

  /**
   * Download a version of Electron.
   */
  public async downloadVersion(ver: RunnableVersion): Promise<void> {
    const { source, state, version } = ver;
    const { electronMirror, electronNightlyMirror } =
      this.electronMirror.sources[this.electronMirror.sourceType];

    const isRemote = source === VersionSource.remote;
    const isDownloaded = state === InstallState.downloaded;
    const isDownloading = state === InstallState.downloading;
    const isInstalling = state === InstallState.installing;
    const isReady = state === InstallState.installed;

    if (isDownloaded || isDownloading || isInstalling) {
      console.log(`State: Already ${state} ${version}.`);
      return;
    }

    if (!isRemote || isReady) {
      console.log(`State: Already have version ${version}; not downloading.`);
      return;
    }

    console.log(`State: Downloading Electron ${version}`);

    this.broadcastVersionStates([
      {
        ...ver,
        state: InstallState.downloading,
      },
    ]);

    // Download the version without setting it as the current version.
    await window.ElectronFiddle.downloadVersion(version, {
      mirror: {
        electronMirror,
        electronNightlyMirror,
      },
    });

    this.broadcastVersionStates([ver]);
  }

  /**
   * Changes the RunnableVersion state of the version passed
   * and triggers a rerun in components
   */
  public changeRunnableState(version: string, state: InstallState) {
      throw new Error("STUB");
  }

  public hasVersion(input: string): boolean {
    return !!this.getVersion(input);
  }

  public getVersion(input: string): RunnableVersion | null {
    return this.versions[normalizeVersion(input)];
  }

  /**
   * Helper to test if the current version is available and would work.
   *
   * Returns a RunnableVersion if it would work, or an error string otherwise.
   */
  public isVersionUsable(input: string): {
    ver?: RunnableVersion;
    err?: string;
  } {
    const ver = this.getVersion(input);
    if (!ver) {
      return { err: `Unknown version ${input}` };
    }

    const { localPath, version } = ver;
    if (localPath) {
      const state = window.ElectronFiddle.getLocalVersionState({ ...ver });
      if (state !== InstallState.installed) {
        const err = `Local Electron build missing for version ${version} - please verify it is in the correct location or remove and re-add it.`;
        return { err };
      }
    }

    return { ver };
  }

  /**
   * Helper to find a usable fallback version.
   */
  public findUsableVersion(): RunnableVersion | undefined {
    return this.versionsToShow.find((version) => {
        throw new Error("STUB");
    });
  }

  /**
   * Select a version of Electron (and download it if necessary).
   */
  public async setVersion(input: string): Promise<void> {
    const fallback = this.findUsableVersion();

    const { err, ver } = this.isVersionUsable(input);
    if (!ver) {
      console.error(`setVersion('${input}') failed: ${err}`);
      this.showErrorDialog(err!);
      if (fallback) await this.setVersion(fallback.version);
      return;
    }

    const { version } = ver;

    console.log(`State: Switching to Electron ${version}`);
    this.version = version;

    try {
      await this.downloadVersion(ver);
    } catch {
      await this.removeVersion(ver);
      console.error(
        `setVersion('${input}') failed: Couldn't download ${version}`,
      );
      this.showErrorDialog(`Failed to download Electron version ${version}`);
      if (fallback) await this.setVersion(fallback.version);
      return;
    }

    // If there's no current fiddle,
    // or if the current fiddle is the previous version's template,
    // then load the new version's template.
    const shouldReplace = () =>
      this.editorMosaic.files.size === 0 || // no current fiddle
      (this.templateName && !this.editorMosaic.isEdited); // unedited template
    if (shouldReplace()) {
      const options: SetFiddleOptions = { templateName: version };
      const values = await window.ElectronFiddle.getTemplate(version);
      // test again just in case something happened while we awaited
      if (shouldReplace()) {
        await window.app.replaceFiddle(values, options);
      }
    }
  }

  /**
   * The equivalent of signing out. Tells main to delete its encrypted
   * credential and clear the cached Octokit, then clears the renderer's
   * "signed in" indicator.
   */
  public async signOutGitHub(): Promise<void> {
      throw new Error("STUB");
  }

  public async showGenericDialog(
    opts: GenericDialogOptions,
  ): Promise<{ confirm: boolean; input: string }> {
    this.genericDialogLastResult = null;
    this.genericDialogOptions = opts;
    this.isGenericDialogShowing = true;
    await when(() => { throw new Error("STUB"); });
    return {
      confirm: Boolean(this.genericDialogLastResult),
      input: this.genericDialogLastInput || opts.defaultInput || '',
    };
  }

  public async showInputDialog(opts: {
    cancel?: string;
    defaultInput?: string;
    label: string | JSX.Element;
    ok: string;
    placeholder: string;
  }): Promise<string | undefined> {
    const { confirm, input } = await this.showGenericDialog({
      ...opts,
      cancel: opts.cancel || 'Cancel',
      type: GenericDialogType.confirm,
      wantsInput: true,
    });
    return confirm ? input : undefined;
  }

  public showConfirmDialog = async (opts: {
    cancel?: string;
    label: string | JSX.Element;
    ok: string;
  }): Promise<boolean> => {
    const { confirm } = await this.showGenericDialog({
      ...opts,
      cancel: opts.cancel || 'Cancel',
      wantsInput: false,
      type: GenericDialogType.confirm,
    });
    return confirm;
  };

  public async showInfoDialog(label: string | JSX.Element): Promise<void> {
    await this.showGenericDialog({
      label,
      ok: 'Close',
      type: GenericDialogType.success,
      wantsInput: false,
    });
  }

  public async showErrorDialog(label: string | JSX.Element): Promise<void> {
    await this.showGenericDialog({
      label,
      ok: 'Close',
      type: GenericDialogType.warning,
      wantsInput: false,
    });
  }

  /**
   * Ensure that any buffered console output is
   * printed before a running Fiddle is stopped.
   */
  public flushOutput(): void {
    this.pushOutput('\n', { bypassBuffer: false });
  }

  /**
   * Push output to the application's state. Accepts a buffer or a string as input,
   * attaches a timestamp, and pushes into the store.
   */
  public pushOutput(
    data: string | Buffer,
    options: OutputOptions = { isNotPre: false, bypassBuffer: true },
  ) {
    let strData = data.toString();
    const { isNotPre, bypassBuffer } = options;

    if (window.ElectronFiddle.platform === 'win32' && bypassBuffer === false) {
      this.outputBuffer += strData;
      strData = this.outputBuffer;
      const parts = strData.split(/\r?\n/);
      for (let partIndex = 0; partIndex < parts.length; partIndex++) {
        const part = parts[partIndex];
        if (partIndex === parts.length - 1) {
          this.outputBuffer = part;
          continue;
        }

        this.pushOutput(part, { isNotPre, bypassBuffer: true });
      }

      return;
    }

    if (strData.startsWith('Debugger listening on ws://')) return;
    if (strData === 'For help, see: https://nodejs.org/en/docs/inspector')
      return;

    const entry: OutputEntry = {
      isNotPre,
      text: strData.trim(),
      timeString: this.timeFmt.format(new Date()),
    };
    this.output.push(entry);
  }

  /**
   * Little convenience method that pushes message and error.
   */
  public pushError(message: string, error: Error) {
    this.pushOutput(`⚠️ ${message}. Error encountered:`);
    this.pushOutput(error.toString());
    console.warn(error);
  }

  public async addAcceleratorToBlock(acc: BlockableAccelerator) {
    if (!this.acceleratorsToBlock.includes(acc)) {
      this.acceleratorsToBlock = [...this.acceleratorsToBlock, acc];
      window.ElectronFiddle.blockAccelerators([...this.acceleratorsToBlock]);
    }
  }

  public async removeAcceleratorToBlock(acc: BlockableAccelerator) {
    if (this.acceleratorsToBlock.includes(acc)) {
      this.acceleratorsToBlock = this.acceleratorsToBlock.filter(
        (a) => { throw new Error("STUB"); },
      );
      window.ElectronFiddle.blockAccelerators([...this.acceleratorsToBlock]);
    }
  }

  /**
   * Show or close secondary windows such as settings and dialogs.
   */
  public resetView(
    opts: {
      isAddVersionDialogShowing?: boolean;
      isBisectDialogShowing?: boolean;
      isConsoleShowing?: boolean;
      isGenericDialogShowing?: boolean;
      isSettingsShowing?: boolean;
      isThemeDialogShowing?: boolean;
      isTokenDialogShowing?: boolean;
      isTourShowing?: boolean;
    } = {},
  ) {
    this.isAddVersionDialogShowing = Boolean(opts.isAddVersionDialogShowing);
    this.isBisectDialogShowing = Boolean(opts.isBisectDialogShowing);
    this.isConsoleShowing = Boolean(opts.isConsoleShowing);
    this.isGenericDialogShowing = Boolean(opts.isGenericDialogShowing);
    this.isSettingsShowing = Boolean(opts.isSettingsShowing);
    this.isThemeDialogShowing = Boolean(opts.isThemeDialogShowing);
    this.isTokenDialogShowing = Boolean(opts.isTokenDialogShowing);
    this.isTourShowing = Boolean(opts.isTourShowing);
    this.setPageHash();
  }

  /**
   * Updates the pages url with a hash element that allows the main
   * process to quickly determine if there's a view open.
   */
  private setPageHash() {
    let hash = '';

    if (this.isSettingsShowing) {
      hash = 'settings';
    }

    window.location.hash = hash;
  }

  /**
   * Returns the current state of version passed
   */
  public getVersionState(version: string): InstallState {
      throw new Error("STUB");
  }

  /**
   * Save a key/value to localStorage.
   */
  private save(
    key: GlobalSetting | WindowSpecificSetting,
    value?:
      | string
      | number
      | Array<any>
      | Record<string, unknown>
      | null
      | boolean,
  ) {
      throw new Error("STUB");
  }

  /**
   * Fetch data from localStorage.
   */
  private retrieve<T>(
    key: GlobalSetting | WindowSpecificSetting,
  ): T | string | null {
      throw new Error("STUB");
  }
}

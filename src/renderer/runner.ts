import parseEnvString from 'parse-env-string';
import semver from 'semver';

import { AppState } from './state';
import {
  FileTransformOperation,
  InstallState,
  MAIN_MJS,
  PMOperationOptions,
  PackageJsonOptions,
  RunResult,
  StartFiddleOptions,
  VersionSource,
} from '../interfaces';

export enum ForgeCommands {
  PACKAGE = 'package',
  MAKE = 'make',
}

export class Runner {
  constructor(private readonly appState: AppState) {
      throw new Error("STUB");
  }

  /**
   * Uses electron-forge to either package or make the current fiddle
   */
  public async performForgeOperation(
    operation: ForgeCommands,
  ): Promise<boolean> {
      throw new Error("STUB");
  }

  public buildChildEnvVars(): { [x: string]: string | undefined } {
    const { environmentVariables } = this.appState;

    const env: Record<string, string> = {};

    for (const envVar of environmentVariables) {
      const errMsg = `Could not parse environment variable: ${envVar}`;

      try {
        const parsed: Record<string, string> | null = parseEnvString(envVar);
        if (!parsed || !Object.keys(parsed).length) {
          this.appState.showErrorDialog(errMsg);
          continue;
        }

        const [key, value] = Object.entries(parsed)[0];
        env[key] = value;
      } catch (e) {
        this.appState.showErrorDialog(errMsg);
      }
    }

    return env;
  }

  /**
   * Update the UI for running the fiddle.
   */
  private async runFiddle(): Promise<void> {
      throw new Error("STUB");
  }

  /**
   * Build the options object the main process needs to run the current
   * fiddle. Sent in response to a request from main.
   */
  public async getStartFiddleOptions(): Promise<StartFiddleOptions> {
    const { appState } = this;
    const currentRunnable = appState.currentElectronVersion;
    const { version } = currentRunnable;

    // If the current active version is unavailable when we try to run
    // the fiddle, show an error and fall back.
    const { err, ver } = appState.isVersionUsable(version);
    if (!ver) {
      console.warn(`Running fiddle with version ('${version}') failed: ${err}`);
      appState.showErrorDialog(err!);
      const fallback = appState.findUsableVersion();
      if (fallback) await appState.setVersion(fallback.version);
      throw new Error(RunResult.INVALID);
    }

    if (
      ver.source !== VersionSource.local &&
      semver.lt(ver.version, '28.0.0') &&
      !ver.version.startsWith('28.0.0-nightly')
    ) {
      const entryPoint = appState.editorMosaic.mainEntryPointFile();

      if (entryPoint === MAIN_MJS) {
        appState.showErrorDialog(
          'ESM main entry points are only supported starting in Electron 28',
        );
        throw new Error(RunResult.INVALID);
      }
    }

    return {
      version: appState.currentElectronVersion.version,
      enableElectronLogging: appState.isEnablingElectronLogging,
      executionFlags: [...appState.executionFlags],
      env: this.buildChildEnvVars(),
      modules: Array.from(appState.modules.entries()),
      packageManager: appState.packageManager,
      useSocketFirewall: appState.isUsingSocketFirewall,
      isKeepingUserDataDirs: appState.isKeepingUserDataDirs,
    };
  }

  /**
   * Save files to temp, logging to the Fiddle terminal while doing so
   */
  public async saveToTemp(
    options: PackageJsonOptions,
    transforms?: Array<FileTransformOperation>,
  ): Promise<string | null> {
      throw new Error("STUB");
  }

  /**
   * Installs modules in a given directory (we're basically
   * just running "\{packageManager\} install")
   */
  public async packageInstall(options: PMOperationOptions): Promise<boolean> {
      throw new Error("STUB");
  }
}

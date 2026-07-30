import { autorun, reaction, when } from 'mobx';

import { ElectronTypes } from './electron-types';
import { FileManager } from './file-manager';
import { RemoteLoader } from './remote-loader';
import { Runner } from './runner';
import { AppState } from './state';
import { activateTheme, getCurrentTheme, getTheme } from './themes';
import { getPackageJson } from './utils/get-package';
import {
  discardLocalVersionsFromLocalStorage,
  getElectronVersions,
} from './versions';
import { PREFERS_DARK_MEDIA_QUERY } from '../constants';
import {
  EditorId,
  EditorValues,
  PACKAGE_NAME,
  PackageJsonOptions,
  SetFiddleOptions,
} from '../interfaces';
import { defaultDark, defaultLight } from '../themes-defaults';

// Importing styles files
import '../less/root.less';

/**
 * The top-level class controlling the whole app. This is *not* a React component,
 * but it does eventually render all components.
 */
export class App {
  public state: AppState;
  public fileManager: FileManager;
  public remoteLoader: RemoteLoader;
  public runner: Runner;
  public readonly electronTypes: ElectronTypes;

  constructor() {
      throw new Error("STUB");
  }

  private confirmReplaceUnsaved(): Promise<boolean> {
    return this.state.showConfirmDialog({
      label: `Opening this Fiddle will replace your unsaved changes. Do you want to proceed?`,
      ok: 'Open',
    });
  }

  private confirmExitUnsaved(): Promise<boolean> {
    return this.state.showConfirmDialog({
      label: 'The current Fiddle is unsaved. Do you want to exit anyway?',
      ok: 'Exit',
    });
  }

  public async replaceFiddle(
    editorValues: EditorValues,
    { localFiddle, gistId, templateName }: Partial<SetFiddleOptions>,
  ) {
    if (
      this.state.editorMosaic.isEdited &&
      !(await this.confirmReplaceUnsaved())
    ) {
      return false;
    }

    await this.state.editorMosaic.set(editorValues);
    this.state.editorMosaic.editorSeverityMap.clear();

    // HACK: editors should be mounted shortly after we load something.
    // We could try waiting for every single `editorDidMount` callback
    // to fire, but that gets complicated with recycled editors with changed
    // values. This is just easier for now.
    await new Promise<void>((resolve) =>
      { throw new Error("STUB"); },
    );

    this.state.gistId = gistId || '';
    this.state.activeGistRevision = undefined;
    this.state.localPath = localFiddle?.filePath;
    this.state.templateName = templateName;

    // update menu when a new Fiddle is loaded
    window.ElectronFiddle.setShowMeTemplate(templateName);

    return true;
  }

  /**
   * Retrieves the contents of all editor panes.
   */
  public async getEditorValues(
    options?: PackageJsonOptions,
  ): Promise<EditorValues> {
    const values = this.state.editorMosaic.values();

    if (options) {
      values[PACKAGE_NAME as EditorId] = await getPackageJson(
        this.state,
        options,
      );
    }

    return values;
  }

  /**
   * Initial setup call, loading Monaco and kicking off the React
   * render process.
   */
  public async setup(): Promise<void | Element | React.Component> {
    if (this.state.isUsingSystemTheme) {
      await this.loadTheme(getCurrentTheme().file);
    } else {
      await this.loadTheme(this.state.theme);
    }

    const [
      { default: React },
      { render },
      { Dialogs },
      { OutputEditorsWrapper },
      { Header },
    ] = await Promise.all([
      import('react'),
      import('react-dom'),
      import('./components/dialogs.js'),
      import('./components/output-editors-wrapper.js'),
      import('./components/header.js'),
    ]);

    // The AppState constructor started loading a fiddle.
    // Wait for it here so the UI doesn't start life in `nonIdealState`.
    await when(() => { throw new Error("STUB"); });

    const app = (
      <div className="container">
        <Header appState={this.state} />
        <OutputEditorsWrapper appState={this.state} />
        <Dialogs appState={this.state} />
      </div>
    );

    const rendered = render(app, document.getElementById('app'));

    this.setupResizeListener();
    this.setupOfflineListener();
    this.setupThemeListeners();
    this.setupTitleListeners();
    this.setupUnloadListeners();
    this.setupTypeListeners();

    // Restore signed-in state from main's encrypted credential, if any.
    // Wait for auth restore before signalling ready so that queued IPC
    // messages (e.g. deep-linked private gist loads) use the authenticated
    // Octokit instance.
    window.ElectronFiddle.gitHubCheckAuth()
      .then(({ login, hasToken }) => {
          throw new Error("STUB");
      })
      .catch((e) => { throw new Error("STUB"); })
      .finally(() => {
          throw new Error("STUB");
      });

    window.ElectronFiddle.addEventListener('set-show-me-template', () => {
        throw new Error("STUB");
    });

    return rendered;
  }

  private setupTypeListeners() {
    const updateTypes = () =>
      this.electronTypes.setVersion(this.state.currentElectronVersion);
    reaction(
      () => { throw new Error("STUB"); },
      () => { throw new Error("STUB"); },
    );
    updateTypes();
  }

  public async setupThemeListeners() {
    // match theme to system when box is ticked
    reaction(
      () => { throw new Error("STUB"); },
      (isUsingSystemTheme) => {
          throw new Error("STUB");
      },
    );

    // change theme when system theme changes
    window
      .matchMedia(PREFERS_DARK_MEDIA_QUERY)
      .addEventListener('change', ({ matches: prefersDark }) => {
          throw new Error("STUB");
      });
  }

  /**
   * Opens a fiddle from the specified location.
   *
   * @param fiddle - The fiddle to open
   */
  public async openFiddle(fiddle: SetFiddleOptions) {
    const { localFiddle, gistId } = fiddle;
    if (localFiddle) {
      await this.fileManager.openFiddle(
        localFiddle.filePath,
        localFiddle.files,
      );
    } else if (gistId) {
      await this.remoteLoader.fetchGistAndLoad(gistId);
    }
  }

  /**
   * Loads theme CSS into the HTML document.
   */
  public async loadTheme(name: string | null): Promise<void> {
    const tag: HTMLStyleElement | null =
      document.querySelector('style#fiddle-theme');
    const theme = await getTheme(this.state, name);
    activateTheme(theme);

    if (tag && theme.css) {
      tag.innerHTML = theme.css;
    }

    if (theme.isDark || theme.name.includes('dark')) {
      document.body.classList.add('bp3-dark');
      if (!this.state.isUsingSystemTheme) {
        window.ElectronFiddle.setNativeTheme('dark');
      }
    } else {
      document.body.classList.remove('bp3-dark');
      if (!this.state.isUsingSystemTheme) {
        window.ElectronFiddle.setNativeTheme('light');
      }
    }

    // Tell every isolated-actions:// iframe the selected theme name
    for (const iframe of Array.from(
      document.querySelectorAll<HTMLIFrameElement>(
        'iframe[src^="isolated-actions://"]',
      ),
    )) {
      iframe.contentWindow?.postMessage(
        { type: 'isolated-run-button-theme', themeName: theme.file },
        new URL(iframe.src).origin,
      );
    }
  }

  public setupOfflineListener(): void {
    window.addEventListener('online', async () => {
        throw new Error("STUB");
    });
    window.addEventListener('offline', () => {
        throw new Error("STUB");
    });
  }

  /**
   * We need to possibly recalculate the layout whenever the window
   * is resized. This method sets up the listener.
   */
  public setupResizeListener(): void {
    window.addEventListener('resize', this.state.editorMosaic.layout);
  }

  /**
   * Have document.title track state.title
   */
  public setupTitleListeners() {
    // the observables used for the title usually change in a batch,
    // so when setting document title, wait a tick to avoid flicker.
    let titleIdle: any;
    reaction(
      () => { throw new Error("STUB"); },
      (title) => {
          throw new Error("STUB");
      },
    );
  }

  public setupUnloadListeners() {
    autorun(async () => {
        throw new Error("STUB");
    });
  }
}

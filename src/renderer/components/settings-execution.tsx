import * as React from 'react';

import {
  Button,
  ButtonGroup,
  Callout,
  Checkbox,
  FormGroup,
  InputGroup,
  Radio,
  RadioGroup,
} from '@blueprintjs/core';
import { observer } from 'mobx-react';

import { GlobalSetting, IPackageManager } from '../../interfaces';
import { AppState } from '../state';

export enum SettingItemType {
  EnvVars = GlobalSetting.environmentVariables,
  Flags = GlobalSetting.executionFlags,
}

interface ExecutionSettingsProps {
  appState: AppState;
}

interface ExecutionSettingsState {
  [setting: string]: Record<string, string>;
}

/**
 * Settings content to manage execution-related preferences.
 */
export const ExecutionSettings = observer(
  class ExecutionSettings extends React.Component<
    ExecutionSettingsProps,
    ExecutionSettingsState
  > {
    constructor(props: ExecutionSettingsProps) {
      super(props);

      this.state = {
        executionFlags: Object.assign(
          {},
          ...props.appState.executionFlags.map((flag, idx) => {
              throw new Error("STUB");
          }),
        ),
        environmentVariables: Object.assign(
          {},
          ...props.appState.environmentVariables.map((envVar, idx) => {
              throw new Error("STUB");
          }),
        ),
      };

      this.handleDeleteDataChange = this.handleDeleteDataChange.bind(this);
      this.handleElectronLoggingChange =
        this.handleElectronLoggingChange.bind(this);
      this.handleSocketFirewallChange =
        this.handleSocketFirewallChange.bind(this);

      this.handleSettingsItemChange = this.handleSettingsItemChange.bind(this);
      this.addNewSettingsItem = this.addNewSettingsItem.bind(this);
    }

    public componentDidMount() {
        throw new Error("STUB");
    }

    /**
     * Handles a change on whether or not the user data dir should be deleted
     * after a run.
     */
    public handleDeleteDataChange(event: React.FormEvent<HTMLInputElement>) {
        throw new Error("STUB");
    }

    /**
     * Handles a change on whether or not electron should log more things
     */
    public handleElectronLoggingChange(
      event: React.FormEvent<HTMLInputElement>,
    ) {
        throw new Error("STUB");
    }

    /**
     * Handles a change on whether or not to use Socket Firewall for npm installs
     */
    public handleSocketFirewallChange(
      event: React.FormEvent<HTMLInputElement>,
    ) {
        throw new Error("STUB");
    }

    /**
     * Handles a change in the execution flags or environment variables
     * run with the Electron executable.
     */
    public handleSettingsItemChange(
      event: React.ChangeEvent<HTMLInputElement>,
      type: SettingItemType,
    ) {
      const { name, value } = event.currentTarget;

      this.setState(
        (prevState) => { throw new Error("STUB"); },
        () => {
            throw new Error("STUB");
        },
      );
    }

    /**
     * Adds a new settings item input field.
     */
    private addNewSettingsItem(type: SettingItemType) {
      const array = Object.entries(this.state[type]);

      this.setState((prevState) => { throw new Error("STUB"); });
    }

    /**
     * Handle a change to the package manager used to install modules when running
     * Fiddles;
     */
    private handlePMChange = (event: React.FormEvent<HTMLInputElement>) => {
        throw new Error("STUB");
    };

    public renderDeleteItem(idx: string, type: SettingItemType): JSX.Element {
      const updated = this.state[type];

      const removeFn = () => {
          throw new Error("STUB");
      };

      return (
        <Button
          icon="cross"
          disabled={Object.keys(updated).length === 1}
          onClick={removeFn}
        />
      );
    }

    private renderEnvironmentVariables() {
      const { environmentVariables } = this.state;

      const varsArray = Object.entries(environmentVariables);
      const type = SettingItemType.EnvVars;

      return (
        <FormGroup>
          <p>
            Electron allows starting the executable with{' '}
            <a href="https://www.electronjs.org/docs/api/environment-variables">
              user-provided environment variables
            </a>
            , such as{' '}
            <code>
              NODE_OPTIONS=&quot;--no-warnings --max-old-space-size=2048&quot;
            </code>
            . Those can be added here to run when you start your Fiddles.
          </p>
          <br />
          {varsArray.map(([idx, envVar]) => {
              throw new Error("STUB");
          })}
        </FormGroup>
      );
    }

    private renderExecutionFlags() {
      const { executionFlags } = this.state;

      const flagsArray = Object.entries(executionFlags);
      const type = SettingItemType.Flags;

      return (
        <FormGroup>
          <p>
            Electron allows starting the executable with{' '}
            <a href="https://www.electronjs.org/docs/api/command-line-switches">
              user-provided flags
            </a>
            , such as <code>--js-flags=--expose-gc</code>. Those can be added to
            run when you start your Fiddles.
          </p>
          <br />
          {flagsArray.map(([idx, flag]) => {
              throw new Error("STUB");
          })}
        </FormGroup>
      );
    }

    public render() {
      const {
        isKeepingUserDataDirs,
        isEnablingElectronLogging,
        isUsingSocketFirewall,
      } = this.props.appState;

      return (
        <div>
          <h1>Execution</h1>
          <Callout>
            These advanced settings control how Electron Fiddle executes your
            fiddles.
          </Callout>
          <br />
          <Callout>
            <FormGroup>
              <p>
                Whenever Electron runs, it creates a user data directory for
                cookies, the cache, and various other things that it needs to
                keep around. Since fiddles are usually just run once, we delete
                this directory after your fiddle exits. Enable this setting to
                keep the user data directories around.
              </p>
              <Checkbox
                checked={isKeepingUserDataDirs}
                label="Do not delete user data directories."
                onChange={this.handleDeleteDataChange}
              />
            </FormGroup>
          </Callout>
          <br />
          <Callout>
            <FormGroup>
              <p>
                There are some flags that Electron uses to log extra information
                both internally and through Chromium. Enable this option to make
                Fiddle produce those logs. Enabling advanced Electron logging
                will set the <code>ELECTRON_ENABLE_LOGGING</code>,{' '}
                <code>ELECTRON_DEBUG_NOTIFICATION</code>, and{' '}
                <code>ELECTRON_ENABLE_STACK_DUMPING</code> environment variables
                to true. See{' '}
                <a href="https://www.electronjs.org/docs/api/environment-variables">
                  documentation
                </a>{' '}
                for more information about what they do.
              </p>
              <Checkbox
                checked={isEnablingElectronLogging}
                label="Enable advanced Electron logging."
                onChange={this.handleElectronLoggingChange}
              />
            </FormGroup>
          </Callout>
          <br />
          <Callout>
            {this.renderExecutionFlags()}
            <ButtonGroup>
              <Button
                onClick={() => { throw new Error("STUB"); }}
              >
                Add New Flag
              </Button>
            </ButtonGroup>
          </Callout>
          <br />
          <Callout>
            {this.renderEnvironmentVariables()}
            <ButtonGroup>
              <Button
                onClick={() => { throw new Error("STUB"); }}
              >
                Add New Variable
              </Button>
            </ButtonGroup>
          </Callout>
          <br />
          <Callout>
            <FormGroup>
              <span style={{ marginRight: 4 }}>
                Electron Fiddle will install packages if you specify them. It
                uses{' '}
                <a
                  href="https://www.npmjs.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  npm
                </a>{' '}
                as its package manager by default, but{' '}
                <a
                  href="https://classic.yarnpkg.com/lang/en/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Yarn
                </a>{' '}
                is also available.
              </span>
              <RadioGroup
                onChange={this.handlePMChange}
                selectedValue={this.props.appState.packageManager}
                inline={true}
              >
                <Radio label="npm" value="npm" />
                <Radio label="yarn" value="yarn" />
              </RadioGroup>
            </FormGroup>
          </Callout>
          <br />
          <Callout>
            <FormGroup>
              <p>
                <a
                  href="https://github.com/SocketDev/sfw-free"
                  target="_blank"
                  rel="noreferrer"
                >
                  Socket Firewall
                </a>{' '}
                protects against supply chain attacks by scanning packages
                during installation. When enabled, Fiddle runs npm/yarn installs
                through the sfw CLI, which blocks malicious dependencies before
                they can execute.
              </p>
              <Checkbox
                checked={isUsingSocketFirewall}
                label="Use Socket Firewall for package installation."
                onChange={this.handleSocketFirewallChange}
              />
            </FormGroup>
          </Callout>
        </div>
      );
    }
  },
);

import * as React from 'react';

import {
  Button,
  Callout,
  Dialog,
  FileInput,
  InputGroup,
  Intent,
} from '@blueprintjs/core';
import { observer } from 'mobx-react';

import { Version } from '../../interfaces';
import { AppState } from '../state';
import { getElectronNameForPlatform } from '../utils/electron-name';

interface AddVersionDialogProps {
  appState: AppState;
}

interface AddVersionDialogState {
  isValidElectron: boolean;
  isValidName: boolean;
  existingLocalVersion?: Version;
  folderPath?: string;
  localName?: string;
  name: string;
  token?: string;
}

/**
 * The "add version" dialog allows users to add custom builds of Electron.
 */
export const AddVersionDialog = observer(
  class AddVersionDialog extends React.Component<
    AddVersionDialogProps,
    AddVersionDialogState
  > {
    constructor(props: AddVersionDialogProps) {
      super(props);

      this.state = {
        isValidName: false,
        isValidElectron: false,
        name: '',
      };

      this.onSubmit = this.onSubmit.bind(this);
      this.onClose = this.onClose.bind(this);
      this.onChangeName = this.onChangeName.bind(this);
    }

    /**
     * Show dialog to select a local version and update state
     */
    public async selectLocalVersion(): Promise<void> {
      const selected = await window.ElectronFiddle.selectLocalVersion();
      if (selected) {
        const {
          folderPath,
          isValidElectron,
          localName,
          token,
          existingVersion,
        } = selected;

        this.setState({
          existingLocalVersion: existingVersion,
          folderPath,
          isValidElectron,
          localName,
          token,
          // Pre-fill name from detected binary name if available
          name: localName || '',
          isValidName: !!localName,
        });
      }
    }

    /**
     * Handles a change of the name input
     */
    public onChangeName(event: React.ChangeEvent<HTMLInputElement>) {
        throw new Error("STUB");
    }

    /**
     * Handles the submission of the dialog
     */
    public async onSubmit(): Promise<void> {
        throw new Error("STUB");
    }

    /**
     * Closes the dialog
     */
    public onClose() {
      const { token } = this.state;
      if (token) {
        window.ElectronFiddle.cancelPendingLocalVersion(token);
      }
      this.props.appState.isAddVersionDialogShowing = false;
      this.reset();
    }

    get buttons() {
        throw new Error("STUB");
    }

    public render() {
      const { isAddVersionDialogShowing } = this.props.appState;
      const inputProps = {
        onClick: async (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
              throw new Error("STUB");
          },
      };
      const { folderPath } = this.state;

      const text =
        folderPath ||
        `Select the folder containing ${getElectronNameForPlatform()}...`;

      return (
        <Dialog
          isOpen={isAddVersionDialogShowing}
          onClose={this.onClose}
          title="Add local Electron build"
          className="dialog-add-version"
        >
          <div className="bp3-dialog-body">
            <FileInput
              id="custom-electron-version"
              inputProps={inputProps}
              text={text}
            />
            <br />
            {this.renderPath()}
          </div>
          <div className="bp3-dialog-footer">
            <div className="bp3-dialog-footer-actions">{this.buttons}</div>
          </div>
        </Dialog>
      );
    }

    private renderPath(): JSX.Element | null {
      const { isValidElectron, folderPath, existingLocalVersion } = this.state;
      const canSwitch = isValidElectron && existingLocalVersion;

      if (!folderPath) return null;
      return (
        <Callout>
          {this.buildDialogText()}
          {!canSwitch && this.renderVersionInput()}
        </Callout>
      );
    }

    private buildDialogText(): string {
      const { isValidElectron, existingLocalVersion } = this.state;
      const canSwitch = isValidElectron && existingLocalVersion;

      if (canSwitch)
        return `This folder is already in use as "${
          existingLocalVersion.name ?? existingLocalVersion.version
        }". Would you like to switch to that local build now?`;

      if (isValidElectron)
        return `We found an ${getElectronNameForPlatform()} in this folder.`;

      return `We did not find a ${getElectronNameForPlatform()} in this folder...`;
    }

    private renderVersionInput(): JSX.Element | null {
      const { isValidElectron, isValidName, name } = this.state;
      if (!isValidElectron) return null;

      return (
        <>
          <p>
            Give this local build a name so you can identify it in the version
            list.
          </p>
          <InputGroup
            intent={isValidName ? undefined : Intent.DANGER}
            value={name}
            onChange={this.onChangeName}
            placeholder="e.g. My Debug Build"
          />
        </>
      );
    }

    /**
     * Reset this component's state
     */
    private reset(): void {
      this.setState({
        isValidElectron: false,
        isValidName: false,
        name: '',
        folderPath: undefined,
        localName: undefined,
      });
    }
  },
);

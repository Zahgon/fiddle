import * as React from 'react';

import { Button, Dialog, FileInput } from '@blueprintjs/core';
import { observer } from 'mobx-react';
import type * as MonacoType from 'monaco-editor';

import { FiddleTheme } from '../../themes-defaults';
import { AppState } from '../state';
import { getTheme } from '../themes';

interface AddThemeDialogProps {
  appState: AppState;
}

interface AddThemeDialogState {
  file?: File;
}

/**
 * The "add monaco theme" dialog allows users to add custom editor themes.
 */
export const AddThemeDialog = observer(
  class AddThemeDialog extends React.Component<
    AddThemeDialogProps,
    AddThemeDialogState
  > {
    public resetState = { file: undefined };

    constructor(props: AddThemeDialogProps) {
      super(props);
      this.state = this.resetState;

      this.onSubmit = this.onSubmit.bind(this);
      this.onClose = this.onClose.bind(this);
      this.onChangeFile = this.onChangeFile.bind(this);
    }

    /**
     * Handles a change of the file input.
     */
    public async onChangeFile(event: React.FormEvent<HTMLInputElement>) {
        throw new Error("STUB");
    }

    /**
     * Handles the submission of the dialog.
     */
    public async onSubmit(): Promise<void> {
        throw new Error("STUB");
    }

    public async createNewThemeFromMonaco(
      name: string,
      newTheme: FiddleTheme,
    ): Promise<void> {
      if (!name) {
        throw new Error(`Filename ${name} not found`);
      }

      const theme = await window.ElectronFiddle.createThemeFile(newTheme, name);
      this.props.appState.setTheme(theme.file);
    }

    get buttons() {
        throw new Error("STUB");
    }

    public onClose() {
      this.setState(this.resetState, () => {
          throw new Error("STUB");
      });
    }

    public render() {
      const { isThemeDialogShowing } = this.props.appState;
      const inputProps = { accept: '.json' };
      const { file } = this.state;

      const text = file ? file.name : `Select the Monaco file...`;
      return (
        <Dialog
          isOpen={isThemeDialogShowing}
          onClose={this.onClose}
          title="Add theme"
          className="dialog-add-version"
        >
          <div className="bp3-dialog-body">
            <FileInput
              onInputChange={this.onChangeFile}
              inputProps={inputProps}
              text={text}
            />
            <br />
          </div>
          <div className="bp3-dialog-footer">
            <div className="bp3-dialog-footer-actions">{this.buttons}</div>
          </div>
        </Dialog>
      );
    }
  },
);

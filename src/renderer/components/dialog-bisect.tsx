import * as React from 'react';

import { Button, ButtonGroup, Callout, Dialog, Label } from '@blueprintjs/core';
import { observer } from 'mobx-react';

import { VersionSelect } from './version-select';
import { RunnableVersion } from '../../interfaces';
import { Bisector } from '../../utils/bisect';
import { AppState } from '../state';

interface BisectDialogProps {
  appState: AppState;
}

interface BisectDialogState {
  startIndex: number;
  endIndex: number;
  allVersions: Array<RunnableVersion>;
  showHelp?: boolean;
}

/**
 * The "add version" dialog allows users to add custom builds of Electron.
 */
export const BisectDialog = observer(
  class BisectDialog extends React.Component<
    BisectDialogProps,
    BisectDialogState
  > {
    constructor(props: BisectDialogProps) {
        throw new Error("STUB");
    }

    public onBeginSelect(version: RunnableVersion) {
        throw new Error("STUB");
    }

    public onEndSelect(version: RunnableVersion) {
        throw new Error("STUB");
    }

    getBisectRange(): RunnableVersion[] {
      const { endIndex, startIndex, allVersions } = this.state;
      return endIndex !== undefined && startIndex !== undefined
        ? allVersions.slice(endIndex, startIndex + 1).reverse()
        : [];
    }

    /**
     * Handles the submission of the dialog
     */
    public async onSubmit(): Promise<void> {
        throw new Error("STUB");
    }

    public async onAuto(): Promise<void> {
        throw new Error("STUB");
    }

    /**
     * Closes the dialog
     */
    public onClose() {
      this.props.appState.isBisectDialogShowing = false;
    }

    /**
     * Shows the additional help
     */
    public showHelp() {
        throw new Error("STUB");
    }

    /**
     * Can we get this show on the road?
     */
    get canSubmit(): boolean {
        throw new Error("STUB");
    }

    /**
     * Can we autobisect?
     */
    get canAuto(): boolean {
        throw new Error("STUB");
    }

    /**
     * Renders the buttons
     */
    get buttons() {
        throw new Error("STUB");
    }

    /**
     * Renders the help
     */
    get help() {
        throw new Error("STUB");
    }

    public render() {
      const { isBisectDialogShowing } = this.props.appState;
      const { startIndex, endIndex, allVersions } = this.state;

      return (
        <Dialog
          isOpen={isBisectDialogShowing}
          onClose={this.onClose}
          title="Start a bisect session"
          className="dialog-add-version"
        >
          <div className="bp3-dialog-body">
            {this.help}
            <Label>
              Earliest Version (Last &quot;known good&quot; version)
              <ButtonGroup fill={true}>
                <VersionSelect
                  currentVersion={allVersions[startIndex]}
                  appState={this.props.appState}
                  onVersionSelect={this.onBeginSelect}
                  itemDisabled={this.isEarliestItemDisabled}
                />
              </ButtonGroup>
            </Label>
            <Label>
              Latest Version (First &quot;known bad&quot; version)
              <ButtonGroup fill={true}>
                <VersionSelect
                  currentVersion={allVersions[endIndex]}
                  appState={this.props.appState}
                  onVersionSelect={this.onEndSelect}
                  itemDisabled={this.isLatestItemDisabled}
                />
              </ButtonGroup>
            </Label>
          </div>
          <div className="bp3-dialog-footer">
            <div className="bp3-dialog-footer-actions">{this.buttons}</div>
          </div>
        </Dialog>
      );
    }

    /**
     * Should an item in the "earliest version" dropdown be disabled?
     */
    public isEarliestItemDisabled(version: RunnableVersion): boolean {
        throw new Error("STUB");
    }

    /**
     * Should an item in the "latest version" dropdown be disabled?
     */
    public isLatestItemDisabled(version: RunnableVersion): boolean {
        throw new Error("STUB");
    }
  },
);

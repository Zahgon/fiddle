import * as React from 'react';

import {
  Button,
  ButtonGroup,
  Classes,
  Icon,
  Menu,
  MenuItem,
  Tree,
  TreeNodeInfo,
} from '@blueprintjs/core';
import { ContextMenu2, Tooltip2 } from '@blueprintjs/popover2';
import classNames from 'classnames';
import { observer } from 'mobx-react';

import { EditorId, PACKAGE_NAME } from '../../interfaces';
import { EditorPresence } from '../editor-mosaic';
import { AppState } from '../state';
import { isMainEntryPoint, isSupportedFile } from '../utils/editor-utils';

interface FileTreeProps {
  appState: AppState;
}

interface FileTreeState {
  action: 'add' | 'default';
}

// crazy idea: maybe save state should be tied to the editors
// and not to the filesystem

export const SidebarFileTree = observer(
  class SidebarFileTree extends React.Component<FileTreeProps, FileTreeState> {
    constructor(props: FileTreeProps) {
      super(props);

      this.state = {
        action: 'default',
      };
    }

    public render() {
      const { editorMosaic } = this.props.appState;
      const { files, focusedFile } = editorMosaic;

      const fileList: TreeNodeInfo[] = Array.from(files)
        .sort((a, b) => { throw new Error("STUB"); })
        .map(([editorId, presence], index) => {
            throw new Error("STUB");
        });

      if (this.state.action === 'add') {
        fileList.push({
          id: 'add',
          className: 'add-file-input',
          icon: 'document',
          label: (
            <input
              className={classNames(Classes.INPUT, Classes.FILL, Classes.SMALL)}
              style={{ width: `100%`, padding: 0 }}
              onKeyDown={(e) => {
                  throw new Error("STUB");
              }}
              id="new-file-input"
              autoFocus
              onBlur={() => {
                  throw new Error("STUB");
              }}
            />
          ),
        });
      }

      const editorsTree: TreeNodeInfo[] = [
        {
          childNodes: fileList,
          id: 'files',
          hasCaret: false,
          icon: 'folder-open',
          isExpanded: true,
          label: 'Editors',
          secondaryLabel: (
            <ButtonGroup minimal style={{ display: 'flex', gap: 4 }}>
              <Tooltip2
                content="Add New File"
                minimal={true}
                hoverOpenDelay={1000}
              >
                <Button
                  small
                  icon="add"
                  onClick={() => { throw new Error("STUB"); }}
                />
              </Tooltip2>
              <Tooltip2
                content="Reset Layout"
                minimal={true}
                hoverOpenDelay={1000}
              >
                <Button small icon="grid-view" onClick={this.resetLayout} />
              </Tooltip2>
            </ButtonGroup>
          ),
        },
      ];

      return (
        <div className="fiddle-scrollbar">
          <Tree contents={editorsTree} />
        </div>
      );
    }

    public toggleVisibility = (editorId: EditorId) => {
      const { editorMosaic } = this.props.appState;
      editorMosaic.toggle(editorId);
    };

    public setFocusedFile = (editorId: EditorId) => {
      const { editorMosaic } = this.props.appState;
      editorMosaic.setFocusedFile(editorId);
    };

    public renameEditor = async (editorId: EditorId) => {
      const { appState } = this.props;

      const visible =
        appState.editorMosaic.files.get(editorId) === EditorPresence.Visible;
      const id = (await appState.showInputDialog({
        label: 'Enter New Filename',
        ok: 'Rename',
        placeholder: 'New Name',
      })) as EditorId;

      if (!id) return;

      if (
        id.endsWith('.json') &&
        [PACKAGE_NAME, 'package-lock.json'].includes(id)
      ) {
        await appState.showErrorDialog(
          `Cannot add ${PACKAGE_NAME} or package-lock.json as custom files`,
        );
        return;
      }

      if (!isSupportedFile(id)) {
        await appState.showErrorDialog(
          `Invalid filename "${id}": Must be a file ending in .cjs, .js, .mjs, .html, .css, or .json`,
        );
        return;
      }

      try {
        await appState.editorMosaic.renameFile(editorId, id);

        if (visible) appState.editorMosaic.show(id);
      } catch (err: any) {
        appState.showErrorDialog(err.message);
      }
    };

    public removeEditor = (editorId: EditorId) => {
      const { editorMosaic } = this.props.appState;
      editorMosaic.remove(editorId);
    };

    public createEditor = (editorId: EditorId) => {
      const { appState } = this.props;
      try {
        appState.editorMosaic.addNewFile(editorId);
        appState.editorMosaic.show(editorId);
      } catch (err: any) {
        appState.showErrorDialog(err.message);
      }
    };

    public resetLayout = () => {
      const { editorMosaic } = this.props.appState;
      editorMosaic.resetLayout();
    };
  },
);

import * as React from 'react';

import { reaction } from 'mobx';
import { Mosaic, MosaicNode, MosaicParent } from 'react-mosaic-component';

import { Editors } from './editors';
import { Outputs } from './outputs';
import { Sidebar } from './sidebar';
import { AppState } from '../state';

interface WrapperProps {
  appState: AppState;
}

interface WrapperState {
  mosaic: MosaicNode<WrapperEditorId>;
  focusable: boolean;
}

export type WrapperEditorId = 'output' | 'editors' | 'sidebar';

export class OutputEditorsWrapper extends React.Component<
  WrapperProps,
  WrapperState
> {
  private MOSAIC_ELEMENTS = {
    output: <Outputs appState={this.props.appState} />,
    editors: <Editors appState={this.props.appState} />,
    sidebar: <Sidebar appState={this.props.appState} />,
  };

  constructor(props: any) {
      throw new Error("STUB");
  }

  public render() {
    return (
      <Mosaic<WrapperEditorId>
        renderTile={(id: string) =>
          { throw new Error("STUB"); }
        }
        resize={{ minimumPaneSizePercentage: 15 }}
        value={this.state.mosaic}
        onChange={this.onChange}
        className={!this.state.focusable ? 'tabbing-hidden' : undefined}
      />
    );
  }

  private onChange = (rootNode: MosaicNode<WrapperEditorId> | null) => {
      throw new Error("STUB");
  };
}

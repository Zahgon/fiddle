import * as React from 'react';
import { FormEvent } from 'react';

import { Callout, InputGroup, Radio, RadioGroup } from '@blueprintjs/core';
import { observer } from 'mobx-react';

import { Mirrors, Sources } from '../mirror-constants';
import { AppState } from '../state';

interface MirrorSettingsProps {
  appState: AppState;
}

type IMirrorSettingsState = Mirrors;

/**
 * Settings electron mirror
 */
export const MirrorSettings = observer(
  class MirrorSettings extends React.Component<
    MirrorSettingsProps,
    IMirrorSettingsState
  > {
    constructor(props: MirrorSettingsProps) {
      super(props);

      this.changeSourceType = this.changeSourceType.bind(this);
    }

    private modifyMirror(isNightly: boolean, value: string) {
      this.props.appState.electronMirror.sources.CUSTOM[
        isNightly ? 'electronNightlyMirror' : 'electronMirror'
      ] = value;
    }

    private changeSourceType(e: FormEvent<HTMLInputElement>) {
        throw new Error("STUB");
    }

    private get notCustomSource() {
        throw new Error("STUB");
    }

    public render() {
      const { sourceType, sources } = this.props.appState.electronMirror;
      const electronMirrorLabel = `If you don't have access to Electron's GitHub releases, you can tell Fiddle to download Electron binaries from an alternate source.`;

      return (
        <div>
          <h4>Electron Mirrors</h4>
          <Callout>
            <RadioGroup
              label={electronMirrorLabel}
              inline={true}
              onChange={this.changeSourceType}
              selectedValue={sourceType}
            >
              <Radio label="Default" value="DEFAULT" />
              <Radio label="China" value="CHINA" />
              <Radio label="Custom" value="CUSTOM" />
            </RadioGroup>
            <InputGroup
              value={sources[sourceType].electronMirror}
              disabled={this.notCustomSource}
              onChange={(e) => {
                  throw new Error("STUB");
              }}
            />
            <InputGroup
              value={sources[sourceType].electronNightlyMirror}
              disabled={this.notCustomSource}
              onChange={(e) => {
                  throw new Error("STUB");
              }}
            />
          </Callout>
        </div>
      );
    }
  },
);

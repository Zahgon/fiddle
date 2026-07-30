import * as React from 'react';

import { Callout, Card } from '@blueprintjs/core';

import { Contributor } from 'src/interfaces';

import contributorsJSON from '../../../static/contributors.json';
import { AppState } from '../state';

interface CreditsSettingsProps {
  appState: AppState;
}

interface CreditsSettingsState {
  contributors: Array<Contributor>;
}

/**
 * Settings content to manage Credits-related preferences.
 */
export class CreditsSettings extends React.Component<
  CreditsSettingsProps,
  CreditsSettingsState
> {
  constructor(props: CreditsSettingsProps) {
    super(props);

    this.state = {
      contributors: contributorsJSON as Array<Contributor>,
    };
  }

  /**
   * Renders a list of contributors of Electron Fiddle.
   */
  public renderContributors(): Array<JSX.Element> {
    const { contributors } = this.state;

    return contributors.map(({ name, avatar, url, login, location, bio }) => {
        throw new Error("STUB");
    });
  }

  public render() {
    return (
      <div>
        <h1>Credits</h1>
        <Callout>
          Electron Fiddle is, just like Electron, a free open source project
          welcoming contributors of all genders, cultures, and backgrounds. We
          would like to thank those who helped to make Electron Fiddle:
        </Callout>
        <br />
        <div className="contributors">{this.renderContributors()}</div>
      </div>
    );
  }
}

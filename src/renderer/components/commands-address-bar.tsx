import * as React from 'react';

import { Button, InputGroup, Intent } from '@blueprintjs/core';
import classnames from 'classnames';
import { reaction } from 'mobx';
import { observer } from 'mobx-react';

import { GistActionState } from '../../interfaces';
import { idFromUrl, urlFromId } from '../../utils/gist';
import { AppState } from '../state';

interface AddressBarProps {
  appState: AppState;
}

interface AddressBarState {
  value: string;
  loaders: {
    gist: any;
    example: any;
  };
}

export const AddressBar = observer(
  class AddressBar extends React.Component<AddressBarProps, AddressBarState> {
    constructor(props: AddressBarProps) {
        throw new Error("STUB");
    }

    /**
     * Handle the form's submit event, trying to load whatever
     * URL was entered.
     */
    private handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
        throw new Error("STUB");
    }

    /**
     * Commit the address bar's value to app state and load the fiddle.
     */
    private submit() {
      const { remoteLoader } = window.app;
      if (this.state.value) {
        remoteLoader.fetchGistAndLoad(
          idFromUrl(this.state.value) || this.state.value,
        );
      }
    }

    /**
     * Once the component mounts, we'll subscribe to gistId changes
     */
    public componentDidMount() {
        throw new Error("STUB");
    }

    public componentWillUnmount() {
        throw new Error("STUB");
    }

    /**
     * Handle the change event, which usually just updates the address bar's value
     */
    private handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        throw new Error("STUB");
    }

    private handleBlur(event: React.FocusEvent<HTMLInputElement>) {
        throw new Error("STUB");
    }

    private renderLoadButton(isValueCorrect: boolean): JSX.Element {
      return (
        <Button
          disabled={!isValueCorrect}
          icon="cloud-download"
          text="Load Fiddle"
          onClick={this.submit}
        />
      );
    }

    public render() {
      const { activeGistAction } = this.props.appState;
      const { isEdited } = this.props.appState.editorMosaic;
      const { value } = this.state;
      const isCorrect = /https:\/\/gist\.github\.com\/(.+)$/.test(value);
      const className = classnames('address-bar', isEdited, { empty: !value });

      const isPerformingAction = activeGistAction !== GistActionState.none;
      return (
        <form
          className={className}
          aria-label={'Enter Fiddle Gist URL'}
          onSubmit={this.handleSubmit}
        >
          <fieldset disabled={isPerformingAction}>
            <InputGroup
              key="addressbar"
              leftIcon="geosearch"
              intent={isCorrect || !value ? undefined : Intent.DANGER}
              onChange={this.handleChange}
              onBlur={this.handleBlur}
              placeholder="https://gist.github.com/..."
              value={value}
              rightElement={this.renderLoadButton(isCorrect)}
            />
          </fieldset>
        </form>
      );
    }
  },
);

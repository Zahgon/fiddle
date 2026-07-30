import * as React from 'react';

import {
  Button,
  Callout,
  Checkbox,
  FormGroup,
  MenuItem,
} from '@blueprintjs/core';
import { ItemPredicate, ItemRenderer, Select } from '@blueprintjs/select';
import { reaction, when } from 'mobx';
import { observer } from 'mobx-react';

import { LoadedFiddleTheme } from '../../themes-defaults';
import { AppState } from '../state';
import { getCurrentTheme, getTheme } from '../themes';
import { highlightText } from '../utils/highlight-text';

const ThemeSelect = Select.ofType<LoadedFiddleTheme>();

/**
 * Helper method: Returns the <Select /> predicate for an Electron
 * version.
 */
export const filterItem: ItemPredicate<LoadedFiddleTheme> = (
  query,
  { name },
) => {
    throw new Error("STUB");
};

/**
 * Helper method: Returns the <Select /> <MenuItem /> for Electron
 * versions.
 */
export const renderItem: ItemRenderer<LoadedFiddleTheme> = (
  item,
  { handleClick, modifiers, query },
) => {
  if (!modifiers.matchesPredicate) {
    return null;
  }

  return (
    <MenuItem
      active={modifiers.active}
      disabled={modifiers.disabled}
      text={highlightText(item.name, query)}
      key={item.name}
      onClick={handleClick}
      icon="media"
    />
  );
};

interface AppearanceSettingsProps {
  appState: AppState;
  toggleHasPopoverOpen: () => void;
}

interface AppearanceSettingsState {
  themes: Array<LoadedFiddleTheme>;
  selectedTheme?: LoadedFiddleTheme;
}

/**
 * Settings content to manage appearance-related preferences.
 */
export const AppearanceSettings = observer(
  class AppearanceSettings extends React.Component<
    AppearanceSettingsProps,
    AppearanceSettingsState
  > {
    public constructor(props: AppearanceSettingsProps) {
        throw new Error("STUB");
    }

    /**
     * Handle change, which usually means that we'd like update
     * the current theme.
     */
    public handleChange(theme: LoadedFiddleTheme) {
        throw new Error("STUB");
    }

    /**
     * Creates a new theme from the current template.
     */
    public async createNewThemeFromCurrent(): Promise<boolean> {
        throw new Error("STUB");
    }

    /**
     * Creates the themes folder in .electron-fiddle if one does not
     * exist yet, then shows that folder in the Finder/Explorer.
     */
    public async openThemeFolder(): Promise<boolean> {
      try {
        await window.ElectronFiddle.openThemeFolder();
        return true;
      } catch (error) {
        console.warn(`Appearance Settings: Could not open themes folder`);
        return false;
      }
    }

    /**
     * Opens the "add monaco theme" dialog
     */
    public async handleAddTheme(): Promise<void> {
        throw new Error("STUB");
    }

    public handleThemeSource(event: React.FormEvent<HTMLInputElement>): void {
        throw new Error("STUB");
    }

    public render() {
      const { selectedTheme } = this.state;
      const { isUsingSystemTheme } = this.props.appState;
      const selectedName = selectedTheme?.name || 'Select a theme';

      return (
        <div className="settings-appearance">
          <h3>Appearance</h3>
          <Checkbox
            label="Sync theme with system setting"
            checked={isUsingSystemTheme}
            onChange={this.handleThemeSource}
          />
          <FormGroup
            label="Choose your theme"
            labelFor="open-theme-selector"
            disabled={isUsingSystemTheme}
            inline={true}
          >
            <ThemeSelect
              filterable={true}
              disabled={isUsingSystemTheme}
              items={this.state.themes}
              activeItem={selectedTheme}
              itemRenderer={renderItem}
              itemPredicate={filterItem}
              onItemSelect={this.handleChange}
              popoverProps={{
                onClosed: () => { throw new Error("STUB"); },
              }}
              noResults={<MenuItem disabled={true} text="No results." />}
            >
              <Button
                id="open-theme-selector"
                text={selectedName}
                icon="tint"
                onClick={() => { throw new Error("STUB"); }}
                disabled={isUsingSystemTheme}
              />
            </ThemeSelect>
          </FormGroup>
          <Callout hidden={isUsingSystemTheme}>
            <p>
              To add themes, add JSON theme files to{' '}
              <a id="open-theme-folder" onClick={this.openThemeFolder}>
                <code>{window.ElectronFiddle.themePath}</code>
              </a>
              . The easiest way to get started is to clone one of the two
              existing themes and to add your own colors.
            </p>
            <p>
              Additionally, if you wish to import a Monaco Editor theme, pick
              your JSON file and Fiddle will attempt to import it.
            </p>
            <Button
              onClick={this.createNewThemeFromCurrent}
              text="Create theme from current selection"
              icon="duplicate"
            />
            <Button
              icon="document-open"
              onClick={this.handleAddTheme}
              text="Add a Monaco Editor theme"
            />
          </Callout>
        </div>
      );
    }
  },
);

import * as React from 'react';

import { ButtonGroup } from '@blueprintjs/core';
import { observer } from 'mobx-react';

import { VersionSelect } from './version-select';
import { AppState } from '../state';

interface VersionChooserProps {
  appState: AppState;
}

/**
 * A dropdown allowing the selection of Electron versions. The actual
 * download is managed in the state.
 */
export const VersionChooser = observer((props: VersionChooserProps) => {
    throw new Error("STUB");
});

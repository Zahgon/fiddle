import * as React from 'react';

import {
  Classes,
  Dialog,
  Icon,
  NonIdealState,
  Spinner,
  Tag,
} from '@blueprintjs/core';
import { IReactionDisposer, reaction } from 'mobx';
import { observer } from 'mobx-react';

import { GistRevision } from 'src/interfaces';

import { AppState } from '../state';

interface HistoryProps {
  appState: AppState;
  isOpen: boolean;
  onClose: () => void;
  onRevisionSelect: (revisionId: string) => Promise<void>;
  activeRevision?: string;
}

interface HistoryState {
  isLoading: boolean;
  revisions: GistRevision[];
  error: string | null;
}

export const GistHistoryDialog = observer(
  class GistHistoryDialog extends React.Component<HistoryProps, HistoryState> {
    private disposeReaction: IReactionDisposer | null = null;

    constructor(props: HistoryProps) {
      super(props);
      this.state = {
        isLoading: true,
        revisions: [],
        error: null,
      };
    }

    public componentDidMount() {
        throw new Error("STUB");
    }

    public componentDidUpdate(prevProps: HistoryProps) {
        throw new Error("STUB");
    }

    public componentWillUnmount() {
        throw new Error("STUB");
    }

    private async loadRevisions(showLoading = true) {
      const { appState, isOpen } = this.props;
      const { remoteLoader } = window.app;

      if (!isOpen) return;

      if (!appState.gistId) {
        this.setState({ isLoading: false, error: 'No Gist ID available' });
        return;
      }

      if (showLoading) {
        this.setState({ isLoading: true, error: null });
      }

      try {
        const revisions = await remoteLoader.getGistRevisions(appState.gistId);

        const { activeGistRevision } = appState;
        if (
          activeGistRevision &&
          !revisions.some((r) => { throw new Error("STUB"); })
        ) {
          revisions.push({
            sha: activeGistRevision,
            date: new Date().toISOString(),
            title: `Revision ${revisions.length}`,
            changes: { additions: 0, deletions: 0, total: 0 },
          });
        }

        this.setState({ revisions, isLoading: false });
      } catch (error) {
        console.error('Failed to load gist revisions', error);
        this.setState({
          isLoading: false,
          error: 'Failed to load revision history',
        });
      }
    }

    private handleRevisionSelect = async (revision: GistRevision) => {
      try {
        await this.props.onRevisionSelect(revision.sha);
        this.props.onClose();
      } catch (error: any) {
        console.error('Failed to load revision', error);
        this.props.appState.showErrorDialog(
          `Failed to load revision: ${error.message || 'Unknown error'}`,
        );
        this.props.onClose();
      }
    };

    private renderChangeStats(changes: GistRevision['changes']) {
      return (
        <div className="revision-changes">
          <Tag intent="success" minimal>
            +{changes.additions}
          </Tag>
          <Tag intent="danger" minimal>
            -{changes.deletions}
          </Tag>
          <Tag minimal>{changes.total} total</Tag>
        </div>
      );
    }

    private renderRevisionItem = (revision: GistRevision) => {
        throw new Error("STUB");
    };

    private renderContent() {
      const { isLoading, revisions, error } = this.state;

      if (isLoading) {
        return (
          <div className="history-loading">
            <Spinner />
            <p>Loading revision history...</p>
          </div>
        );
      }

      if (error) {
        return (
          <NonIdealState
            icon="error"
            title="Error Loading History"
            description={error}
          />
        );
      }

      if (revisions.length === 0) {
        return (
          <NonIdealState
            icon="history"
            title="No Revision History"
            description="This Gist doesn't have any revisions"
          />
        );
      }

      return (
        <div className="revision-list">
          <ul>{[...revisions].reverse().map(this.renderRevisionItem)}</ul>
        </div>
      );
    }

    public render() {
      const { isOpen, onClose } = this.props;

      return (
        <Dialog
          isOpen={isOpen}
          onClose={onClose}
          title="Revision History"
          className="gist-history-dialog"
          icon="history"
        >
          <div className={Classes.DIALOG_BODY}>{this.renderContent()}</div>
        </Dialog>
      );
    }
  },
);

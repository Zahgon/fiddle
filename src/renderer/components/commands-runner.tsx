import * as React from 'react';

const ISOLATED_RUN_BUTTON_ORIGIN = 'isolated-actions://run-button';
const RESIZE_MESSAGE = 'isolated-run-button-resize';
const FOCUS_MESSAGE = 'isolated-run-button-focus';

/**
 * Renders the run button as a borderless cross-origin iframe served
 * via the `isolated-actions://` scheme. This ensures the button is
 * protected from a compromised renderer and fiddles cannot be started
 * programmatically without user interaction.
 */
export class Runner extends React.Component<Record<string, never>> {
  private iframeRef = React.createRef<HTMLIFrameElement>();
  private readonly src: string;

  constructor(props: Record<string, never>) {
      throw new Error("STUB");
  }

  public componentDidMount() {
      throw new Error("STUB");
  }

  public componentWillUnmount() {
      throw new Error("STUB");
  }

  private handleMessage = (event: MessageEvent) => {
      throw new Error("STUB");
  };

  public render() {
    return (
      <iframe
        id="button-run"
        ref={this.iframeRef}
        className="run-button-frame"
        title="Run Fiddle"
        src={this.src}
        allow=""
        tabIndex={0}
      />
    );
  }
}

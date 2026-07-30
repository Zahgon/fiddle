import * as monaco from 'monaco-editor';
import * as prettierPluginBabel from 'prettier/plugins/babel';
import * as prettierPluginESTree from 'prettier/plugins/estree';
import * as prettierPluginHTML from 'prettier/plugins/html';
import * as prettierPluginCSS from 'prettier/plugins/postcss';
import * as prettier from 'prettier/standalone';

import { App } from './app';
import { initSentry } from './sentry';

initSentry();

// Register Prettier as the formatter for all Monaco.
monaco.languages.registerDocumentFormattingEditProvider('javascript', {
  provideDocumentFormattingEdits: async (model) => {
        throw new Error("STUB");
    },
});

monaco.languages.registerDocumentRangeFormattingEditProvider('javascript', {
  provideDocumentRangeFormattingEdits: async (model, range) => {
        throw new Error("STUB");
    },
});

monaco.languages.registerDocumentFormattingEditProvider('html', {
  provideDocumentFormattingEdits: async (model) => {
        throw new Error("STUB");
    },
});

monaco.languages.registerDocumentRangeFormattingEditProvider('html', {
  provideDocumentRangeFormattingEdits: async (model, range) => {
        throw new Error("STUB");
    },
});

monaco.languages.registerDocumentFormattingEditProvider('css', {
  provideDocumentFormattingEdits: async (model) => {
        throw new Error("STUB");
    },
});

monaco.languages.registerDocumentRangeFormattingEditProvider('css', {
  provideDocumentRangeFormattingEdits: async (model, range) => {
        throw new Error("STUB");
    },
});

window.monaco = monaco;
window.app = new App();
window.app.setup();

import React, { useEffect } from 'react';
import { Editor, loader } from '@monaco-editor/react';

const CodeEditor = ({ onCodeChange }: any) => {
  function handleEditorChange(value, event) {
    console.log('here is the current model value:', value);
    if (onCodeChange) {
      onCodeChange(value); // Call the passed callback function with the current code value
    }
  }

  // Function to define Clarity language
  const defineClarityLanguage = (monaco) => {
    monaco.languages.register({ id: 'clarity' });

    monaco.languages.setMonarchTokensProvider('clarity', {
      tokenizer: {
        root: [
          // Comments
          [/(;;.*$)/, 'comment'],

          // Strings
          [/"/, { token: 'string.quote', bracket: '@open', next: '@string' }],

          // Keywords
          [
            /\b(define-data-var|define-public|define-private|define-read-only|define-constant|begin|let|if|map-set|map-get\?|and|or|not|is-eq|unwrap-panic|unwrap-err-panic|unwrap-err!|unwrap!|asserts!|try!|ok|err)\b/,
            'keyword'
          ],

          // Numbers - Clarity supports both signed and unsigned integers
          [/\bu?[0-9]+/, 'number'],

          // Brackets and Parentheses
          [/[{}()[\]]/, '@brackets'],

          // Operators
          [/[=<>!+\-*/%]/, 'operator']
        ],

        string: [
          [/[^"]+/, 'string'],
          [/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
        ]
      }
    });
  };

  useEffect(() => {
    loader.init().then((monaco) => {
      defineClarityLanguage(monaco);
    });
  }, []);

  return (
    <Editor
      height="50vh"
      theme="vs-dark"
      defaultLanguage="clarity" // Set to use the custom Clarity language
      defaultValue="(define-data-var count int 0)
(define-public (add-number (number int))
    (let
        (
            (current-count count)
        )

        (var-set count (+ 1 number))
        (ok (var-get count))
    )
)"
      onChange={handleEditorChange}
    />
  );
};

export default CodeEditor;

import * as monaco from 'monaco-editor';

const completionProvider =  {
    provideCompletionItems: (model, position) => {
        const prefix = model.getValueInRange({
            startLineNumber: position.lineNumber,
            startColumn: 1,
            endLineNumber: position.lineNumber,
            endColumn: position.column,
        });

        const allInstructions = ['mov', 'add', 'cmp', 'beq'];

        const allConstants = Array.from(Array(0xFFFF + 1).keys()).map((i) =>
            i.toString(16).toUpperCase()
        );
        const allCompletions = [...new Set([...allInstructions, ...allConstants])];
        const completions = allCompletions.filter((c) => c.startsWith(prefix));

        return {
            suggestions: completions.map((c) => {
                return {
                    label: c,
                    kind: monaco.languages.CompletionItemKind.Text,
                    insertText: c,
                    range: new monaco.Range(
                        position.lineNumber,
                        position.column - prefix.length,
                        position.lineNumber,
                        position.column
                    ),
                };
            }),
        };
    },
};

export default completionProvider;
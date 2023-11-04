const tokenProvider = {
    // The entry state.
    tokenizer: {
        root: [
          [/\.\w+\s+[0-9]+/, 'constant.character.decimal.assembly'],
          [/\.\w+\s+[\w.]+/, 'variable.language.assembly'],
          [/\.data/, 'variable.language.assembly'],
          [/\.code/, 'variable.language.assembly'],
          [/;.*/, 'comment.assembly'],
          [/\b[\w.]+\s*:/, 'entity.name.function.assembly'],
          [/\b(?:add|beq|cmp|dw|mov)\b/i, 'keyword.control.assembly'],
          [/\b(?:result|var1|var2)\b/i, 'variable.parameter.register.assembly'],
          [/\b[0-9]+\b/, 'constant.character.decimal.assembly'],
          [/\b0x[A-F0-9]+\b/i, 'constant.character.hexadecimal.assembly'],
          [/"([^\\"]|\\.)*"/, 'string.assembly'],
        ] as [RegExp, string][],
      },
};

export default tokenProvider;
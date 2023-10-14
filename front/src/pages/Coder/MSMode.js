/*
	Don't look at this :( It's a mess. I just like the result, but there is no way to make it work with typescript at this time.
*/

import 'brace/mode/java';

export class CustomHighlightRules extends window.ace.acequire("ace/mode/text_highlight_rules").TextHighlightRules {
	constructor() {
		super();

		this.$rules = {
			"start": [
				{ token: 'constant.character.decimal.assembly', regex: '\\.ver\\s+[0-9]+' },

				// .fin lblname
				{ token: 'variable.language.assembly', regex: '\\.fin\\s+[\\w.]+' },

				// .data
				{ token: 'variable.language.assembly', regex: '\\.data' },

				// .code
				{ token: 'variable.language.assembly', regex: '\\.code' },

				// ; Comments
				{ token: 'comment.assembly', regex: ';.*$' },

				// Labels (e.g., bucle:)
				{ token: 'entity.name.function.assembly', regex: '\\b[\\w.]+\\s*:' },

				// Instructions
				{ token: 'keyword.control.assembly', regex: '\\b(?:add|beq|cmp|dw|mov)\\b', caseInsensitive: true },

				// Registers (e.g., result, var1, var2)
				{ token: 'variable.parameter.register.assembly', regex: '\\b(?:result|var1|var2)\\b', caseInsensitive: true },

				// Numbers (e.g., 166, 0x22)
				{ token: 'constant.character.decimal.assembly', regex: '\\b[0-9]+\\b' },
				{ token: 'constant.character.hexadecimal.assembly', regex: '\\b0x[A-F0-9]+\\b', caseInsensitive: true },

				// Strings (e.g., "esto es un comentario")
				{ token: 'string.assembly', regex: /"([^\\"]|\\.)*"/ },
			],
		};
	}
}

export default class MSMode extends window.ace.acequire('ace/mode/java').Mode {
	constructor() {
		super();
		this.HighlightRules = CustomHighlightRules;
	}
}
import * as React from "react";
import "./Code.css";
import hljs from "highlight.js/lib/core";
import "highlight.js/styles/monokai-sublime.css";
import Preview from "./Preview";

hljs.registerLanguage("ms", (e) => {
  return {
    case_insensitive: true,
    keywords: {
      keyword:
        'add beq cmp dw mov',
      built_in:
        'longitud aux1 aux2 aux3 dato0 dato1 dato2 dato3 dato4 dato5 dato6 dato7 dato8 out0 out1 out2 out3 out4 out5 out6 out7 out8',
      literal:
        'lblend'
    },
    contains: [
      hljs.COMMENT(';', '$', {
        relevance: 0
      }),
      {
        className: 'number',
        begin: '\\b\\d+\\b', // Decimales
        relevance: 0
      },
      {
        className: 'number',
        begin: '\\b0x[a-fA-F0-9]+\\b', // Hexadecimales
        relevance: 0
      },
      {
        className: 'label',
        begin: '^\\s*[a-zA-Z_][a-zA-Z0-9_]*:',
        relevance: 0
      },
      {
        className: 'meta',
        begin: '\\.\\w+',
        relevance: 0
      }
    ]
  };
});

export default function Code({
  code,
  testCodeText,
  previewText,
  previewVideoSrc,
  bgColor,
  ref,
}: {
  code: string;
  testCodeText?: string;
  previewText?: string;
  previewVideoSrc?: string;
  bgColor?: string;
  ref?: React.Ref<HTMLPreElement>;
}) {
  const colored = hljs.highlight(code, { language: "ms" }).value;

  const openCode = (code: string) => {
    // open new url in new tab
    const url = new URL("https://ms.nullx.me");
    url.searchParams.set("code", code);
    window.open(url.href, "_blank");
  };

  return (
    <pre
      className="shiki github-dark"
      style={{ backgroundColor: bgColor ?? "#0d1117", color: "#c9d1d9", overflow: 'scroll' }}
      ref={ref}
    >
      <div className="run-code">
        {testCodeText && (
          <button onClick={() => openCode(code)}>{testCodeText}</button>
        )}
        {previewText && previewVideoSrc && (
          <Preview previewText={previewText} videoSrc={previewVideoSrc} title={code} />
        )}
      </div>

      <div className="code-container">
        <code dangerouslySetInnerHTML={{ __html: colored }} />
      </div>
    </pre>
  );
}

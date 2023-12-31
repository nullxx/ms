import React from "react";

import _CodeMirror from "@uiw/react-codemirror";

const CodeMirror = Object.hasOwnProperty.call(_CodeMirror, "default") ? (_CodeMirror as any).default : _CodeMirror;

export default function CodeEditor({
  code,
  onChange,
}: {
  code: string;
  onChange: (value: any, viewUpdate: any) => void;
}) {
  return (
    <CodeMirror
      value={code}
      height="35rem"
      style={{ width: "100%", overflow: "scroll" }}
      theme="dark"
      onChange={onChange}
    />
  );
}

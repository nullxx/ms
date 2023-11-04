// import AceEditor from "react-ace";
import Editor from '@monaco-editor/react';

interface TranslatedEditorProps {
  traslated: string;
  initOffset: number;
  width?: string;
  height?: string;
}

export default function TranslatedEditor({
  traslated,
  initOffset,
  width = "unset",
  height = "200px",
}: TranslatedEditorProps) {
  return (
    <Editor
      height={height}
      width={width}
      defaultLanguage="text"
      defaultValue={traslated}
      value={traslated}
      options={{
        readOnly: true,
        fontSize: 14,
        minimap: {
          enabled: false,
        },
      }}
    />
  );
}

import AceEditor from "react-ace";
import "brace/ext/language_tools"; // after import react-ace
import MSMode from "../MSMode";
import completer from "../Completer";

import React, { useEffect } from "react";
import { CompiledBitLine, parseInput } from '../../../lib/traslator';
import type { Data, Fin } from '../../../lib/traslator';
import NumberBaseInput from "../../../components/NumberBaseInput";
import { getCore } from "../../../lib/core/index";
import { Button, Popover, Space, Collapse } from "antd";
import Examples from "./Examples";
import { setStoredValue, getStoredValue } from "../../../lib/storage";
import { Text } from "atomize";
import { useTextFile } from "../../../lib/utils";
import toast from "react-hot-toast";
import TranslatedEditor from "./TranslatedEditor";
import { Annotation } from "brace";
import { loc } from "../../../lib/i18n";
import I18n, { useI18n } from "../../../components/i18n";

const { Panel } = Collapse;

let runningVariables: Data[] = [];
let fin: Fin | null = null;

export function getRunningVariables() {
  return runningVariables;
}

export function getFin() {
  return fin;
}

export default function CodeEditor({
  onNewTranslation,
  onNewOffset,
  initialCode,
  maximized = false,
}: {
  onNewTranslation: (lines: string[] | null) => void;
  onNewOffset: (offset: number) => void;
  initialCode?: string;
  maximized?: boolean;
}) {

  let initCode = getStoredValue("code", "");
  if (initialCode && initialCode.length > 0) {
    initCode = initialCode;
  }
  const [code, setCode] = React.useState<string>(
    initCode
  );
  const [traslated, setTraslated] = React.useState("");
  const [initOffset, setInitOffset] = React.useState(0);
  const [offsetValid, setOffsetValid] = React.useState<boolean>(true);
  const [annotations, setAnnotations] = React.useState<Annotation[]>([]);

  const aceEditorRef = React.createRef<AceEditor>();

  const { downloadFile, openFile } = useTextFile();

  useEffect(() => {
    setStoredValue("code", code);

    setTraslated("");
    
    const res = parseInput(code, 0); // FIXME Let the user choose the offset

    const maxAddress = res.bits.reduce((acc: number, r: CompiledBitLine) => {
      return Math.max(acc, r.address);
    }, 0);

    const bitArr = new Array(maxAddress + 1).fill("");
    bitArr.forEach((r, i) => {
      const bit = res.bits.find((b) => b.address === i);
      bitArr[i] = bit ? bit.bits : "".padStart(16, "0");
    });

    const str = bitArr.join("\n");
    if (res.errors.length === 0) {
      setTraslated(str);
    }

    const _annotations = [
      ...res.bits.map((r) => ({
        row: r.sourceCodeLine!,
        column: 0,
        type: "info",
        text: `${r.bits.slice(0, 2)} ${r.bits.slice(2, 9)} ${r.bits.slice(9, 16)}`
      })),
    ];

    if (res.errors.length > 0) {
      _annotations.push(...res.errors.map((r) => ({
        row: r.line,
        column: 0,
        type: "error",
        text: r.message,
      })));
    }

    if (res.variables.length > 0) {
      _annotations.push(...res.variables.map((r) => ({
        row: r.sourceCodeLine!,
        column: 0,
        type: "info",
        text: `'${r.name}' address: 0x${r.address.toString(16).toUpperCase()}`,
      })));

      runningVariables = res.variables;
    }

    fin = res.fin;

    setAnnotations(_annotations);

    onNewTranslation(
      res.errors.length > 0 || str.length === 0 ? null : str.split("\n")
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  useEffect(() => {
    if (!aceEditorRef.current) return;
    aceEditorRef.current.editor.getSession().setMode(new MSMode() as any);
    aceEditorRef.current.editor.completers = [completer];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (!aceEditorRef.current) return;

      // every render, we resize the editor to fit the content
      aceEditorRef.current.editor.resize();
    }, 300); // wait for the drawer to expand
  });

  function onChange(newValue: string) {
    setCode(newValue);
  }

  function onChangeInitOffset(newValue: number) {
    const maxOffset = getCore().get_memory_size() - 1;
    let offsetValid = true;

    if (newValue < 0 || newValue > maxOffset) {
      offsetValid = false;
    }

    setOffsetValid(offsetValid);
    setInitOffset(newValue);

    if (offsetValid) onNewOffset(newValue);
  }

  function handlePCChange() {
    getCore().set_register_pc(initOffset);
  }

  function handleSelectExample(code: string) {
    setCode(code);
  }

  function handleDownloadCode() {
    toast.success(`${loc('downloadingCode')}...`)

    // to avoid clousure
    setCode((code) => {
      downloadFile("codeMS.s", code);
      return code;
    });
  }

  async function handleOpenCode() {
    const { content, file } = await openFile();
    setCode(content);
    toast.success("Code loaded from " + file.name);
  }

  // Render editor
  return (
    <>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Space align="center" direction="horizontal">
          <NumberBaseInput
            initialBase="HEX"
            number={initOffset}
            onChange={onChangeInitOffset}
            width={200}
            disabled
            isError={!offsetValid}
          />

          <Popover
            placement="topLeft"
            title={`${useI18n('pcSetted.title')} ${initOffset}`}
            content={`${useI18n('pcSetted.description')}`}
            trigger="click"
          >
            <Button
              type="primary"
              onClick={handlePCChange}
              disabled={!offsetValid}
            >
              <I18n k="setPCTo" />{initOffset}
            </Button>
          </Popover>
        </Space>

        <Space direction="vertical" style={{ width: "100%" }}>
          <Collapse bordered={false}>
            <Panel header={<I18n k="howToUseLabels.title" />} key="1">
              <Text>- <I18n k="howToUseLabels.description.1" />:</Text>

              <pre className="code">
                <span className="eti-marker-color">start:</span> CMP 0x7, 0x7
              </pre>
              <Text>- <I18n k="howToUseLabels.description.2" />:</Text>
              <pre className="code">BEQ start</pre>
            </Panel>
          </Collapse>
        </Space>

        <Space direction="vertical" style={{ width: "100%" }}>
          <AceEditor
            onChange={onChange}
            value={code}
            name="code"
            editorProps={{ $blockScrolling: false }}
            ref={aceEditorRef}
            setOptions={{
              showLineNumbers: true,
              firstLineNumber: 0,
              fontSize: `${maximized ? "24" : "14"}px`,
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
            }}
            height={maximized ? "50vh" : "200px"}
            width="unset"
            mode="text"
            annotations={annotations}
            commands={[
              {
                name: "save",
                bindKey: { win: "Ctrl-S", mac: "Cmd-S" },
                exec: handleDownloadCode,
              },
              {
                name: "open",
                bindKey: { win: "Ctrl-O", mac: "Cmd-O" },
                exec: handleOpenCode,
              },
            ]}
          />

          {!maximized && (
            <TranslatedEditor initOffset={initOffset} traslated={traslated} />
          )}
        </Space>
        <Collapse bordered={false}>
          <Panel header={<I18n k="words.examples" />} key="1">
            <Examples onSelect={handleSelectExample} />
          </Panel>
        </Collapse>
      </Space>
    </>
  );
}

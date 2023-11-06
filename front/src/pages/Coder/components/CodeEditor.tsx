// import AceEditor from "react-ace";
// import "brace/ext/language_tools"; // after import react-ace
// // import MSMode from "../MSMode";
// import completer from "../Completer";

import React, { useEffect } from "react";
import Editor, { useMonaco } from '@monaco-editor/react';
import * as mc from 'monaco-editor';
import { CompiledBitLine, parseInput } from '../../../lib/traslator';
import type { Data, Fin, Instruction } from '../../../lib/traslator';
import NumberBaseInput from "../../../components/NumberBaseInput";
import { getCore } from "../../../lib/core/index";
import { Button, Popover, Space, Collapse } from "antd";
import Examples from "./Examples";
import { setStoredValue, getStoredValue } from "../../../lib/storage";
import { Text } from "atomize";
import { useTextFile } from "../../../lib/utils";
import toast from "react-hot-toast";
import TranslatedEditor from "./TranslatedEditor";
import { loc } from "../../../lib/i18n";
import I18n, { useI18n } from "../../../components/i18n";
import TokenProvider from "../TokenProvider";
import CompletionProvider from "../CompletionProvider";
import usePrev from "../../../hook/usePrev";

const { Panel } = Collapse;

let runningVariables: Data[] = [];
let fin: Fin | null = null;
let breakpoints: number[] = [];

export function getRunningVariables() {
  return runningVariables;
}

export function getFin() {
  return fin;
}

export function getBreakpoints() {
  return breakpoints;
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
  const [editor, setEditor] = React.useState<mc.editor.IStandaloneCodeEditor>();
  const [instructions, setInstructions] = React.useState<Instruction[]>([]);
  // const aceEditorRef = React.createRef<AceEditor>();

  const decorators = React.useRef<{ line: number; id: string; type: 'error' | 'breakpoint', originalId: string, address: number }[]>([]);

  const { downloadFile, openFile } = useTextFile();
  const monaco = useMonaco();

  const prevTraslated = usePrev(traslated);

  const traslatedHasChanged = prevTraslated !== traslated;

  function getInstructions() {
    let _instructions = instructions;
    setInstructions((instructions) => {
      _instructions = instructions;
      return instructions;
    });

    return _instructions;
  }

  function addDeltaDecorator(decorator: { line: number; id: string; type: 'error' | 'breakpoint', address: number, gyrphMarginClassName?: string, hoverMessage?: string, className?: string }) {
    const allDecorators = editor?.getModel()?.getAllDecorations() ?? [];
    const decoratorExists = allDecorators.find((d) => d.id === decorator.id);
    if (decoratorExists) {
      return;
    }

    // add the decorator
    const r = editor?.getModel()?.deltaDecorations([], [{
      range: {
        startLineNumber: decorator.line, endLineNumber: decorator.line,
        startColumn: 1,
        endColumn: 1
      }, options: {
        isWholeLine: true,
        glyphMarginClassName: decorator.gyrphMarginClassName ?? decorator.type,
        ...(decorator.hoverMessage ? { hoverMessage: { value: decorator.hoverMessage } } : {}),
        ...{ className: decorator.className } ?? {},
      },
    }]);
    if (!r) return;

    decorators.current.push({
      ...decorator,
      originalId: decorator.id,
      id: r[0],
    });
  }

  function removeDeltaDecorator(decorator: { line: number; id: string; type: 'error' | 'breakpoint' }) {
    const allDecorators = editor?.getModel()?.getAllDecorations() ?? [];
    const decoratorExists = allDecorators.find((d) => d.id === decorator.id);
    if (!decoratorExists) {
      return;
    }

    // remove the decorator
    editor?.getModel()?.deltaDecorations([decorator.id], []);

    decorators.current = decorators.current.filter((d) => d.id !== decorator.id);
  }

  useEffect(() => {
    if (!editor) return;
    monaco?.languages.register({ id: 'ms' });
    monaco?.languages.setMonarchTokensProvider('ms', TokenProvider);
    monaco?.languages.registerCompletionItemProvider('ms', CompletionProvider);

    // break point

    const disposable = editor?.onMouseDown((e) => {
      const target = e.target;
      if (target.type !== mc.editor.MouseTargetType.GUTTER_GLYPH_MARGIN) {
        return;
      }

      const line = target.position?.lineNumber;
      if (!line) {
        return;
      }

      const canLineBreak = getInstructions().find((i) => i.sourceCodeLine + 1 === line);
      if (!canLineBreak) {
        toast.error(loc('cannotSetBreakpoint'));
        return;
      }

      const model = editor?.getModel();
      const allBreakpoints = model?.getAllDecorations().filter((d) => d.options.isWholeLine && d.options.glyphMarginClassName === 'breakpoint');
      const breakpoint = allBreakpoints?.find((b: any) => b.range.startLineNumber === line);

      if (breakpoint) {
        // decorators.current = (model?.deltaDecorations([breakpoint.id], [])) ?? [] as string[];
        removeDeltaDecorator({ line, id: breakpoint.id, type: 'breakpoint' });
        // setStoredValue("breakpoints", decorators.current.filter(d => d.type === 'breakpoint').map((d) => d.address).sort());
        breakpoints = decorators.current.filter(d => d.type === 'breakpoint').map((d) => d.address).sort();
      } else {
        addDeltaDecorator({ line, id: `breakpoint-${line}`, type: 'breakpoint', gyrphMarginClassName: 'breakpoint', className: 'breakpoint', address: canLineBreak.address });
        // setStoredValue("breakpoints", decorators.current.filter(d => d.type === 'breakpoint').map((d) => d.address).sort());
        breakpoints = decorators.current.filter(d => d.type === 'breakpoint').map((d) => d.address).sort();
      }
    });

    // on save
    const disposable2 = editor?.onKeyDown((e) => {
      if ((e.ctrlKey && e.code === 'KeyS') || (e.metaKey && e.code === 'KeyS')) {
        e.preventDefault();
        handleDownloadCode();
      }
    });
    
    // on open
    const disposable3 = editor?.onKeyDown((e) => {
      if ((e.ctrlKey && e.code === 'KeyO') || (e.metaKey && e.code === 'KeyO')) {
        e.preventDefault();
        handleOpenCode();
      }
    });

    return () => {
      disposable?.dispose();
      disposable2?.dispose();
      disposable3?.dispose();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  useEffect(() => {
    if (traslatedHasChanged) {
      decorators.current.filter(d => d.type === 'breakpoint').forEach((d) => {
        removeDeltaDecorator(d);
      });
    }

    setStoredValue("code", code);
    setTraslated("");

    const res = parseInput(code, 0); // FIXME Let the user choose the offset

    setInstructions(res.instructions);
    decorators.current.filter((d) => d.type === 'breakpoint').forEach((d) => {
      // remove the decorator that are not in the new code
      const canLineBreak = res.instructions.find((i) => i.sourceCodeLine + 1 === d.line);
      if (!canLineBreak) {
        removeDeltaDecorator(d);
      }
    });
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

    // const _annotations = [
    //   ...res.bits.map((r) => ({
    //     row: r.sourceCodeLine!,
    //     column: 0,
    //     type: "info",
    //     text: `${r.bits.slice(0, 2)} ${r.bits.slice(2, 9)} ${r.bits.slice(9, 16)}`
    //   })),
    // ];

    decorators.current.filter((d) => d.type === 'error').forEach((d) => {
      removeDeltaDecorator(d);
    });
    if (res.errors.length > 0) {
      res.errors.forEach((err) => {
        addDeltaDecorator({ line: err.line + 1, id: `error-${err.line + 1}`, type: 'error', className: 'line-error', gyrphMarginClassName: 'margin-error', hoverMessage: err.message, address: -1 });
      });
      // prevErrorDecorators.current = (editor?.getModel()?.deltaDecorations(prevErrorDecorators.current, res.errors.map((err) => ({
      //   range: {
      //     startLineNumber: err.line + 1,
      //     endLineNumber: err.line + 1,
      //     startColumn: 1,
      //     endColumn: 1,
      //   },
      //   options: {
      //     className: 'line-error',
      //     isWholeLine: true,
      //     glyphMarginClassName: 'margin-error',
      //     hoverMessage: { value: err.message },
      //   }
      // })) ?? []) as string[]);
    }

    if (res.variables.length > 0) {
      // _annotations.push(...res.variables.map((r) => ({
      //   row: r.sourceCodeLine!,
      //   column: 0,
      //   type: "info",
      //   text: `'${r.name}' address: 0x${r.address.toString(16).toUpperCase()}`,
      // })));

      runningVariables = res.variables;
    }

    fin = res.fin;


    onNewTranslation(
      res.errors.length > 0 || str.length === 0 ? null : str.split("\n")
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, editor]);

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
          <Editor
            height={maximized ? "50vh" : "200px"}
            // defaultLanguage="javascript" 
            language="ms"
            defaultLanguage="ms"
            defaultValue="; :)"
            value={code}
            onChange={(value, event) => onChange(value ?? '')}
            options={{
              fontSize: maximized ? 24 : 14,
              minimap: {
                enabled: false,
              },
              glyphMargin: true,
            }}

            onMount={(editor, monaco) => {
              setEditor(editor);
            }}
          />
          {/* <AceEditor
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
              showGutter: true,
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
          /> */}

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

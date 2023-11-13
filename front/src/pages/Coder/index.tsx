import React, { useState } from "react";
import { Space, Popconfirm, Modal } from "antd";
import CodeEditor from "./components/CodeEditor";
import { getCore } from "../../lib/core";
import IconButton from "../../components/IconButton";
import { CodeOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons";
import ResizeDrawer from "./components/ResizeDrawer";
import { useEffect } from "react";
import I18n, { useI18n } from "../../components/i18n";
import { doHeavyWork } from "../../lib/utils";


const Coder: React.FC = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const initialCode = searchParams.get("code") || "";

  const [visible, setVisible] = useState(Boolean(initialCode));
  const [canSaveToMem, setCanSaveToMem] = useState(false);
  const [initOffset, setInitOffset] = useState(0);
  const [slots, setSlots] = useState<string[]>([]);
  const [maximize, setMaximize] = useState(false);
  const [isSavingToMem, setIsSavingToMem] = useState(false);

  const modalStyles = {
    mask: {
      backdropFilter: 'blur(10px)',
    },
  };

  const showDefaultDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const handleSaveToMemory = async () => {
    setIsSavingToMem(true);
    await doHeavyWork(() => {
      getCore().reset_control(); // reset the control to start from the beginning

      for (let i = 0; i < slots.length; i++) {
        const slot = slots[i];
        getCore().set_memory_value(initOffset + i, parseInt(slot, 2));
      }
    });

    setIsSavingToMem(false);
    onClose();
  };

  const onNewTranslation = (lines: string[] | null) => {
    setCanSaveToMem(lines !== null);
    if (lines) {
      setSlots(lines);
    }
  };

  const onNewOffset = (offset: number) => {
    setInitOffset(offset);
  };

  useEffect(() => {
    const maxOffset = getCore().get_memory_size() - 1;
    const s = initOffset + slots.length - 1 <= maxOffset;
    setCanSaveToMem(s);
  }, [slots, initOffset]);

  const handleResize = setMaximize;

  return (
    <>
      <Space className="onboarding-editor">
        <IconButton
          title={useI18n("openEditor")}
          icon={<CodeOutlined />}
          onClick={showDefaultDrawer}
        />
      </Space>

      <Modal
        title={
          <Space align="center">
            <span>Code</span>
            <ResizeDrawer onResize={handleResize} />
          </Space>
        }
        open={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        footer={
          <Space>
            <Popconfirm
              title={<I18n k="areYouSure" />}
              okText={<I18n k="words.yes" />}
              cancelText={<I18n k="words.no" />}
              onConfirm={onClose}
            >
              <IconButton icon={<CloseOutlined />} danger title={useI18n('words.cancel')} />
            </Popconfirm>
            <IconButton
              icon={<SaveOutlined />}
              type="primary"
              onClick={handleSaveToMemory}
              disabled={!canSaveToMem || isSavingToMem}
              title={useI18n('words.save')}
              loading={isSavingToMem}
            />
          </Space>
        }
        // classNames={classNames}
        closable={false}
        keyboard={false}
        maskClosable={false}
        closeIcon={null}
        width={maximize ? "95%" : undefined}
        styles={{
          mask: modalStyles.mask,
        }}
        centered

      >
        <CodeEditor
          onNewTranslation={onNewTranslation}
          onNewOffset={onNewOffset}
          initialCode={initialCode}
          maximized={maximize}
        />
      </Modal>
    </>
  );
};

export default Coder;

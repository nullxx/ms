import React, { memo } from "react";
import { Text, Row, Col } from "atomize";
import NumberBaseInput from "../../../components/NumberBaseInput";
import {
  execute,
  subscribeToUIUpdates,
  unsubscribeToUIUpdates,
} from "../../../lib/core/index";
import { Tooltip } from "antd";
import useUpdateEdges from "../../../hook/useUpdateEdges";
import Handles from "./Handles";
import I18n from "../../../components/i18n";

export const DEFAULT_REGISTER_VALUE = 0;

export default memo(({ data, id }: any) => {
  const [value, setValue] = React.useState(DEFAULT_REGISTER_VALUE);
  const [changed, setChanged] = React.useState(false);

  const [controlBusBitLoad] = useUpdateEdges({ data, id });

  function onUIUpdate() {
    if (!data.getFunction)
      return console.warn(
        `Not updating ${data.label}. Missing data.getFunction`
      );

    const out = execute(data.getFunction);

    setValue((prevValue) => {
      let hasChanged = false;
      if (prevValue !== out) {
        hasChanged = true;
      }
      setChanged(hasChanged);
      return out;
    });
  }

  React.useEffect(() => {
    subscribeToUIUpdates(onUIUpdate);
    return () => {
      unsubscribeToUIUpdates(onUIUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={`${changed ? "blob" : ""} pretty-shadow`}
      style={{ padding: 6, backgroundColor: "#f5f5f5", position: 'relative' }}
    >
      <Handles data={data} id={id} />

      {controlBusBitLoad && <div style={{ height: 10, position: 'absolute', top: -37, left: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <svg style={{ fill: controlBusBitLoad.value ? 'red' : 'black' }} xmlns="http://www.w3.org/2000/svg" height={30} viewBox="0 0 32 32"><path d="M26.29 20.29 18 28.59V0h-2v28.59l-8.29-8.3-1.42 1.42 10 10a1 1 0 0 0 1.41 0l10-10z" data-name="2-Arrow Down" /></svg>
          <p style={{ height: '100%' }}>
            {controlBusBitLoad.name}: {controlBusBitLoad.value}
          </p>
        </div>
      </div>
      }

      <Row>
        <Col>
          <Tooltip
            className={`${data.helpInfoKey || data.docLink ? "tooltip" : ""}`}
            overlay={
              (data.helpInfoKey || data.docLink) && (
                <>
                  <I18n k={data.helpInfoKey} />{" "}
                  {data.docLink && (
                    <a href={data.docLink} target="_blank" rel="noreferrer">
                      <I18n k="checkDocs" />
                    </a>
                  )}
                </>
              )
            }
          >
            <Text tag="p" textSize="display5">
              <I18n k={data.labelKey} />
            </Text>
          </Tooltip>
        </Col>
      </Row>
      <Row>
        <Col>
          <NumberBaseInput
            initialBase="HEX"
            number={value}
            width={153}
            readOnly
          />
        </Col>
      </Row>
    </div>
  );
});

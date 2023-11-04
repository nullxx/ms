import React, { memo } from "react";
import { Text, Row, Col } from "atomize";
import {
  execute,
  subscribeToUIUpdates,
  unsubscribeToUIUpdates,
} from "../../../lib/core/index";
import { Input, Tooltip } from "antd";
import useUpdateEdges from "../../../hook/useUpdateEdges";
import Handles from "./Handles";
import I18n from "../../../components/i18n";

export const DEFAULT_REGISTER_VALUE = 0;

export default memo(({ data, id }: any) => {
  const [value, setValue] = React.useState(DEFAULT_REGISTER_VALUE);
  const [changed, setChanged] = React.useState(false);

  useUpdateEdges({ data, id });

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

  const co = (value & 0b1100000000000000) >> 14;
  const src = (value & 0b0011111110000000) >> 7;
  const dest = value & 0b0000000001111111;

  return (
    <div
      className={`${changed ? "blob" : ""} pretty-shadow`}
      style={{ padding: 6, backgroundColor: "#f5f5f5" }}
    >
      <Handles data={data} id={id} />

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
          <Input
            style={{ width: 130 }}
            value={co}
            readOnly={data.readOnly}
            addonBefore={<>CO<sub>16</sub></>}
          />
          <Input
            style={{ width: 130 }}
            value={src}
            readOnly={data.readOnly}
            addonBefore={<>SRC<sub>16</sub></>}
          />
          <Input
            style={{ width: 130 }}
            value={dest}
            readOnly={data.readOnly}
            addonBefore={<>DST<sub>16</sub></>}
          />

        </Col>
      </Row>
    </div>
  );
});

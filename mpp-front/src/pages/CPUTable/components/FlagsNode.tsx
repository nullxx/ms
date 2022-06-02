import { Checkbox } from "antd";
import { Row, Col, Text } from "atomize";
import { useEffect, useState } from "react";
import {
  execute,
  subscribeToUIUpdates,
  unsubscribeToUIUpdates,
} from "../../../lib/core";

export default function FlagsNode({ data }: { data: any }) {
  const [fz, setFz] = useState(false);
  const [fc, setFc] = useState(false);
  const [changed, setChanged] = useState(false);

  function onUIUpdate() {
    const fz = Boolean(execute<number>("get_register_fz"));
    const fc = Boolean(execute<number>("get_register_fc"));

    let hasChanged = false;
    setFz((prevFz) => {
      if (prevFz !== fz) {
        hasChanged = true;
        return fz;
      }
      return prevFz;
    });
    setFc((prevFc) => {
      if (prevFc !== fc) {
        hasChanged = true;
        return fc;
      }
      return prevFc;
    });

    setChanged(hasChanged);
  }

  useEffect(() => {
    subscribeToUIUpdates(onUIUpdate);
    return () => {
      unsubscribeToUIUpdates(onUIUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        backgroundColor: "white",
        paddingLeft: 20,
        paddingRight: 20,
      }}
      className={changed ? "blob bordered" : "bordered"}
    >
      <Row>
        <Col size="100%">
          <Text tag="h4" textSize="display4">
            {data.label}
          </Text>
        </Col>
      </Row>
      <Row>
        <Checkbox checked={fz}>FZ</Checkbox>
      </Row>
      <Row>
        <Checkbox checked={fc}>FC</Checkbox>
      </Row>
    </div>
  );
}

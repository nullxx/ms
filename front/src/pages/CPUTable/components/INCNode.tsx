import React, { memo } from 'react';
import { Row, Col, Text } from "atomize";
import I18n from '../../../components/i18n';
import { Handle, Position } from '../../../lib/ReactFlow';

export default memo(function INCNode({ data, id }: any) {
    return (
        <div
            style={{
                height: data.height || 300,
                overflow: "hidden",
                width: data.width || 220,
                padding: 8,
                backgroundColor: "#f5f5f5",
            }}
            className="pretty-shadow"
        >
            <Row>
                <Col size="100%">
                    <Text tag="h4" textSize="display4">
                        <I18n k={data.labelKey} />
                    </Text>
                </Col>
            </Row>
            <Row>
                <Col size="100%">
                    <p>+1</p>
                </Col>

                <Handle
                    id="inc-in"
                    type="target"
                    position={Position.Bottom}
                    style={{
                        background: "#555",
                        position: "absolute",
                        left: "50%",
                    }}
                    isConnectable={false}
                />
                <Handle
                    id="inc-out"
                    type="source"
                    position={Position.Left}
                    style={{
                        background: "#555",
                        position: "absolute",
                        top: "50%",
                    }}
                    isConnectable={false}
                />
            </Row>
        </div>
    );
}, (prevProps, nextProps) => {
    return JSON.stringify(prevProps.data) === JSON.stringify(nextProps.data);
});
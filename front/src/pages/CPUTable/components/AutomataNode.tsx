

import React, { memo } from "react";
import { unsubscribeToUIUpdates } from "../../../lib/core";
import { Row, Col, Text } from "atomize";
import { subscribeToUIUpdates, getCore } from "../../../lib/core/index";

import I18n from "../../../components/i18n";
import mermaid from "mermaid";

const baseDiagram = `stateDiagram-v2
    classDef yellowFill fill:#f0c40094,color:black,font-weight:bold,stroke-width:2px,stroke:yellow
    classDef orangeBorder stroke:orange,stroke-width:2px,stroke-dasharray:5

    [*] --> S0
    S0 --> S1 : XXX
    S11 --> S1 : XXX
    S10 --> S0 : XXX
    S2 --> S6 : XXX
    S6 --> S7 : 00X
    S9 --> S0 : XXX
    S7 --> S0 : XXX
    S6 --> S9 : 01X
    S1 --> S2 : 0XX
    S2 --> S10 : 10X
    S1 --> S11 : 111
`;

const isSvgEmpty = (svg: string) => {
    var parser = new DOMParser();
    const doc = parser.parseFromString(svg, "image/svg+xml");

    const gElement = doc.querySelector('g');
    const isGEmpty = gElement?.children.length === 0;

    return isGEmpty;
}

async function renderAutomata(node: HTMLElement, text: string = baseDiagram) {
    node.removeAttribute("data-processed");
    // node.innerHTML = text;

    // await mermaid.run({ nodes: [node] }).catch(e => e); // ignore errors

    const result = await mermaid.render('id0', text);
    result.bindFunctions?.(node);

    if (!isSvgEmpty(result.svg)) {
        node.innerHTML = result.svg;
    } else {
        await renderAutomata(node, text);
    }


}

export default memo(function AutomataNode({ data }: { data: any }) {
    const mermaidContainerRef = React.useRef<HTMLDivElement>(null);

    async function onUIUpdate(this: any) {
        const nextStateNumber = getCore().get_next_state();
        const currentStateNumber = getCore().get_state();

        const diagramTxt = `${baseDiagram}\n    class S${currentStateNumber} yellowFill\n    class S${nextStateNumber} orangeBorder`;

        if (mermaidContainerRef.current) {
            await renderAutomata(mermaidContainerRef.current, diagramTxt);
        }
    }

    async function initialize() {
        mermaid.initialize({
            startOnLoad: false,
            theme: "default",
            fontSize: 12,
        });
        mermaid.contentLoaded();



        if (mermaidContainerRef.current) {
            await renderAutomata(mermaidContainerRef.current);
        }
    }

    React.useEffect(() => {
        subscribeToUIUpdates(onUIUpdate);
        initialize();

        return () => {
            unsubscribeToUIUpdates(onUIUpdate);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                    <div className="mermaid" ref={mermaidContainerRef}></div>
                </Col>
            </Row>
        </div>
    );
}, (prevProps, nextProps) => {
    return JSON.stringify(prevProps.data) === JSON.stringify(nextProps.data);
});

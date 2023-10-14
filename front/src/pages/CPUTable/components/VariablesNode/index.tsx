import React from "react";
import { Row, Col, Text } from "atomize";
import { Table } from "antd";

import NumberBaseInput from "../../../../components/NumberBaseInput";

import {
  subscribeToUIUpdates,
  unsubscribeToUIUpdates,
  getCore,
} from "../../../../lib/core/index";
import I18n from "../../../../components/i18n";
import { getRunningVariables } from "../../../Coder/components/CodeEditor";

const columns = [

  {
    title: <I18n k="variables.variableName" />,
    dataIndex: 'name',
    key: 'name',
    align: 'center' as const,
  },
  {
    title: <I18n k="variables.variableAddress" />,
    dataIndex: 'address',
    key: 'address',
    align: 'center' as const,
  },
  {
    title: <I18n k="variables.variableValue" />,
    dataIndex: 'value',
    key: 'value',
    align: 'center' as const,
    render: (value: number) => <NumberBaseInput initialBase="HEX" number={value} readOnly width={160} />
  },
];

const maxVariablesPerPage = 8;

function VariablesComponent() {

  interface VariableData {
    name: string;
    value: number;
    address: number;
  }

  const [variablesData, setVariablesData] = React.useState<VariableData[]>([]);

  function onUIUpdate() {
    const variables = getRunningVariables();

    setVariablesData(variables.map((variable) => ({
      name: variable.name,
      value: getCore().get_memory_value(variable.address),
      address: variable.address
    })));
  }

  React.useEffect(() => {
    subscribeToUIUpdates(onUIUpdate);
    return () => {
      unsubscribeToUIUpdates(onUIUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dataSource = variablesData.map((variable) => ({
    key: variable.name,
    name: variable.name,
    address: `0x${variable.address.toString(16).toUpperCase()}`,
    value: variable.value,
  }));

  const showPagination = dataSource.length > maxVariablesPerPage;

  return (
    <div>
      <Table dataSource={dataSource} columns={columns} size="small" pagination={showPagination ? { pageSize: maxVariablesPerPage } : false} />
    </div>
  );
}

const VariablesNode = ({ data }: { data: any }) => {
  return (
    <div
      style={{
        padding: 10,
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
          <VariablesComponent />
        </Col>
      </Row>
    </div>
  );
};

export default VariablesNode;

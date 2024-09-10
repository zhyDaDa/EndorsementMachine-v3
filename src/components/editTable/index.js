import {
    EditableProTable,
    ProCard,
    ProForm,
    ProFormDependency,
    ProFormField,
    ProFormSegmented,
    ProFormSwitch,
} from "@ant-design/pro-components";
import { Button } from "antd";
import React, { useRef, useState } from "react";

const defaultData = [
    {
        id: "624748504",
        title: "活动名称一",
        decs: "这个活动真好玩",
        state: "open",
        created_at: 1590486176000,
        update_at: 1590486176000,
    },
    {
        id: "624691229",
        title: "活动名称二",
        decs: "这个活动真好玩",
        state: "closed",
        created_at: 1590481162000,
        update_at: 1590481162000,
    },
];

let i = 0;

export default function EditTable ({initialData, bookName, turnTo}) {
    const [editableKeys, setEditableRowKeys] = useState(() => []);
    const [position, setPosition] = useState("bottom");
    const [controlled, setControlled] = useState(false);
    const formRef = useRef();
    const editorFormRef = useRef();
    const columns = [
        {
            title: "题目",
            dataIndex: "question",
            formItemProps: () => {
                return {
                    rules: [{ required: true, message: "此项为必填项" }],
                };
            },
            width: "30%",
        },
        {
            title: "答案",
            key: "answer",
            dataIndex: "answer",
            formItemProps: () => {
                return {
                    rules: [{ required: true, message: "此项为必填项" }],
                };
            },
            width: "30%",
        },
        {
            title: "操作",
            valueType: "option",
            width: "30%",
            render: (text, record, _, action) => [
                <a
                    key="editable"
                    onClick={() => {
                        action?.startEditable?.(record.id, record);
                    }}
                >
                    编辑
                </a>,
                <a
                    key="delete"
                    onClick={() => {
                        const tableDataSource =
                            formRef.current?.getFieldValue("table");
                        formRef.current?.setFieldsValue({
                            table: tableDataSource.filter(
                                (item) => item.id !== record.id
                            ),
                        });
                    }}
                >
                    删除
                </a>,
            ],
        },
    ];

    return (
        <ProForm
            formRef={formRef}
            initialValues={{
                table: defaultData,
            }}
            validateTrigger="onBlur"
        >
            <EditableProTable
                rowKey="id"
                scroll={{
                    x: "120%",
                }}
                editableFormRef={editorFormRef}
                headerTitle={`编辑辞书：${bookName}`}
                name="table"
                recordCreatorProps={
                    position !== "hidden"
                        ? {
                              position: position,
                              record: () => ({
                                  id: (Math.random() * 1000000).toFixed(0),
                              }),
                          }
                        : false
                }
                toolBarRender={() => [
                    <Button
                        key="rows"
                        onClick={() => {
                            const rows = editorFormRef.current?.getRowsData?.();
                            console.log(rows);
                        }}
                    >
                        获取 table 的数据
                    </Button>,
                ]}
                columns={columns}
                editable={{
                    type: "multiple",
                    editableKeys,
                    onChange: setEditableRowKeys,
                    actionRender: (row, config, defaultDom) => {
                        return [
                            defaultDom.save,
                            defaultDom.delete,
                            defaultDom.cancel,
                        ];
                    },
                }}
            />
            <ProForm.Item>
                <ProCard
                    title="表格数据"
                    headerBordered
                    collapsible
                    defaultCollapsed
                >
                    <ProFormDependency name={["table"]}>
                        {({ table }) => {
                            return (
                                <ProFormField
                                    ignoreFormItem
                                    fieldProps={{
                                        style: {
                                            width: "100%",
                                        },
                                    }}
                                    mode="read"
                                    valueType="jsonCode"
                                    text={JSON.stringify(table)}
                                />
                            );
                        }}
                    </ProFormDependency>
                </ProCard>
            </ProForm.Item>
        </ProForm>
    );
};

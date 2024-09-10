import {
    EditableProTable,
    ProCard,
    ProForm,
    ProFormDependency,
    ProFormField,
    ProFormSegmented,
    ProFormSwitch,
} from "@ant-design/pro-components";
import { Button, message, Space, Typography, Select, FloatButton } from "antd";
import React, { useRef, useState, useEffect } from "react";
import {
    Book,
    GetBooksFromLocalStorage,
    SaveBooksIntoLocalStorage,
    deepCopy,
} from "../../utils/utils";
import { echo } from "../../utils/coolConsle";

const { Title, Paragraph, Text, Link } = Typography;

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

export default function EditTable({ turnTo }) {
    const [editableKeys, setEditableRowKeys] = useState(() => []);
    const position = "top";
    const [controlled, setControlled] = useState(false);
    const [books, setBooks] = useState([]);
    const [currentBook, setCurrentBook] = useState(null);
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
                        saveChange();
                    }}
                >
                    删除
                </a>,
            ],
        },
    ];

    useEffect(() => {
        (async () => {
            setBooks(GetBooksFromLocalStorage());
        })();
    }, []);

    useEffect(() => {
        let b = books.find((e) => e.id == currentBook);
        if (b) {
            formRef.current?.setFieldsValue({
                table: b.contentArray.map((e) => {
                    return {
                        id: (Math.random() * 1000000).toFixed(0),
                        question: e[0],
                        answer: e[1],
                    };
                }),
            });
        }
    }, [currentBook]);

    const saveChange = () => {
        const rows = editorFormRef.current?.getRowsData?.();
        let i = books.findIndex((e) => e.id == currentBook);
        let b = new Book(books[i]);
        b.contentArray = rows.map((row) => [row.question, row.answer]);
        let _books = [
            ...books.slice(0, i),
            b,
            ...books.slice(i + 1, books.length),
        ];
        echo.log(echo.asSuccess("i"), i);
        echo.log(echo.asSuccess("b"), b);
        echo.log(echo.asSuccess("_books"), _books);
        SaveBooksIntoLocalStorage(_books);
        setBooks(GetBooksFromLocalStorage());
    };

    return (
        <ProForm
            formRef={formRef}
            initialValues={{
                table: defaultData,
            }}
            validateTrigger="onBlur"
            // onBlur={()=>{saveChange()}}
            // onValuesChange={() => {
            //     saveChange();
            // }}
            // onFinish={() => {saveChange()}}
            submitter={false}
        >
            <Space>
                <Text strong>
                    编辑辞书&nbsp;
                    {
                        <Select
                            showSearch
                            style={{
                                width: "36vw",
                            }}
                            placeholder="Select a book"
                            optionFilterProp="label"
                            onChange={(v) => {
                                setCurrentBook(v);
                            }}
                            options={books.map((book) => {
                                return {
                                    label: book.name,
                                    value: book.id,
                                };
                            })}
                        />
                    }
                </Text>
            </Space>
            <EditableProTable
                rowKey="id"
                scroll={{
                    x: "120%",
                }}
                editableFormRef={editorFormRef}
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
                toolBarRender={false}
                columns={columns}
                editable={{
                    type: "multiple",
                    editableKeys,
                    onChange: setEditableRowKeys,
                    onSave: saveChange,
                    onDelete: saveChange,
                    actionRender: (row, config, defaultDom) => {
                        return [
                            defaultDom.save,
                            defaultDom.delete,
                            defaultDom.cancel,
                        ];
                    },
                }}
                style={{ display: currentBook ? "block" : "none" }}
            />
            <FloatButton.BackTop type="primary" />
        </ProForm>
    );
}

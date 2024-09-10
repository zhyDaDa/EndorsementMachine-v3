import React, { useState, useEffect } from "react";
import {
    Typography,
    Button,
    Card,
    Statistic,
    Flex,
    message,
    Space,
    Popconfirm,
} from "antd";
import {
    EditOutlined,
    EllipsisOutlined,
    SettingOutlined,
    DeleteOutlined,
} from "@ant-design/icons";
import { deepCopy, md2html } from "../../utils/utils";
import { SETTING } from "../../utils/colorSetting";
import { ProCard, CheckCard } from "@ant-design/pro-components";

const { Divider } = ProCard;
const { Title, Paragraph, Text, Link } = Typography;

export default function BookCard({ style, turnTo, book, deleteBook, onEdit }) {
    const actions = [
        <EditOutlined key="edit" onClick={onEdit}/>,
        <Popconfirm
            title="删除辞书"
            description="删除后不可恢复，确定删除吗？"
            okText="确定"
            cancelText="取消"
            onConfirm={deleteBook}
            key="delete"
        >
            <DeleteOutlined />
        </Popconfirm>,
        <EllipsisOutlined key="ellipsis" />,
    ];
    return (
        <>
            <Card
                actions={actions}
                style={{
                    ...style,
                    minWidth: "30vmin",
                }}
                // cover={
                //     <img
                //         alt="example pic"
                //         src="https://picsum.photos/50/10"
                //     />
                // }
                bordered
            >
                <Space>
                    <Text strong style={{ textWrap: "nowrap" }}>
                        {book.name}
                    </Text>
                </Space>
            </Card>
        </>
    );
}

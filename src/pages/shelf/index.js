import React, { useState, useEffect } from "react";
import {
    Typography,
    Space,
    Button,
    Card,
    Col,
    Row,
    Statistic,
    Flex,
    message,
    FloatButton,
} from "antd";
import { CloudDownloadOutlined, PlusCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import { deepCopy, md2html } from "../../utils/utils";
import { SETTING } from "../../utils/colorSetting";
import { ProCard, CheckCard } from "@ant-design/pro-components";
import BookCard from "../../components/bookCard";
import "./index.css";
import { echo } from "../../utils/coolConsle";
import { GetBooksFromLocalStorage, SaveBooksIntoLocalStorage, Book, deleteBook } from "../../utils/utils";

const { Divider } = ProCard;
const { Title, Paragraph, Text, Link } = Typography;

const gridStyle = {
    width: "5%",
    textAlign: "center",
};

class Shelf extends React.PureComponent {
    constructor(props) {
        super(props);
        let { turnTo } = props;
    }

    state = {
        books: [],
    };

    componentDidMount() {
        let books = GetBooksFromLocalStorage();
        this.setState((pre) => ({ books: books }));
    }

    render() {
        return (
            <>
                <Space
                    size={"small"}
                    wrap
                    align="center"
                    style={{
                        justifyContent: "space-around",
                    }}
                >
                    {this.state.books.length > 0 ? (
                        this.state.books.map((book, index) => {
                            return (
                                <BookCard
                                    turnTo={this.props.turnTo}
                                    style={gridStyle}
                                    book={book}
                                    deleteBook={() => {deleteBook(index);this.componentDidMount();}}
                                    index={index}
                                    key={index}
                                    
                                />
                            );
                        })
                    ) : (
                        <Text type="secondary">没有辞书</Text>
                    )}
                </Space>{" "}
                <FloatButton.Group
                    trigger="click"
                    type="primary"
                    style={{
                        insetInlineEnd: 24,
                        transform: "scale(1.25)",
                    }}
                    shape="square"
                    icon={<PlusCircleOutlined />}
                >
                    <FloatButton
                        icon={<PlusCircleOutlined />}
                        description={
                            <Text
                                style={{
                                    fontSize: "1.2vmin",
                                    textWrap: "nowrap",
                                }}
                            >
                                New
                            </Text>
                        }
                        shape="square"
                    />
                    <FloatButton
                        icon={<CloudDownloadOutlined />}
                        description={
                            <Text
                                style={{
                                    fontSize: "1.2vmin",
                                    textWrap: "nowrap",
                                }}
                            >
                                Import
                            </Text>
                        }
                        shape="square"
                        onClick={async () => {
                            await loadFromCloud();
                            this.componentDidMount();
                        }}
                    />
                    <FloatButton
                        icon={<DeleteOutlined />}
                        description={
                            <Text
                                style={{
                                    fontSize: "1.2vmin",
                                    textWrap: "nowrap",
                                }}
                            >
                                Delete All
                            </Text>
                        }
                        shape="square"
                        onClick={async () => {
                            SaveBooksIntoLocalStorage([]);
                            this.componentDidMount();
                        }}
                    />
                </FloatButton.Group>
            </>
        );
    }
}

export default Shelf;

const loadFromCloud = async () => {
    let src = "https://zhydada.online/EndorsementMachine_Books/";
    let links = [];
    await fetch(src)
        .then((response) => {
            // 正则提取所有链接
            return response.text();
        })
        .then((text) => {
            // 示例: <a href="%E5%88%B7%E9%A2%98%E6%94%B6%E9%9B%86.txt">刷题收集.txt</a>
            let reg = /<a href="([^"]+)">([^<]+)<\/a>/g;
            let result;
            while ((result = reg.exec(text)) !== null) {
                links.push({
                    href: result[1],
                    title: result[2],
                });
            }
        });
    echo.log(echo.asSuccess("获取到链接"), links);
    for (let i = 1; i < links.length; i++) {
        let link = links[i];
        let url = src + link.href;
        await fetch(url)
            .then((response) => {
                return response.text();
            })
            .then((text) => {
                let name = link.title.split(".")
                name.pop();
                name = name.join(".");
                let book = new Book({
                    name: name,
                    rawContent: text,
                });
                let books = GetBooksFromLocalStorage();
                books.push(book);
                SaveBooksIntoLocalStorage(books);
            });
    }
};

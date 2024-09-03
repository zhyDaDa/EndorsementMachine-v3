import React, { useState, useEffect } from "react";
import { Typography, Button, Card, Statistic, Flex } from "antd";
import { deepCopy, md2html } from "../../utils/utils";
import { SETTING } from "../../utils/colorSetting";
import { ProCard } from "@ant-design/pro-components";

const { Divider } = ProCard;
const { Title, Paragraph, Text, Link } = Typography;

const getAnswers = (qa) => {
    return ["x", qa[1], "y", "z"];
};

const QuestionAndAnswer = ({ qa, showAns, mode }) => {
    const [question, setQuestion] = useState(qa[0] || "default");
    const [answers, setAnswers] = useState(qa[1] || ["答案", "默认"]);

    useEffect(() => {
        let newAnswers = getAnswers(qa);
        setQuestion(qa[0]);
        setAnswers(newAnswers);
    }, []);

    return (
        <>
            <Card>
                <Flex align="center" justify="center">
                    <Text>{question}</Text>
                </Flex>
            </Card>

            <ProCard
                style={{ marginBlockStart: 8, display: "flex", flexDirection: "column" }}
                gutter={[16, 16]}
                wrap
                title=""
            >
                {typeof answers.map === "function" ? (
                    answers?.map((ans, index) => {
                        return (
                                <ProCard
                                    colSpan={{
                                        xs: 24,
                                        sm: 12,
                                        md: 12,
                                        lg: 12,
                                        xl: 12,
                                    }}
                                    layout="center"
                                    bordered
                                    key={index}
                                >
                                    <Text>{ans}</Text>
                                </ProCard>
                        );
                    })
                ) : (
                    <p>Something wrong with answers.</p>
                )}
            </ProCard>
        </>
    );
};

export default QuestionAndAnswer;

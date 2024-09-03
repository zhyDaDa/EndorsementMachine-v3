import React, { useState, useEffect } from "react";
import { Typography, Button, Card, Statistic, Flex, message } from "antd";
import { deepCopy, md2html } from "../../utils/utils";
import { SETTING } from "../../utils/colorSetting";
import { ProCard, CheckCard } from "@ant-design/pro-components";
import "./index.css";

const { Divider } = ProCard;
const { Title, Paragraph, Text, Link } = Typography;

const QuestionAndAnswer = ({
    qa,
    showAns,
    showAnsFlag,
    mode,
    onCorrect,
    onWrong,
}) => {
    const [question, setQuestion] = useState(qa[0] || "default");
    const [answers, setAnswers] = useState(qa[1] || ["答案", "默认"]);
    const [correctIndex, setCorrectIndex] = useState(-1);
    const [canChoose, setCanChoose] = useState(true);
    const [currentChoice, setCurrentChoice] = useState(-1);

    const getAnswers = (qa) => {
        return { newAnswers: ["x", qa[1], "y", "z"], correctIndex: 1 };
    };

    const choose = (choice) => {
        setCurrentChoice(choice);
        setCanChoose(false);
        showAns();
        if (choice < 0 || choice >= answers.length) {
            message.error("未作答");
            if (typeof onWrong === "function") onWrong();
        } else if (choice === correctIndex) {
            message.success(`选择了${choice}，正确！`);
            if (typeof onCorrect === "function") onCorrect();
        } else {
            message.error(`选择了${choice}，错误！`);
            if (typeof onWrong === "function") onWrong();
        }
    };

    useEffect(() => {
        let { newAnswers, correctIndex } = getAnswers(qa);
        setQuestion(qa[0]);
        setAnswers(newAnswers);
        setCorrectIndex(correctIndex);
        setCurrentChoice(-1);
    }, [qa]);

    return (
        <>
            <Card>
                <Flex align="center" justify="center">
                    <Text strong className="question-text">
                        {question}
                    </Text>
                </Flex>
            </Card>

            <CheckCard.Group
                style={{
                    marginBlockStart: 8,
                    alignContent: "center",
                    justifyContent: "center",
                    alignItems: "center",
                }}
                defaultValue={-1}
                onChange={(value) => {
                    choose(value);
                }}
                disabled={!canChoose}
            >
                {typeof answers?.map === "function" ? (
                    answers?.map((ans, index) => {
                        return (
                            <CheckCard
                                layout="center"
                                bordered
                                key={index}
                                value={index}
                                title={
                                    showAnsFlag ? (
                                        index === correctIndex ? (
                                            <Text typeof="success">
                                                正确答案
                                            </Text>
                                        ) : (
                                            ""
                                        )
                                    ) : (
                                        ""
                                    )
                                }
                                className="answer-card"
                            >
                                <Text className="answer-text">{ans}</Text>
                            </CheckCard>
                        );
                    })
                ) : (
                    <>
                        <Text type="warning">
                            Something wrong with answers.
                        </Text>
                        <Text>Current answers: {answers}</Text>
                    </>
                )}
            </CheckCard.Group>
        </>
    );
};

export default QuestionAndAnswer;

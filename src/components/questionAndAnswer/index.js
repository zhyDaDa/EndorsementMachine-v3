import React, { useState, useEffect } from "react";
import { Typography, Button, Card, Statistic, Flex, message } from "antd";
import { deepCopy, md2html } from "../../utils/utils";
import { SETTING } from "../../utils/colorSetting";
import { ProCard, CheckCard } from "@ant-design/pro-components";
import "./index.css";
import { echo } from "../../utils/coolConsle";

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
    const [loading, setLoading] = useState(true);

    const getAnswers = async (qa) => {
        let ans = await getSimilarwords_GLM(qa);
        let newAnswers = ans;
        newAnswers.push(qa);
        newAnswers.sort(() => Math.random() - 0.5);
        let correctIndex = newAnswers.indexOf(qa);

        return { newAnswers: newAnswers, correctIndex: correctIndex };
    };

    const choose = (choice) => {
        setCurrentChoice(choice);
        setCanChoose(false);
        showAns();
        if (choice < 0 || choice >= answers.length) {
            // message.error("未作答");
            if (typeof onWrong === "function") onWrong();
        } else if (choice === correctIndex) {
            // message.success(`选择了${choice}，正确！`);
            if (typeof onCorrect === "function") onCorrect();
        } else {
            // message.error(`选择了${choice}，错误！`);
            if (typeof onWrong === "function") onWrong();
        }
    };

    useEffect(() => {
        (async () => {
            setQuestion(qa[0]);
            if (mode === "选择模式") {
                setLoading(true);
                let { newAnswers, correctIndex } = await getAnswers(qa);
                setAnswers(newAnswers);
                setCorrectIndex(correctIndex);
                setCurrentChoice(-1);
                setLoading(false);
                setCanChoose(true);
            }
        })();
    }, [qa, mode]);

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
                value={currentChoice}
                onChange={(value) => {
                    choose(value);
                }}
                disabled={!canChoose}
                className="answer-group"
                loading={loading}
            >
                {(() => {
                    if (mode === "选择模式") {
                        return typeof answers?.map === "function" ? (
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
                                                    <Text>{ans[0]}</Text>
                                                )
                                            ) : (
                                                <Text>&nbsp;</Text>
                                            )
                                        }
                                        className="answer-card"
                                    >
                                        <Text className="answer-text">
                                            {ans[1]}
                                        </Text>
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
                        );
                    } else if (mode === "填空模式") {
                        return (
                            <Card>
                                {showAnsFlag ? (
                                    <Card>{qa[1]}</Card>
                                ) : (
                                    <Text type="secondary">请默念答案</Text>
                                )}
                            </Card>
                        );
                    } else {
                        return (
                            <>
                                <Text type="warning">
                                    Something wrong with mode.
                                </Text>
                                <Text type="warning">Current mode: {mode}</Text>
                            </>
                        );
                    }
                })()}
            </CheckCard.Group>
        </>
    );
};

export default QuestionAndAnswer;

const getSimilarwords = async (word) => {
    let response = await fetch(
        "https://api.dictionaryapi.dev/api/v2/entries/en/" + word
    );
    let data = await response.json();
    let synonyms = data[0].meanings[0].synonyms;
    return synonyms;
};
const getSimilarwords_GLM = async (word) => {
    // return [        ["x", "x"],        ["x", "x"],        ["x", "x"],    ];
    let content = {
        model: "glm-4",
        messages: [
            {
                role: "system",
                content:
                    "对于给定的^word#单词, 要求到3个形近或意近的单词，要求必须是3个或更少的单词，并且必须用{^word1#单词1^word2#单词2^word3#单词3}的形式回答。单词的含义越精简越好, 且不允许重复, 不允许出现无关的话语。",
            },
            { role: "user", content: "^acquire#学习, 获取" },
            {
                role: "assistant",
                content:
                    "^require#需要, 要求^attain#获得, 达到^obtain#获得, 得到",
            },
            { role: "user", content: "^campans#n. 营地, 帐篷" },
            {
                role: "assistant",
                content:
                    "^campus#n. 校园, 大学校园^campaign#n. 运动, 战役, 活动^compaign#n. 竞选, 运动",
            },
            { role: "user", content: `^${word[0]}#${word[1]}` },
        ],
        stream: false,
        api_key: "a4232b6fb869c7be0460444faf5ad63a.KkjLoXzWnzzIGaJY",
    };

    let response = await fetch(
        "https://open.bigmodel.cn/api/paas/v4/chat/completions",
        {
            method: "POST",
            headers: {
                Authorization:
                    "Bearer a4232b6fb869c7be0460444faf5ad63a.KkjLoXzWnzzIGaJY",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(content),
        }
    );
    let data = await response.json();
    let ans = data.choices[0].message.content;
    try {
        ans = ans.split("^");
        ans.shift();
        ans = ans.map((e) => e.split("#"));
        ans = ans.filter((e) => e[1].length <= 36);
    } catch (e) {
        echo.log(echo.asAlert("解析失败"), ans);
        ans = [
            ["error", "解析失败"],
            ["error", "解析失败"],
            ["error", "解析失败"],
        ];
    }
    echo.log(echo.asSuccess("获取到相似词"), ans);
    return ans;
};

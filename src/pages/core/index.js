import React, { useState } from "react";
import { Typography, Button, Card, Statistic, Flex, Select, Space, message } from "antd";
import { SettingOutlined, CloseOutlined } from "@ant-design/icons";
import { deepCopy, md2html } from "../../utils/utils";
import { SETTING } from "../../utils/colorSetting";
import { ProCard } from "@ant-design/pro-components";
import QuestionAndAnswer from "../../components/questionAndAnswer";
import RcResizeObserver from "rc-resize-observer";
import {
    Book,
    GetBooksFromLocalStorage,
    SaveBooksIntoLocalStorage,
} from "../../utils/utils";
import { echo } from "../../utils/coolConsle";

const { Divider } = ProCard;
const { Title, Paragraph, Text, Link } = Typography;

/**
 * 书架
 */
const BOOKS = {
    books: [],
    GetBooksFromLocalStorage: () => {
        let s = localStorage.getItem("books");
        if (!s) {
            console.log("存储中没有书");
            return false;
        }
        BOOKS.books = JSON.parse(s);
    },
    SaveBooksIntoLocalStorage: () => {
        localStorage.setItem("books", JSON.stringify(BOOKS.books));
    },
    GetBookCount: () => {
        return BOOKS.books.length;
    },
};

/**
 * 相当于全局对象, 表示当前的状态
 * 还有LoadBook的功能
 */
const CURRENT = {
    bookId: 0,
    bookName: "",
    mode: "",
    lastEdit: 0,
    wordCount: 0,
    contentArray: "",
    rawContent: "",
    question: "",
    questionId: 0,
    // questionList是所有问题的索引的数组
    questionPool: [],
    // rateList是部分问题出现频率的数组
    rateList: [],
    answer1: "",
    answer2: "",

    /**
     * 把一个BOOK装载到CURRENT中
     * @param {*} book 一个BOOK对象
     */
    LoadBook: (book, id) => {
        // todo: 修改状态
        // CURRENT.bookId = id;
        // CURRENT.bookName = book.name;
        // CURRENT.mode = book.mode;
        // CURRENT.lastEdit = book.lastEdit;
        // CURRENT.wordCount = book.wordCount;
        // CURRENT.contentArray = book.contentArray;
        // CURRENT.rawContent = book.rawContent;
        // let tr = $("tr#book-info-display>td").get();
        // tr[0].innerText = CURRENT.bookName;
        // tr[1].innerText = CURRENT.mode;
        // let d = new Date(parseInt(CURRENT.lastEdit));
        // tr[2].innerText = (d).toLocaleDateString() + " " + (d).toLocaleTimeString();
        // tr[3].innerText = CURRENT.wordCount;
        // CURRENT.questionPool = [];
        // rateList = JSON.parse(localStorage.getItem("questionRateList")) || [];
        // CURRENT.rateList = rateList[CURRENT.bookId] || [];
    },

    /**
     * 从Books的books中按序号找到对应的书, 并导入CURRENT中, 相当于获得了全部信息
     * @param {int} bookId BOOK.books中的下标
     */
    OpenBookByBookID: (bookId = 0) => {
        // todo: 修改状态
        // let book = BOOKS.books[bookId];
        // if (BOOKS.GetBookCount == 0 || !book) {
        //     console.log("书架上没有书");
        //     return false;
        // }
        // CURRENT.LoadBook(book, bookId);
        // $("input[name='book']")[bookId].checked = true;
        // GLOBAL.flag_showAnswer = false;
        // GLOBAL.ShowQA();
        // SETTING.settings.lastBookID = bookId;
        // SETTING.SaveSettingsToLocalStorage();
        return true;
    },

    /**
     * "多背几遍按钮"点击事件, 让当前问题的索引(questionId)在questionPool中的出现频率增加, 登记到rateList中
     */
    AddRate: () => {
        let rate = CURRENT.rateList[CURRENT.questionId];
        if (rate == undefined) {
            CURRENT.rateList[CURRENT.questionId] = 1.2;
        } else {
            CURRENT.rateList[CURRENT.questionId] += 0.2;
        }
        GLOBAL.DisplayQuestionRate();
        GLOBAL.MemorizeQuestionRateList();
    },

    /**
     * "少背几遍按钮"点击事件, 让当前问题的索引(questionId)在questionPool中的出现频率减少, 登记到rateList中
     */
    SubRate: () => {
        let rate = CURRENT.rateList[CURRENT.questionId];
        if (rate == undefined) {
            CURRENT.rateList[CURRENT.questionId] = 0.8;
        } else {
            CURRENT.rateList[CURRENT.questionId] -= 0.2;
        }
        GLOBAL.DisplayQuestionRate();
        GLOBAL.MemorizeQuestionRateList();
    },
};

/**
 * 得到输入框rectify_3这个element
 * @returns rectify_3元素
 */
function GetRectify3() {
    // todo:
    // return $("#rectify_3")[0];
}

function generatePattern(str) {
    // 将字符串转换为16进制
    let hex = "";
    for (let i = 0; i < str.length; i++) {
        let n = str.charCodeAt(i);
        // 仅保留n转化为16进制后的最后一位
        n = n.toString(16).substr(-1);
        hex += n;
    }

    // 创建canvas元素
    const canvas = document.createElement("canvas");
    const clarity = 10;
    const tileSize = clarity;
    canvas.width = tileSize * 16;
    canvas.height = tileSize * 16;
    const ctx = canvas.getContext("2d");

    // 绘制图案
    for (let i = 0; i < hex.length; i += 6) {
        let x = ((parseInt(hex.substr(i, 1), 16) * 3) / 5 + 3) * tileSize;
        let y = ((parseInt(hex.substr(i + 1, 1), 16) * 3) / 5 + 3) * tileSize;
        let f = parseInt(hex.substr(i + 2, 1), 16) + 1;
        let r = (Math.sqrt(i) + 4) * tileSize;
        let color_string = hex.substr(i + 3, 3);
        let color =
            "#" +
            color_string[0] +
            color_string[0] +
            color_string[1] +
            color_string[1] +
            color_string[2] +
            color_string[2] +
            "CC";

        // 如果r在1到4之间, 则绘制圆形
        if (f >= 1 && f <= 4) {
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.closePath();
        }
        // 如果5到8之间, 则绘制矩形
        else if (f >= 5 && f <= 8) {
            ctx.fillStyle = color;
            ctx.fillRect(x, y, r, r);
        }
        // 如果9到12之间, 则绘制三角形
        else if (f >= 9 && f <= 12) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + r, y + r);
            ctx.lineTo(x - r, y + r);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.closePath();
        }
        // 如果13到16之间, 则绘制五角星
        else if (f >= 13 && f <= 16) {
            ctx.beginPath();
            ctx.moveTo(x, y - r);
            ctx.lineTo(x + r * 0.5, y - r * 0.5);
            ctx.lineTo(x + r, y);
            ctx.lineTo(x + r * 0.5, y + r * 0.5);
            ctx.lineTo(x, y + r);
            ctx.lineTo(x - r * 0.5, y + r * 0.5);
            ctx.lineTo(x - r, y);
            ctx.lineTo(x - r * 0.5, y - r * 0.5);
            ctx.lineTo(x, y - r);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.closePath();
        }
    }

    function hashString(str) {
        let hash = str.length;
        for (let i = 0; i < str.length; i++) {
            hash = (hash << 5) - hash + str.charCodeAt(i);
            hash |= 0;
        }
        return Math.abs(hash).toString(16).slice(0, 6);
    }
    // 将str用hashString转换为16进制, 然后用这个16进制的字符串作为canvas的背景色
    canvas.style.backgroundColor = "#" + hashString(str);

    return canvas;
}

/**
 * 获取辞书类型
 * @param {"填空类型"|"选择类型"} modeName 辞书的类型
 * @returns {Object} 那个类型对应的类型处理对象
 */
function GetModeByModeName(modeName) {
    switch (modeName) {
        case "填空类型":
            return MODE_FillingTheBlank;
        case "选择类型":
            return MODE_Choosing;

        default:
            console.log(
                "在获取辞书类型时出错, 传入的错误的辞书类型是: " + modeName
            );
            return null;
    }
}

/**
 * 关于表格式录入
 */
const PANEL = {
    getPanel: () => {
        return document.getElementById("panel");
    },
    getTable: () => {
        return PANEL.getPanel().querySelector("table");
    },
    getAddRowButton: () => {
        return PANEL.getPanel().querySelector("#add-row");
    },
    getDeletRowButton: () => {
        return PANEL.getPanel().querySelector("#delet-row");
    },
    getSaveDataButton: () => {
        return PANEL.getPanel().querySelector("#save-data");
    },
    getCLoseButton: () => {
        return PANEL.getPanel().querySelector("#close-panel");
    },
    // 显示全屏面板
    showPanel: () => {
        PANEL.getPanel().classList.add("show");
    },

    // 隐藏全屏面板
    hidePanel: () => {
        PANEL.getPanel().classList.remove("show");
    },

    // 添加新行
    addRow: () => {
        var newRow = document.createElement("tr");
        newRow.innerHTML =
            "<td contenteditable='true'></td><td contenteditable='true'></td>";
        PANEL.getTable().querySelector("tbody").appendChild(newRow);
    },

    // 删除所有空的行
    deletRow: () => {
        var rows = PANEL.getTable().querySelectorAll("tbody tr");
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            var tds = row.querySelectorAll("td");
            if (tds[0].innerText == "" && tds[1].innerText == "") {
                row.remove();
            }
        }
    },

    // 载入数据
    loadData: (data) => {
        // 先将data内的换行符\n去除
        data = data.replace(/\n/g, "");

        // 用正则实现
        let pat = /\^\^(.+?)\#\#(.+?)((?=\^\^|\n|\/\/)|$)/g;
        // 第一组是题目, 第二组是答案
        // 对应填入每一行的两列中
        let rows = [];
        let match;
        while ((match = pat.exec(data))) {
            rows.push([match[1], match[2]]);
        }

        // 去除空元素
        rows = rows.filter(function (row) {
            return row.length > 1;
        });

        // 获取表格元素
        var table = PANEL.getTable();

        // 清空表格
        table.querySelector("tbody").innerHTML = "";

        // 在表格末尾添加两个单元格, 用innerText放入数据, 循环
        rows.forEach(function (row) {
            var newRow = document.createElement("tr");
            newRow.innerHTML =
                "<td contenteditable='true'></td><td contenteditable='true'></td>";
            newRow.querySelectorAll("td").forEach(function (cell, index) {
                cell.innerText = row[index];
            });
            table.querySelector("tbody").appendChild(newRow);
        });
    },

    // 保存数据
    saveData: () => {
        var data = [];

        // 遍历每一行
        PANEL.getTable()
            .querySelectorAll("tbody tr")
            .forEach(function (row) {
                var rowData = [];

                // 遍历每一列
                row.querySelectorAll("td").forEach(function (cell) {
                    rowData.push(cell.innerText);
                });

                // 如果该行的两个单元格都为空，则不保存该行数据
                if (
                    rowData.every(function (value) {
                        return value.trim() === "";
                    })
                ) {
                    return;
                }

                data.push(rowData);
            });

        // 将二维数组中的每一行用^^连接，每一列用##连接，组成一个字符串
        data = data
            ?.map(function (row) {
                return row.join("##");
            })
            .join("^^");

        // data最前面也要加上^^
        data = "^^" + data;

        GetRectify3().value = data;
    },
};

/**
 * 这个对象聚合了和填空题有关的所有方法
 */
const MODE_FillingTheBlank = {
    DealContent: (rawContent) => {
        // rawContent.replace(/\n\n/gm, "^^");
        // rawContent.replace(/\n/gm, "##");
        let Q_A = [];
        Q_A = rawContent.split("^^");
        Q_A.shift();
        let finalContent = [];
        finalContent = Q_A?.map((e) => {
            let t = e.split("##");
            return [t[0], t[t.length - 1]];
        });
        return finalContent;
    },
    /**
     * 设定下一个问题和答案, 并登记到current中
     */
    SetNextQuestion: () => {
        // let ranNum = (Math.random() * (CURRENT.contentArray.length)) >> 0;

        // current的问题库(questionPool)是一个数组, 里面存放的是问题的索引
        // 先判断问题库是否为空, 如果为空, 就把问题库重置
        // 如果不为空, 就从问题库中随机取一个问题的索引
        let ranNum = 0;
        if (CURRENT.questionPool.length == 0) {
            // set_times是一个问题在问题库标准出现的次数
            const set_times = SETTING.settings.poolSize;
            // 每个索引值依据CURRENT.rateList生成的数量
            // 问题索引对应的rateList位置的值, 代表了该问题的出现概率, 小于0的值代表了该问题不出现, 大于零的值代表了该问题要出现times的次数倍, 没有值则就是times次
            // 例如rateList[20] = 1.2, 那么问题索引为20的问题, 会出现1.2*times次, 最后四舍五入取整
            CURRENT.questionPool = [];
            for (let i = 0; i < CURRENT.contentArray.length; i++) {
                let times = 0;
                if (!CURRENT.rateList[i]) times = set_times;
                else if (CURRENT.rateList[i] > 0)
                    times = Math.round(CURRENT.rateList[i] * set_times);
                else times = 0;
                for (let j = 0; j < times; j++) {
                    CURRENT.questionPool.push(i);
                }
            }
        }

        // 从问题库中随机取一个问题的索引, 并从问题库中删除该索引
        ranNum = CURRENT.questionPool.splice(
            (Math.random() * CURRENT.questionPool.length) >> 0,
            1
        )[0];
        CURRENT.questionId = ranNum;

        // 将问题和答案分别登记到current中
        CURRENT.question = CURRENT.contentArray[ranNum][0];
        CURRENT.answer1 = CURRENT.contentArray[ranNum][1];
    },
    DisplayQuestion: () => {
        let target = null;
        let question = CURRENT.question;
        // 清空target中的内容
        target.innerHTML = "";

        // 判断"|"是否存在
        if (question.indexOf("|") == -1) {
            // 创建一个h5标签, 存在node变量中
            let node = document.createElement("h5");
            // 给h5标签添加一个class
            node.className = "question";
            // 如果问题的长度大于20, 就给h5标签添加一个class: long-question, 否则就添加一个class: short-question
            if (question.length > 20) node.classList.add("long-question");
            else node.classList.add("short-question");
            // 将问题的内容添加到h5标签中
            node.innerHTML = GLOBAL.DealDisplayString(CURRENT.question);
            // 将h5标签添加到target中
            target.appendChild(node);
        } else {
            // 建一个ul标签, 容纳多个h5标签
            let ul = document.createElement("ul");
            // 如果有|出现, 那么|隔开的多个答案, 分别重复上面的操作
            // 中文的|也一样的操作, 所以用正则表达式匹配
            let questions = question.split(/\s*[\|｜]\s*/);
            questions.forEach((e) => {
                let node = document.createElement("h5");
                node.className = "question";
                if (e.length > 40) node.classList.add("long-question");
                else node.classList.add("short-question");
                node.innerHTML = GLOBAL.DealDisplayString(e);
                // 将h5标签添加到ul标签中
                ul.appendChild(node);
            });
            // ul的class是questions
            ul.className = "questions";
            // 将ul标签添加到target中
            target.appendChild(ul);
        }

        // 生成图片的标识
        generatePattern(question);
        // 显示问题出现的频次
        GLOBAL.DisplayQuestionRate();
    },
    DisplayQuestionAndAnswer: () => {
        let target = null,
            question = CURRENT.question,
            answer = CURRENT.answer1;
        // 清空target中的内容
        target.innerHTML = "";

        // 判断"|"是否存在
        if (question.indexOf("|") == -1) {
            // 创建一个h5标签, 存在node1变量中
            let node1 = document.createElement("h5");
            // 给h5标签添加一个class
            node1.className = "question";
            // 如果问题的长度大于20, 就给h5标签添加一个class: long-question, 否则就添加一个class: short-question
            if (question.length > 20) node1.classList.add("long-question");
            else node1.classList.add("short-question");
            // 将问题的内容添加到h5标签中
            node1.innerHTML = GLOBAL.DealDisplayString(CURRENT.question);
            // 将h5标签添加到target中
            target.appendChild(node1);

            // 创建一个h7标签, 存在node2变量中
            let node2 = document.createElement("h7");
            node2.className = "answer";
            if (answer.length > 40) node2.classList.add("long-answer");
            else node2.classList.add("short-answer");
            node2.innerHTML = GLOBAL.DealDisplayString(CURRENT.answer1);
            target.appendChild(node2);
        } else {
            // 建一个ul标签, 容纳多个h5标签
            let ul1 = document.createElement("ul");
            // 如果有|出现, 那么|隔开的多个答案, 分别重复上面的操作
            let questions = question.split(/\s*[\|｜]\s*/);
            questions.forEach((e) => {
                let node = document.createElement("h5");
                node.className = "question";
                if (e.length > 20) node.classList.add("long-question");
                else node.classList.add("short-question");
                node.innerHTML = GLOBAL.DealDisplayString(e);
                // 将h5标签添加到ul标签中
                ul1.appendChild(node);
            });
            // ul的class是questions
            ul1.className = "questions";

            // 建一个ul标签, 容纳多个h7标签
            let ul2 = document.createElement("ul");
            // 如果有|出现, 那么|隔开的多个答案, 分别重复上面的操作
            let answers = answer.split("|");
            answers.forEach((e) => {
                let node = document.createElement("h7");
                node.className = "answer";
                if (e.length > 40) node.classList.add("long-answer");
                else node.classList.add("short-answer");
                node.innerHTML = GLOBAL.DealDisplayString(e);
                // 将h7标签添加到ul标签中
                ul2.appendChild(node);
            });
            // ul的class是answers
            ul2.className = "answers";

            // 将ul标签添加到target中
            target.appendChild(ul1);
            target.appendChild(ul2);
        }
    },
};

/**
 * 这个对象聚合了和选择题有关的所有方法
 */
const MODE_Choosing = {
    DealContent: (rawContent) => {
        // rawContent.replace(/\n\n/gm, "^^");
        // rawContent.replace(/\n/gm, "##");
        let Q_A = [];
        Q_A = rawContent.split("^^");
        Q_A.shift();
        let finalContent = [];
        finalContent = Q_A?.map((e) => {
            let t = e.split("##");
            return [t[0], t[t.length - 1]];
        });
        return finalContent;
    },
    /**
     * 设定下一个问题和答案, 并登记到current中
     */
    SetNextQuestion: () => {
        // let ranNum = (Math.random() * (CURRENT.contentArray.length)) >> 0;

        // current的问题库(questionPool)是一个数组, 里面存放的是问题的索引
        // 先判断问题库是否为空, 如果为空, 就把问题库重置
        // 如果不为空, 就从问题库中随机取一个问题的索引
        let ranNum = 0;
        if (CURRENT.questionPool.length == 0) {
            // set_times是一个问题在问题库标准出现的次数
            const set_times = SETTING.settings.poolSize;
            // 每个索引值依据CURRENT.rateList生成的数量
            // 问题索引对应的rateList位置的值, 代表了该问题的出现概率, 小于0的值代表了该问题不出现, 大于零的值代表了该问题要出现times的次数倍, 没有值则就是times次
            // 例如rateList[20] = 1.2, 那么问题索引为20的问题, 会出现1.2*times次, 最后四舍五入取整
            CURRENT.questionPool = [];
            for (let i = 0; i < CURRENT.contentArray.length; i++) {
                let times = 0;
                if (!CURRENT.rateList[i]) times = set_times;
                else if (CURRENT.rateList[i] > 0)
                    times = Math.round(CURRENT.rateList[i] * set_times);
                else times = 0;
                for (let j = 0; j < times; j++) {
                    CURRENT.questionPool.push(i);
                }
            }
        }

        // 从问题库中随机取一个问题的索引, 并从问题库中删除该索引
        ranNum = CURRENT.questionPool.splice(
            (Math.random() * CURRENT.questionPool.length) >> 0,
            1
        )[0];
        CURRENT.questionId = ranNum;

        // 将问题和答案分别登记到current中
        CURRENT.question = CURRENT.contentArray[ranNum][0];
        CURRENT.answer1 = CURRENT.contentArray[ranNum][1];
    },
    DisplayQuestion: () => {
        let target = null;
        let question = CURRENT.question;
        // 清空target中的内容
        target.innerHTML = "";

        // 判断"|"是否存在
        if (question.indexOf("|") == -1) {
            // 创建一个h5标签, 存在node变量中
            let node = document.createElement("h5");
            // 给h5标签添加一个class
            node.className = "question";
            // 如果问题的长度大于20, 就给h5标签添加一个class: long-question, 否则就添加一个class: short-question
            if (question.length > 20) node.classList.add("long-question");
            else node.classList.add("short-question");
            // 将问题的内容添加到h5标签中
            node.innerHTML = GLOBAL.DealDisplayString(CURRENT.question);
            // 将h5标签添加到target中
            target.appendChild(node);
        } else {
            // 建一个ul标签, 容纳多个h5标签
            let ul = document.createElement("ul");
            // 如果有|出现, 那么|隔开的多个答案, 分别重复上面的操作
            // 中文的|也一样的操作, 所以用正则表达式匹配
            let questions = question.split(/\s*[\|｜]\s*/);
            questions.forEach((e) => {
                let node = document.createElement("h5");
                node.className = "question";
                if (e.length > 40) node.classList.add("long-question");
                else node.classList.add("short-question");
                node.innerHTML = GLOBAL.DealDisplayString(e);
                // 将h5标签添加到ul标签中
                ul.appendChild(node);
            });
            // ul的class是questions
            ul.className = "questions";
            // 将ul标签添加到target中
            target.appendChild(ul);
        }

        // 生成图片的标识
        generatePattern(question);
        // 显示问题出现的频次
        GLOBAL.DisplayQuestionRate();
    },
    DisplayQuestionAndAnswer: () => {
        let target = null,
            question = CURRENT.question,
            answer = CURRENT.answer1;
        // 清空target中的内容
        target.innerHTML = "";

        // 判断"|"是否存在
        if (question.indexOf("|") == -1) {
            // 创建一个h5标签, 存在node1变量中
            let node1 = document.createElement("h5");
            // 给h5标签添加一个class
            node1.className = "question";
            // 如果问题的长度大于20, 就给h5标签添加一个class: long-question, 否则就添加一个class: short-question
            if (question.length > 20) node1.classList.add("long-question");
            else node1.classList.add("short-question");
            // 将问题的内容添加到h5标签中
            node1.innerHTML = GLOBAL.DealDisplayString(CURRENT.question);
            // 将h5标签添加到target中
            target.appendChild(node1);

            // 创建一个h7标签, 存在node2变量中
            let node2 = document.createElement("h7");
            node2.className = "answer";
            if (answer.length > 40) node2.classList.add("long-answer");
            else node2.classList.add("short-answer");
            node2.innerHTML = GLOBAL.DealDisplayString(CURRENT.answer1);
            target.appendChild(node2);
        } else {
            // 建一个ul标签, 容纳多个h5标签
            let ul1 = document.createElement("ul");
            // 如果有|出现, 那么|隔开的多个答案, 分别重复上面的操作
            let questions = question.split(/\s*[\|｜]\s*/);
            questions.forEach((e) => {
                let node = document.createElement("h5");
                node.className = "question";
                if (e.length > 20) node.classList.add("long-question");
                else node.classList.add("short-question");
                node.innerHTML = GLOBAL.DealDisplayString(e);
                // 将h5标签添加到ul标签中
                ul1.appendChild(node);
            });
            // ul的class是questions
            ul1.className = "questions";

            // 建一个ul标签, 容纳多个h7标签
            let ul2 = document.createElement("ul");
            // 如果有|出现, 那么|隔开的多个答案, 分别重复上面的操作
            let answers = answer.split("|");
            answers.forEach((e) => {
                let node = document.createElement("h7");
                node.className = "answer";
                if (e.length > 40) node.classList.add("long-answer");
                else node.classList.add("short-answer");
                node.innerHTML = GLOBAL.DealDisplayString(e);
                // 将h7标签添加到ul标签中
                ul2.appendChild(node);
            });
            // ul的class是answers
            ul2.className = "answers";

            // 将ul标签添加到target中
            target.appendChild(ul1);
            target.appendChild(ul2);
        }
    },
};
//#endregion

/**
 * 全局变量和全局函数
 */
const GLOBAL = {
    flag_showAnswer: false,
    flag_rectify: false,

    NextQuestion: () => {
        GetModeByModeName(CURRENT.mode).SetNextQuestion();
        GetModeByModeName(CURRENT.mode).DisplayQuestion();
        this.flag_showAnswer = true;
    },
    DisplayAnswer: () => {
        GetModeByModeName(CURRENT.mode).DisplayQuestionAndAnswer();
        this.flag_showAnswer = false;
    },
    DisplayQuestionRate: () => {
        // todo: 显示问题出现的频次率
        // let currentRate = CURRENT.rateList[CURRENT.questionId];
        // let tds = $("tr#book-info-display>td").get();
        // tds[4].innerHTML = String(currentRate ? currentRate.toFixed(1) : 1);
    },
    MemorizeQuestionRateList: () => {
        let currentBookId = CURRENT.bookId;
        let currentRateList = CURRENT.rateList;
        let questionRateList = JSON.parse(
            localStorage.getItem("questionRateList")
        );
        // 如果questionRateList不是数组, 就创建一个
        if (!Array.isArray(questionRateList)) questionRateList = [];
        questionRateList[currentBookId] = currentRateList;
        localStorage.setItem(
            "questionRateList",
            JSON.stringify(questionRateList)
        );
    },
    /**
     * 处理显示字符串
     * @param {string} str
     * @returns {string}
     * @description
     * 1. 以//开头, 行尾或^^收尾的注释, 去掉
     * 2. 换行符改为\<br\>标签
     * 3. 制表符改为4个空格
     * 4. 方括号改为\<strong\>标签
     * 5. 不改变分隔符 "|" !!!
     */
    DealDisplayString: (str) => {
        let result = str;
        // 以//开头, 行尾或^^收尾的注释, 去掉
        result = result.replace(/\/\/(.+?)(?=\^\^|$)/gm, "");
        // 换行符改为<br>标签
        result = result.replace(/ ?\\n ?/g, "<br>");
        // 制表符改为4个空格
        result = result.replace(/\\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;");
        // 方括号改为<strong>标签
        result = result.replace(/\[(.+?)\]/g, "<strong>$1</strong>");
        // $符号中间的内容改为<code>标签
        result = result.replace(/\$(.+?)\$/g, "<code>$1</code>");

        return result.trim();
    },

    ShowQA: () => {
        // todo: 显示问题和答案
        // if (!CURRENT.bookName && !CURRENT.mode) {
        //     let target = null;
        //     target.innerHTML = `没有选定的辞书!<br>快去录入辞书吧!`;
        //     $(".showQA-btn")[0].innerText = "选择辞书后刷新";
        // }
        // if (GLOBAL.flag_showAnswer) {
        //     GLOBAL.DisplayAnswer();
        //     $(".showQA-btn")[0].innerText = "再来一题";
        //     GLOBAL.flag_showAnswer = false;
        // } else {
        //     GLOBAL.NextQuestion();
        //     $(".showQA-btn")[0].innerText = "显示答案";
        //     GLOBAL.flag_showAnswer = true;
        // }
    },

    ConfirmLoadBook: () => {
        // todo: 加载辞书
        // let rawbook = {};
        // rawbook.name = $("#book-info_1")[0].value;
        // rawbook.mode = $("#book-info_2")[0].value;
        // rawbook.rawContent = $("#book-info_3")[0].value;
        // let book = new Book(JSON.stringify(rawbook));
        // BOOKS.books.push(book);
        // BOOKS.SaveBooksIntoLocalStorage();
        // BOOKS.RefreshBookGridPannel();
        // hsycms.success();
        // $("form#LoadBook")[0].reset();
        return false;
    },

    RectifyCurrentBook: () => {
        // todo: 修改辞书
        // let r1 = $("#rectify_1")[0];
        // let r2 = $("#rectify_2")[0];
        // let r3 = $("#rectify_3")[0];
        // let book = BOOKS.books[CURRENT.bookId];
        // r1.value = book.name;
        // r2.value = book.mode;
        // r3.value = book.rawContent;
        GLOBAL.flag_rectify = false;
    },

    ConfirmRectifyBook: () => {
        // todo: 确认修改辞书
        // if (!GLOBAL.flag_rectify) return false;
        // let r1 = $("#rectify_1")[0].value;
        // let r2 = $("#rectify_2")[0].value;
        // let r3 = $("#rectify_3")[0].value;
        // let _book = {};
        // _book.name = r1;
        // _book.mode = r2;
        // _book.rawContent = r3;
        // BOOKS.books[CURRENT.bookId] = deepCopy(new Book(JSON.stringify(_book)), false);
        // BOOKS.SaveBooksIntoLocalStorage();
        // BOOKS.RefreshBookGridPannel();
        // CURRENT.OpenBookByBookID(CURRENT.bookId);
        // $("form#RectifyBook")[0].reset();
        // hsycms.success();
        return false;
    },
    ConfirmSetting: () => {
        // todo: 确认设置
        // SETTING.settings.start_rememberLastBook = $("#setting_1")[0].checked;
        // SETTING.settings.start_showSentence = $("#setting_2")[0].checked;
        // let aaa = $(".setting-color-grid").get();
        // let value = 0;
        // for (let i = 0; i < aaa.length; i++) {
        //     const a = aaa[i];
        //     if (a.checked) {
        //         value = a.value * 1;
        //         break;
        //     }
        // }
        // SETTING.settings.theme_color = value;
        // SETTING.settings.poolSize = $("#stepper-input__input")[0].value;
        // SETTING.settings.poolSize =
        //     SETTING.settings.poolSize * 1 <= 1
        //         ? 5
        //         : Math.floor(SETTING.settings.poolSize * 1);
        // SETTING.SaveSettingsToLocalStorage();
        // SETTING.ApplySetting();
        // hsycms.success();
        return false;
    },

    DisplayTutorial: () => {
        //todo:一个遮挡层, 做任意事件就消失
    },

    DisplaySentence: () => {
        //todo:需要几个一言库, 做一个api接口
    },
};

/**
 * Div: main函数
 * 初始化成功就运行, 完成所有初始化
 */
function main() {
    // 将存储中的书导出到BOOKS
    BOOKS.GetBooksFromLocalStorage();
    // 将存储中的设置导出到SETTINGS.setting并应用
    SETTING.GetSettingsFromLocalStorageThenApply();
    // 按照SETTINGS打开最近看的辞书或者有设置过的初始辞书
    CURRENT.OpenBookByBookID(
        SETTING.settings.start_rememberLastBook
            ? SETTING.settings.lastBookID
            : 0
    );
}

class Core extends React.PureComponent {
    constructor(props) {
        super(props);
        let { turnTo } = props;
        this.state = {
            books: [],
            selectBooks: [],
            chosenBooks: [],
            questionQueue: [["default", "默认"]],
            currentMode: "",
            currentQuestion: ["default", "默认"],
            showAnsFlag: false,
            responsive: false,
        };
    }

    getNewQuestionQueue() {
        let allQuestion = [];
        this.state.books.map((book) => {
            if(this.state.chosenBooks.includes(book.id)) {
                allQuestion = allQuestion.concat(book.contentArray);
            }
        });
        allQuestion.sort(() => Math.random() - 0.5); // 打乱数组
        return allQuestion;
    }

    setQuestion() {
        this.setState((preState) => ({
            showAnsFlag: false,
            currentQuestion: preState.questionQueue[0],
        }));
    }

    nextQuestion() {
        // todo: 加载下一个问题
        // 弹出问题队列的第一个问题
        // 如果问题队列没有问题, 则重新生成问题队列
        if (this.state.questionQueue.length <= 1) {
            let allQuestion = this.getNewQuestionQueue();
            this.setState((preState) => ({
                questionQueue: allQuestion,
            }));
        } else {
            this.setState((preState) => {
                let newQuestionQueue = preState.questionQueue;
                newQuestionQueue.shift();
                return {
                    questionQueue: newQuestionQueue,
                };
            });
        }
        this.setQuestion();
    }

    // div: 初始化
    componentDidMount() {
        let chosenBooks = JSON.parse(localStorage.getItem("chosenBooks"));
        this.setState((preState) => ({
            books: GetBooksFromLocalStorage(),
            chosenBooks: chosenBooks,
            selectBooks: chosenBooks,
        }));
    }

    showAns() {
        this.setState((preState) => ({
            showAnsFlag: true,
        }));
    }

    nextButtonClick() {
        if (this.state.showAnsFlag) {
            this.nextQuestion();
        } else {
            this.setState((preState) => ({
                showAnsFlag: true,
            }));
        }
    }

    selectChange(value) {
        this.setState((preState) => ({
            selectBooks: value,
        }));
    }

    setBooks() {
        localStorage.setItem(
            "chosenBooks",
            JSON.stringify(this.state.selectBooks)
        );
        this.setState((preState) => ({
            chosenBooks: preState.selectBooks,
            questionQueue: this.getNewQuestionQueue(),
        }));
    }

    render() {
        return (
            <>
                <QuestionAndAnswer
                    qa={this.state.currentQuestion}
                    showAns={() => {
                        this.showAns();
                    }}
                    showAnsFlag={this.state.showAnsFlag}
                    mode={this.state.currentMode}
                    onCorrect={() => {}}
                    onWrong={() => {}}
                />

                <Card style={{ marginBlockStart: 8 }}>
                    <Flex justify={"space-around"} align={"center"}>
                        <Button
                            size={"large"}
                            disabled={this.state.books.length < 1}
                        >
                            收藏
                        </Button>
                        <Divider
                            type={
                                this.state.responsive
                                    ? "horizontal"
                                    : "vertical"
                            }
                        />
                        <Button
                            onClick={() => {
                                this.nextButtonClick();
                            }}
                            disabled={this.state.books.length < 1}
                        >
                            {this.state.showAnsFlag ? "下一题" : "忘了"}
                        </Button>
                    </Flex>
                </Card>

                <RcResizeObserver
                    key="resize-observer"
                    onResize={(offset) => {
                        this.setState((preState) => ({
                            responsive: offset.width < 596,
                        }));
                    }}
                >
                    <ProCard
                        style={{ marginBlockStart: 8 }}
                        direction={this.state.responsive ? "column" : "row"}
                    >
                        <ProCard.Group
                            title="辞书配置"
                            direction={this.state.responsive ? "column" : "row"}
                        >
                            <ProCard>
                                <Statistic title="本次背词计数" value={0} />
                            </ProCard>
                            <Divider
                                type={
                                    this.state.responsive
                                        ? "horizontal"
                                        : "vertical"
                                }
                            />
                            <ProCard>
                                <Statistic
                                    title="准确率"
                                    value={100.0}
                                    precision={2}
                                    suffix="%"
                                />
                            </ProCard>
                            <Divider
                                type={
                                    this.state.responsive
                                        ? "horizontal"
                                        : "vertical"
                                }
                            />
                            <ProCard
                                title=<Text type="secondary">辞书选择</Text>
                                style={{ maxWidth: 300 }}
                                actions={
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            padding: 12,
                                            flex: 1,
                                            gap: 8,
                                        }}
                                        onClick={() => {
                                            this.setBooks();
                                            message.success("设置成功!");
                                        }}
                                    >
                                        <SettingOutlined key="setting" />
                                        应用设置
                                    </div>
                                }
                            >
                                <Select
                                    mode="multiple"
                                    style={{ width: "100%" }}
                                    placeholder="select books"
                                    value={this.state.selectBooks}
                                    onChange={(value) => {
                                        this.selectChange(value);
                                    }}
                                    options={this.state.books.map((book) => ({
                                        label: book.name,
                                        value: book.id,
                                        desc: book.name,
                                    }))}
                                    optionRender={(option) => (
                                        <Space>{option.data.desc}</Space>
                                    )}
                                />
                            </ProCard>
                        </ProCard.Group>
                    </ProCard>
                </RcResizeObserver>
            </>
        );
    }
}

export default Core;

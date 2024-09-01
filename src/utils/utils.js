export const deepCopy = function (source, isArray) {
    var result = {};
    if (isArray) var result = [];
    for (var key in source) {
        if (Object.prototype.toString.call(source[key]) === "[object Object]") {
            result[key] = deepCopy(source[key]);
        }
        if (Object.prototype.toString.call(source[key]) === "[object Array]") {
            result[key] = deepCopy(source[key], 1);
        } else {
            result[key] = source[key];
        }
    }
    return result;
};

// 简易的md转html
export const md2html = function (md) {
    // 分别替换两个尖括号
    md = md.replace(/</gm, "&lt;");
    md = md.replace(/>/gm, "&gt;");

    // 加粗
    md = md.replace(/\*\*(.+?)\*\*/gm, "<strong>$1</strong>");

    // 代码
    md = md.replace(/\$(.+?)\$/gm, "<code>$1</code>");

    // 链接
    md = md.replace(
        /\[(.+?)\]\((.+?)\)/gm,
        "<a target='_blank' href='$2'>$1</a>"
    );

    // 句子中间的多个空格替换为html中相同数量的空格
    md = md.replace(/  /gm, "&nbsp;&nbsp;");

    // 一级标题
    md = md.replace(/^# (.+?)$/gm, "<h1>$1</h1>");

    // 二级标题
    md = md.replace(/^## (.+?)$/gm, "<h2>$1</h2>");

    // 三级标题
    md = md.replace(/^### (.+?)$/gm, "<h3>$1</h3>");

    // 其余的行前后加上p标签, 如果一行的末尾有2个空格则在末尾加上<br>
    md = md.replace(/^(.+?)$/gm, "<p>$1</p>");
    md = md.replace(/<p>(.+?)  <\/p>/gm, "<p>$1</p><br>");

    return md;
};

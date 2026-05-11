// ========== 1. 定义你的语录数据 ==========
// 格式：{ content: "语录内容", author: "作者名", tags: ["分类1", "分类2"] }
const quotes = [
    { content: "世上只有一种英雄主义，就是在认清生活真相之后依然热爱生活。", author: "罗曼·罗兰", tags: ["文学", "人生"] },
    { content: "且视他人之疑目如盏盏鬼火，大胆地去走你的夜路。", author: "史铁生", tags: ["文学", "勇气"] },
    { content: "The unexamined life is not worth living.", author: "Socrates", tags: ["英语", "哲学"] },
    { content: "Stay hungry, stay foolish.", author: "Steve Jobs", tags: ["英语", "工作"] },
    { content: "人生如逆旅，我亦是行人。", author: "苏轼", tags: ["文学", "人生"] },
    { content: "你必须活在当下，乘着每一个波浪，在每一刻找到你的永恒。", author: "梭罗", tags: ["人生", "自然"] },
    { content: "对未来的真正慷慨，是把一切都献给现在。", author: "阿尔贝·加缪", tags: ["人生", "哲学"] },
    // 你可以继续添加更多...
];

// ========== 2. 获取所有分类 ==========
function getAllTags() {
    const tags = new Set();
    tags.add("全部");
    quotes.forEach(q => {
        q.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
}

// ========== 3. 存放当前状态 ==========
const state = {
    currentTag: "全部",
    searchKeyword: ""
};

// ========== 4. 主渲染函数 ==========
function renderApp(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";

    // --- 搜索框（带清空按钮） ---
    const searchRow = document.createElement("div");
    searchRow.style.display = "flex";
    searchRow.style.gap = "10px";
    searchRow.style.marginBottom = "20px";

    const searchBox = document.createElement("input");
    searchBox.type = "text";
    searchBox.placeholder = "搜索名言，按回车或点击按钮查找...";
    searchBox.style.flex = "1";
    searchBox.style.padding = "12px 16px";
    searchBox.style.fontSize = "16px";
    searchBox.style.border = "2px solid #e0e0e0";
    searchBox.style.borderRadius = "12px";
    searchBox.style.boxSizing = "border-box";
    searchBox.style.outline = "none";
    searchBox.style.transition = "border-color 0.2s";
    searchBox.value = state.searchKeyword;
    searchBox.addEventListener("focus", () => { searchBox.style.borderColor = "#A31F34"; });
    searchBox.addEventListener("blur", () => { searchBox.style.borderColor = "#e0e0e0"; });

    const clearBtn = document.createElement("button");
    clearBtn.innerHTML = "✕";
    clearBtn.style.padding = "8px 12px";
    clearBtn.style.background = "transparent";
    clearBtn.style.border = "none";
    clearBtn.style.fontSize = "18px";
    clearBtn.style.cursor = "pointer";
    clearBtn.style.color = "#999";
    clearBtn.style.display = searchBox.value ? "inline" : "none";
    clearBtn.addEventListener("click", () => {
        searchBox.value = "";
        state.searchKeyword = "";
        clearBtn.style.display = "none";
        renderApp(containerId);
    });

    const searchBtn = document.createElement("button");
    searchBtn.textContent = "搜索";
    searchBtn.style.padding = "10px 20px";
    searchBtn.style.background = "#A31F34";
    searchBtn.style.color = "#fff";
    searchBtn.style.border = "none";
    searchBtn.style.borderRadius = "12px";
    searchBtn.style.cursor = "pointer";
    searchBtn.style.fontSize = "16px";
    searchBtn.style.fontFamily = "inherit";

    const doSearch = () => {
        state.searchKeyword = searchBox.value.trim();
        renderApp(containerId);
    };
    searchBox.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            doSearch();
        }
    });
    searchBtn.addEventListener("click", doSearch);

    searchBox.addEventListener("input", () => {
        clearBtn.style.display = searchBox.value ? "inline" : "none";
    });

    searchRow.appendChild(searchBox);
    searchRow.appendChild(clearBtn);
    searchRow.appendChild(searchBtn);
    container.appendChild(searchRow);

    // --- 分类标签按钮 ---
    const tagContainer = document.createElement("div");
    tagContainer.style.display = "flex";
    tagContainer.style.flexWrap = "wrap";
    tagContainer.style.gap = "10px";
    tagContainer.style.marginBottom = "32px";

    const allTags = getAllTags();
    allTags.forEach(tag => {
        const tagBtn = document.createElement("button");
        tagBtn.textContent = tag;
        tagBtn.style.padding = "8px 18px";
        tagBtn.style.border = "2px solid #e0e0e0";
        tagBtn.style.borderRadius = "24px";
        tagBtn.style.background = tag === state.currentTag ? "#A31F34" : "transparent";
        tagBtn.style.color = tag === state.currentTag ? "#fff" : "#555";
        tagBtn.style.cursor = "pointer";
        tagBtn.style.fontSize = "14px";
        tagBtn.style.transition = "all 0.2s";
        tagBtn.style.fontFamily = "inherit";

        if (tag !== state.currentTag) {
            tagBtn.addEventListener("mouseenter", () => {
                tagBtn.style.borderColor = "#A31F34";
                tagBtn.style.color = "#A31F34";
            });
            tagBtn.addEventListener("mouseleave", () => {
                tagBtn.style.borderColor = "#e0e0e0";
                tagBtn.style.color = "#555";
            });
        }

        tagBtn.addEventListener("click", () => {
            state.currentTag = tag;
            state.searchKeyword = "";
            renderApp(containerId);
        });
        tagContainer.appendChild(tagBtn);
    });
    container.appendChild(tagContainer);

    // --- 语录列表容器 ---
    const quoteListContainer = document.createElement("div");
    container.appendChild(quoteListContainer);
    renderQuoteList(quoteListContainer);
}

// ========== 5. 渲染语录列表 ==========
function renderQuoteList(container) {
    container.innerHTML = "";

    const filtered = quotes.filter(q => {
        if (state.currentTag !== "全部" && !q.tags.includes(state.currentTag)) {
            return false;
        }
        if (state.searchKeyword.trim() !== "") {
            const keyword = state.searchKeyword.trim().toLowerCase();
            const inContent = q.content.toLowerCase().includes(keyword);
            const inAuthor = q.author.toLowerCase().includes(keyword);
            if (!inContent && !inAuthor) return false;
        }
        return true;
    });

    if (filtered.length === 0) {
        const emptyMsg = document.createElement("p");
        emptyMsg.textContent = "没有找到匹配的名言。";
        emptyMsg.style.textAlign = "center";
        emptyMsg.style.color = "#888";
        emptyMsg.style.padding = "40px 0";
        container.appendChild(emptyMsg);
        return;
    }

    filtered.forEach(quote => {
        const card = document.createElement("blockquote");
        card.style.background = "#fff";
        card.style.border = "1px solid #f0f0f0";
        card.style.borderRadius = "16px";
        card.style.padding = "24px 28px";
        card.style.margin = "0 0 20px 0";
        card.style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)";
        card.style.transition = "box-shadow 0.2s, transform 0.2s";
        card.style.lineHeight = "1.7";

        card.addEventListener("mouseenter", () => {
            card.style.boxShadow = "0 6px 20px rgba(0,0,0,0.08)";
            card.style.transform = "translateY(-2px)";
        });
        card.addEventListener("mouseleave", () => {
            card.style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)";
            card.style.transform = "none";
        });

        const contentP = document.createElement("p");
        contentP.textContent = quote.content;
        contentP.style.margin = "0 0 12px 0";
        contentP.style.fontSize = "18px";
        contentP.style.fontWeight = "500";
        contentP.style.color = "#222";
        contentP.style.fontStyle = "italic";
        card.appendChild(contentP);

        const bottomRow = document.createElement("div");
        bottomRow.style.display = "flex";
        bottomRow.style.flexWrap = "wrap";
        bottomRow.style.alignItems = "center";
        bottomRow.style.justifyContent = "space-between";
        bottomRow.style.gap = "12px";

        if (quote.author) {
            const authorSpan = document.createElement("span");
            authorSpan.textContent = "—— " + quote.author;
            authorSpan.style.color = "#666";
            authorSpan.style.fontSize = "14px";
            bottomRow.appendChild(authorSpan);
        }

        if (quote.tags && quote.tags.length > 0) {
            const tagsRow = document.createElement("div");
            tagsRow.style.display = "flex";
            tagsRow.style.flexWrap = "wrap";
            tagsRow.style.gap = "6px";
            quote.tags.forEach(tag => {
                const tagSpan = document.createElement("span");
                tagSpan.textContent = tag;
                tagSpan.style.padding = "3px 12px";
                tagSpan.style.background = "#f5f5f5";
                tagSpan.style.borderRadius = "16px";
                tagSpan.style.fontSize = "12px";
                tagSpan.style.color = "#777";
                tagsRow.appendChild(tagSpan);
            });
            bottomRow.appendChild(tagsRow);
        }

        card.appendChild(bottomRow);
        container.appendChild(card);
    });
}

// ========== 6. 启动一切 ==========
document.addEventListener("DOMContentLoaded", function() {
    renderApp("app");
});
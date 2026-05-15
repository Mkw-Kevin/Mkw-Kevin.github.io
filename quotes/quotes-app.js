// ========== 1. 定义你的语录数据 ==========
const quotes = [
    { content: "世上只有一种英雄主义，就是在认清生活真相之后依然热爱生活。", author: "罗曼·罗兰", tags: ["文学", "人生"] },
    { content: "且视他人之疑目如盏盏鬼火，大胆地去走你的夜路。", author: "史铁生", tags: ["文学", "勇气"] },
    { content: "The unexamined life is not worth living.", author: "Socrates", tags: ["英语", "哲学"] },
    { content: "Stay hungry, stay foolish.", author: "Steve Jobs", tags: ["英语", "工作"] },
    { content: "人生如逆旅，我亦是行人。", author: "苏轼", tags: ["文学", "人生"] },
    { content: "你必须活在当下，乘着每一个波浪，在每一刻找到你的永恒。", author: "梭罗", tags: ["人生", "自然"] },
    { content: "对未来的真正慷慨，是把一切都献给现在。", author: "阿尔贝·加缪", tags: ["人生", "哲学"] },
];

// ========== 2. 获取所有分类 ==========
function getAllTags() {
    const tags = new Set();
    quotes.forEach(q => {
        q.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
}

// ========== 3. 状态 ==========
const state = {
    selectedTags: [],
    searchKeyword: "",
    sidebarOpen: true // 侧边栏默认展开
};

// ========== 4. 主渲染函数 ==========
function renderApp(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";

    // --- 顶部搜索框 ---
    const searchRow = document.createElement("div");
    searchRow.style.display = "flex";
    searchRow.style.marginBottom = "20px";

    const searchBoxWrapper = document.createElement("div");
    searchBoxWrapper.style.position = "relative";
    searchBoxWrapper.style.flex = "1";

    const searchBox = document.createElement("input");
    searchBox.type = "text";
    searchBox.placeholder = "搜索好言...";
    searchBox.style.width = "100%";
    searchBox.style.padding = "12px 40px 12px 16px";
    searchBox.style.fontSize = "16px";
    searchBox.style.border = "2px solid #e0e0e0";
    searchBox.style.borderRadius = "12px";
    searchBox.style.boxSizing = "border-box";
    searchBox.style.outline = "none";
    searchBox.value = state.searchKeyword;
    searchBox.addEventListener("focus", () => { searchBox.style.borderColor = "#A31F34"; });
    searchBox.addEventListener("blur", () => { searchBox.style.borderColor = "#e0e0e0"; });

    const clearBtn = document.createElement("button");
    clearBtn.innerHTML = "✕";
    clearBtn.style.position = "absolute";
    clearBtn.style.right = "12px";
    clearBtn.style.top = "50%";
    clearBtn.style.transform = "translateY(-50%)";
    clearBtn.style.background = "transparent";
    clearBtn.style.border = "none";
    clearBtn.style.fontSize = "16px";
    clearBtn.style.cursor = "pointer";
    clearBtn.style.color = "#999";
    clearBtn.style.display = searchBox.value ? "block" : "none";
    clearBtn.addEventListener("click", () => {
        searchBox.value = "";
        state.searchKeyword = "";
        clearBtn.style.display = "none";
        const quoteListContainer = document.getElementById("quote-list-container");
        if (quoteListContainer) renderQuoteList(quoteListContainer);
    });

    searchBox.addEventListener("input", () => {
        state.searchKeyword = searchBox.value.trim();
        clearBtn.style.display = searchBox.value ? "block" : "none";
        const quoteListContainer = document.getElementById("quote-list-container");
        if (quoteListContainer) renderQuoteList(quoteListContainer);
    });

    searchBoxWrapper.appendChild(searchBox);
    searchBoxWrapper.appendChild(clearBtn);
    searchRow.appendChild(searchBoxWrapper);
    container.appendChild(searchRow);

    // --- 可折叠侧边栏按钮 ---
    const toggleBtn = document.createElement("button");
    toggleBtn.innerHTML = "☰ 分类";
    toggleBtn.style.padding = "8px 16px";
    toggleBtn.style.marginBottom = "12px";
    toggleBtn.style.background = "#f5f5f5";
    toggleBtn.style.border = "1px solid #e0e0e0";
    toggleBtn.style.borderRadius = "8px";
    toggleBtn.style.cursor = "pointer";
    toggleBtn.style.fontSize = "14px";
    container.appendChild(toggleBtn);

    // --- 主布局（侧边栏 + 右侧列表） ---
    const mainRow = document.createElement("div");
    mainRow.style.display = "flex";
    mainRow.style.gap = "30px";
    mainRow.style.alignItems = "flex-start";

    // 左侧分类栏容器（用于控制折叠）
    const sideBarWrapper = document.createElement("div");
    sideBarWrapper.id = "sidebar-wrapper";
    sideBarWrapper.style.width = state.sidebarOpen ? "180px" : "0";
    sideBarWrapper.style.overflow = "hidden";
    sideBarWrapper.style.transition = "width 0.3s ease";
    sideBarWrapper.style.flexShrink = "0";

    // 左侧分类栏内容
    const sideBar = document.createElement("div");
    sideBar.style.width = "180px";
    sideBar.style.padding = state.sidebarOpen ? "12px 0" : "0";
    sideBar.style.borderRight = state.sidebarOpen ? "1px solid #eee" : "none";
    sideBar.style.transition = "padding 0.3s";

    // 清空选择按钮（始终在侧边栏内部）
    const clearTagBtn = document.createElement("div");
    clearTagBtn.textContent = "清空筛选";
    clearTagBtn.style.fontSize = "12px";
    clearTagBtn.style.color = "#999";
    clearTagBtn.style.marginTop = "12px";
    clearTagBtn.style.cursor = "pointer";
    clearTagBtn.style.display = state.sidebarOpen ? "block" : "none";
    clearTagBtn.addEventListener("click", () => {
        state.selectedTags = [];
        // 重新渲染侧边栏和列表
        renderSidebarContent(sideBar);
        const quoteListContainer = document.getElementById("quote-list-container");
        if (quoteListContainer) renderQuoteList(quoteListContainer);
    });

    // 首次填充侧边栏内容
    renderSidebarContent(sideBar, clearTagBtn);
    sideBar.appendChild(clearTagBtn);
    sideBarWrapper.appendChild(sideBar);
    mainRow.appendChild(sideBarWrapper);

    // 右侧卡片列表
    const quoteListContainer = document.createElement("div");
    quoteListContainer.id = "quote-list-container";
    quoteListContainer.style.flex = "1";
    mainRow.appendChild(quoteListContainer);
    container.appendChild(mainRow);

    // 折叠按钮点击事件
    toggleBtn.addEventListener("click", () => {
        state.sidebarOpen = !state.sidebarOpen;
        sideBarWrapper.style.width = state.sidebarOpen ? "180px" : "0";
        sideBar.style.padding = state.sidebarOpen ? "12px 0" : "0";
        sideBar.style.borderRight = state.sidebarOpen ? "1px solid #eee" : "none";
        clearTagBtn.style.display = state.sidebarOpen ? "block" : "none";
        // 重新渲染侧边栏内容（确保状态同步）
        renderSidebarContent(sideBar, clearTagBtn);
    });

    renderQuoteList(quoteListContainer);
}

// ========== 5. 渲染侧边栏内容（不含✓，保留选中样式） ==========
function renderSidebarContent(sideBar, clearTagBtn) {
    // 清空除清空按钮外的内容
    sideBar.innerHTML = "";
    
    const allTags = getAllTags();
    allTags.forEach(tag => {
        const item = document.createElement("div");
        item.style.padding = "8px 12px";
        item.style.marginBottom = "6px";
        item.style.borderRadius = "8px";
        item.style.cursor = "pointer";
        item.style.fontSize = "14px";
        item.style.transition = "background 0.2s, color 0.2s";
        // 选中样式：变红 + 浅红背景
        if (state.selectedTags.includes(tag)) {
            item.style.color = "#A31F34";
            item.style.background = "#fdf0f2";
            item.style.fontWeight = "600";
        } else {
            item.style.color = "#555";
            item.style.background = "transparent";
            item.style.fontWeight = "normal";
        }

        item.textContent = tag;

        item.addEventListener("click", () => {
            const index = state.selectedTags.indexOf(tag);
            if (index === -1) {
                state.selectedTags.push(tag);
            } else {
                state.selectedTags.splice(index, 1);
            }
            // 重新渲染侧边栏和列表
            renderSidebarContent(sideBar, clearTagBtn);
            const quoteListContainer = document.getElementById("quote-list-container");
            if (quoteListContainer) renderQuoteList(quoteListContainer);
        });

        sideBar.appendChild(item);
    });

    // 重新添加清空按钮（避免被清除）
    if (clearTagBtn) {
        sideBar.appendChild(clearTagBtn);
    }
}

// ========== 6. 渲染语录列表（多选逻辑） ==========
function renderQuoteList(container) {
    container.innerHTML = "";

    const filtered = quotes.filter(q => {
        if (state.selectedTags.length > 0) {
            const hasTag = q.tags.some(t => state.selectedTags.includes(t));
            if (!hasTag) return false;
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
        emptyMsg.textContent = "没有找到匹配的好言。";
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

// ========== 7. 启动 ==========
document.addEventListener("DOMContentLoaded", function() {
    renderApp("app");
});
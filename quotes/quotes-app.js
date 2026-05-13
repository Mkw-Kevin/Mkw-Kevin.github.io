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

// ========== 3. 检测当前是否为深色模式 ==========
function isDarkMode() {
    const html = document.documentElement;
    return html.getAttribute('data-theme') === 'dark';
}

// ========== 4. 获取当前主题颜色 ==========
function getThemeColors() {
    const dark = isDarkMode();
    return {
        // 页面背景与文字
        bg: dark ? '#1a1a1a' : '#ffffff',
        text: dark ? '#e0e0e0' : '#222222',
        textSecondary: dark ? '#aaaaaa' : '#666666',
        // 卡片样式
        cardBg: dark ? '#2a2a2a' : '#ffffff',
        cardBorder: dark ? '#3a3a3a' : '#f0f0f0',
        cardShadow: dark ? '0 2px 12px rgba(0,0,0,0.3)' : '0 2px 12px rgba(0,0,0,0.04)',
        cardShadowHover: dark ? '0 6px 20px rgba(0,0,0,0.5)' : '0 6px 20px rgba(0,0,0,0.08)',
        // 输入框样式
        inputBg: dark ? '#2a2a2a' : '#ffffff',
        inputBorder: dark ? '#444444' : '#e0e0e0',
        inputBorderFocus: '#A31F34',
        inputText: dark ? '#e0e0e0' : '#222222',
        inputPlaceholder: dark ? '#777777' : '#999999',
        // 分类栏样式
        sidebarBg: dark ? '#1a1a1a' : '#ffffff',
        sidebarBorder: dark ? '#333333' : '#eeeeee',
        sidebarTitle: dark ? '#cccccc' : '#333333',
        tagDefaultBg: dark ? 'transparent' : 'transparent',
        tagDefaultColor: dark ? '#bbbbbb' : '#555555',
        tagDefaultBorder: dark ? '#444444' : '#e0e0e0',
        tagSelectedBg: dark ? '#3d1a1f' : '#fdf0f2',
        tagSelectedColor: '#A31F34',
        tagHoverBorder: '#A31F34',
        tagHoverColor: '#A31F34',
        // 清空按钮
        clearTagColor: dark ? '#888888' : '#999999',
        // 折叠按钮
        toggleBg: dark ? '#2a2a2a' : '#f5f5f5',
        toggleBorder: dark ? '#444444' : '#e0e0e0',
        toggleColor: dark ? '#cccccc' : '#333333',
        // 标签胶囊
        tagPillBg: dark ? '#333333' : '#f5f5f5',
        tagPillColor: dark ? '#bbbbbb' : '#777777',
        // 空状态
        emptyColor: dark ? '#888888' : '#888888',
        // 清空搜索按钮
        clearSearchColor: dark ? '#aaaaaa' : '#999999',
    };
}

// ========== 5. 状态 ==========
const state = {
    selectedTags: [],
    searchKeyword: "",
    sidebarOpen: true
};

// ========== 6. 主渲染函数 ==========
function renderApp(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";

    const colors = getThemeColors();

    // 设置容器背景色
    container.style.background = colors.bg;
    container.style.color = colors.text;

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
    searchBox.style.background = colors.inputBg;
    searchBox.style.color = colors.inputText;
    searchBox.style.border = `2px solid ${colors.inputBorder}`;
    searchBox.style.borderRadius = "12px";
    searchBox.style.boxSizing = "border-box";
    searchBox.style.outline = "none";
    searchBox.style.transition = "border-color 0.2s";
    searchBox.value = state.searchKeyword;
    searchBox.addEventListener("focus", () => { searchBox.style.borderColor = colors.inputBorderFocus; });
    searchBox.addEventListener("blur", () => { searchBox.style.borderColor = colors.inputBorder; });
    
    // 占位符颜色
    searchBox.style.setProperty('--placeholder-color', colors.inputPlaceholder);
    searchBox.placeholder = "搜索好言...";

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
    clearBtn.style.color = colors.clearSearchColor;
    clearBtn.style.display = searchBox.value ? "block" : "none";
    clearBtn.addEventListener("click", () => {
        searchBox.value = "";
        state.searchKeyword = "";
        clearBtn.style.display = "none";
        const quoteListContainer = document.getElementById("quote-list-container");
        if (quoteListContainer) renderQuoteList(quoteListContainer, colors);
    });

    searchBox.addEventListener("input", () => {
        state.searchKeyword = searchBox.value.trim();
        clearBtn.style.display = searchBox.value ? "block" : "none";
        const quoteListContainer = document.getElementById("quote-list-container");
        if (quoteListContainer) renderQuoteList(quoteListContainer, colors);
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
    toggleBtn.style.background = colors.toggleBg;
    toggleBtn.style.color = colors.toggleColor;
    toggleBtn.style.border = `1px solid ${colors.toggleBorder}`;
    toggleBtn.style.borderRadius = "8px";
    toggleBtn.style.cursor = "pointer";
    toggleBtn.style.fontSize = "14px";
    container.appendChild(toggleBtn);

    // --- 主布局（侧边栏 + 右侧列表） ---
    const mainRow = document.createElement("div");
    mainRow.style.display = "flex";
    mainRow.style.gap = "30px";
    mainRow.style.alignItems = "flex-start";

    const sideBarWrapper = document.createElement("div");
    sideBarWrapper.id = "sidebar-wrapper";
    sideBarWrapper.style.width = state.sidebarOpen ? "180px" : "0";
    sideBarWrapper.style.overflow = "hidden";
    sideBarWrapper.style.transition = "width 0.3s ease";
    sideBarWrapper.style.flexShrink = "0";

    const sideBar = document.createElement("div");
    sideBar.style.width = "180px";
    sideBar.style.padding = state.sidebarOpen ? "12px 0" : "0";
    sideBar.style.borderRight = state.sidebarOpen ? `1px solid ${colors.sidebarBorder}` : "none";
    sideBar.style.transition = "padding 0.3s, border-color 0.3s";
    sideBar.style.background = colors.sidebarBg;

    const clearTagBtn = document.createElement("div");
    clearTagBtn.textContent = "清空筛选";
    clearTagBtn.style.fontSize = "12px";
    clearTagBtn.style.color = colors.clearTagColor;
    clearTagBtn.style.marginTop = "12px";
    clearTagBtn.style.cursor = "pointer";
    clearTagBtn.style.display = state.sidebarOpen ? "block" : "none";
    clearTagBtn.addEventListener("click", () => {
        state.selectedTags = [];
        renderSidebarContent(sideBar, clearTagBtn, colors);
        const quoteListContainer = document.getElementById("quote-list-container");
        if (quoteListContainer) renderQuoteList(quoteListContainer, colors);
    });

    renderSidebarContent(sideBar, clearTagBtn, colors);
    sideBar.appendChild(clearTagBtn);
    sideBarWrapper.appendChild(sideBar);
    mainRow.appendChild(sideBarWrapper);

    const quoteListContainer = document.createElement("div");
    quoteListContainer.id = "quote-list-container";
    quoteListContainer.style.flex = "1";
    mainRow.appendChild(quoteListContainer);
    container.appendChild(mainRow);

    toggleBtn.addEventListener("click", () => {
        state.sidebarOpen = !state.sidebarOpen;
        sideBarWrapper.style.width = state.sidebarOpen ? "180px" : "0";
        sideBar.style.padding = state.sidebarOpen ? "12px 0" : "0";
        sideBar.style.borderRight = state.sidebarOpen ? `1px solid ${colors.sidebarBorder}` : "none";
        clearTagBtn.style.display = state.sidebarOpen ? "block" : "none";
        renderSidebarContent(sideBar, clearTagBtn, colors);
    });

    renderQuoteList(quoteListContainer, colors);
}

// ========== 7. 渲染侧边栏内容 ==========
function renderSidebarContent(sideBar, clearTagBtn, colors) {
    sideBar.innerHTML = "";
    
    const allTags = getAllTags();
    allTags.forEach(tag => {
        const item = document.createElement("div");
        item.style.padding = "8px 12px";
        item.style.marginBottom = "6px";
        item.style.borderRadius = "8px";
        item.style.cursor = "pointer";
        item.style.fontSize = "14px";
        item.style.transition = "background 0.2s, color 0.2s, border-color 0.2s";
        item.style.border = "2px solid transparent";

        if (state.selectedTags.includes(tag)) {
            item.style.color = colors.tagSelectedColor;
            item.style.background = colors.tagSelectedBg;
            item.style.fontWeight = "600";
            item.style.borderColor = colors.tagSelectedColor;
        } else {
            item.style.color = colors.tagDefaultColor;
            item.style.background = colors.tagDefaultBg;
            item.style.fontWeight = "normal";
            item.style.borderColor = "transparent";
        }

        item.textContent = tag;

        item.addEventListener("mouseenter", () => {
            if (!state.selectedTags.includes(tag)) {
                item.style.borderColor = colors.tagHoverBorder;
                item.style.color = colors.tagHoverColor;
            }
        });
        item.addEventListener("mouseleave", () => {
            if (!state.selectedTags.includes(tag)) {
                item.style.borderColor = "transparent";
                item.style.color = colors.tagDefaultColor;
            }
        });

        item.addEventListener("click", () => {
            const index = state.selectedTags.indexOf(tag);
            if (index === -1) {
                state.selectedTags.push(tag);
            } else {
                state.selectedTags.splice(index, 1);
            }
            renderSidebarContent(sideBar, clearTagBtn, colors);
            const quoteListContainer = document.getElementById("quote-list-container");
            if (quoteListContainer) renderQuoteList(quoteListContainer, colors);
        });

        sideBar.appendChild(item);
    });

    if (clearTagBtn) {
        sideBar.appendChild(clearTagBtn);
    }
}

// ========== 8. 渲染语录列表 ==========
function renderQuoteList(container, colors) {
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
        emptyMsg.style.color = colors.emptyColor;
        emptyMsg.style.padding = "40px 0";
        container.appendChild(emptyMsg);
        return;
    }

    filtered.forEach(quote => {
        const card = document.createElement("blockquote");
        card.style.background = colors.cardBg;
        card.style.border = `1px solid ${colors.cardBorder}`;
        card.style.borderRadius = "16px";
        card.style.padding = "24px 28px";
        card.style.margin = "0 0 20px 0";
        card.style.boxShadow = colors.cardShadow;
        card.style.transition = "box-shadow 0.2s, transform 0.2s";
        card.style.lineHeight = "1.7";

        card.addEventListener("mouseenter", () => {
            card.style.boxShadow = colors.cardShadowHover;
            card.style.transform = "translateY(-2px)";
        });
        card.addEventListener("mouseleave", () => {
            card.style.boxShadow = colors.cardShadow;
            card.style.transform = "none";
        });

        const contentP = document.createElement("p");
        contentP.textContent = quote.content;
        contentP.style.margin = "0 0 12px 0";
        contentP.style.fontSize = "18px";
        contentP.style.fontWeight = "500";
        contentP.style.color = colors.text;
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
            authorSpan.style.color = colors.textSecondary;
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
                tagSpan.style.background = colors.tagPillBg;
                tagSpan.style.borderRadius = "16px";
                tagSpan.style.fontSize = "12px";
                tagSpan.style.color = colors.tagPillColor;
                tagsRow.appendChild(tagSpan);
            });
            bottomRow.appendChild(tagsRow);
        }

        card.appendChild(bottomRow);
        container.appendChild(card);
    });
}

// ========== 9. 启动并监听深色模式切换 ==========
document.addEventListener("DOMContentLoaded", function() {
    renderApp("app");
    
    // 监听主题切换事件（Redefine 主题切换时重新渲染）
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'data-theme') {
                renderApp("app");
            }
        });
    });
    observer.observe(document.documentElement, { attributes: true });
});
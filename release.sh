#!/bin/bash
# NodScroll 发布脚本
# 自动化版本发布流程：打包、提交、打标签、推送

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 读取当前版本号
VERSION=$(grep -o '"version": "[^"]*"' manifest.json | cut -d'"' -f4)

echo -e "${BLUE}🚀 NodScroll 发布脚本${NC}"
echo -e "${BLUE}================================${NC}"
echo -e "当前版本: ${GREEN}v${VERSION}${NC}"
echo ""

# 检查工作目录是否干净
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}⚠️  检测到未提交的更改：${NC}"
    git status --short
    echo ""
    read -p "是否继续发布? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${RED}❌ 发布已取消${NC}"
        exit 1
    fi
fi

# 检查 CHANGELOG.md 是否更新
echo -e "${BLUE}📝 检查 CHANGELOG.md...${NC}"
if ! grep -q "\[${VERSION}\]" CHANGELOG.md; then
    echo -e "${RED}❌ 错误: CHANGELOG.md 中未找到版本 ${VERSION} 的记录${NC}"
    echo -e "${YELLOW}请先更新 CHANGELOG.md，添加此版本的更新日志${NC}"
    exit 1
fi
echo -e "${GREEN}✅ CHANGELOG.md 已更新${NC}"
echo ""

# 运行测试（如果有）
# if [ -f "package.json" ] && grep -q "\"test\"" package.json; then
#     echo -e "${BLUE}🧪 运行测试...${NC}"
#     npm test
#     echo -e "${GREEN}✅ 测试通过${NC}"
#     echo ""
# fi

# 打包扩展
echo -e "${BLUE}📦 打包扩展...${NC}"
bash build.sh
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ 打包失败${NC}"
    exit 1
fi
echo ""

# 检查是否已经存在该版本的 tag
if git rev-parse "v${VERSION}" >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  标签 v${VERSION} 已存在${NC}"
    read -p "是否删除旧标签并重新创建? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git tag -d "v${VERSION}"
        git push origin ":refs/tags/v${VERSION}" 2>/dev/null || true
        echo -e "${GREEN}✅ 已删除旧标签${NC}"
    else
        echo -e "${RED}❌ 发布已取消${NC}"
        exit 1
    fi
fi

# 提示输入提交信息
echo -e "${BLUE}📝 请输入提交信息（或按回车使用默认信息）:${NC}"
read -p "> " COMMIT_MSG

if [ -z "$COMMIT_MSG" ]; then
    COMMIT_MSG="Release v${VERSION}

查看详细更新日志: CHANGELOG.md

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
fi

# 提交所有更改
echo ""
echo -e "${BLUE}💾 提交更改...${NC}"
git add -A
git commit -m "$COMMIT_MSG" || {
    echo -e "${YELLOW}⚠️  没有需要提交的更改（可能已经提交）${NC}"
}

# 创建 git tag
echo -e "${BLUE}🏷️  创建标签 v${VERSION}...${NC}"

# 从 CHANGELOG.md 提取此版本的更新日志
TAG_MSG=$(awk "/## \[${VERSION}\]/,/## \[/" CHANGELOG.md | sed '1d;$d' | head -n 50)

if [ -z "$TAG_MSG" ]; then
    TAG_MSG="Release v${VERSION}

查看详细更新日志: CHANGELOG.md"
fi

git tag -a "v${VERSION}" -m "Release v${VERSION}

${TAG_MSG}

---
发布时间: $(date '+%Y-%m-%d %H:%M:%S')
提交哈希: $(git rev-parse --short HEAD)"

echo -e "${GREEN}✅ 标签创建成功${NC}"
echo ""

# 推送到远程
echo -e "${BLUE}🚀 推送到远程仓库...${NC}"
read -p "是否推送到远程? (Y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Nn]$ ]]; then
    git push origin main
    git push origin "v${VERSION}"
    echo -e "${GREEN}✅ 推送成功${NC}"
else
    echo -e "${YELLOW}⏭️  跳过推送${NC}"
fi

# 总结
echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}🎉 发布完成！${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo -e "📦 扩展包: ${BLUE}nod-scroll-v${VERSION}.zip${NC}"
echo -e "🏷️  标签: ${BLUE}v${VERSION}${NC}"
echo -e "📝 更新日志: ${BLUE}CHANGELOG.md${NC}"
echo ""
echo -e "${YELLOW}下一步:${NC}"
echo "1. 测试扩展包: chrome://extensions/ (开发者模式 → 加载已解压的扩展)"
echo "2. 上传到商店:"
echo "   - Chrome Web Store: https://chrome.google.com/webstore/devconsole"
echo "   - Edge Add-ons: https://partner.microsoft.com/dashboard"
echo ""
echo -e "${BLUE}查看发布:${NC}"
echo "   git show v${VERSION}"
echo ""

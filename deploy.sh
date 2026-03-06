#!/bin/bash
# FamilyWall 部署脚本 - 自动处理构建和资源复制

set -e

echo "🚀 开始部署 FamilyWall..."

# 1. 清理所有缓存
echo "📦 清理缓存..."
rm -rf dist .vite

# 2. 重新构建
echo "🔨 构建中..."
pnpm build

# 3. 【关键】先清空 assets 目录，再复制新构建的文件
echo "📁 复制资源文件..."
rm -rf assets/
cp -r dist/assets/ .
cp dist/index.html .

# 4. 检查 index.html 引用的 JS 文件是否存在于 assets 目录
echo "✅ 验证文件..."
JS_FILE=$(grep -oP 'src="\K[^"]+' index.html | head -1)
if [ -f "assets/$JS_FILE" ]; then
    echo "✓ JS 文件 $JS_FILE 存在"
else
    echo "❌ 错误：JS 文件 $JS_FILE 不存在于 assets 目录！"
    exit 1
fi

# 5. 显示当前 Build 号
BUILD_NUM=$(grep -oP 'Build_\K[0-9]+' src/components/SettingsModal.vue | head -1)
echo "📋 当前版本: Build_$BUILD_NUM"

# 6. 推送到 GitHub
echo "📤 推送到 GitHub..."
git add -A
git commit -m "build: Build_$BUILD_NUM - 部署更新"
git push origin main

echo "✅ 部署完成！"

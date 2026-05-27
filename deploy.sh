#!/bin/bash

# Cloud Code Studio - 快速部署脚本

echo "🚀 开始部署 Cloud Code Studio..."

# 检查是否安装了 gh-pages
if ! npm list gh-pages > /dev/null 2>&1; then
    echo "📦 安装 gh-pages..."
    npm install --save-dev gh-pages
fi

# 检查远程仓库
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "⚠️  未找到远程仓库"
    echo "请先在 GitHub 创建仓库，然后运行："
    echo "  git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git"
    exit 1
fi

# 构建项目
echo "🔨 构建项目..."
npm run build

# 部署
echo "🚀 部署到 GitHub Pages..."
npm run deploy

echo "✅ 部署完成！"
echo "请访问: https://YOUR_USERNAME.github.io/REPO_NAME/"

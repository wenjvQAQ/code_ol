# Cloud Code Studio - 部署指南

一个类似 VS Code 的在线代码编辑器，基于 React + Monaco Editor 构建。

## 快速开始

### 本地运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

### 部署到 GitHub Pages

#### 方法一：使用 GitHub Actions 自动部署（推荐）

1. **创建 GitHub 仓库**
   - 登录 GitHub
   - 点击 "New repository"
   - 仓库名称建议：`cloud-code-studio`
   - 选择 Public
   - 点击 "Create repository"

2. **推送代码到 GitHub**
   ```bash
   # 添加远程仓库（替换 YOUR_USERNAME 为您的 GitHub 用户名）
   git remote add origin https://github.com/YOUR_USERNAME/cloud-code-studio.git
   
   # 推送代码
   git push -u origin master
   ```

3. **启用 GitHub Pages**
   - 进入仓库 Settings
   - 左侧菜单选择 "Pages"
   - Source 选择 "Deploy from a branch"
   - Branch 选择 "gh-pages" (如果没有，点击 None 然后选择 gh-pages)
   - 点击 Save

4. **自动部署设置**
   - 仓库会自动使用 GitHub Actions
   - 推送代码后，GitHub Actions 会自动构建并部署

#### 方法二：手动部署

1. **安装 gh-pages 包**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **更新 package.json 添加部署脚本**
   ```json
   "scripts": {
     "deploy": "gh-pages -d dist"
   }
   ```

3. **配置 base 路径**
   
   编辑 `vite.config.ts`：
   ```typescript
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'
   import path from 'path'

   export default defineConfig({
     plugins: [react()],
     base: '/YOUR_REPOSITORY_NAME/',
     resolve: {
       alias: {
         '@': path.resolve(__dirname, './src'),
       },
     },
   })
   ```

4. **部署**
   ```bash
   npm run build
   npm run deploy
   ```

## 功能特性

- ✅ Monaco Editor 代码编辑器
- ✅ 文件浏览器（创建、删除、重命名）
- ✅ 多标签页编辑
- ✅ 终端模拟器
- ✅ 深色/亮色主题切换
- ✅ 命令面板 (Ctrl+Shift+P)
- ✅ 本地存储持久化
- ✅ 响应式设计

## 快捷键

| 快捷键 | 功能 |
|--------|------|
| Ctrl+N | 新建文件 |
| Ctrl+S | 保存文件 |
| Ctrl+W | 关闭当前标签 |
| Ctrl+Shift+P | 打开命令面板 |
| Ctrl+B | 切换侧边栏 |
| Ctrl+J | 切换终端面板 |

## 技术栈

- React 18 + TypeScript
- Monaco Editor
- xterm.js
- Zustand
- Tailwind CSS
- Vite

## 项目结构

```
cloud-code-studio/
├── src/
│   ├── components/       # UI 组件
│   │   ├── Editor/       # 编辑器相关
│   │   ├── Sidebar/      # 侧边栏
│   │   ├── Terminal/     # 终端
│   │   └── ...
│   ├── stores/           # Zustand 状态管理
│   ├── types/            # TypeScript 类型定义
│   └── App.tsx           # 主应用
├── public/
├── .trae/documents/      # 文档
└── package.json
```

## 许可证

MIT License

# ☁️ Cloud Code Studio

一个类似 VS Code 的在线代码编辑器，支持多标签页、文件管理、终端模拟和主题切换。

![Cloud Code Studio](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Monaco Editor](https://img.shields.io/badge/Monaco-Editor-yellow) ![License](https://img.shields.io/badge/License-MIT-green)

## ✨ 特性

- 🎨 **Monaco Editor** - 专业的代码编辑体验
- 📁 **文件浏览器** - 创建、删除、重命名文件
- 📑 **多标签页** - 同时编辑多个文件
- 🖥️ **终端模拟器** - 内置命令终端
- 🌙 **主题切换** - 深色/亮色主题
- ⌨️ **命令面板** - 快捷命令 (Ctrl+Shift+P)
- 💾 **本地存储** - 数据保存在浏览器
- 📱 **响应式设计** - 适配各种屏幕尺寸

## 🚀 快速开始

### 安装

```bash
npm install
```

### 开发

```bash
npm run dev
```

### 构建

```bash
npm run build
```

## ⌨️ 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Ctrl+N` | 新建文件 |
| `Ctrl+S` | 保存文件 |
| `Ctrl+W` | 关闭标签 |
| `Ctrl+Shift+P` | 命令面板 |
| `Ctrl+B` | 切换侧边栏 |
| `Ctrl+J` | 切换终端 |

## 🛠️ 技术栈

- **前端框架**: React 18 + TypeScript
- **编辑器**: Monaco Editor
- **终端**: xterm.js
- **状态管理**: Zustand
- **样式**: Tailwind CSS
- **构建**: Vite

## 📂 项目结构

```
cloud-code-studio/
├── src/
│   ├── components/      # UI 组件
│   │   ├── Editor/       # 编辑器组件
│   │   ├── Sidebar/      # 侧边栏
│   │   ├── Terminal/     # 终端
│   │   └── ...
│   ├── stores/          # 状态管理
│   ├── types/           # 类型定义
│   └── App.tsx          # 主应用
├── public/
├── .github/             # GitHub 配置
└── package.json
```

## 🌐 部署

项目已配置 GitHub Actions，可以自动部署到 GitHub Pages。

详细部署指南请查看 [DEPLOY.md](./DEPLOY.md)

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE)

---

Made with ❤️ using React + Monaco Editor

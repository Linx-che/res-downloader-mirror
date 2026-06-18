# Obsidian res-downloader Monitor Plugin

这是一个 **Obsidian 插件**，用于实时监控 res-downloader 的下载状态，并在 Obsidian 中快速触发下载。

## ✨ 功能特性

### 🔍 **实时监控**
- 📊 实时监控 res-downloader 下载队列
- 🔔 显示当前下载状态和进度
- 🌐 通过本地代理（127.0.0.1:8899）连接
- ⚡ 可配置的更新间隔

### 📥 **快速下载**
- ⚡ Ribbon Icon 快速访问
- 🎯 在笔记中选中链接，快速下载
- 📝 支持粘贴 URL 直接下载
- 🎨 优雅的 UI 和通知提示

## 📦 安装方法

### 方法 1：手动安装

1. 克隆或下载此仓库的 `obsidian-plugin` 目录
2. 将文件夹放入 Obsidian 的插件目录：
   ```
   .obsidian/plugins/obsidian-res-downloader-monitor/
   ```
3. 重启 Obsidian
4. 在"社区插件"中启用 "res-downloader Monitor"

### 方法 2：从源代码构建

```bash
# 进入插件目录
cd obsidian-plugin

# 安装依赖
npm install

# 开发模式（自动编译）
npm run dev

# 生产构建
npm run build
```

## 🚀 使用方法

### 基本设置

1. 打开 Obsidian 设置 → 社区插件 → res-downloader Monitor
2. 配置以下选项：
   - **Proxy Host**: res-downloader 代理地址（默认：127.0.0.1）
   - **Proxy Port**: res-downloader 代理端口（默认：8899）
   - **Update Interval**: 监控更新间隔，单位毫秒（默认：2000）

### 使用命令

#### 显示监控面板
- 点击 Ribbon 中的下载图标
- 或使用命令：`Show res-downloader Monitor`
- 在监控面板中可以看到：
  - 当前连接状态
  - 活跃下载列表
  - 快速下载输入框

#### 快速下载
**方法 1：从笔记中选中链接**
```
1. 在笔记中选中一个 URL
2. 使用命令：`Quick Download to res-downloader`
3. 下载自动开始
```

**方法 2：在监控面板中输入**
```
1. 打开监控面板（Ribbon 图标或命令）
2. 在"快速下载"输入框中粘贴 URL
3. 点击"📥 Download"按钮或按 Enter
```

## 🔧 配置示例

### 默认配置
```json
{
  "proxyHost": "127.0.0.1",
  "proxyPort": 8899,
  "updateInterval": 2000
}
```

### 远程机器配置
如果 res-downloader 运行在其他机器上：
```json
{
  "proxyHost": "192.168.1.100",
  "proxyPort": 8899,
  "updateInterval": 2000
}
```

## 📋 命令列表

| 命令 ID | 名称 | 描述 |
|--------|------|------|
| `show-res-downloader-monitor` | Show res-downloader Monitor | 显示下载监控面板 |
| `quick-download` | Quick Download to res-downloader | 快速下载选中的 URL |

## 🎨 UI 特性

- ✅ 完全支持 Obsidian 亮色/暗色主题
- 📊 实时显示下载队列
- 🎯 直观的状态指示
- ⌨️ 键盘快捷支持（Enter 快速下载）

## 🔌 与 res-downloader 集成

此插件通过与 res-downloader 的本地代理通信工作：

1. **确保 res-downloader 正在运行**
2. **确保代理已启动**（res-downloader 首页左上角"启动代理"）
3. **默认代理地址**：`127.0.0.1:8899`
4. **监控面板会自动连接并显示状态**

## 📝 注意事项

- 🔴 如果看到"❌ res-downloader: Not connected"，检查：
  - res-downloader 是否在运行
  - 代理是否已启动
  - 网络连接是否正常
  - 代理地址和端口配置是否正确

- 💡 监控间隔越短，CPU 使用率越高。建议设置为 2000ms 或更高

- 🔒 此插件只读取下载状态，不会修改任何文件

## 🐛 故障排除

### 问题：插件无法连接到 res-downloader

**解决方案：**
1. 检查 res-downloader 是否在运行
2. 点击 res-downloader 首页左上角"启动代理"
3. 验证代理地址和端口是否正确
4. 检查防火墙设置

### 问题：下载不工作

**解决方案：**
1. 确保选中的是有效 URL
2. 检查 res-downloader 是否支持该资源类型
3. 查看 res-downloader 的日志输出

### 问题：插件性能问题

**解决方案：**
1. 增加"Update Interval"的值
2. 关闭不使用的其他插件
3. 重启 Obsidian

## 📄 许可证

MIT License - 详见 LICENSE 文件

## 🔗 相关链接

- [res-downloader 主项目](https://github.com/putyy/res-downloader)
- [Obsidian 插件开发文档](https://docs.obsidian.md/Plugins/Getting+started/Build+a+plugin)
- [镜像仓库主页](https://github.com/Linx-che/res-downloader-mirror)

---

**最后更新**：2026-06-18

**维护者**：[@Linx-che](https://github.com/Linx-che)

**需要帮助？** 查看 [GitHub Issues](https://github.com/Linx-che/res-downloader-mirror/issues) 或原项目 [res-downloader Issues](https://github.com/putyy/res-downloader/issues)

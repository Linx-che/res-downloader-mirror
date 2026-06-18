import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

interface ResDownloaderSettings {
  proxyHost: string;
  proxyPort: number;
  updateInterval: number;
}

const DEFAULT_SETTINGS: ResDownloaderSettings = {
  proxyHost: '127.0.0.1',
  proxyPort: 8899,
  updateInterval: 2000
}

export default class ResDownloaderMonitor extends Plugin {
  settings: ResDownloaderSettings;
  statusBar: HTMLElement;
  downloadQueue: DownloadItem[] = [];
  monitoringInterval: number;

  async onload() {
    await this.loadSettings();

    // 添加 Ribbon Icon
    this.addRibbonIcon('download', 'res-downloader Monitor', (evt: MouseEvent) => {
      this.showMonitorModal();
    });

    // 添加命令：显示下载监控面板
    this.addCommand({
      id: 'show-res-downloader-monitor',
      name: 'Show res-downloader Monitor',
      callback: () => this.showMonitorModal(),
    });

    // 添加命令：快速下载
    this.addCommand({
      id: 'quick-download',
      name: 'Quick Download to res-downloader',
      editorCallback: (editor: Editor, view: MarkdownView) => {
        this.quickDownload(editor);
      },
    });

    // 创建状态栏项
    this.statusBar = this.addStatusBarItem();
    this.statusBar.setText('🔍 res-downloader: Connecting...');

    // 开始监控
    this.startMonitoring();

    // 添加设置面板
    this.addSettingTab(new ResDownloaderSettingTab(this.app, this));

    console.log('res-downloader Monitor plugin loaded');
  }

  onunload() {
    // 停止监控
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }
    console.log('res-downloader Monitor plugin unloaded');
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  private startMonitoring() {
    // 定期检查 res-downloader 状态
    this.monitoringInterval = window.setInterval(async () => {
      await this.checkDownloaderStatus();
    }, this.settings.updateInterval);
  }

  private async checkDownloaderStatus() {
    try {
      // 尝试连接到 res-downloader 代理
      const response = await fetch(`http://${this.settings.proxyHost}:${this.settings.proxyPort}/status`, {
        method: 'GET',
        timeout: 5000
      });

      if (response.ok) {
        const data = await response.json();
        this.downloadQueue = data.downloads || [];
        this.updateStatusBar();
      }
    } catch (error) {
      // 连接失败，更新状态栏
      this.statusBar.setText('❌ res-downloader: Not connected');
    }
  }

  private updateStatusBar() {
    const count = this.downloadQueue.length;
    if (count === 0) {
      this.statusBar.setText('✅ res-downloader: Ready');
    } else {
      this.statusBar.setText(`📥 res-downloader: ${count} downloads`);
    }
  }

  private showMonitorModal() {
    new ResDownloaderMonitorModal(this.app, this).open();
  }

  private quickDownload(editor: Editor) {
    const selectedText = editor.getSelection();
    
    if (!selectedText) {
      new Notice('Please select a URL or resource link');
      return;
    }

    // 验证是否是有效的 URL
    if (!this.isValidUrl(selectedText)) {
      new Notice('Invalid URL format');
      return;
    }

    this.triggerDownload(selectedText);
  }

  private isValidUrl(str: string): boolean {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  }

  private async triggerDownload(url: string) {
    try {
      // 向 res-downloader 代理发送下载请求
      const response = await fetch(`http://${this.settings.proxyHost}:${this.settings.proxyPort}/download`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url,
          timestamp: Date.now()
        })
      });

      if (response.ok) {
        new Notice(`✅ Download started: ${url}`);
      } else {
        new Notice('❌ Failed to start download');
      }
    } catch (error) {
      new Notice('❌ res-downloader not connected');
      console.error('Download trigger error:', error);
    }
  }
}

interface DownloadItem {
  url: string;
  name: string;
  status: 'pending' | 'downloading' | 'completed' | 'failed';
  progress: number;
  timestamp: number;
}

class ResDownloaderMonitorModal extends Modal {
  plugin: ResDownloaderMonitor;

  constructor(app: App, plugin: ResDownloaderMonitor) {
    super(app);
    this.plugin = plugin;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();

    contentEl.createEl('h2', { text: 'res-downloader Monitor' });

    // 显示连接状态
    const statusSection = contentEl.createDiv('monitor-status-section');
    statusSection.createEl('p', { 
      text: `📍 Proxy: ${this.plugin.settings.proxyHost}:${this.plugin.settings.proxyPort}` 
    });

    // 显示下载队列
    contentEl.createEl('h3', { text: 'Download Queue' });
    
    if (this.plugin.downloadQueue.length === 0) {
      contentEl.createEl('p', { text: 'No active downloads' });
    } else {
      const queueDiv = contentEl.createDiv('download-queue');
      this.plugin.downloadQueue.forEach(item => {
        const itemDiv = queueDiv.createDiv('download-item');
        itemDiv.innerHTML = `
          <div class="download-name">${item.name}</div>
          <div class="download-status">${item.status}</div>
          <div class="download-progress">${item.progress}%</div>
        `;
      });
    }

    // 快速下载输入框
    contentEl.createEl('h3', { text: 'Quick Download' });
    const inputDiv = contentEl.createDiv('quick-download-input');
    
    const input = inputDiv.createEl('input', {
      type: 'text',
      placeholder: 'Enter URL or resource link...',
      value: ''
    });

    const button = inputDiv.createEl('button', {
      text: '📥 Download'
    });

    button.addEventListener('click', () => {
      const url = input.value.trim();
      if (url) {
        this.plugin.triggerDownload(url);
        input.value = '';
      }
    });

    // 按 Enter 触发下载
    input.addEventListener('keypress', (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        const url = input.value.trim();
        if (url) {
          this.plugin.triggerDownload(url);
          input.value = '';
        }
      }
    });
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}

class ResDownloaderSettingTab extends PluginSettingTab {
  plugin: ResDownloaderMonitor;

  constructor(app: App, plugin: ResDownloaderMonitor) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    containerEl.createEl('h2', { text: 'res-downloader Monitor Settings' });

    new Setting(containerEl)
      .setName('Proxy Host')
      .setDesc('res-downloader proxy host address')
      .addText(text => text
        .setPlaceholder('127.0.0.1')
        .setValue(this.plugin.settings.proxyHost)
        .onChange(async (value) => {
          this.plugin.settings.proxyHost = value;
          await this.plugin.saveSettings();
        }));

    new Setting(containerEl)
      .setName('Proxy Port')
      .setDesc('res-downloader proxy port (default: 8899)')
      .addText(text => text
        .setPlaceholder('8899')
        .setValue(String(this.plugin.settings.proxyPort))
        .onChange(async (value) => {
          this.plugin.settings.proxyPort = parseInt(value) || 8899;
          await this.plugin.saveSettings();
        }));

    new Setting(containerEl)
      .setName('Update Interval')
      .setDesc('Monitoring update interval in milliseconds')
      .addText(text => text
        .setPlaceholder('2000')
        .setValue(String(this.plugin.settings.updateInterval))
        .onChange(async (value) => {
          this.plugin.settings.updateInterval = parseInt(value) || 2000;
          await this.plugin.saveSettings();
        }));
  }
}

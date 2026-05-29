import { useState, useEffect } from 'react';
import { X, Settings, Code, Monitor, RotateCcw } from 'lucide-react';
import { useSettingsStore } from '@/stores/settingsStore';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = 'editor' | 'ui' | 'about';

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>('editor');
  const { 
    editor, 
    ui, 
    updateEditorSettings, 
    updateUISettings, 
    resetSettings 
  } = useSettingsStore();

  useEffect(() => {
    if (isOpen) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col md:flex-row md:items-center md:justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="w-full md:max-w-4xl bg-[var(--bg-secondary)] border-t md:border border-[var(--border-color)] rounded-t-xl md:rounded-xl shadow-2xl overflow-hidden flex flex-col flex-1 md:flex-initial md:h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-[var(--accent-blue)]" />
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">设置</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-[var(--bg-tertiary)] rounded transition-colors"
          >
            <X className="w-6 h-6 text-[var(--text-secondary)]" />
          </button>
        </div>

        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* Mobile: horizontal tabs */}
          <div className="md:hidden border-b border-[var(--border-color)] px-4 py-3">
            <div className="flex gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setActiveTab('editor')}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'editor'
                    ? 'bg-[var(--accent-blue)] text-white'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Code className="w-4 h-4" />
                <span className="font-medium">编辑器</span>
              </button>
              <button
                onClick={() => setActiveTab('ui')}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'ui'
                    ? 'bg-[var(--accent-blue)] text-white'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Monitor className="w-4 h-4" />
                <span className="font-medium">界面</span>
              </button>
              <button
                onClick={() => setActiveTab('about')}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'about'
                    ? 'bg-[var(--accent-blue)] text-white'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span className="font-medium">关于</span>
              </button>
            </div>
          </div>

          {/* Desktop: vertical sidebar */}
          <div className="hidden md:block w-64 border-r border-[var(--border-color)] bg-[var(--bg-tertiary)]/30">
            <nav className="p-4 space-y-1">
              <button
                onClick={() => setActiveTab('editor')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  activeTab === 'editor'
                    ? 'bg-[var(--accent-blue)] text-white'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Code className="w-4 h-4" />
                <span className="font-medium">编辑器</span>
              </button>
              <button
                onClick={() => setActiveTab('ui')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  activeTab === 'ui'
                    ? 'bg-[var(--accent-blue)] text-white'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Monitor className="w-4 h-4" />
                <span className="font-medium">界面</span>
              </button>
              <button
                onClick={() => setActiveTab('about')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  activeTab === 'about'
                    ? 'bg-[var(--accent-blue)] text-white'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span className="font-medium">关于</span>
              </button>
            </nav>

            <div className="p-4 border-t border-[var(--border-color)] mt-4">
              <button
                onClick={() => {
                  if (confirm('确定要重置所有设置到默认值吗？')) {
                    resetSettings();
                  }
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[var(--accent-red)] hover:bg-[var(--accent-red)]/10 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="font-medium">重置设置</span>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            {activeTab === 'editor' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">字体设置</h3>
                  <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <label className="text-sm text-[var(--text-primary)]">字体大小</label>
                          <p className="text-xs text-[var(--text-secondary)]">编辑器的字体大小（像素）</p>
                        </div>
                        <span className="text-sm text-[var(--text-primary)] font-medium">{editor.fontSize}px</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="24"
                        value={editor.fontSize}
                        onChange={(e) => updateEditorSettings({ fontSize: parseInt(e.target.value) })}
                        className="w-full"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <div>
                        <label className="text-sm text-[var(--text-primary)]">字体族</label>
                        <p className="text-xs text-[var(--text-secondary)]">编辑器使用的字体</p>
                      </div>
                      <input
                        type="text"
                        value={editor.fontFamily}
                        onChange={(e) => updateEditorSettings({ fontFamily: e.target.value })}
                        className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded text-sm text-[var(--text-primary)]"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm text-[var(--text-primary)]">连字</label>
                        <p className="text-xs text-[var(--text-secondary)]">启用编程连字（如 ==、=&gt;）</p>
                      </div>
                      <button
                        onClick={() => updateEditorSettings({ fontLigatures: !editor.fontLigatures })}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          editor.fontLigatures ? 'bg-[var(--accent-blue)]' : 'bg-[var(--border-color)]'
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                            editor.fontLigatures ? 'translate-x-7' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">制表符</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm text-[var(--text-primary)]">Tab 大小</label>
                        <p className="text-xs text-[var(--text-secondary)]">Tab 键产生的空格数</p>
                      </div>
                      <select
                        value={editor.tabSize}
                        onChange={(e) => updateEditorSettings({ tabSize: parseInt(e.target.value) })}
                        className="px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded text-sm text-[var(--text-primary)]"
                      >
                        <option value={2}>2 个空格</option>
                        <option value={4}>4 个空格</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">光标</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm text-[var(--text-primary)]">光标样式</label>
                        <p className="text-xs text-[var(--text-secondary)]">光标的外观样式</p>
                      </div>
                      <select
                        value={editor.cursorStyle}
                        onChange={(e) => updateEditorSettings({ cursorStyle: e.target.value as any })}
                        className="px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded text-sm text-[var(--text-primary)]"
                      >
                        <option value="line">线条</option>
                        <option value="block">方块</option>
                        <option value="underline">下划线</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm text-[var(--text-primary)]">光标动画</label>
                        <p className="text-xs text-[var(--text-secondary)]">光标的闪烁效果</p>
                      </div>
                      <select
                        value={editor.cursorBlinking}
                        onChange={(e) => updateEditorSettings({ cursorBlinking: e.target.value as any })}
                        className="px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded text-sm text-[var(--text-primary)]"
                      >
                        <option value="blink">闪烁</option>
                        <option value="smooth">平滑</option>
                        <option value="phase">相位</option>
                        <option value="expand">扩展</option>
                        <option value="solid">静止</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm text-[var(--text-primary)]">滚轮缩放</label>
                        <p className="text-xs text-[var(--text-secondary)]">按住 Ctrl 并滚动滚轮缩放编辑器</p>
                      </div>
                      <button
                        onClick={() => updateEditorSettings({ mouseWheelZoom: !editor.mouseWheelZoom })}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          editor.mouseWheelZoom ? 'bg-[var(--accent-blue)]' : 'bg-[var(--border-color)]'
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                            editor.mouseWheelZoom ? 'translate-x-7' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">界面显示</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm text-[var(--text-primary)]">自动换行</label>
                        <p className="text-xs text-[var(--text-secondary)]">长行自动换行显示</p>
                      </div>
                      <button
                        onClick={() => updateEditorSettings({ 
                          wordWrap: editor.wordWrap === 'on' ? 'off' : 'on' 
                        })}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          editor.wordWrap === 'on' ? 'bg-[var(--accent-blue)]' : 'bg-[var(--border-color)]'
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                            editor.wordWrap === 'on' ? 'translate-x-7' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm text-[var(--text-primary)]">行号</label>
                        <p className="text-xs text-[var(--text-secondary)]">显示行号</p>
                      </div>
                      <button
                        onClick={() => updateEditorSettings({ 
                          lineNumbers: editor.lineNumbers === 'on' ? 'off' : 'on' 
                        })}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          editor.lineNumbers === 'on' ? 'bg-[var(--accent-blue)]' : 'bg-[var(--border-color)]'
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                            editor.lineNumbers === 'on' ? 'translate-x-7' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm text-[var(--text-primary)]">小地图</label>
                        <p className="text-xs text-[var(--text-secondary)]">编辑器右侧的代码缩略图</p>
                      </div>
                      <button
                        onClick={() => updateEditorSettings({ minimap: !editor.minimap })}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          editor.minimap ? 'bg-[var(--accent-blue)]' : 'bg-[var(--border-color)]'
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                            editor.minimap ? 'translate-x-7' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm text-[var(--text-primary)]">平滑滚动</label>
                        <p className="text-xs text-[var(--text-secondary)]">编辑器滚动动画</p>
                      </div>
                      <button
                        onClick={() => updateEditorSettings({ smoothScrolling: !editor.smoothScrolling })}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          editor.smoothScrolling ? 'bg-[var(--accent-blue)]' : 'bg-[var(--border-color)]'
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                            editor.smoothScrolling ? 'translate-x-7' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">自动保存</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm text-[var(--text-primary)]">自动保存</label>
                        <p className="text-xs text-[var(--text-secondary)]">停止编辑后自动保存文件</p>
                      </div>
                      <button
                        onClick={() => updateEditorSettings({ autoSave: !editor.autoSave })}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          editor.autoSave ? 'bg-[var(--accent-blue)]' : 'bg-[var(--border-color)]'
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                            editor.autoSave ? 'translate-x-7' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    {editor.autoSave && (
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                          <div>
                            <label className="text-sm text-[var(--text-primary)]">自动保存延迟</label>
                            <p className="text-xs text-[var(--text-secondary)]">自动保存的延迟时间（毫秒）</p>
                          </div>
                          <span className="text-sm text-[var(--text-primary)] font-medium">{editor.autoSaveDelay}ms</span>
                        </div>
                        <input
                          type="range"
                          min="500"
                          max="5000"
                          step="500"
                          value={editor.autoSaveDelay}
                          onChange={(e) => updateEditorSettings({ autoSaveDelay: parseInt(e.target.value) })}
                          className="w-full"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ui' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">界面布局</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm text-[var(--text-primary)]">显示标签栏</label>
                        <p className="text-xs text-[var(--text-secondary)]">显示打开文件的标签栏</p>
                      </div>
                      <button
                        onClick={() => updateUISettings({ showTabBar: !ui.showTabBar })}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          ui.showTabBar ? 'bg-[var(--accent-blue)]' : 'bg-[var(--border-color)]'
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                            ui.showTabBar ? 'translate-x-7' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm text-[var(--text-primary)]">显示状态栏</label>
                        <p className="text-xs text-[var(--text-secondary)]">显示底部状态栏</p>
                      </div>
                      <button
                        onClick={() => updateUISettings({ showStatusBar: !ui.showStatusBar })}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          ui.showStatusBar ? 'bg-[var(--accent-blue)]' : 'bg-[var(--border-color)]'
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                            ui.showStatusBar ? 'translate-x-7' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm text-[var(--text-primary)]">紧凑模式</label>
                        <p className="text-xs text-[var(--text-secondary)]">使用更紧凑的界面布局</p>
                      </div>
                      <button
                        onClick={() => updateUISettings({ compactMode: !ui.compactMode })}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          ui.compactMode ? 'bg-[var(--accent-blue)]' : 'bg-[var(--border-color)]'
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                            ui.compactMode ? 'translate-x-7' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm text-[var(--text-primary)]">动画效果</label>
                        <p className="text-xs text-[var(--text-secondary)]">启用界面过渡动画</p>
                      </div>
                      <button
                        onClick={() => updateUISettings({ animations: !ui.animations })}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          ui.animations ? 'bg-[var(--accent-blue)]' : 'bg-[var(--border-color)]'
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                            ui.animations ? 'translate-x-7' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">布局尺寸</h3>
                  <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <label className="text-sm text-[var(--text-primary)]">侧边栏宽度</label>
                          <p className="text-xs text-[var(--text-secondary)]">侧边栏的宽度（像素）</p>
                        </div>
                        <span className="text-sm text-[var(--text-primary)] font-medium">{ui.sidebarWidth}px</span>
                      </div>
                      <input
                        type="range"
                        min="180"
                        max="400"
                        step="10"
                        value={ui.sidebarWidth}
                        onChange={(e) => updateUISettings({ sidebarWidth: parseInt(e.target.value) })}
                        className="w-full"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <label className="text-sm text-[var(--text-primary)]">终端高度</label>
                          <p className="text-xs text-[var(--text-secondary)]">底部终端面板的高度（像素）</p>
                        </div>
                        <span className="text-sm text-[var(--text-primary)] font-medium">{ui.terminalHeight}px</span>
                      </div>
                      <input
                        type="range"
                        min="100"
                        max="400"
                        step="10"
                        value={ui.terminalHeight}
                        onChange={(e) => updateUISettings({ terminalHeight: parseInt(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'about' && (
              <div className="space-y-6">
                <div className="bg-[var(--bg-primary)] rounded-lg p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-purple)] rounded-xl flex items-center justify-center">
                      <Code className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[var(--text-primary)]">云端代码工作室</h3>
                      <p className="text-sm text-[var(--text-secondary)]">版本 1.0.0</p>
                    </div>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    一个功能强大的在线代码编辑器，提供类似 VS Code 的编辑体验。
                    支持多种编程语言、语法高亮、代码补全等功能。
                  </p>
                </div>

                <div className="bg-[var(--bg-primary)] rounded-lg p-6">
                  <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-4">主要功能</h4>
                  <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[var(--accent-blue)] rounded-full"></span>
                      支持 50+ 种编程语言的语法高亮
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[var(--accent-green)] rounded-full"></span>
                      智能代码补全和提示
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[var(--accent-purple)] rounded-full"></span>
                      深色/浅色主题切换
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[var(--accent-orange)] rounded-full"></span>
                      完整的键盘快捷键支持
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[var(--accent-red)] rounded-full"></span>
                      文件管理和项目组织
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[var(--accent-blue)] rounded-full"></span>
                      响应式设计，支持移动端
                    </li>
                  </ul>
                </div>

                <div className="bg-[var(--bg-primary)] rounded-lg p-6">
                  <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-4">技术栈</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {['React 18', 'TypeScript', 'Monaco Editor', 'Tailwind CSS', 'Zustand', 'Vite'].map((tech) => (
                      <div key={tech} className="px-3 py-2 bg-[var(--bg-tertiary)] rounded text-sm text-[var(--text-primary)]">
                        {tech}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-center text-xs text-[var(--text-secondary)]">
                  <p>Made with ❤️ by AI Assistant</p>
                  <p className="mt-1">© 2024 云端代码工作室. All rights reserved.</p>
                </div>
              </div>
            )}

            {/* Mobile: Reset button at bottom */}
            <div className="md:hidden mt-6 pt-4 border-t border-[var(--border-color)]">
              <button
                onClick={() => {
                  if (confirm('确定要重置所有设置到默认值吗？')) {
                    resetSettings();
                  }
                }}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg text-[var(--accent-red)] hover:bg-[var(--accent-red)]/10 transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
                <span className="font-medium">重置设置</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

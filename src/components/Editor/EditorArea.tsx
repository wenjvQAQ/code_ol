import TabBar from './TabBar';
import CodeEditor from './CodeEditor';

export default function EditorArea() {
  return (
    <div className="flex-1 flex flex-col bg-[var(--bg-primary)] overflow-hidden">
      <TabBar />
      <CodeEditor />
    </div>
  );
}

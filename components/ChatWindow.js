import { useEffect, useRef, useState } from 'react';
import MessageBubble from './MessageBubble';

export default function ChatWindow({ messages, loading, error, botName, onSend, onRate }) {
  const [text, setText] = useState('');
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const submit = (e) => {
    e.preventDefault();
    const t = text.trim();
    if (!t || loading) return;
    onSend(t);
    setText('');
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) submit(e);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.length === 0 && !loading && (
          <p className="mt-20 text-center text-gray-500">Say hello to start the conversation 👋</p>
        )}
        {messages.map((m, i) => (
          <MessageBubble key={m._id || i} message={m} botName={botName} onRate={onRate} />
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex gap-1 rounded-2xl rounded-bl-sm bg-gray-200 px-4 py-3 dark:bg-gray-700">
              <span className="h-2 w-2 animate-bounce rounded-full bg-gray-500" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-gray-500 [animation-delay:150ms]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-gray-500 [animation-delay:300ms]" />
            </div>
          </div>
        )}
        {error && <p className="text-center text-sm text-red-500">{error}</p>}
        <div ref={endRef} />
      </div>
      <form onSubmit={submit} className="flex gap-2 border-t p-3 dark:border-gray-700">
        <textarea
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Type a message… (Enter to send, Shift+Enter for a new line)"
          className="flex-1 resize-none rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
        />
        <button
          disabled={loading}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
        >
          Send
        </button>
      </form>
    </div>
  );
}
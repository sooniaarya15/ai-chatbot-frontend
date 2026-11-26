import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/services/api';
import Sidebar from '@/components/Sidebar';
import ChatWindow from '@/components/ChatWindow';

export default function ChatPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();

  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const activeRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('casual');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const selectActive = (id) => {
    activeRef.current = id;
    setActiveId(id);
  };

  const loadConversations = async () => {
    try {
      const d = await api('/chat/conversations');
      setConversations(d.conversations);
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace('/login');
      return;
    }
    setCategory(user.settings?.category || 'casual');
    loadConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading]);

  const openConversation = async (id) => {
    setError('');
    try {
      const d = await api(`/chat/conversations/${id}`);
      selectActive(id);
      setMessages(d.conversation.messages);
    } catch (e) {
      setError(e.message);
    }
  };

  const newChat = () => {
    selectActive(null);
    setMessages([]);
    setError('');
  };

  const deleteConversation = async (id) => {
    if (!confirm('Delete this conversation?')) return;
    try {
      await api(`/chat/conversations/${id}`, { method: 'DELETE' });
      if (activeRef.current === id) newChat();
      loadConversations();
    } catch (e) {
      setError(e.message);
    }
  };

  // ---- sending (REST version; Day 8 replaces this with Socket.io) ----
  const sendMessage = async (text) => {
    setError('');
    setMessages((m) => [...m, { role: 'user', content: text }]);
    setLoading(true);
    try {
      const d = await api('/chat/messages', {
        method: 'POST',
        body: { conversationId: activeRef.current, content: text, category },
      });
      selectActive(d.conversation._id);
      setMessages(d.conversation.messages);
      loadConversations();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };
  // ---- end sending ----

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  if (authLoading || !user) {
    return <div className="flex h-screen items-center justify-center">Loading…</div>;
  }

  return (
    <>
      <Head>
        <title>{user.settings.botName}</title>
      </Head>
      <div className="flex h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
        <Sidebar
          conversations={conversations}
          activeId={activeId}
          onSelect={openConversation}
          onNew={newChat}
          onDelete={deleteConversation}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between border-b px-4 py-3 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <button className="md:hidden" onClick={() => setSidebarOpen(true)}>
                ☰
              </button>
              <h1 className="font-semibold">{user.settings.botName}</h1>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="hidden text-gray-500 sm:inline">{user.name}</span>
              {user.role === 'admin' && (
                <Link href="/admin" className="text-blue-600 hover:underline">
                  Admin
                </Link>
              )}
              <button onClick={handleLogout} className="text-gray-500 hover:text-red-500">
                Logout
              </button>
            </div>
          </header>
          <ChatWindow
            messages={messages}
            loading={loading}
            error={error}
            botName={user.settings.botName}
            onSend={sendMessage}
          />
        </main>
      </div>
    </>
  );
}
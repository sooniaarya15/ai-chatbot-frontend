export default function Sidebar({ conversations, activeId, onSelect, onNew, onDelete, open, onClose }) {
  return (
    <>
      {open && <div className="fixed inset-0 z-20 bg-black/40 md:hidden" onClick={onClose} />}
      <aside
        className={`fixed z-30 flex h-full w-64 flex-col border-r bg-white transition-transform dark:border-gray-700 dark:bg-gray-800 md:static md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          onClick={() => {
            onNew();
            onClose();
          }}
          className="m-3 rounded-lg bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + New chat
        </button>
        <div className="flex-1 space-y-1 overflow-y-auto px-2 pb-3">
          {conversations.length === 0 && <p className="p-3 text-sm text-gray-500">No conversations yet</p>}
          {conversations.map((c) => (
            <div
              key={c._id}
              className={`group flex items-center justify-between rounded-lg px-3 py-2 text-sm ${
                c._id === activeId ? 'bg-blue-100 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <button
                className="flex-1 truncate text-left"
                onClick={() => {
                  onSelect(c._id);
                  onClose();
                }}
              >
                {c.title}
              </button>
              <button
                onClick={() => onDelete(c._id)}
                className="ml-2 text-gray-400 opacity-0 hover:text-red-500 group-hover:opacity-100"
                title="Delete"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}
import { useState, useRef, useEffect } from "react";
import { SendIcon, XIcon, UserIcon } from "lucide-react";

function ChatPanel({ messages, sendMessage, user, isChatOpen, setIsChatOpen }) {
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (inputText.trim()) {
      sendMessage(inputText, user.name, user.profileImage);
      setInputText("");
    }
  };

  return (
    <div
      className={`flex flex-col rounded-lg shadow overflow-hidden bg-[#272a30] transition-all duration-300 ease-in-out h-full ${
        isChatOpen ? "w-80 opacity-100" : "w-0 opacity-0 hidden"
      }`}
    >
      <div className="bg-[#1c1e22] p-3 border-b border-[#3a3d44] flex items-center justify-between">
        <h3 className="font-semibold text-white">Session Chat</h3>
        <button
          onClick={() => setIsChatOpen(false)}
          className="text-gray-400 hover:text-white transition-colors"
          title="Close chat"
        >
          <XIcon className="size-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => {
          const isMe = msg.senderId === user._id;
          return (
            <div key={idx} className={`flex ${isMe ? "justify-end" : "justify-start"} gap-2`}>
              {!isMe && (
                <div className="w-8 h-8 rounded-full bg-base-300 flex-shrink-0 flex items-center justify-center overflow-hidden">
                  {msg.senderImage ? (
                    <img src={msg.senderImage} alt={msg.senderName} className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon size={16} />
                  )}
                </div>
              )}
              
              <div className={`max-w-[75%] rounded-lg p-3 ${isMe ? "bg-primary text-primary-content rounded-tr-none" : "bg-base-200 text-base-content rounded-tl-none"}`}>
                {!isMe && <p className="text-xs opacity-70 mb-1">{msg.senderName}</p>}
                <p className="text-sm break-words">{msg.text}</p>
                <p className="text-[10px] opacity-50 text-right mt-1">
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 bg-[#1c1e22] border-t border-[#3a3d44]">
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message..."
            className="input input-sm input-bordered w-full bg-[#272a30] text-white focus:outline-none"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="btn btn-sm btn-primary btn-circle"
          >
            <SendIcon size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatPanel;

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { FormEvent } from "react";

interface RecMsg {
  senderId: string;
  content: string;
}

const App = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [serverId, setServerId] = useState<string | undefined>(undefined);
  const [allChats, setAllChats] = useState<RecMsg[]>([]);
  const [message, setMessage] = useState("");

  const isOwnMessage = (senderId: string) => senderId === serverId;

  const socket = io("http://localhost:8080", {
    transports: ["websocket"],
  });

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected with ID:", socket.id);
      setIsConnected(true);
      setServerId(socket.id);

      // Receive messages from server
      socket.on("to-all", (serverIncMsg) => {
        console.log("Incoming message:", serverIncMsg);
        setAllChats((prev) => [...prev, serverIncMsg]);
      });
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("to-all");
    };
  }, []);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!message.trim()) return;
    socket.emit("client-message", { senderId: serverId, content: message });
    setMessage("");
  }

  return (
    <div className="bg-gray-900 text-white w-full min-h-screen flex flex-col">
      <h2 className="text-3xl text-center py-4">Chat App</h2>
      <p className="text-center mb-4">
        Connected with ID: {isConnected && serverId}
      </p>
      <div className="flex-grow overflow-y-auto w-full max-w-sm py-4 px-5 mx-auto border rounded-lg bg-gray-800">
        <ul className="w-full py-10 space-y-3 ">
          {allChats.map((chat, i) => (
            <li
              key={i}
              className={`flex ${
                isOwnMessage(chat.senderId) ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-3 rounded-lg max-w-xs text-white ${
                  isOwnMessage(chat.senderId) ? "bg-pink-500" : "bg-slate-700"
                }`}
              >
                <h1>{chat.content}</h1>
                <p className="text-xs text-gray-300">
                  {isOwnMessage(chat.senderId) ? "You" : "Received"}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm mx-auto flex items-center space-x-2 py-4"
      >
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-grow text-black px-4 py-2 rounded-md"
          type="text"
          placeholder="Type your message..."
        />
        <button
          type="submit"
          className="rounded-md bg-pink-500 hover:bg-pink-400 px-4 py-2"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default App;

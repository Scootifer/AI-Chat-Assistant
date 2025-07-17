import { useState, useRef, useEffect } from "react";

type ChatMessage = {
  sender: "user" | "ai";
  text: string;
};

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendPrompt = async () => {
  if (!input.trim()) return;

  const userMsg: ChatMessage = { sender: "user", text: input };
  setMessages((prev) => [...prev, userMsg]);
  setInput("");

  const aiMsg: ChatMessage = { sender: "ai", text: "" };
  setMessages((prev) => [...prev, aiMsg]);

  try {
    const res = await fetch("http://localhost:8000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: userMsg.text }),
    });

    if (!res.body) throw new Error("No response body");

    const reader = res.body.getReader();
    const decoder = new TextDecoder("utf-8");

    let fullText = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      fullText += chunk;

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { sender: "ai", text: fullText };
        return updated;
      });
    }
  } catch (err) {
    console.error(err);
    setMessages((prev) => {
      const updated = [...prev];
      updated[updated.length - 1] = {
        sender: "ai",
        text: "Error contacting model.",
      };
      return updated;
    });
  }
};


  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center"> AI Dev Assistant</h1>

        <div className="bg-gray-800 p-4 rounded-lg h-[400px] overflow-y-auto space-y-2">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 rounded-xl max-w-[75%] whitespace-pre-wrap ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-100"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex mt-4 gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow px-4 py-2 rounded bg-gray-700 text-white focus:outline-none"
          />
          <button
            onClick={sendPrompt}
            className="bg-blue-600 px-4 py-2 rounded text-white hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

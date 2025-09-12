import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import chatbotImage from "../assets/chatbot.png";  
 import { useNavigate } from "react-router-dom"; 
const Chat = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false); 
  const [darkMode, setDarkMode] = useState(true); 
  const navigate = useNavigate(); 
  
  
  
  useEffect(() => {
    if (isChatOpen) fetchChatHistory();
  }, [isChatOpen]);

  const fetchChatHistory = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in.");
      return;
    }

    try {
      const res = await fetch("https://chat-nlp-backend.vercel.app/chat/history", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) throw new Error("Unauthorized. Please log in again.");
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setChat(data);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) {
      toast.error("Message cannot be empty.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in.");
      return;
    }

    try {
      const res = await fetch("https://chat-nlp-backend.vercel.app/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message }),
      });

      if (res.status === 401) throw new Error("Unauthorized. Please log in again.");
      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();
      setChat([...chat, { user: message, bot: data.reply, timestamp: new Date().toISOString() }]);
      setMessage("");
      toast.success("Message sent! ✅");
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Speech-to-Text (Mic)
  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      toast.error("Your browser doesn't support speech recognition.");
      return;
    }

    setIsListening(true);
    toast.success("Listening... 🎤 Speak now!");

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      setMessage(event.results[0][0].transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      toast.error("Speech recognition error.");
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  // Delete chat history
  const deleteHistory = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in.");
      return;
    }

    try {
      const res = await fetch("https://chat-nlp-backend.vercel.app/chat/history", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete history");

      setChat([]);
      toast.success("Chat history deleted! 🗑");
    } catch (err) {
      toast.error(err.message);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate("/");
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"} p-6`}>
      <Toaster position="top-right" reverseOrder={false} />
      <img src={chatbotImage} alt="Chatbot" className="absolute left-5 top-5 w-24 h-24" />
      {/* Toggle Dark Mode */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="absolute top-5 right-5 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
      >
        {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
      </button>

   <button 
     onClick={handleLogout}  
     className="absolute top-20 right-5 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg"
     >
     Logout
     </button>
     
      {/* Start Chat Button */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-2xl shadow-lg transition duration-300"
        >
          🚀 Start Chat
        </button>
      )}

      {/* Chatbox */}
      {isChatOpen && (
        <div className={`fixed bottom-5 right-5 w-96 ${darkMode ? "bg-transparent" : "bg-transparent"} p-4 rounded-2xl shadow-lg border-2 ${darkMode ? "border-gray-700" : "border-gray-300"}`}>
          {/* Chat Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Chatbot 🤖</h2>
            <button
              onClick={() => setIsChatOpen(false)}
              className="text-gray-300 hover:text-red-500 text-2xl font-bold"
            >
              ❌
            </button>
            <button
              onClick={deleteHistory}
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-600 text-white hover:bg-red-500 transition"
            >
              🗑 Delete History
            </button>
          </div>

          {/* Chat Messages */}
          <div className={`h-64 overflow-y-auto p-2 rounded-lg ${darkMode ? "bg-transparent" : "bg-transparent"}`}>
            {chat.length === 0 && <p className="text-gray-400 text-center">No messages yet...</p>}
            {chat.map((c, i) => (
              <div key={i} className="mb-3">
                <p className="text-sm text-gray-500">{new Date(c.timestamp).toLocaleString()}</p>
                <p className="p-2 rounded-lg inline-block bg-gray-600 text-white"><strong>You:</strong> {c.user}</p>
                <p className="p-2 rounded-lg inline-block bg-gray-500 text-white mt-1"><strong>Bot:</strong> {c.bot}</p>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="flex mt-4">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className={`w-full p-3 border rounded-l-lg ${darkMode ? "border-gray-600 bg-transparent text-white" : "border-gray-500 bg-transparent text-black"} focus:ring-gray-500`}
            />
            <button onClick={sendMessage} className="bg-gray-600 hover:bg-gray-500 px-6 py-3 text-white font-bold">
              Send
            </button>
            <button
              onClick={startListening}
              className={`px-4 py-3 ml-2 rounded-lg text-white font-bold ${isListening ? "bg-red-500 animate-pulse" : "bg-green-600 hover:bg-green-500"}`}
            >
              🎤
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;



 

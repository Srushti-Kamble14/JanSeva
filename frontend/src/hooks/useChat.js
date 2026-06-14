import { useState, useRef } from "react";

export function useChat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      text: "Namaste! 🙏 I'm JanSeva AI. How can I help you today?",
    },
  ]);

  const [typing, setTyping] = useState(false);

  const idRef = useRef(2);

  const addUserMessage = (text) => {
  setMessages((prev) => [
    ...prev,
    {
      id: idRef.current++,
      role: "user",
      text,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
};

  const addAssistantMessage = (text, schemes = []) => {
  setMessages((prev) => [
    ...prev,
    {
      id: idRef.current++,
      role: "assistant",
      text,
      schemes,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
};

  const clear = () => {
    setMessages([
      {
        id: 1,
        role: "assistant",
        text: "Namaste! 🙏 I'm JanSeva AI. How can I help you today?",
      },
    ]);
  };

  return {
    messages,
    typing,
    setTyping,
    addUserMessage,
    addAssistantMessage,
    clear,
  };
}
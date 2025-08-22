"use client";
import { useState, useRef, useEffect } from "react";
import { FiSend, FiX, FiMessageSquare, FiExternalLink } from "react-icons/fi";

export default function WhatsAppRedirectWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Olá! Sou o assistente da Tlhavika. Suas mensagens serão redirecionadas para nosso WhatsApp. Como posso ajudar você hoje?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Número de WhatsApp da empresa (substitua pelo número real)
  const whatsappNumber = "+258871191481";
  
  // Rolagem automática para a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMessage = {
      sender: "user",
      text: input,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
  };

  const redirectToWhatsApp = () => {
    if (!input.trim()) return;
    
    // Codificar a mensagem para URL
    const encodedMessage = encodeURIComponent(input);
    
    // Criar o link do WhatsApp
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    // Abrir em nova aba
    window.open(whatsappUrl, '_blank');
    
    // Mensagem de confirmação
    const confirmationMessage = {
      sender: "bot",
      text: `Mensagem redirecionada para WhatsApp! Você será direcionado para conversar conosco.`,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, confirmationMessage]);
    setInput("");
  };

  const formatTime = (date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="w-80 bg-white rounded-lg shadow-xl overflow-hidden flex flex-col">
          <div className="bg-green-600 text-white p-3 flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-white text-green-600 rounded-full w-8 h-8 flex items-center justify-center mr-2">
                <FiMessageSquare size={16} />
              </div>
              <h3 className="font-bold text-xl">WhatsApp Redirect</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200"
            >
              <FiX size={20} />
            </button>
          </div>

          <div
            className="flex-1 p-3 overflow-y-auto bg-gray-50"
            style={{ minHeight: "200px", maxHeight: "400px" }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`mb-3 flex ${
                  msg.sender === "bot" ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`max-w-xs p-3 rounded-lg ${
                    msg.sender === "bot"
                      ? "bg-gray-200 text-gray-800 rounded-tl-none"
                      : "bg-green-600 text-white rounded-tr-none"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                  <div
                    className={`text-xs mt-1 ${
                      msg.sender === "bot" ? "text-gray-500" : "text-green-100"
                    }`}
                  >
                    {formatTime(msg.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 border-t bg-white">
            <div className="flex">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Digite sua mensagem para o WhatsApp..."
                className="flex-1 p-2 border rounded-l focus:outline-none focus:ring-1 focus:ring-green-500"
              />
              <button
                onClick={redirectToWhatsApp}
                disabled={!input.trim()}
                className={`bg-green-600 text-white p-2 rounded-r flex items-center ${
                  !input.trim() ? "opacity-50" : "hover:bg-green-700"
                }`}
              >
                <FiExternalLink size={18} />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1 text-center">
              Sua mensagem será enviada para nosso WhatsApp
            </p>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition flex items-center justify-center"
          aria-label="Abrir chat WhatsApp"
        >
          <FiMessageSquare size={24} />
        </button>
      )}
    </div>
  );
}
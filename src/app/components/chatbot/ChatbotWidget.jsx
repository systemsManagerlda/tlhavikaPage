"use client";
import { useState, useRef, useEffect } from "react";
import { FiSend, FiX, FiMessageSquare } from "react-icons/fi";

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Olá! Sou o assistente virtual da Tlhavika. Posso te ajudar com informações sobre bombas solares, painéis fotovoltaicos, inversores e outros produtos. Como posso ajudar você hoje?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // **Novo inputRef adicionado**
  const inputRef = useRef(null);

  // Rolagem automática para a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Base de conhecimento dos produtos
  const productKnowledge = {
    pumps: {
      name: "Bombas Solares",
      description:
        "Nossas bombas solares são ideais para irrigação, abastecimento de água e aplicações residenciais. Oferecemos modelos de 12V, 24V e 48V com vazões de 1000 a 5000 litros/hora.",
      models: [
        "SolarJet 1000 - MZN 1.299,00",
        "SolarJet 2000 - MZN 1.899,00",
        "SolarJet 3000 - MZN 2.499,00",
      ],
      faq: [
        {
          question: "Qual a vida útil de uma bomba solar?",
          answer:
            "Nossas bombas têm vida útil média de 8-10 anos com manutenção adequada.",
        },
        {
          question: "Preciso de baterias para a bomba solar?",
          answer:
            "Não necessariamente. Nossas bombas podem operar diretamente com os painéis solares, mas recomendamos baterias para uso noturno ou dias nublados.",
        },
      ],
    },
    panels: {
      name: "Painéis Solares",
      description:
        "Painéis fotovoltaicos de alta eficiência com garantia de 25 anos. Oferecemos modelos de 330W a 550W, monocristalinos e policristalinos.",
      models: [
        "SolarMax 330W - MZN 899,00",
        "SolarMax 450W - MZN 1.299,00",
        "SolarMax 550W - MZN 1.599,00",
      ],
      faq: [
        {
          question: "Quantos painéis preciso para minha casa?",
          answer:
            "Depende do consumo. Em média, uma residência precisa de 6-10 painéis de 450W.",
        },
        {
          question: "Qual a diferença entre mono e policristalino?",
          answer:
            "Os monocristalinos têm maior eficiência (18-22%) e melhor desempenho em baixa luz. Os policristalinos são mais econômicos com eficiência de 15-17%.",
        },
      ],
    },
    inverters: {
      name: "Inversores",
      description:
        "Inversores solares para sistemas on-grid e off-grid. Potências de 1kW a 10kW com proteções integradas e monitoramento remoto.",
      models: [
        "InverterPro 2kW - MZN 3.299,00",
        "InverterPro 5kW - MZN 5.999,00",
        "InverterPro 10kW - MZN 10.499,00",
      ],
      faq: [
        {
          question: "Qual a diferença entre on-grid e off-grid?",
          answer:
            "On-grid conecta à rede elétrica e pode gerar créditos. Off-grid é independente, requer baterias.",
        },
      ],
    },
  };

  const processMessage = (userInput) => {
    const inputLower = userInput.toLowerCase();
    if (inputLower.includes("bomba") || inputLower.includes("bombas")) {
      return generateProductResponse("pumps", userInput);
    } else if (
      inputLower.includes("painel") ||
      inputLower.includes("painéis") ||
      inputLower.includes("fotovoltaico")
    ) {
      return generateProductResponse("panels", userInput);
    } else if (
      inputLower.includes("inversor") ||
      inputLower.includes("inversores")
    ) {
      return generateProductResponse("inverters", userInput);
    } else if (
      inputLower.includes("oi") ||
      inputLower.includes("olá") ||
      inputLower.includes("ola")
    ) {
      return "Olá! Como posso te ajudar com nossos produtos de energia solar hoje?";
    } else if (
      inputLower.includes("preço") ||
      inputLower.includes("valor") ||
      inputLower.includes("custo")
    ) {
      return "Posso te informar sobre os preços dos nossos produtos. Por favor, especifique qual produto você deseja: bombas, painéis ou inversores?";
    } else if (
      inputLower.includes("obrigado") ||
      inputLower.includes("obrigada")
    ) {
      return "De nada! Estou à disposição para qualquer outra dúvida sobre nossos produtos solares.";
    } else {
      return "Desculpe, não entendi completamente. Você pode perguntar sobre:\n- Bombas solares\n- Painéis fotovoltaicos\n- Inversores\n\nOu especificar melhor sua dúvida?";
    }
  };

  const generateProductResponse = (productType, userInput) => {
    const product = productKnowledge[productType];
    let response = `**${product.name}**\n${product.description}\n\n`;
    if (
      userInput.includes("modelo") ||
      userInput.includes("modelos") ||
      userInput.includes("tipos")
    ) {
      response +=
        "**Modelos disponíveis:**\n" + product.models.join("\n") + "\n\n";
    }
    const askedQuestion = product.faq.find((q) =>
      userInput.toLowerCase().includes(q.question.toLowerCase())
    );

    if (askedQuestion) {
      response += `**Pergunta:** ${askedQuestion.question}\n**Resposta:** ${askedQuestion.answer}`;
    } else {
      response +=
        `**Perguntas frequentes:**\n` +
        product.faq.map((q) => `- ${q.question}`).join("\n") +
        `\n\nVocê pode me perguntar sobre qualquer uma dessas questões ou outras informações sobre ${product.name.toLowerCase()}.`;
    }
    return response;
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMessage = {
      sender: "user",
      text: input,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = {
        sender: "bot",
        text: processMessage(input),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const generateQuickReplies = () => {
    const suggestions = [];
    productKnowledge.pumps.faq.forEach((faq) => {
      suggestions.push({
        text: `Bombas: ${faq.question.substring(0, 30)}...`,
        query: faq.question,
      });
    });
    productKnowledge.panels.faq.forEach((faq) => {
      suggestions.push({
        text: `Painéis: ${faq.question.substring(0, 30)}...`,
        query: faq.question,
      });
    });
    productKnowledge.inverters.faq.forEach((faq) => {
      suggestions.push({
        text: `Inversores: ${faq.question.substring(0, 30)}...`,
        query: faq.question,
      });
    });
    suggestions.push(
      {
        text: "Modelos de bombas",
        query: "Quais modelos de bombas solares vocês têm?",
      },
      {
        text: "Modelos de painéis",
        query: "Quais modelos de painéis solares vocês oferecem?",
      },
      {
        text: "Modelos de inversores",
        query: "Quais modelos de inversores vocês vendem?",
      }
    );
    suggestions.push(
      { text: "Preço bombas", query: "Quanto custam as bombas solares?" },
      { text: "Preço painéis", query: "Qual o valor dos painéis solares?" },
      { text: "Preço inversores", query: "Quanto custam os inversores?" }
    );
    return suggestions.slice(0, 8);
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
              <h3 className="font-bold text-xl">Assistente Solar</h3>
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
            {isTyping && (
              <div className="flex justify-start mb-3">
                <div className="bg-gray-200 text-gray-800 p-3 rounded-lg rounded-tl-none max-w-xs">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Sugestões rápidas */}
          <div className="mt-2 flex flex-wrap gap-2 mx-2">
            {generateQuickReplies().map((reply, index) => (
              <button
                key={index}
                onClick={() => {
                  setInput(reply.query);
                  inputRef.current?.focus(); // ✅ agora inputRef existe
                }}
                className="text-xs bg-gray-800 text-white px-2 py-1 rounded hover:bg-gray-900 transition"
              >
                {reply.text}
              </button>
            ))}
          </div>

          <div className="p-3 border-t bg-white">
            <div className="flex">
              <input
                ref={inputRef} // ✅ associa o ref aqui
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Digite sua mensagem..."
                className="flex-1 p-2 border rounded-l focus:outline-none focus:ring-1 focus:ring-green-500"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className={`bg-green-600 text-white p-2 rounded-r ${
                  !input.trim() ? "opacity-50" : "hover:bg-green-700"
                }`}
              >
                <FiSend size={18} />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1 text-center">
              Posso te ajudar com bombas, painéis e inversores solares
            </p>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition flex items-center justify-center"
          aria-label="Abrir chat"
        >
          <FiMessageSquare size={24} />
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            1
          </span>
        </button>
      )}
    </div>
  );
}

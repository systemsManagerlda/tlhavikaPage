export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Mensagem não fornecida' });

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Você é um assistente virtual especializado em energia solar. Responda sempre em português." },
          { role: "user", content: message }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    const data = await openaiRes.json();
    if (!openaiRes.ok) {
      console.error(data);
      return res.status(500).json({ error: 'Erro na API da OpenAI' });
    }

    const reply = data.choices?.[0]?.message?.content || 'Não consegui gerar uma resposta.';
    return res.status(200).json({ reply });
  } catch (error) {
    console.error("Erro no /api/chat:", error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

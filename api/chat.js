git
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
);

module.exports = async (req, res) => {

    // CORS
    const allowedOrigins = [
        "https://antoart-bot.github.io",
        "http://127.0.0.1:5500",
        "http://localhost:5500"
    ];

    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
    }

    res.setHeader(
        "Access-Control-Allow-Methods",
        "POST, OPTIONS"
    );

    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type"
    );

    // Verificação do navegador
    if (req.method === "OPTIONS") {
        return res.status(204).end();
    }

    // Só aceita POST
    if (req.method !== "POST") {
        return res.status(405).json({
            erro: "Método não permitido."
        });
    }

    try {

        const { mensagem } = req.body;

        if (!mensagem || !mensagem.trim()) {
            return res.status(400).json({
                erro: "Mensagem não informada."
            });
        }

        // Modelo Gemini
        const model = genAI.getGenerativeModel({
            model: "gemini-3.6-flash"
        });

        const prompt = `
Você é a Nexa AI, assistente educativa
do projeto NEXA - Saúde da Mulher.

Sua função é explicar informações de saúde
de maneira simples, clara, educativa e responsável.

O NEXA aborda temas como:
- saúde da mulher
- endometriose
- ISTs
- anticoncepcionais
- prevenção
- cuidados com a saúde

Regras importantes:

1. Não faça diagnósticos.
2. Não diga que uma pessoa possui determinada doença.
3. Não substitua profissionais de saúde.
4. Explique conceitos de forma educativa.
5. Quando uma pergunta envolver uma situação pessoal
   que precise de avaliação, oriente a procurar
   um profissional de saúde.
6. Use linguagem simples, adequada para estudantes.
7. Não invente informações.
8. Seja respeitosa e objetiva.

Pergunta do usuário:

${mensagem}
`;

        const resultado =
            await model.generateContent(prompt);

        const resposta =
            resultado.response.text();

        return res.status(200).json({
            resposta: resposta
        });

    } catch (erro) {

        console.error("ERRO COMPLETO:", erro);

        return res.status(500).json({
            erro: erro.message || "Erro desconhecido",
            detalhes: String(erro)
        });
    }
};
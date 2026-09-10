const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

module.exports = async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).json({
            erro: "Método não permitido"
        });
    }

    try {
        const { mensagem } = req.body;

        if (!mensagem) {
            return res.status(400).json({
                erro: "Mensagem não informada"
            });
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash"
        });

        const prompt = `
Você é a Nexa AI, assistente educativa do projeto NEXA - Saúde da Mulher.

Seu objetivo é explicar assuntos de saúde de maneira simples,
educativa, responsável e fácil de entender.

Não faça diagnósticos.
Não substitua profissionais de saúde.
Quando uma situação precisar de avaliação profissional,
recomende procurar um profissional de saúde.

Pergunta da pessoa:
${mensagem}
`;

        const result = await model.generateContent(prompt);
        const resposta = result.response.text();

        return res.status(200).json({
            resposta
        });

    } catch (erro) {
        console.error(erro);

        return res.status(500).json({
            erro: "Não foi possível obter uma resposta."
        });
    }
};
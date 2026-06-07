const { GoogleGenAI } = require('@google/genai')
require('dotenv').config();

const apiKey =  process.env.GEMINI_API_KEY

const ai = new GoogleGenAI({
    apiKey: apiKey
})

const getAiCall = async (req, res) => {
    try {
        const {query }= req.body
        if (!query) {
            return res.status(400).send({
                success: false,
                message: 'Query is required'
            })
        }
        const responseStream = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: query,
        });
       
        return res.status(200).send({
            success: true,
            answer: responseStream.text
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports={
    getAiCall
}
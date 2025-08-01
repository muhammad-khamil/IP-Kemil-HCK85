const { GoogleGenerativeAI } = require("@google/generative-ai");

const reviewChecker = async (req, res, next) => {
    try {
        const { comment } = req.body;

        if (!comment) {
            throw { name: 'BadRequest', message: 'Comment is required' };
        }

        // Pastikan API key ada
        if (!process.env.GEMINI_API_KEY) {
            throw new Error('Gemini API key not configured');
        }

        const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
            Analyze this review text in Indonesian language for inappropriate content.
            Check for:
            1. Hate speech
            2. SARA (diskriminasi suku, agama, ras, atau antargolongan)
            3. Sexual content
            4. Inappropriate or offensive language
            5. Threats or harassment

            Review text: "${comment}"

            Respond with EXACTLY one word:
            "SAFE" - if the content is appropriate
            "UNSAFE" - if it contains any inappropriate content
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().trim().toUpperCase();

        if (text === "UNSAFE") {
            return res.status(403).json({ 
                message: 'Review mengandung konten SARA atau kata-kata yang tidak pantas',
                type: 'INAPPROPRIATE_CONTENT'
            });
        }

        next();
    } catch (error) {
        // Only log unexpected errors, not validation errors
        if (error.name !== 'BadRequest') {
            console.error('AI Review Check Error:', error);
        }
        next(error);
    }
};

module.exports = { reviewChecker };
// lib/gemini.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface QuestionRequest {
    subject: string;
    topic: string;
    class: string;
    chapter: string;
}

export interface GeneratedQuestion {
    id: number;
    question: string;
    options: string[];
    answer: number;
}

const GEMINI_MODEL = 'gemini-3-flash-preview';

export async function generateQuestions(
    request: QuestionRequest
): Promise<GeneratedQuestion[]> {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error('GEMINI_API_KEY is not configured');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    // Using Gemini 2.0 Flash - faster and more cost-effective
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

    const prompt = `You are an expert educator creating quiz questions for students.

Generate exactly 30 multiple-choice questions with the following specifications:

Subject: ${request.subject}
Topic: ${request.topic}
Class/Grade: ${request.class}
Chapter: ${request.chapter}

CRITICAL REQUIREMENTS:
1. ALL 30 questions MUST be specifically about "${request.topic}" from chapter "${request.chapter}" in the subject of "${request.subject}"
2. DO NOT include questions from other topics, chapters, or subjects
3. Each question must have exactly 4 options
4. Only one option should be correct
5. Questions should be age-appropriate for class ${request.class}
6. Vary difficulty levels (easy, medium, hard)
7. Keep questions concise and clear
8. Avoid ambiguous wording
9. Options MUST be very short (1-2 words maximum)

CHAPTER FOCUS: Every single question must directly relate to "${request.topic}" from chapter "${request.chapter}". 
For example:
- If chapter is "Triangles" and topic is "Geometry", questions should be about triangle properties, angles, theorems, etc.
- If chapter is "Linear Equations" and topic is "Algebra", questions should be about solving linear equations, graphing, etc.
- If chapter is "Plant Nutrition" and topic is "Photosynthesis", questions should be about photosynthesis process, chlorophyll, light reactions, etc.

Return ONLY a valid JSON array with NO additional text, markdown, or formatting.
Use this EXACT format:

[
  {
    "id": 1,
    "question": "What is the sum of angles in a triangle?",
    "options": ["90°", "180°", "270°", "360°"],
    "answer": 1
  },
  {
    "id": 2,
    "question": "What is the area formula for a circle?",
    "options": ["πr", "πr²", "2πr", "πd"],
    "answer": 1
  }
]

Generate all 30 questions about "${request.topic}" from chapter "${request.chapter}" now:`;

    try {
        console.log('🤖 Calling Gemini API...');
        const result = await model.generateContent(prompt);
        const text = result.response.text();

        console.log('📥 Received response from Gemini');

        // Extract JSON from response (remove markdown code blocks if present)
        let jsonText = text.trim();
        if (jsonText.startsWith('```')) {
            jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        }

        const questions = JSON.parse(jsonText);

        // Validate the response
        if (!Array.isArray(questions) || questions.length !== 30) {
            throw new Error(`Expected 30 questions, got ${questions.length}`);
        }

        // Validate each question
        questions.forEach((q, idx) => {
            if (!q.question || !Array.isArray(q.options) || q.options.length !== 4 || typeof q.answer !== 'number') {
                throw new Error(`Invalid question format at index ${idx}`);
            }
        });

        console.log('✅ Validation passed: 30 questions generated');

        return questions;
    } catch (error) {
        console.error('❌ Error generating questions:', error);
        throw new Error('Failed to generate questions. Please try again.');
    }
}

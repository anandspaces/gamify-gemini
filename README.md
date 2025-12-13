# Gemini API Integration - Setup Guide

## Prerequisites

1. **Gemini API Key**: Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

## Setup Instructions

### 1. Install Dependencies

Already installed:
```bash
npm install @google/generative-ai
```

### 2. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
# .env.local
GEMINI_API_KEY=your_gemini_api_key_here
```

**Important**: Never commit `.env.local` to version control!

### 3. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3000`

## API Endpoints

### POST `/api/generate-game`

Generate a new game session with custom questions.

**Request:**
```json
{
  "subject": "Mathematics",
  "topic": "Algebra",
  "class": "10",
  "chapter": "Linear Equations"
}
```

**Response:**
```json
{
  "success": true,
  "sessionId": "1701234567890-abc123def456",
  "gameUrl": "http://localhost:3000/game?id=1701234567890-abc123def456",
  "questionCount": 30
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Failed to generate questions"
}
```

### GET `/api/session/[id]`

Retrieve questions for a session.

**Response:**
```json
{
  "success": true,
  "questions": [
    {
      "id": 1,
      "question": "What is 2 + 2?",
      "options": ["3", "4", "5", "6"],
      "answer": 1
    }
    // ... 29 more questions
  ]
}
```

## Testing the API

### Using cURL

```bash
# Generate a game
curl -X POST http://localhost:3000/api/generate-game \
  -H "Content-Type: application/json" \
  -d '{"subject":"Math","topic":"Algebra","class":"10","chapter":"Linear Equations"}'

# Get session questions
curl http://localhost:3000/api/session/SESSION_ID_HERE
```

### Using Postman

1. Create a POST request to `http://localhost:3000/api/generate-game`
2. Set header: `Content-Type: application/json`
3. Body (raw JSON):
```json
{
  "subject": "Science",
  "topic": "Physics",
  "class": "9",
  "chapter": "Motion and Force"
}
```
4. Send request and copy the `gameUrl` from response
5. Open the URL in your browser to play!

## Session Management

- **Storage**: In-memory (no database required)
- **TTL**: 1 hour per session
- **Cleanup**: Automatic cleanup every 5 minutes
- **Restart**: Sessions are lost on server restart

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variable: `GEMINI_API_KEY`
4. Deploy!

### Other Platforms

Works on any platform supporting Next.js API routes:
- Netlify
- Railway
- Render
- AWS Amplify

## Flutter Integration

See [FLUTTER_INTEGRATION.md](./FLUTTER_INTEGRATION.md) for complete Flutter implementation guide.

## Troubleshooting

### "GEMINI_API_KEY is not configured"
- Ensure `.env.local` exists
- Restart dev server after creating `.env.local`

### "Failed to generate questions"
- Check API key is valid
- Check internet connection
- Check Gemini API quota/limits

### Session not found
- Session may have expired (1 hour TTL)
- Generate a new game session

## Example Subjects/Topics/Chapters

- **Mathematics**: 
  - Algebra: Linear Equations, Quadratic Equations, Polynomials
  - Geometry: Triangles, Circles, Coordinate Geometry
  - Calculus: Limits, Derivatives, Integrals
  - Statistics: Mean and Median, Probability, Data Representation
- **Science**: 
  - Physics: Motion and Force, Energy, Electricity
  - Chemistry: Atomic Structure, Chemical Reactions, Periodic Table
  - Biology: Cell Structure, Photosynthesis, Human Body Systems
- **English**: 
  - Grammar: Parts of Speech, Tenses, Sentence Structure
  - Literature: Poetry Analysis, Novel Study, Drama
  - Vocabulary: Word Formation, Synonyms and Antonyms
- **History**: 
  - World History: World Wars, Industrial Revolution, Ancient Rome
  - Ancient Civilizations: Egypt, Greece, Mesopotamia
- **Geography**: 
  - Countries: European Countries, Asian Countries
  - Capitals: World Capitals, State Capitals
  - Physical Geography: Rivers and Mountains, Climate Zones, Landforms

## API Rate Limits

Gemini API has rate limits. For production:
- Implement caching
- Add rate limiting middleware
- Consider upgrading Gemini API plan

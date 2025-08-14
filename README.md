# Micdrop Monorepo

A voice AI assistant built with Micdrop, featuring a Fastify TypeScript server and a React client.

## 🚀 Features

- **Server**: Fastify TypeScript server with Micdrop integration
- **Client**: Beautiful React app with futuristic neon UI
- **Voice AI**: OpenAI, Gladia STT, and ElevenLabs TTS integration
- **Real-time**: WebSocket-based voice conversations
- **Monorepo**: Turborepo setup for efficient development

## 🏗️ Project Structure

```
├── apps/
│   ├── server/          # Fastify TypeScript server
│   │   ├── src/
│   │   │   └── server.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── client/          # React TypeScript client
│       ├── src/
│       │   ├── components/
│       │   ├── App.tsx
│       │   └── main.tsx
│       ├── package.json
│       └── vite.config.ts
├── package.json         # Root package.json
└── turbo.json          # Turborepo configuration
```

## 🛠️ Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- API keys for:
  - OpenAI
  - ElevenLabs
  - Gladia

### Installation

1. **Install dependencies**:

   ```bash
   npm install
   cd apps/server && npm install
   cd ../client && npm install
   cd ../..
   ```

2. **Setup environment variables**:

   ```bash
   cp apps/server/.env.example apps/server/.env
   ```

   Edit `apps/server/.env` with your API keys:

   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
   ELEVENLABS_VOICE_ID=your_preferred_voice_id
   GLADIA_API_KEY=your_gladia_api_key_here
   PORT=8081
   HOST=0.0.0.0
   ```

## 🚀 Running the Application

### Development Mode

Start both server and client in development mode:

```bash
npm run dev
```

This will start:

- Server on `http://localhost:8081`
- Client on `http://localhost:3000`
- WebSocket endpoint: `ws://localhost:8081/call`

### Individual Services

**Server only**:

```bash
cd apps/server
npm run dev
```

**Client only**:

```bash
cd apps/client
npm run dev
```

### Production Build

```bash
npm run build
```

## 🎮 Usage

1. **Start the applications** using `npm run dev`
2. **Open your browser** to `http://localhost:3000`
3. **Configure server URL** (default: `ws://localhost:8081/call`)
4. **Click "Start Call"** to begin voice conversation
5. **Use controls**:
   - **Play**: Start voice conversation
   - **Pause**: Pause the conversation
   - **Stop**: End the conversation
6. **Speak naturally** - the AI will respond with voice and text

## 🎨 UI Features

- **Futuristic neon design** with animated backgrounds
- **Real-time status indicators** showing connection and voice activity
- **Conversation display** with user and assistant messages
- **Volume indicator** showing microphone input levels
- **Error handling** with user-friendly messages
- **Responsive design** that works on desktop and mobile

## 🔧 Configuration

### Server Configuration

The server can be configured via environment variables:

- `PORT`: Server port (default: 8081)
- `HOST`: Server host (default: 0.0.0.0)
- `OPENAI_API_KEY`: OpenAI API key
- `ELEVENLABS_API_KEY`: ElevenLabs API key
- `ELEVENLABS_VOICE_ID`: ElevenLabs voice ID
- `GLADIA_API_KEY`: Gladia API key

### Client Configuration

The client server URL can be configured in the settings panel within the app.

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development servers
- `npm run build` - Build for production
- `npm run type-check` - Run TypeScript type checking
- `npm run clean` - Clean build artifacts

### Tech Stack

**Server**:

- Fastify - Fast web framework
- TypeScript - Type safety
- Micdrop Server - Voice AI framework
- OpenAI - LLM agent
- Gladia - Speech-to-text
- ElevenLabs - Text-to-speech

**Client**:

- React 18 - UI framework
- TypeScript - Type safety
- Vite - Build tool
- Tailwind CSS - Styling
- Micdrop Client - Voice AI client
- Lucide React - Icons

## 📝 API Endpoints

### Server Endpoints

- `GET /health` - Health check endpoint
- `GET /call` - WebSocket endpoint for voice conversations (upgrade to WebSocket)

### WebSocket Events

The Micdrop protocol handles all voice communication automatically, including:

- Audio streaming
- Voice activity detection
- Real-time transcription
- AI response generation
- Text-to-speech conversion

## 🎯 Next Steps

- Add user authentication
- Implement conversation history persistence
- Add voice settings (speed, tone, etc.)
- Support multiple AI models
- Add mobile app support
- Implement conversation analytics

## 📄 License

MIT License - see LICENSE file for details.

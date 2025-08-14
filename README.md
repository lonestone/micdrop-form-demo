# 🎙️ Micdrop Form Demo - AI Voice Form Assistant

**A demo app showcasing [Micdrop](https://micdrop.dev)'s capabilities for voice-assisted form filling using OpenAI and tool calling.**

Transform how users fill forms with natural voice conversations! This demo app shows how to build an intelligent voice assistant that can collect structured information through conversational AI, automatically populating form fields using OpenAI's tool calling feature.

## ✨ Demo Features

- **🗣️ Voice-First Form Filling**: Users speak naturally to fill out forms instead of typing
- **🛠️ Dynamic Form Builder**: Create and customize forms with drag & drop interface
- **🤖 OpenAI Integration**: GPT-4 powered conversations with tool calling
- **📝 Smart Data Collection**: AI extracts structured data from natural conversations
- **⚡ Real-time Updates**: Form fields populate automatically as the AI collects information
- **🎯 Intelligent Conversations**: AI asks relevant questions based on form structure

## 🎯 What This Demonstrates

This app showcases Micdrop's powerful capabilities for building voice-enabled applications:

1. **Form Schema Integration**: Dynamic system prompt generation based on form configuration
2. **Tool Calling**: OpenAI agent uses tools to populate form fields in real-time
3. **Natural Conversations**: AI conducts human-like conversations to collect information
4. **Structured Data Extraction**: Converting conversational input into structured form data
5. **Real-time Synchronization**: Bidirectional updates between voice conversation and form UI

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- API keys for:
  - [OpenAI](https://platform.openai.com/) (for conversational AI + tool calling)
  - [ElevenLabs](https://elevenlabs.io/) (for text-to-speech)
  - [Gladia](https://www.gladia.io/) (for speech-to-text)

### Installation

1. **Clone and install**:

   ```bash
   git clone https://github.com/lonestone/micdrop-form-demo.git
   cd micdrop-form-demo
   npm install
   ```

2. **Setup environment variables**:

   Create `apps/server/.env` with your API keys:

   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
   ELEVENLABS_VOICE_ID=your_preferred_voice_id
   GLADIA_API_KEY=your_gladia_api_key_here
   PORT=8081
   HOST=0.0.0.0
   ```

3. **Start the demo**:

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`

## 🪄 This Demo App was Vibe-Coded

I used this prompt to vibe-code this project, and a few manual tweaks.

```
Create a turbo monorepo in current folder with a client and a server in a new /apps folder:
- server: a simple fastify server with Typescript that implements a micdrop server (use context7)
- client: a simple React webapp with micdrop client.

I want the React app to display a form with AI voice assistance instead of a classic discussion.
Show form builder, play/stop/pause buttons and conversation.
Make it beautiful and futuristic. White and yellow on dark background.
Make the form editable (name/type/delete/order inputs).
Default form inputs are: First name (required), Last name (required), Birthday date, City, Zip code, Message.
Once the call is started, the form is not editable anymore.
The form schema is sent as a call param when starting.
The server validates and uses the form schema and inject it in the systemPrompt.
The agent asks relevant questions to get all the info to fill the form.
Add agent tool with emitOutput:true to get the outputs.
When a ToolCall is received client side, update the form value.
Use context7 for micdrop client, server and OpenaiAgent doc.
```

Note: I used [Context7 MCP Server](https://context7.com), see [installation instructions](https://github.com/upstash/context7).

## 🎮 How to Use the Demo

1. **Open the app** at `http://localhost:3000`

2. **Design your form**:

   - Use the Form Builder on the left to create/edit form fields
   - Default form includes: First Name, Last Name, Birthday, City, Zip Code, Message
   - Drag & drop to reorder fields
   - Set fields as required or optional
   - Add new fields with different input types

3. **Start the voice assistant**:

   - Click "Start Assistant" when your form is ready
   - The form becomes read-only during the conversation
   - The AI receives your form schema and creates a personalized conversation plan

4. **Have a natural conversation**:

   - Speak naturally about your information
   - The AI will ask follow-up questions based on your form structure
   - Watch as form fields populate automatically in real-time
   - The AI uses OpenAI's tool calling to update form data as you speak

5. **Review collected data**:
   - See your responses appear in the form fields instantly
   - The conversation history is displayed on the right
   - Once the AI has collected all required information, it will end the conversation

### 🎯 Example Conversation Flow

```
AI: "Hello! I'm here to help you fill out a form. Let's start with your basic information. What's your first name?"

User: "Hi, my name is John Smith and I live in New York"

AI: "Great! I've got John as your first name and Smith as your last name. I also noted that you live in New York - is that the city you'd like me to record?"

User: "Yes, and my zip code is 10001"

AI: "Perfect! I've recorded New York as your city and 10001 as your zip code. Do you have a birthday you'd like to share?"
```

_As this conversation happens, you'll see the form fields automatically populate with "John", "Smith", "New York", and "10001"._

## 🔧 Technical Implementation

This demo showcases several advanced Micdrop features:

### Form Schema Integration

- Dynamic system prompt generation based on form configuration
- Client sends form schema via WebSocket parameters
- Server validates schema using Zod validation

### OpenAI Tool Calling

```typescript
agent.addTool({
  name: 'updateFormField',
  description: 'Update a form field with user-provided information',
  parameters: z.object({
    fieldName: z.string().describe('The name of the field to update'),
    value: z.string().describe('The value provided by the user'),
  }),
  emitOutput: true,
  callback: () => ({}), // Tool results sent to client
})
```

### Real-time Client Updates

```typescript
// Listen for tool calls and update form fields
Micdrop.on('ToolCall', (event) => {
  if (event.name === 'updateFormField') {
    const { fieldName, value } = event.parameters
    // Update form field in real-time
    updateFormField(fieldName, value)
  }
})
```

### Intelligent Conversation Flow

- AI prioritizes required fields over optional ones
- Extracts multiple pieces of information from single responses
- Provides natural conversation experience
- Automatically ends conversation when all required data is collected

## 🛠️ Built With

**Micdrop Stack**:

- [@micdrop/server](https://micdrop.dev/docs/server) - Voice AI server framework
- [@micdrop/client](https://micdrop.dev/docs/client) - Browser voice AI client
- [@micdrop/react](https://micdrop.dev/docs/client/installation) - React hooks for Micdrop
- [@micdrop/openai](https://micdrop.dev/docs/ai-integration/provided-integrations/openai) - OpenAI integration with tool calling
- [@micdrop/gladia](https://micdrop.dev/docs/ai-integration/provided-integrations/gladia) - Gladia Speech-to-Text
- [@micdrop/elevenlabs](https://micdrop.dev/docs/ai-integration/provided-integrations/elevenlabs) - ElevenLabs Text-to-Speech

**Additional Technologies**:

- **Server**: Fastify, TypeScript, Zod validation
- **Client**: React 18, TypeScript, Vite, Tailwind CSS
- **AI Services**: OpenAI GPT-4, ElevenLabs TTS, Gladia STT

## 💡 Use Cases

This demo pattern can be adapted for many voice-enabled form applications:

- **🏥 Healthcare**: Patient intake forms with voice assistance
- **🏦 Finance**: Loan applications with conversational data collection
- **🏢 Enterprise**: Employee onboarding and HR forms
- **🏪 E-commerce**: Voice-powered checkout and customer information
- **📋 Surveys**: Interactive voice surveys with dynamic questioning
- **🎓 Education**: Voice-enabled student registration and assessments

## 📖 Learn More

- [Micdrop Documentation](https://micdrop.dev/docs)
- [OpenAI Tool Calling Guide](https://platform.openai.com/docs/guides/function-calling)
- [WebSocket Protocol Details](https://micdrop.dev/docs/server/protocol)

## 📄 License

MIT License - see LICENSE file for details.

---

**Ready to build your own voice-enabled forms?** [Explore Micdrop](https://micdrop.dev) and start creating conversational AI applications!

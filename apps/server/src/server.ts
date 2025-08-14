import { ElevenLabsTTS } from '@micdrop/elevenlabs'
import { GladiaSTT } from '@micdrop/gladia'
import { OpenaiAgent } from '@micdrop/openai'
import { MicdropServer } from '@micdrop/server'
import { config } from 'dotenv'
import Fastify from 'fastify'

// Load environment variables
config()

const fastify = Fastify({ logger: true })

// Register WebSocket support
await fastify.register(import('@fastify/websocket'))

// CORS support for the client
fastify.register(async function (fastify) {
  fastify.addHook('onRequest', async (request, reply) => {
    reply.header('Access-Control-Allow-Origin', '*')
    reply.header(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS'
    )
    reply.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    )

    if (request.method === 'OPTIONS') {
      reply.status(200).send()
    }
  })
})

// Health check endpoint
fastify.get('/health', async (request, reply) => {
  return { status: 'ok', timestamp: new Date().toISOString() }
})

// WebSocket route for voice calls
fastify.register(async function (fastify) {
  fastify.get('/call', { websocket: true }, (socket) => {
    console.log('🎤 New voice connection established')

    // Setup AI components
    const agent = new OpenaiAgent({
      apiKey: process.env.OPENAI_API_KEY || '',
      systemPrompt:
        'You are a helpful and friendly voice assistant. Keep responses concise and conversational. Be enthusiastic and engaging.',
      model: 'gpt-4o-mini',
    })

    const stt = new GladiaSTT({
      apiKey: process.env.GLADIA_API_KEY || '',
    })

    const tts = new ElevenLabsTTS({
      apiKey: process.env.ELEVENLABS_API_KEY || '',
      voiceId: process.env.ELEVENLABS_VOICE_ID || '',
      modelId: 'eleven_turbo_v2_5',
    })

    // Handle voice conversation
    new MicdropServer(socket, {
      firstMessage:
        "Hello! I'm your AI voice assistant. How can I help you today?",
      agent,
      stt,
      tts,
    })

    socket.on('close', () => {
      console.log('🔌 Voice connection closed')
    })

    socket.on('error', (error) => {
      console.error('❌ WebSocket error:', error)
    })
  })
})

// Start server
const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '8081')
    const host = process.env.HOST || '0.0.0.0'

    await fastify.listen({ port, host })

    console.log(`🎤 Micdrop server running on http://${host}:${port}`)
    console.log(`🔗 WebSocket endpoint: ws://${host}:${port}/call`)
    console.log(`💚 Health check: http://${host}:${port}/health`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()

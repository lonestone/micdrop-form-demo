import { ElevenLabsTTS } from '@micdrop/elevenlabs'
import { GladiaSTT } from '@micdrop/gladia'
import { OpenaiAgent } from '@micdrop/openai'
import {
  handleError,
  Logger,
  MicdropServer,
  waitForParams,
} from '@micdrop/server'
import { config } from 'dotenv'
import Fastify from 'fastify'
import { z } from 'zod'

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

// Define form field schema
const formFieldSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['text', 'email', 'tel', 'date', 'textarea']),
  label: z.string(),
  required: z.boolean(),
  placeholder: z.string().optional(),
  value: z.string().optional(),
  order: z.number(),
})

const formSchema = z.object({
  fields: z.array(formFieldSchema),
})

const paramsSchema = z.object({
  formSchema: formSchema.optional(),
})

// WebSocket route for voice calls
fastify.register(async function (fastify) {
  fastify.get('/call', { websocket: true }, async (socket) => {
    console.log('🎤 New voice connection established')

    try {
      // Wait for parameters from client
      const params = await waitForParams(socket, paramsSchema.parse)

      // Build dynamic system prompt based on form schema
      let systemPrompt =
        'You are a helpful voice assistant designed to collect information from users through conversation.'

      if (params.formSchema && params.formSchema.fields.length > 0) {
        const fieldDescriptions = params.formSchema.fields
          .sort((a, b) => a.order - b.order)
          .map((field) => {
            const required = field.required ? ' (REQUIRED)' : ' (optional)'
            return `- ${field.label}${required}: ${field.type} field, name: "${field.name}"`
          })
          .join('\n')

        systemPrompt = `You are a helpful voice assistant designed to collect information from users through conversation.

Your goal is to gather the following information through natural conversation:

${fieldDescriptions}

Instructions:
1. Be friendly, conversational, and natural
2. Ask for information in a logical order (required fields first, then optional)
3. Don't ask for all fields at once - gather them progressively through conversation
4. When you successfully collect a piece of information, use the updateFormField tool to save it
5. If a user provides information for multiple fields at once, extract and save each piece separately
6. Keep responses concise and engaging
7. After collecting all required fields, end the conversation, say thank you and goodbye. Don't ask for anything else.

Start by greeting the user and beginning to collect the required information naturally.`
      }

      // Setup AI components
      const agent = new OpenaiAgent({
        apiKey: process.env.OPENAI_API_KEY || '',
        systemPrompt,
        model: 'gpt-4o',
        autoEndCall: true,
      })

      // Add form field update tool
      if (params.formSchema && params.formSchema.fields.length > 0) {
        agent.addTool({
          name: 'updateFormField',
          description: 'Update a form field with user-provided information',
          parameters: z.object({
            fieldName: z.string().describe('The name of the field to update'),
            value: z.string().describe('The value provided by the user'),
          }),
          emitOutput: true,
          callback: () => ({}),
        })
      }

      const stt = new GladiaSTT({
        apiKey: process.env.GLADIA_API_KEY || '',
      })

      const tts = new ElevenLabsTTS({
        apiKey: process.env.ELEVENLABS_API_KEY || '',
        voiceId: process.env.ELEVENLABS_VOICE_ID || '',
        modelId: 'eleven_turbo_v2_5',
      })

      // Handle voice conversation
      const server = new MicdropServer(socket, {
        generateFirstMessage: true,
        agent,
        stt,
        tts,
      })

      // Enable debug logs
      server.logger = new Logger('MicdropServer')
      agent.logger = new Logger('OpenaiAgent')
      stt.logger = new Logger('GladiaSTT')
      tts.logger = new Logger('ElevenLabsTTS')

      socket.on('close', () => {
        console.log('🔌 Voice connection closed')
      })

      socket.on('error', (error) => {
        console.error('❌ WebSocket error:', error)
      })
    } catch (error) {
      console.error('❌ Error setting up voice connection:', error)
      handleError(socket, error)
    }
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

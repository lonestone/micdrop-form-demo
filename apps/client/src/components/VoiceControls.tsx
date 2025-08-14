import { Micdrop, Speaker } from '@micdrop/client'
import { useMicdropEndCall, useMicdropState } from '@micdrop/react'
import { Mic, MicOff, Pause, Play, Square } from 'lucide-react'
import { FormSchema } from './FormBuilder'

interface VoiceControlsProps {
  serverUrl: string
  formSchema?: FormSchema
}

export default function VoiceControls({
  serverUrl,
  formSchema,
}: VoiceControlsProps) {
  const state = useMicdropState()

  // Handle end of call
  useMicdropEndCall(() => {
    // Stop after last speech end
    setTimeout(async () => {
      if (Speaker.isPlaying) {
        Speaker.on('StopPlaying', Micdrop.stop)
      } else {
        Micdrop.stop()
      }
    }, 5000)
  })

  const startCall = async () => {
    try {
      await Micdrop.start({
        url: serverUrl,
        vad: ['volume', 'silero'],
        debugLog: true,
        params: formSchema ? { formSchema } : undefined,
      })
    } catch (error) {
      console.error('Failed to start call:', error)
    }
  }

  const stopCall = async () => {
    await Micdrop.stop()
  }

  const togglePause = () => {
    if (state.isPaused) {
      Micdrop.resume()
    } else {
      Micdrop.pause()
    }
  }

  const getStatusMessage = () => {
    if (state.error) return `❌ Error: ${state.error.message}`
    if (state.isStarting) return '🔄 Starting call...'
    if (state.isPaused) return '⏸️ Call paused'
    if (state.isUserSpeaking) return '🗣️ You are speaking...'
    if (state.isListening) return '🎤 Listening for your voice'
    if (state.isProcessing) return '🤔 Processing your message'
    if (state.isAssistantSpeaking) return '🔊 Assistant is speaking'
    if (state.isStarted) return '✅ Connected and ready'
    return '🎤 Ready to start voice conversation'
  }

  return (
    <div className="flex flex-col items-center space-y-8">
      {/* Status Display */}
      <div className="glass-panel p-6 min-w-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neon-blue neon-glow mb-4">
            Voice Assistant
          </h2>
          <p className="text-lg text-gray-300 mb-6">{getStatusMessage()}</p>

          {/* Connection Status Indicator */}
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                state.isStarted
                  ? 'bg-green-400 animate-pulse-neon'
                  : 'bg-gray-600'
              }`}
            />
            <span className="text-sm text-gray-400">
              {state.isStarted ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Controls */}
      <div className="flex items-center space-x-6">
        {!state.isStarted ? (
          <button
            onClick={startCall}
            disabled={state.isStarting}
            className="btn-primary flex items-center space-x-3 text-xl px-8 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="w-6 h-6" />
            <span>{state.isStarting ? 'Starting...' : 'Start Assistant'}</span>
          </button>
        ) : (
          <>
            {/* Pause/Resume Button */}
            <button
              onClick={togglePause}
              className="btn-secondary flex items-center space-x-3 text-lg px-6 py-4"
            >
              {state.isPaused ? (
                <>
                  <Play className="w-5 h-5" />
                  <span>Resume</span>
                </>
              ) : (
                <>
                  <Pause className="w-5 h-5" />
                  <span>Pause</span>
                </>
              )}
            </button>

            {/* Stop Button */}
            <button
              onClick={stopCall}
              className="btn-danger flex items-center space-x-3 text-lg px-6 py-4"
            >
              <Square className="w-5 h-5" />
              <span>Stop</span>
            </button>
          </>
        )}
      </div>

      {/* Microphone Status */}
      {state.isStarted && (
        <div className="glass-panel p-4 flex items-center space-x-4">
          <div
            className={`transition-colors duration-300 ${
              state.isMicMuted ? 'text-red-400' : 'text-green-400'
            }`}
          >
            {state.isMicMuted ? (
              <MicOff className="w-6 h-6" />
            ) : (
              <Mic className="w-6 h-6" />
            )}
          </div>
          <span className="text-sm text-gray-400">
            Microphone {state.isMicMuted ? 'Muted' : 'Active'}
          </span>
        </div>
      )}
    </div>
  )
}

import React, { useState } from 'react'
import VoiceControls from './components/VoiceControls'
import ConversationDisplay from './components/ConversationDisplay'
import VolumeIndicator from './components/VolumeIndicator'
import ErrorHandler from './components/ErrorHandler'
import { useMicdropState } from '@micdrop/react'
import { Settings, Zap } from 'lucide-react'

export default function App() {
  const [serverUrl, setServerUrl] = useState('ws://localhost:8081/call')
  const [showSettings, setShowSettings] = useState(false)
  const state = useMicdropState()

  return (
    <div className="min-h-screen bg-dark-bg text-white overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-neon-blue/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-neon-purple/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-neon-pink/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Error Handler */}
      <ErrorHandler />

      {/* Header */}
      <header className="relative z-10 p-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold neon-glow text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">
              Micdrop Assistant
            </h1>
            <p className="text-xs text-gray-400">Futuristic AI Voice Interface</p>
          </div>
        </div>

        <button
          onClick={() => setShowSettings(!showSettings)}
          className="btn-secondary p-3"
        >
          <Settings className="w-5 h-5" />
        </button>
      </header>

      {/* Settings Panel */}
      {showSettings && (
        <div className="relative z-20 mx-6 mb-6">
          <div className="glass-panel p-4">
            <h3 className="text-lg font-semibold text-neon-purple mb-4">Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Server URL
                </label>
                <input
                  type="text"
                  value={serverUrl}
                  onChange={(e) => setServerUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:border-neon-blue focus:outline-none"
                  placeholder="ws://localhost:8081/call"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="relative z-10 px-6 pb-6 flex-1">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[70vh]">
            {/* Left Column - Controls */}
            <div className="flex flex-col space-y-6">
              <VoiceControls serverUrl={serverUrl} />
              
              {/* Volume Indicator - only show when mic is active */}
              {state.isMicStarted && (
                <div className="flex justify-center">
                  <VolumeIndicator />
                </div>
              )}
            </div>

            {/* Right Column - Conversation */}
            <div className="flex flex-col">
              <ConversationDisplay />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-6 text-center">
        <p className="text-xs text-gray-500">
          Powered by Micdrop • Built with React & TypeScript
        </p>
      </footer>
    </div>
  )
}
import React from 'react'
import { useMicdropError } from '@micdrop/react'
import { AlertTriangle, Wifi, Mic, Shield, Server } from 'lucide-react'

export default function ErrorHandler() {
  const [currentError, setCurrentError] = React.useState<any>(null)

  useMicdropError((error) => {
    setCurrentError(error)
    // Auto-hide error after 10 seconds
    setTimeout(() => setCurrentError(null), 10000)
  })

  if (!currentError) return null

  const getErrorIcon = (code: string) => {
    switch (code) {
      case 'Mic':
        return <Mic className="w-6 h-6" />
      case 'Connection':
        return <Wifi className="w-6 h-6" />
      case 'Unauthorized':
        return <Shield className="w-6 h-6" />
      case 'InternalServer':
        return <Server className="w-6 h-6" />
      default:
        return <AlertTriangle className="w-6 h-6" />
    }
  }

  const getErrorMessage = (code: string, message: string) => {
    switch (code) {
      case 'Mic':
        return 'Microphone access denied. Please enable microphone permissions and try again.'
      case 'Connection':
        return 'Connection lost. Please check your internet connection and server status.'
      case 'Unauthorized':
        return 'Authentication failed. Please check your credentials.'
      case 'InternalServer':
        return 'Server error occurred. Please try again later.'
      case 'MissingUrl':
        return 'Server URL is missing. Please check your configuration.'
      case 'BadRequest':
        return 'Invalid request. Please check your settings.'
      case 'NotFound':
        return 'Voice server not found. Please verify the server URL.'
      default:
        return message || 'An unexpected error occurred.'
    }
  }

  return (
    <div className="fixed top-4 right-4 max-w-md z-50 animate-float">
      <div className="glass-panel p-4 border-red-500/50 bg-red-500/10">
        <div className="flex items-start space-x-3">
          <div className="text-red-400 flex-shrink-0">
            {getErrorIcon(currentError.code)}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-red-400 mb-1">
              {currentError.code} Error
            </h4>
            <p className="text-sm text-gray-300">
              {getErrorMessage(currentError.code, currentError.message)}
            </p>
          </div>
          <button
            onClick={() => setCurrentError(null)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  )
}
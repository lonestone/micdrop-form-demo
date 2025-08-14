import React from 'react'
import { useMicVolume } from '@micdrop/react'
import { Volume2, VolumeX } from 'lucide-react'

export default function VolumeIndicator() {
  const { micVolume } = useMicVolume()
  
  // Convert dB to 0-100 percentage for display
  const normalizedVolume = Math.max(0, Math.min(100, micVolume + 100))
  
  return (
    <div className="glass-panel p-4 w-full max-w-sm">
      <div className="flex items-center space-x-3">
        <div className="text-neon-blue">
          {normalizedVolume > 10 ? (
            <Volume2 className="w-5 h-5" />
          ) : (
            <VolumeX className="w-5 h-5" />
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400">Microphone Level</span>
            <span className="text-xs text-neon-blue font-mono">
              {normalizedVolume.toFixed(0)}%
            </span>
          </div>
          
          <div className="w-full h-2 bg-dark-bg rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-100 ease-out rounded-full"
              style={{
                width: `${normalizedVolume}%`,
                background: `linear-gradient(90deg, 
                  #00d4ff 0%, 
                  #8b5cf6 50%, 
                  #ff006e 100%
                )`
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
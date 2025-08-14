import React, { useEffect, useRef } from 'react'
import { useMicdropState } from '@micdrop/react'
import { User, Bot } from 'lucide-react'

export default function ConversationDisplay() {
  const { conversation } = useMicdropState()
  const bottomRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversation.length])

  if (conversation.length === 0) {
    return (
      <div className="glass-panel p-8 flex-1 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <Bot className="w-16 h-16 mx-auto mb-4 text-neon-blue animate-float" />
          <p className="text-lg">Start a conversation to see messages here</p>
        </div>
      </div>
    )
  }

  return (
    <div className="glass-panel flex-1 flex flex-col">
      <div className="p-4 border-b border-dark-border">
        <h3 className="text-lg font-semibold text-neon-purple neon-glow">
          Conversation ({conversation.length} messages)
        </h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[500px]">
        {conversation.map(({ role, content }, index) => (
          <div
            key={index}
            className={`flex items-start space-x-3 animate-float ${
              role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            {/* Avatar */}
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              role === 'user' 
                ? 'bg-neon-blue/20 text-neon-blue' 
                : 'bg-neon-purple/20 text-neon-purple'
            }`}>
              {role === 'user' ? (
                <User className="w-4 h-4" />
              ) : (
                <Bot className="w-4 h-4" />
              )}
            </div>
            
            {/* Message */}
            <div className={`max-w-[80%] p-4 rounded-2xl border transition-all duration-300 hover:scale-[1.02] ${
              role === 'user'
                ? 'bg-neon-blue/10 border-neon-blue/30 text-neon-blue rounded-br-none'
                : 'bg-neon-purple/10 border-neon-purple/30 text-neon-purple rounded-bl-none'
            }`}>
              <p className="text-sm leading-relaxed">
                {content}
              </p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
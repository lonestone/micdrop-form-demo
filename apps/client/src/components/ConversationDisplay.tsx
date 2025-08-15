import { useMicdropState } from '@micdrop/react'
import { Bot, User, Settings, Play, CheckCircle } from 'lucide-react'
import { useEffect, useRef } from 'react'

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
        {conversation.map((item, index) => {
          if (item.role === 'tool_call') {
            // Tool call item
            return (
              <div key={index} className="ml-11">
                <div className="bg-gray-800/50 border border-gray-600/30 rounded-lg p-3 transition-all duration-300 hover:bg-gray-700/50">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center">
                      <Settings className="w-3 h-3" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <Play className="w-3 h-3 text-orange-400" />
                        <span className="text-xs font-medium text-orange-400">
                          {item.toolName}
                        </span>
                      </div>
                      
                      {/* Tool parameters */}
                      {item.parameters && (
                        <div className="mb-2">
                          <div className="text-xs text-gray-400 mb-1">Parameters:</div>
                          <div className="bg-gray-900/50 rounded p-2 text-xs font-mono text-gray-300 overflow-x-auto">
                            {item.parameters}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          }

          if (item.role === 'tool_result') {
            // Tool result item
            return (
              <div key={index} className="ml-11">
                <div className="bg-gray-800/50 border border-gray-600/30 rounded-lg p-3 transition-all duration-300 hover:bg-gray-700/50">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center">
                      <CheckCircle className="w-3 h-3" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <CheckCircle className="w-3 h-3 text-green-400" />
                        <span className="text-xs font-medium text-green-400">
                          {item.toolName} result
                        </span>
                      </div>
                      
                      {/* Tool output */}
                      <div>
                        <div className="text-xs text-gray-400 mb-1">Output:</div>
                        <div className="bg-gray-900/50 rounded p-2 text-xs font-mono text-gray-300 overflow-x-auto max-h-32 overflow-y-auto">
                          {item.output}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          }

          // Regular message item
          return (
            <div key={index}>
              <div
                className={`flex items-start space-x-3 animate-float ${
                  item.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                {/* Avatar */}
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    item.role === 'user'
                      ? 'bg-neon-blue/20 text-neon-blue'
                      : 'bg-neon-purple/20 text-neon-purple'
                  }`}
                >
                  {item.role === 'user' ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>

                {/* Message */}
                <div
                  className={`max-w-[80%] p-4 rounded-2xl border transition-all duration-300 hover:scale-[1.02] ${
                    item.role === 'user'
                      ? 'bg-neon-blue/10 border-neon-blue/30 text-neon-blue rounded-br-none'
                      : 'bg-neon-purple/10 border-neon-purple/30 text-neon-purple rounded-bl-none'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{item.content}</p>
                </div>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}

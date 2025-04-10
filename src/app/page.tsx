'use client';

import { useState, useEffect, useRef } from 'react';
import { ClientMessage } from './actions';
import { useActions, useUIState } from 'ai/rsc';
import { generateId } from 'ai';

export const maxDuration = 30;

export default function Home() {
  const [input, setInput] = useState<string>('');
  const [conversation, setConversation] = useUIState();
  const { continueConversation } = useActions();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversation]);

  return (
    <div className="flex flex-col h-screen w-full bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md px-6 py-4">
        <h1 className="text-2xl font-semibold text-indigo-700">
          📚 Shaktiman Book Bot
        </h1>
        <p className="text-sm text-gray-500">
          Ask anything about books, genres, or authors
        </p>
      </header>

      {/* Messages */}
      <main
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-6"
      >
        {conversation.map((message: ClientMessage) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`rounded-xl p-4 shadow-sm ${
                message.role === 'user'
                  ? 'bg-indigo-600 text-white max-w-sm'
                  : 'bg-white border max-w-full w-full'
              }`}
            >
              <div className="text-xs text-gray-400 mb-1 capitalize">
                {message.role}
              </div>
              <div className="whitespace-pre-line text-sm">
                {message.display}
              </div>
            </div>
          </div>
        ))}
      </main>

      {/* Input */}
      <footer className="bg-white px-4 py-3 border-t">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Type your question..."
            className="flex-1 px-4 py-2 text-sm border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
          <button
            onClick={async () => {
              if (!input.trim()) return;

              setConversation((currentConversation: ClientMessage[]) => [
                ...currentConversation,
                { id: generateId(), role: 'user', display: input },
              ]);

              const message = await continueConversation(input);

              setConversation((currentConversation: ClientMessage[]) => [
                ...currentConversation,
                message,
              ]);

              setInput('');
            }}
            className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Send
          </button>
        </div>
      </footer>
    </div>
  );
}

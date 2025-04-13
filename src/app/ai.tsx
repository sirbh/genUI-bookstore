import { createAI } from 'ai/rsc';
import { ServerMessage, ClientMessage, continueConversation } from './actions';
import { generateId } from 'ai';

export const AI = createAI<ServerMessage[], ClientMessage[]>({
  actions: {
    continueConversation,
  },
  initialAIState: [],
  initialUIState: [{
    id: generateId(),
    role: 'assistant',
    display: `👋 Hi there! I'm Shaktiman Book Bot 📚 — your assistant for exploring the world of books! Ask me anything about titles, authors, genres, publishers, or even specific ISBNs. I can help you find books, summarize details, or guide you through your next great read. Let’s dive into the library together! 🔍✨`,
  }],
});
'use server';

import { getMutableAIState, streamUI } from 'ai/rsc';
import { openai } from '@ai-sdk/openai';
import { ReactNode } from 'react';
import { z } from 'zod';
import { generateId } from 'ai';
import ShaktimanBooks from '@/components/books';
import BookDetails from '@/components/book';

export interface ServerMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ClientMessage {
  id: string;
  role: 'user' | 'assistant';
  display: ReactNode;
}

export async function continueConversation(
  input: string,
): Promise<ClientMessage> {
  'use server';

  const history = getMutableAIState();

  const result = await streamUI({
    system: `

    You are a helpful and knowledgeable assistant that specializes in books.
Your job is to help users find books based on title, author, subject, publisher, or other metadata like ISBN. You should also provide book descriptions, authors, publication dates, and links to preview or buy them.
You should only respond with book-related content.
If a user asks anything outside of this domain (e.g. weather, math, unrelated facts), politely decline and remind them you're a book assistant.
You can search for books using Google Books API. Structure search queries properly based on user input (e.g., "Find books by Agatha Christie" → inauthor:Agatha Christie).
Your tone is informative, warm, and enthusiastic about reading.
    
    `,
    model: openai('gpt-3.5-turbo'),
    messages: [...history.get(), { role: 'user', content: input }],
    text: ({ content, done }) => {
      if (done) {
        history.done((messages: ServerMessage[]) => [
          ...messages,
          { role: 'assistant', content },
        ]);
      }

      return <div>{content}</div>;
    },
    tools: {
      Books: {
        description: 'Search and display books using various search filters like title, author, subject, etc.',
        parameters: z.object({
          query: z.string().optional().describe('General search query for books'),
          intitle: z.string().optional().describe('Search for books with this title'),
          inauthor: z.string().optional().describe('Search for books by this author'),
          inpublisher: z.string().optional().describe('Search for books by this publisher'),
          subject: z.string().optional().describe('Search for books in this subject/category'),
          isbn: z.string().optional().describe('Search for books by ISBN'),
          lccn: z.string().optional().describe('Search for books by Library of Congress Control Number'),
          oclc: z.string().optional().describe('Search for books by OCLC number'),
        }),
        generate: async (params) => {
          const queryParts: Record<string, string> = {};

          if (params.query) queryParts.query = params.query;
          if (params.intitle) queryParts.intitle = `${params.intitle}`;
          if (params.inauthor) queryParts.inauthor = `${params.inauthor}`;
          if (params.inpublisher) queryParts.inpublisher = `${params.inpublisher}`;
          if (params.subject) queryParts.subject = `${params.subject}`;
          if (params.isbn) queryParts.isbn = `${params.isbn}`;
          if (params.lccn) queryParts.lccn = `${params.lccn}`;
          if (params.oclc) queryParts.oclc = `${params.oclc}`;

          console.log('Query parts:', queryParts); // Debugging line

          const finalQuery = Object.values(queryParts).join('+');

          history.done((messages: ServerMessage[]) => [
            ...messages,
            {
              role: 'assistant',
              content: `Searching books for "${finalQuery}"`,
            },
          ]);

          return <ShaktimanBooks {...queryParts} />;
        },
      },

      Book:{
        description: 'Get detailed information about a specific book using its ID',
        parameters: z.object({
          bookId: z.string().describe('ID of the book to retrieve details for'),
        }),
        generate: async (params) => {
          const { bookId } = params;
          return <BookDetails bookId={bookId} />;
      }


    },
    },
  });

  return {
    id: generateId(),
    role: 'assistant',
    display: result.value,
  };
}
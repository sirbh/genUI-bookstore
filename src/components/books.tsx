'use client';

import { ClientMessage } from '@/app/actions';
import { generateId } from 'ai';
import { useActions, useUIState } from 'ai/rsc';
import React, { useEffect, useState } from 'react';

const ShaktimanBooks = ({
  query = '',
  intitle,
  inauthor,
  inpublisher,
  subject,
  isbn,
  lccn,
  oclc,
}: {
  query?: string;
  intitle?: string;
  inauthor?: string;
  inpublisher?: string;
  subject?: string;
  isbn?: string;
  lccn?: string;
  oclc?: string;
}) => {
  const [books, setBooks] = useState<{
    id: string;
    volumeInfo: {
      title: string;
      subtitle?: string;
      authors?: string[];
      publishedDate?: string;
      description?: string;
      imageLinks?: { thumbnail?: string };
      previewLink?: string;
    };
  }[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const maxResults = 10;

  const { continueConversation } = useActions();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [conversation, setConversation] = useUIState();

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      const parts = [encodeURIComponent(query)];
      if (intitle) parts.push(`intitle:${encodeURIComponent(intitle)}`);
      if (inauthor) parts.push(`inauthor:${encodeURIComponent(inauthor)}`);
      if (inpublisher) parts.push(`inpublisher:${encodeURIComponent(inpublisher)}`);
      if (subject) parts.push(`subject:${encodeURIComponent(subject)}`);
      if (isbn) parts.push(`isbn:${encodeURIComponent(isbn)}`);
      if (lccn) parts.push(`lccn:${encodeURIComponent(lccn)}`);
      if (oclc) parts.push(`oclc:${encodeURIComponent(oclc)}`);

      const searchQuery = parts.filter(Boolean).join('+');
      const url = `https://www.googleapis.com/books/v1/volumes?q=${searchQuery}&startIndex=${pageIndex}`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        setBooks(data.items || []);
        setTotalItems(data.totalItems || 0);
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [query, intitle, inauthor, inpublisher, subject, isbn, lccn, oclc, pageIndex]);

  const totalPages = Math.ceil(totalItems / maxResults);

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="mb-4 space-y-2">
        <h2 className="text-lg font-semibold">
          Book results {query && `for "${query}"`}
        </h2>
        <p className="text-sm text-gray-500">Total results: {totalItems}</p>
        <p className="text-sm text-gray-500">
          Search Query Made:
          {query && ` "${query}" `}
          {intitle && `intitle:${intitle} `}
          {inauthor && `inauthor:${inauthor} `}
          {inpublisher && `inpublisher:${inpublisher} `}
          {subject && `subject:${subject} `}
          {isbn && `isbn:${isbn} `}
          {lccn && `lccn:${lccn} `}
          {oclc && `oclc:${oclc} `}
        </p>
      </div>

      {/* Book Cards Scrollable Container */}
      <div className="overflow-x-auto whitespace-nowrap py-2 border-y">
        {loading ? (
          <div className="text-sm text-gray-500 p-4">Loading books...</div>
        ) : books.length === 0 ? (
          <div className="text-sm text-gray-500 p-4">No books found.</div>
        ) : (
          <div className="flex space-x-4 min-w-max">
            {books.map((book) => {
              const info = book.volumeInfo;
              return (
                <div
                  key={book.id}
                  onClick={async () => {
                    setConversation((currentConversation: ClientMessage[]) => [
                      ...currentConversation,
                      {
                        id: generateId(),
                        role: 'user',
                        display: `Look for the book ${info.title}`,
                      },
                    ]);
                    const message = await continueConversation(`Look for the book ${book.id}}`);
                    setConversation((currentConversation: ClientMessage[]) => [
                      ...currentConversation,
                      message,
                    ]);
                  }}
                  className="w-64 shrink-0 bg-white rounded-lg border shadow-sm p-4 cursor-pointer hover:shadow-md transition"
                >
                  <h3 className="text-sm font-bold mb-1">
                    {info.title}
                    {info.subtitle ? `: ${info.subtitle}` : ''}
                  </h3>
                  {info.imageLinks?.thumbnail && (
                    <img
                      src={info.imageLinks.thumbnail}
                      alt={`${info.title} cover`}
                      className="w-32 h-48 object-cover mx-auto my-2"
                    />
                  )}
                  <p className="text-xs text-gray-600">
                    <strong>Author(s):</strong> {info.authors?.join(', ') || 'Unknown'}
                  </p>
                  <p className="text-xs text-gray-600">
                    <strong>Published:</strong> {info.publishedDate || 'N/A'}
                  </p>
                  {info.description && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-3">
                      {info.description}
                    </p>
                  )}
                  <a
                    href={info.previewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-indigo-600 mt-2 inline-block"
                  >
                    Preview →
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalItems > maxResults && (
        <div className="flex justify-center items-center space-x-4 mt-6">
          <button
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            onClick={() => setPageIndex((p) => p - 1)}
            disabled={pageIndex === 0}
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {pageIndex + 1} of {totalPages}
          </span>
          <button
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            onClick={() => setPageIndex((p) => p + 1)}
            disabled={(pageIndex + 1) * maxResults >= totalItems}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ShaktimanBooks;

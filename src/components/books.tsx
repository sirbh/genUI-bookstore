'use client';

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
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

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
      const url = `https://www.googleapis.com/books/v1/volumes?q=${searchQuery}`;


      console.log('Fetching books from URL:', url); // Debugging line

      try {
        const response = await fetch(url);
        const data = await response.json();
        setBooks(data.items || []);
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [query, intitle, inauthor, inpublisher, subject, isbn, lccn, oclc]);

  if (loading) return <div className="text-sm text-gray-500">Loading books...</div>;

  return (
    <div className="overflow-x-auto">
      <h2 className="text-lg font-semibold mb-2">
        Book results {query && `for "${query}"`}
      </h2>
      <div className="flex space-x-4">
        {books.length === 0 && <p>No books found.</p>}
        {books.map((book) => {
          const info = book.volumeInfo;
          return (
            <div
              key={book.id}
              className="w-64 shrink-0 bg-white rounded-lg border shadow-sm p-4"
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
    </div>
  );
};

export default ShaktimanBooks;

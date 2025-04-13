'use client';

import React, { useEffect, useState } from 'react';

const BookDetails = ({ bookId }) => {
  const [book, setBook] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!bookId) return;

    const fetchBook = async () => {
      try {
        const res = await fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}`);
        const data = await res.json();

        if (data.error) {
          setError(data.error.message);
        } else {
          setBook(data.volumeInfo);
          setError('');
        }
      } catch (err) {
        setError('Failed to fetch book data.');
      }
    };

    fetchBook();
  }, [bookId]);

  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!book) return <p>Loading...</p>;

  return (
    <div className="max-w-xl mx-auto border rounded-lg p-4 shadow-md">
      <h2 className="text-2xl font-bold mb-2">{book.title}</h2>
      <p className="text-gray-700 mb-1"><strong>Author(s):</strong> {book.authors?.join(', ')}</p>
      <p className="text-gray-700 mb-1"><strong>Publisher:</strong> {book.publisher}</p>
      <p className="text-gray-700 mb-1"><strong>Published:</strong> {book.publishedDate}</p>
      {book.imageLinks?.thumbnail && (
        <img src={book.imageLinks.thumbnail} alt={book.title} className="my-4 rounded" />
      )}
      <p className="text-sm text-gray-600">{book.description}</p>
      <a
        href={book.previewLink}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 underline mt-2 inline-block"
      >
        Preview Book
      </a>
    </div>
  );
};

export default BookDetails;

// BooksByAuthor.js
import React, { useState } from 'react';
import axios from 'axios';

const BooksByAuthor = () => {
  const [author, setAuthor] = useState('');
  const [books, setBooks] = useState([]);

  const handleSearch = () => {
    axios.get(`http://localhost:3000/books/author/${author}`)
      .then(res => setBooks(res.data))
      .catch(() => setBooks([]));
  };

  return (
    <div>
      <h2>Search Books by Author</h2>
      <input value={author} onChange={e => setAuthor(e.target.value)} placeholder="Enter Author" />
      <button onClick={handleSearch}>Search</button>
      <ul>
        {books.length > 0 ? (
          books.map(book => (
            <li key={book.isbn}>{book.title} ({book.isbn})</li>
          ))
        ) : (
          author && <p>No books found.</p>
        )}
      </ul>
    </div>
  );
};

export default BooksByAuthor;

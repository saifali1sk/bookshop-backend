// BookByISBN.js
import React, { useState } from 'react';
import axios from 'axios';

const BookByISBN = () => {
  const [isbn, setIsbn] = useState('');
  const [book, setBook] = useState(null);

  const handleSearch = () => {
    axios.get(`http://localhost:3000/books/${isbn}`)
      .then(res => setBook(res.data))
      .catch(() => setBook(null));
  };

  return (
    <div>
      <h2>Search Book by ISBN</h2>
      <input value={isbn} onChange={e => setIsbn(e.target.value)} placeholder="Enter ISBN" />
      <button onClick={handleSearch}>Search</button>
      {book ? (
        <div>
          <h3>{book.title}</h3>
          <p>Author: {book.author}</p>
        </div>
      ) : isbn && <p>Book not found.</p>}
    </div>
  );
};

export default BookByISBN;

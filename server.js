const express = require('express');
const app = express();
app.use(express.json());

const PORT = 3000;

// In-memory stores
const users = [];
const books = [
  {
    isbn: '001',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    reviews: []
  },
  {
    isbn: '002',
    title: 'JavaScript: The Good Parts',
    author: 'Douglas Crockford',
    reviews: []
  },
  {
    isbn: '003',
    title: 'Eloquent JavaScript',
    author: 'Marijn Haverbeke',
    reviews: []
  }
];

// 📚 TASKS 1–5: Book Queries
app.get('/books', (req, res) => res.status(200).json(books));
app.get('/books/:isbn', (req, res) => {
  const book = books.find(b => b.isbn === req.params.isbn);
  res.status(book ? 200 : 404).json(book || { error: 'Book not found' });
});
app.get('/books/author/:author', (req, res) => {
  const matched = books.filter(b => b.author.toLowerCase().includes(req.params.author.toLowerCase()));
  res.status(matched.length ? 200 : 404).json(matched.length ? matched : { error: 'No books found by that author' });
});
app.get('/books/title/:title', (req, res) => {
  const matched = books.filter(b => b.title.toLowerCase().includes(req.params.title.toLowerCase()));
  res.status(matched.length ? 200 : 404).json(matched.length ? matched : { error: 'No books found with that title' });
});
app.get('/books/review/:isbn', (req, res) => {
  const book = books.find(b => b.isbn === req.params.isbn);
  res.status(book ? 200 : 404).json(book ? { title: book.title, reviews: book.reviews } : { error: 'Book not found' });
});

// 👤 TASKS 6–7: User Registration & Login
app.post('/users/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: 'Username and password are required' });

  if (users.find(u => u.username === username))
    return res.status(409).json({ error: 'User already exists' });

  users.push({ username, password });
  res.status(201).json({ message: 'User registered successfully' });
});
app.post('/users/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (!username || !password)
    return res.status(400).json({ error: 'Username and password are required' });
  if (!user)
    return res.status(401).json({ error: 'Invalid credentials' });

  res.status(200).json({ message: 'Login successful' });
});

// 📝 TASKS 8–10: Review Add, Delete, Update
app.post('/books/review/:isbn', (req, res) => {
  const { username, rating, comment } = req.body;
  const user = users.find(u => u.username === username);
  const book = books.find(b => b.isbn === req.params.isbn);

  if (!username || !rating || !comment)
    return res.status(400).json({ error: 'Username, rating, and comment are required' });
  if (!user)
    return res.status(403).json({ error: 'User not found. Please register first.' });
  if (!book)
    return res.status(404).json({ error: 'Book not found' });

  book.reviews.push({ user: username, rating, comment });
  res.status(201).json({ message: 'Review added successfully', reviews: book.reviews });
});
app.delete('/books/review/:isbn/:username', (req, res) => {
  const { isbn, username } = req.params;
  const user = users.find(u => u.username === username);
  const book = books.find(b => b.isbn === isbn);

  if (!user)
    return res.status(403).json({ error: 'User not found. Please register first.' });
  if (!book)
    return res.status(404).json({ error: 'Book not found' });

  const originalCount = book.reviews.length;
  book.reviews = book.reviews.filter(r => r.user !== username);

  if (book.reviews.length === originalCount)
    return res.status(404).json({ error: 'No review found for this user on this book' });

  res.status(200).json({ message: 'Review deleted successfully', reviews: book.reviews });
});
app.put('/books/review/:isbn', (req, res) => {
  const { username, rating, comment } = req.body;
  const user = users.find(u => u.username === username);
  const book = books.find(b => b.isbn === req.params.isbn);

  if (!username || !rating || !comment)
    return res.status(400).json({ error: 'Username, rating, and comment are required' });
  if (!user)
    return res.status(403).json({ error: 'User not found. Please register first.' });
  if (!book)
    return res.status(404).json({ error: 'Book not found' });

  const review = book.reviews.find(r => r.user === username);
  if (!review)
    return res.status(404).json({ error: 'Review by this user not found for this book' });

  review.rating = rating;
  review.comment = comment;
  res.status(200).json({ message: 'Review updated successfully', reviews: book.reviews });
});

// 🔍 TASKS 11–13: User Info and Removal
app.get('/users', (req, res) => res.status(200).json(users));
app.get('/users/:username', (req, res) => {
  const user = users.find(u => u.username === req.params.username);
  res.status(user ? 200 : 404).json(user || { error: 'User not found' });
});
app.delete('/users/:username', (req, res) => {
  const index = users.findIndex(u => u.username === req.params.username);
  if (index === -1)
    return res.status(404).json({ error: 'User not found' });

  users.splice(index, 1);
  books.forEach(book => {
    book.reviews = book.reviews.filter(r => r.user !== req.params.username);
  });

  res.status(200).json({ message: 'User and their reviews deleted successfully' });
});

// 📋 TASK 14: Get All Reviews by a User
app.get('/reviews/:username', (req, res) => {
  const { username } = req.params;

  const user = users.find(u => u.username === username);
  if (!user)
    return res.status(404).json({ error: 'User not found' });

  const userReviews = [];
  books.forEach(book => {
    book.reviews.forEach(review => {
      if (review.user === username) {
        userReviews.push({
          isbn: book.isbn,
          title: book.title,
          rating: review.rating,
          comment: review.comment
        });
      }
    });
  });

  res.status(userReviews.length ? 200 : 404).json(
    userReviews.length
      ? { user: username, reviews: userReviews }
      : { error: 'No reviews found for this user' }
  );
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});

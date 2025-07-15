const axios = require('axios');

function searchByAuthor(author) {
  axios.get(`http://localhost:3000/books/author/${author}`)
    .then(response => {
      console.log('🖋️ Books by Author:', response.data);
    })
    .catch(error => {
      console.error('❌ Error:', error.response ? error.response.data : error.message);
    });
}

searchByAuthor('Robert C. Martin'); // Replace with any author name

const axios = require('axios');

function searchByISBN(isbn) {
  axios.get(`http://localhost:3000/books/${isbn}`)
    .then(response => {
      console.log('🔍 Book found:', response.data);
    })
    .catch(error => {
      console.error('❌ Error:', error.response ? error.response.data : error.message);
    });
}

searchByISBN('001'); // Replace with any valid ISBN

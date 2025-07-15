const axios = require('axios');

function searchByTitle(title) {
  axios.get(`http://localhost:3000/books/title/${title}`)
    .then(response => {
      console.log('📘 Books with Title:', response.data);
    })
    .catch(error => {
      console.error('❌ Error:', error.response ? error.response.data : error.message);
    });
}

searchByTitle('Clean Code'); // Replace with any book title

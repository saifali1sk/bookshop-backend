const axios = require('axios');

async function getAllBooks() {
  try {
    const response = await axios.get('http://localhost:3000/books');
    console.log('📚 All Books:', response.data);
  } catch (error) {
    if (error.response) {
      console.error('❌ Server responded with:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('❌ No response received. Possible server issue or port problem.');
    } else {
      console.error('❌ Axios error:', error.message);
    }
  }
}

getAllBooks();

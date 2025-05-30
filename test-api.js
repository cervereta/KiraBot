const axios = require('axios');

axios.get('https://api.api-ninjas.com/v1/riddles', {
  headers: { 'X-Api-Key': process.env.RIDDLES_API_KEY }
})
.then(response => console.log('Respuesta:', response.data))
.catch(error => console.error('Error:', error.message));
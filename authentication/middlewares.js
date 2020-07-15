const express = require('express');
const app = express();

const logic = require('./logic');
const checkJwt = logic.checkJwt;

app.get('/api/v2/public', function(req, res) {
  res.json({
    message: 'Hello from a public endpoint! You don\'t need to be authenticated to see this.'
  });
});

app.get('/api/v2/private', checkJwt, function(req, res) {
  res.json({
    message: 'Hello from a private endpoint! You need to be authenticated to see this.'
  });
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  return res.status(err.status).json({ message: err.message });
});

app.listen(3000, () => {
	console.log('Server listening on port 3000')
})
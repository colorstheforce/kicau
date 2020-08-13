const express = require('express')
const app = express()
const port = 3000

let cuits = [];

app.use(express.json());

app.get('/cuits', (req, res) => {
  res.send(cuits);
});

app.post('/cuits', (req, res) => {
  const body = req.body;

  // Auth checks
  const auth = req.headers['authorization'];
  if (!auth) {
    return res.status(403).send("Authorization required");
  }

  const [authType, screenName] = auth.split(' ', 2);
  if (authType != 'ScreenName') {
    return res.status(403).send('ScreenName authorization type required');
  }

  // Validate payload
  if (!body.text) {
    return res.status(400).send('Cuit text required');
  }

  // Dup checks
  const found = cuits.find(cuit => cuit.author == screenName);
  console.log('Found', found);
  if (found && found.text == body.text) {
    return res.status(409).send('Duplicate cuit');
  }

  // Store new cuit
  let nextId = 1024;
  if (cuits.length > 0) {
    nextId = cuits[0].id + 1;
  }

  cuits.unshift({
    id: nextId, 
    text: body.text,
    author: screenName,
    timestamp: new Date()
  });

  res.status(201).send();
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});
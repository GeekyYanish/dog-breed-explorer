const express = require('express');
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('views'));

app.get('/', (req, res) => {
  res.send('Welcome to the Express Server!');
});

app.get('/home', (req, res) => {
  res.render('home', { name: 'Home' });
});

app.get('/page1', (req, res) => {
  res.redirect('./views/page1.html');
});

app.get('/page2', (req, res) => {
  res.sendFile('./views/page2.html', { root: __dirname });
});

app.get('/page3', (req, res) => {
  res.redirect('./views/page2.html');
});

app.use((req, res) => {
  res.status(404).send('404 Not Found');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
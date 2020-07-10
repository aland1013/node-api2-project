const express = require('express');
const postsRouter = require('./posts/postsRouter');

const server = express();
server.use(express.json());
server.use('/api/posts', postsRouter);

server.get('/', (req, res) => {
  res.send('hello from my app');
});

module.exports = server;

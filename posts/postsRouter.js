const express = require('express');
const router = express.Router();
const db = require('../data/db');

router.post('/', (req, res) => {
  const newPost = req.body;

  if (!newPost.title || !newPost.contents) {
    res.status(400).json({
      errorMessage: 'Please provide title and contents for the post'
    });
  }

  db.insert(newPost)
    .then((id) => {
      res.status(201).json(newPost);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: 'There was an error while saving the post to the database'
      });
    });
});

module.exports = router;

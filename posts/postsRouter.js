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

router.post('/:id/comments', (req, res) => {
  const date = new Date().toString();

  const comment = {
    ...req.body,
    post_id: req.params.id,
    created_at: date,
    updated_at: date
  };

  db.findById(req.params.id).then((post) => {
    if (post.length === 0) {
      res.status(404).json({
        message: 'The post with the specified ID does not exist'
      });
    } else if (!comment.text) {
      res.status(400).json({
        errorMessage: 'Please provide text for the comment'
      });
    } else {
      db.insertComment(comment)
        .then((newComment) => {
          res.status(201).json(comment);
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({
            error: 'There was an error while saving the comment to the database'
          });
        });
    }
  });
});

router.get('/', (req, res) => {
  db.find()
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: 'The posts information could not be retrieved'
      });
    });
});

module.exports = router;

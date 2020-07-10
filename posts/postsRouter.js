const express = require('express');
const router = express.Router();
const db = require('../data/db');

/* ----- POST /api/posts ----- */
router.post('/', (req, res) => {
  const date = new Date().toString();

  const newPost = {
    ...req.body,
    created_at: date,
    updated_at: date
  };

  if (!newPost.title || !newPost.contents) {
    res.status(400).json({
      errorMessage: 'Please provide title and contents for the post'
    });
  }

  db.insert(newPost)
    .then((post) => {
      res.status(201).json(newPost);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: 'There was an error while saving the post to the database'
      });
    });
});

/* ----- POST /api/posts/:id/comments ----- */
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

/* ----- GET /api/posts ----- */
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

/* ----- GET /api/posts/:id ----- */
router.get('/:id', (req, res) => {
  const { id } = req.params;

  db.findById(id)
    .then((post) => {
      if (post.length === 0) {
        res.status(404).json({
          message: 'The post with the specified ID does not exist'
        });
      } else {
        res.status(200).json(post);
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: 'The post information could not be retrieved'
      });
    });
});

/* ----- GET /api/posts/:id/comments ----- */
router.get('/:id/comments', (req, res) => {
  const { id } = req.params;

  db.findById(id).then((post) => {
    if (post.length === 0) {
      res.status(404).json({
        message: 'The post with the specified ID does not exist'
      });
    } else {
      db.findPostComments(id)
        .then((comments) => {
          res.status(200).json(comments);
        })
        .catch((err) => {
          res.status(500).json({
            error: 'The comments information could not be retrieved'
          });
        });
    }
  });
});

/* ----- DELETE /api/posts/:id ----- */
router.delete('/:id', (req, res) => {
  // removes the post from the db and returns the deleted post object
  const { id } = req.params;

  db.findById(id).then((post) => {
    if (post.length === 0) {
      res.status(404).json({
        error: 'The post with the specified ID does not exist'
      });
    } else {
      db.remove(id)
        .then((numRecs) => {
          res.status(200).json(post);
        })
        .catch((err) => {
          res.status(500).json({
            error: 'The post could not be removed'
          });
        });
    }
  });
});

module.exports = router;

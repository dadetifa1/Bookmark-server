const express = require('express')
const { v4: uuid } = require('uuid')
const logger = require('../logger')
const bookmarks = require('../bookmarksDB')

const bookMarkRouter = express.Router()
const bodyParser = express.json()

  
bookMarkRouter
  .route('/bookmarks')
  .get((req, res) => {
    res.json(bookmarks);
  })
  .post(bodyParser, (req, res) => {
        const { title, url, rating, description  } = req.body;
      
        if (!title) {
          logger.error(`Title is required`);
          return res
            .status(400)
            .send('Invalid data');
        }
        
        if (!url) {
          logger.error(`Content is required`);
          return res
            .status(400)
            .send('Invalid data');
        }

        if (!rating && isNaN(rating)) {
          logger.error(`Rating is required and has to be a nummber`);
          return res
            .status(400)
            .send('Invalid data');
        }
        
        if (!description) {
          logger.error(`Description is required`);
          return res
            .status(400)
            .send('Invalid data');
        }
      
        const id = uuid();
        const bookMark = { id, title, url, rating, description};
      
        bookmarks.push(bookMark);

        logger.info(`Bookmark with id ${id} created`);
      
        res
          .status(201)
          .location(`${req.hostname}${req.path}/${id}`)
          .json(bookMark);
  })

  bookMarkRouter
  .route('/bookmarks/:id')
  .get((req, res) => {
    const { id } = req.params;
    const book = bookmarks.find(book => book.id == id);

    if (!book) {
        logger.error(`Book with id ${id} not found.`);
        return res
        .status(404)
        .send('Book Not Found');
    }

   res.json(book);
  })
  .delete((req, res) => {
    const { id } = req.params;

    const delAtIndex = bookmarks.findIndex(book => book.id == id);

    if (delAtIndex === -1) {
        logger.error(`Bookmark with id ${id} not found.`);
        return res
        .status(404)
        .send('Not found');
    }

    bookmarks.splice(delAtIndex, 1);

    logger.info(`Bookmark with id ${id} deleted.`);

    res.status(204).end();
  })

module.exports = bookMarkRouter
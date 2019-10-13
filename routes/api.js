/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

//var expect = require('chai').expect;
//var MongoClient = require('mongodb').MongoClient;
//var ObjectId = require('mongodb').ObjectId;
//const MONGODB_CONNECTION_STRING = process.env.DB;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

var database = require("../helper/database.js");

module.exports = function (app) {

  // [1] route without id -----------------
  // I can get /api/books to retrieve an aray of all books containing title, _id, & commentcount
  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      database.getBooks({}, (err,doc)=>{
        if(err!==null) {
          console.log(err);
          res.status(500).send('Cannot get /api/books');
        } else {
          res.json(doc);
        }        
      });
    })
    
    // I can post a title to /api/books to add a book and returned will be the object with the title and a unique _id
    .post(function (req, res){
      var title = req.body.title;
      if(title=='') {
        res.status(500).send('title is empty');
        return;
      }
    
      //response will contain new book object including atleast _id and title
      database.insertBook({title: title}, (err, doc)=>{
        if(err!==null) {
          console.log(err);
          res.status(500).send('Cannot insert book');
        } else {
          res.json({title: doc.title, _id: doc._id});
        }
      });
    })
    
    // I can send a delete request to /api/books to delete all books in the database.
    // Returned will be 'complete delete successful' if successful
    .delete(function(req, res){
      database.deleteAllBooks((err, doc)=>{
        if(err==null) {
          res.json({message:'complete delete successful'});
        } else {
          console.log(err);
          res.status(500).send(err.message);
        }
      }); 
    });


  // [2] route with id -----------------
  
// TODO: If I try to request a book that doesn't exist I will get a 'no book exists' message.
  
  // I can get /api/books/{_id} to retrieve a single object of a book containing title, _id,
  // & an array of comments (empty array if no comments present).
  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      database.getBooks({_id: bookid}, (err,doc)=>{
        if(err!==null) {
          console.log(err);
        } else {
          if(doc.length==0) {
            res.json(new Error("no book exists"));
          }
          else res.json(doc[0]); // just one
        }        
      });
    })
    
    // I can post a comment to /api/books/{_id} to add a comment to a book
    // and returned will be the books object similar to get /api/books/{_id}.
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get
      database.addComment(bookid, comment, (err, doc)=>{
        if(err!==null) {
          console.log(err);
        } else {
          res.json(doc); // just one
        }         
      });
    })
    
    // I can delete /api/books/{_id} to delete a book from the collection.
    // Returned will be 'delete successful' if successful
    .delete(function(req, res){
      var bookid = req.params.id;
      database.deleteBook(bookid, (err, doc)=>{
        if(err==null) {
          res.json({message:'delete successful'});
        } else {
          console.log(err);
          res.status(500).send(err.message);
        }
      });    
    });
  
};

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


module.exports = function(app) {

  // [1] route without id -----------------
  // I can get /api/books to retrieve an aray of all books containing title, _id, & commentcount
  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      database.getBooks({}, (err,doc)=>{            
        if(err!==null) {
          console.log(err);
          // new Error('...') -> obj not sended to the client?
          res.formatter.serverError(['Cannot get /api/books']); // 500
        } else {
          res.formatter.ok(doc);
        }        
      });
    })
    
    // I can post a title to /api/books to add a book and returned will be the object with the title and a unique _id
    .post(function (req, res){
      var title = req.body.title;
      if(title=='') {
        res.formatter.badRequest(['title is empty']); // 400
        return;
      }
    
      // response will contain new book object including atleast _id and title
      database.insertBook({title: title}, (err, doc)=>{
        if(err!==null) {
          console.log(err);
          res.formatter.serverError(['Cannot insert book']); // 500
        } else {
          res.formatter.ok([{title: doc.title, _id: doc._id}]); // 200
        }
      });
    }) 
    
    // I can send a delete request to /api/books to delete all books in the database.
    // Returned will be 'complete delete successful' if successful
    .delete(function(req, res){
      database.deleteAllBooks((err, doc)=>{
        if(err==null) {
          res.formatter.ok([], ['complete delete successful']); // 200
        } else {
          console.log(err);
          res.formatter.serverError([err.message]); // 500
        }
      }); 
    });


  // [2] route with id -----------------
  
  // I can get /api/books/{_id} to retrieve a single object of a book containing title, _id,
  // & an array of comments (empty array if no comments present).
  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      database.getBooks({_id: bookid}, (err,doc)=>{
        if(err!==null) {
          console.log(err);
          if(err.name=='CastError') {
            res.formatter.badRequest([err.message]); // 400  -> bad _id
          } else {
            res.formatter.serverError([err]); // 500  
          }
          
        } else {
          if(doc.length==0) {
            res.formatter.ok([], "no book exists"); // 200
          }
          else res.formatter.ok(doc); // just one, but return array
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
          res.formatter.serverError([err]); // 500
        } else {
          res.formatter.ok([doc]);
        }         
      });
    })
    
    // I can delete /api/books/{_id} to delete a book from the collection.
    // Returned will be 'delete successful' if successful
    .delete(function(req, res){
      var bookid = req.params.id;
      database.deleteBook(bookid, (err, doc)=>{
        if(err==null) {
          // meta?
          res.formatter.ok([], ['delete successful']);
        } else {
          console.log(err);
          // err or err.message
          res.formatter.serverError([err.message]); // 500
        }
      });    
    });
  
};

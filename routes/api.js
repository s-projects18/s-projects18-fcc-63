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

  // I can get /api/books to retrieve an aray of all books containing title, _id, & commentcount
  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      database.getBooks({}, (err,doc)=>{
        if(err!==null) {
          console.log(err);
        } else {
          res.json(doc);
        }        
      });
    })
    
    // an post a title to /api/books to add a book and returned will be the object with the title and a unique _id
    .post(function (req, res){
      var title = req.body.title;
      //response will contain new book object including atleast _id and title
      database.insertBook({title: title}, (err, doc)=>{
        if(err!==null) {
          console.log(err);
        } else {
          res.json({title: doc.title, _id: doc._id});
        }
      });
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      database.getBooks({_id: bookid}, (err,doc)=>{
        if(err!==null) {
          console.log(err);
        } else {
          res.json(doc[0]); // just one
        }        
      });
    })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
      database.deleteBook(bookid, (err, doc)=>{
        if(err==null) {
          res.json(doc);
        } else {
          console.log(err);
          res.status(500).send(err.message);
        }
      });    
    });
  
};

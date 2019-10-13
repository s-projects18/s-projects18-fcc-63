/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {
  var globalBook = {};

    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({
            title: 'Functional Testing Title'  
          })
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.body.title, 'Functional Testing Title');
            globalBook = res.body; // for later use
            done();
          });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({
            title: ''  
          })
          .end(function(err, res){
            assert.equal(res.status, 500);
            assert.equal(res.text, 'title is empty');
            done();
          });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
          .get('/api/books')
          .end(function(err,res){
            assert.equal(res.status, 200);
          
            let data = JSON.parse(res.text);
            assert.equal(Array.isArray(data), true);
          
            let hit = data.filter(function(v,i){
              if(v['_id']==globalBook._id) return true;
              return false;
            });
            assert.equal(hit.length,1);
          
            done();
        });
      });      
    });

    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
          .get('/api/books/555555555555555555555555')
          .end(function(err, res){
            assert.equal(res.status, 200);
console.log(res)
          
            done();
          });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        //done();
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        //done();
      });
      
    });

  });

  // extra: suite security
  suite('GET / => check security', function() {
    test('cache-control, x-powered-by', function(done) {
      chai.request(server)
      .get('/api')
        .end(function(err, res){ 
         assert.equal(res.header['cache-control'], 'no-store, no-cache, must-revalidate, proxy-revalidate');
         assert.equal(res.header['x-powered-by'], 'PHP 4.2.0');
         done();
      });         
    });
  });
  
});

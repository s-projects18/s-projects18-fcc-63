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
        assert.isArray(res.body.data, 'response should be an array');
        assert.property(res.body.data[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body.data[0], 'title', 'Books in array should contain title');
        assert.property(res.body.data[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */
  
  var globalBook = {};
  
  // make test entry available for all suites
  suiteSetup(function() {
    chai.request(server)
      .post('/api/books')
      .send({
        title: 'Functional Testing Title'  
      })
      .end(function(err, res){
        globalBook = res.body.data; // for later use
        globalBook.status = res.status;
      });    
  });
  
  suite('Routing tests', function() {
    suite('POST /api/books with title => create book object/expect book object', function() {
      
      // added new book in suiteSetup - so here just testing result
      test('Test POST /api/books with title', function(done) {
          assert.equal(globalBook.status, 200);
          assert.equal(globalBook.title, 'Functional Testing Title');
          done();
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({
            title: ''  
          })
          .end(function(err, res){
            assert.equal(res.status, 400);
            assert.equal(res.body.errors[0], 'title is empty');
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

            let data = res.body.data;
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
            assert.equal(res.body.meta, 'no book exists');
            done();
          });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
          .get('/api/books/' + globalBook['_id'])
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.body.data.title, 'Functional Testing Title');
            done();
          });
      });
      
    });


    // required for test
    // we cannpt add another test here - probably to fcc-coding-issues
    suiteSetup(function() {      
      console.log("add test comment");
      chai.request(server)
        .post('/api/books/' + globalBook['_id'])
        .send({
          comment: 'Functional Testing Comment'  
      }).end(function(err, res){

      });
    });    
    
    suite('POST /api/books/[id] => add comment/expect book object with id', function() {    
           
      test('Test POST /api/books/[id] with comment', function(done) {       
        chai.request(server)
          .get('/api/books/' + globalBook['_id'])
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.body.data.comments[0], 'Functional Testing Comment');
            done();
          });
      });
      
    });
    
  
    // ----------- extra -------------------
    // delete test entry
    suite('DELETE / => delete single item', function() {
      test('delete single item', function(done) {
        chai.request(server)
        .delete('/api/books/' + globalBook['_id'])
          .end(function(err, res){ 
           assert.equal(res.status, 200);
           assert.equal(res.body.meta[0], 'delete successful');
           done();
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

    
    // delete ALL entries
    // WE WILL NOT DO THIS ON EVERY TEST-RUN
    /*suite('DELETE / => delete all items', function() {
      test('delete all items', function(done) {
        chai.request(server)
        .delete('/api/books')
          .end(function(err, res){ 
           assert.equal(res.status, 200);
           assert.equal(res.body.meta[0], 'complete delete successful');
           done();
        });         
      });
    });*/
    
  });
});

'use strict';

// ======================== [1] require ===========================
var express     = require('express');
var bodyParser  = require('body-parser');
var cors        = require('cors');
var helmet            = require('helmet');

var apiRoutes         = require('./routes/api.js');
var fccTestingRoutes  = require('./routes/fcctesting.js');
var runner            = require('./test-runner');

// mount database-helper lib
var database = require('./helper/database.js');


// ================= [2] create + configure app =====================
var app = express();

app.use( helmet.noCache() );
app.use(helmet.hidePoweredBy({ setTo: 'PHP 4.2.0' }));
app.use(helmet.xssFilter()); // extra

app.use('/public', express.static(process.cwd() + '/public')); // js, css

app.use(cors({origin: '*'})); //USED FOR FCC TESTING PURPOSES ONLY!


// ----------------- middleware functions -----------------------
// show error page if there is no database-connection
app.use((req, res, next)=>{
  if(database.checkConnection()) next();
  else res.render('error-db.pug', {title: 'No database connection'});
});


// ----------------- get/post functions -----------------------
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });

// For FCC testing purposes
fccTestingRoutes(app);

// Routing for API 
apiRoutes(app);  
    
// 404 Not Found Middleware at end of routing
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});


// ================= [3] connect to database and start listening ================
// start listening - no matter what db-status is
// checking connection in middleware
database.connect();

//Start our server and tests!
app.listen(process.env.PORT || 3000, function () {
  console.log("Listening on port " + process.env.PORT);
  if(process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch(e) {
        var error = e;
          console.log('Tests are not valid:');
          console.log(error);
      }
    }, 1500);
  }
});

module.exports = app; //for unit/functional testing

var mongo = require('mongodb');
var mongoose = require('mongoose');
// https://mongoosejs.com/docs/deprecations.html#-findandmodify-
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
var Schema = mongoose.Schema;

// connect --------------------------------
exports.connect = () => {
  // connect to database
  mongoose.connect(process.env.DB, {
      useNewUrlParser: true
    }).catch(err => { // Promise
      console.log(err);
    });
}

// check connection -----------------------
exports.checkConnection = () => {
  /*
  0: disconnected
  1: connected
  2: connecting
  3: disconnecting
  */
  if(mongoose.connection.readyState==0 || mongoose.connection.readyState==3) {
    console.log("no-connection: "+mongoose.connection.readyState);
    return false;
  }  
  return true;
}

// schema --------------------------------
const issuesSchema = new Schema({
  projectname: {type: String}, //* -> not-relational
	issue_title: {type: String}, //* , unique:true -> unique in combination with projectname ???
  issue_text: {type: String}, //*
	created_on: {type: Date, default: Date.now},//auto
  updated_on: {type: Date, default: Date.now},//auto, update on change
  created_by: {type: String},//*
  assigned_to: {type: String},//opt
  open: {type: Boolean},//???
  status_text: {type: String}//opt
});

/*
  TODO: maybe a project-schema can be added
  - problem1: project can only be added together with an issue
  - problem2: a list of existing projects can only be derived by querying ALL issues
  
*/

// model --------------------------------
const Issues = mongoose.model('issue', issuesSchema ); // Mongoose:issue <=> MongoDB:issues


// read all issues --------------------------------
// next(err, docs)
exports.getProject = (projectname, next, filter={}) => {
  let condition = Object.assign({projectname: projectname}, filter);
  // doc is a Mongoose-object that CAN'T be modified
  // lean()+exec() will return a plain JS-object instead
  Issues.find(condition).lean().exec((err, docs) => { 
    if(docs==null) { // entry doesn't exist
      next('no entry found', null);      
    } else {
      next(null, docs);
    }
  });
}

exports.insertIssue = (insertDataObj, next) => {
  // create object based on model
  let urlObj = new Issues(insertDataObj); 
  const pr = urlObj.save();
  pr.then(function (doc) {
    next(null, doc); // new doc created
  }).catch(function(err){
    console.log("error", err);
    next(err, null);
  }); 
}

exports.updateIssue = (id, updateDataObj, next) => {
  updateDataObj.updated_on = new Date();
  Issues.findOneAndUpdate({_id: id}, updateDataObj, {new:true}, next);    
}

exports.deleteIssue = (id, next) => {
  Issues.deleteOne({_id: id}, (err, resultObject) => {
    if(err==null) {
      next(null, {deletedCount: resultObject.n}); 
    } else {
      console.log(err); // eg: wrong format for id -> casting error
      next(err, null);     
    }
  });
 
}
process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var mongoose = require('mongoose');

var server = require('../../app');
var Task = require('../../models/taskModel');

var should = chai.should();
chai.use(chaiHttp);


describe ('Task', function() {
  var createdDate;
  var dueDate;
  var newTaskId;

  Task.collection.drop();

  beforeEach(function (done) {
    var newTask = new Task({
      title: 'Feed the dinosaur',
      created: createdDate = new Date(),
      dueDate: dueDate = new Date(2016, 02, 26),
      importance: 3
    });
    newTask.save(function (err) {
      done();
    });
  });

  beforeEach(function (done) {
    var anotherNewTask = new Task({
      title: 'Pet the dinosaur',
      created: createdDate = new Date(),
      dueDate: dueDate = new Date(2016, 02, 26),
      importance: 2
    });
    anotherNewTask.save(function (err) {
      anotherNewTaskId = anotherNewTask.id;
      done();
    });
  });

  afterEach(function (done) {
    Task.collection.drop();
    done();
  });


  it ('responds with json including the added object when there is a POST request to "/tasks" ', function(done){
    chai.request(server)
      .post('/tasks')
      .send({title: "Polish our dinosaur's scales", dueDate: '2016, 02, 29', importance: 1})
      .end(function(err, res){
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('CREATED');
        res.body.CREATED.should.be.a('object');
        res.body.CREATED.should.have.keys( ['_id', 'title', 'dueDate', 'importance', 'created', 'completed', '__v']);
        res.body.CREATED.title.should.equal("Polish our dinosaur's scales");
        res.body.CREATED.importance.should.equal(1);
        res.body.CREATED.completed.should.equal(false);
        done();
      });
  });


});

process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var mongoose = require('mongoose');

var server = require('../../app');
var Task = require('../../models/taskModel');

var should = chai.should();
chai.use(chaiHttp);

describe ('Nodeboard', function() {

  it ('serves json with a welcome message when there is a GET request to "/"', function(done){
    chai.request(server)
      .get('/')
      .end(function(err, res){
        res.should.have.status(200);
        res.should.be.json;
        res.body.message.should.equal('welcome');
        done();
      });
  });

});

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

  it ('responds with a json including a list of all tasks when there is a GET request to "/tasks"', function(done) {
    chai.request(server)
      .get('/tasks')
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body.length.should.equal(2);
        res.body[0].title.should.equal('Feed the dinosaur');
        res.body[1].title.should.equal('Pet the dinosaur');
        done();
      });
  });

  it ('response with JSON including the specified task when there is a GET request to "/tasks/:id" where id is the task', function(done){
    chai.request(server)
      .get('/tasks/' + anotherNewTaskId)
      .end(function(err, res){
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('_id');
        res.body.should.have.property('title');
        res.body.title.should.equal('Pet the dinosaur');
        res.body.should.have.property('created');
        res.body.created.should.equal(createdDate.toISOString());
        res.body.should.have.property('dueDate');
        res.body.dueDate.should.equal(dueDate.toISOString());
        res.body.should.have.property('importance');
        res.body.importance.should.equal(2);
        res.body.should.have.property('completed');
        res.body.completed.should.equal(false);
        done();
      });
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
        res.body.CREATED.should.have.property('_id');
        res.body.CREATED.should.have.property('title');
        res.body.CREATED.title.should.equal("Polish our dinosaur's scales");
        res.body.CREATED.should.have.property('dueDate');
        res.body.CREATED.should.have.property('importance');
        res.body.CREATED.importance.should.equal(1);
        res.body.CREATED.should.have.property('completed');
        res.body.CREATED.completed.should.equal(false);
        done();
      });
  });

  it ('PATCH request changes the object', function(done){
    chai.request(server)
    .patch('/tasks/' + anotherNewTaskId)
    .send({title: "Tickle the dinosaur"})
    .end(function(err, res){
      res.should.have.status(201);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.have.property('_id');
      res.body.should.have.property('title');
      res.body.title.should.equal('Tickle the dinosaur');
      res.body.should.have.property('created');
      res.body.created.should.equal(createdDate.toISOString());
      res.body.should.have.property('dueDate');
      res.body.dueDate.should.equal(dueDate.toISOString());
      res.body.should.have.property('importance');
      res.body.importance.should.equal(2);
      res.body.should.have.property('completed');
      res.body.completed.should.equal(false);
      done();
    });
  });

  it ('DELETE request deletes the right object', function(done) {
    chai.request(server)
    .delete('/tasks/' + anotherNewTaskId)
    .end(function(err, res) {
      res.should.have.status(204);
      res.body.should.be.empty;
      done();
    });
  });

});














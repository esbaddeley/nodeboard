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

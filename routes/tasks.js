var express = require('express');
var router = express.Router();
var Task = require('../models/taskModel');

/* GET tasks listing. */
router.get('/', function(req, res, next) {
  Task.find(function (err, tasks) {
    if (err) {
      res.json({'ERROR': err});
    } else {
      res.json(tasks);
    }
  });
});

router.get('/:id', function(req, res, next){
  Task.findById(req.params.id, function(err, task){
    if (err) {
      res.json({'ERROR': err});
    } else {
      res.json(task);
    }
  });
});

router.post('/', function(req, res, next){
  var newTask = new Task({
    title: req.body.title,
    dueDate: new Date(req.body.dueDate),
    importance: req.body.importance
  });
  newTask.save(function(err){
    if(err) {
      res.status(400).json({'ERROR' : err});
    } else {
      res.status(201).json({'CREATED' : newTask});
    }
  });
});


module.exports = router;

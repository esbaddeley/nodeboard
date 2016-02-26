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




module.exports = router;

/**
 * StudentsController
 *
 * @description :: Server-side logic for managing students
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
function1 = function (student) {
  console.log(student.firstName);
}
module.exports = {
	list:function (req, res) {
    Students.find({}).exec(function (err, students) {
      if(err) {
        res.send(500, {error: 'Database Error'});
      }
      res.view('list', {students:students});
    });
  },
  add: function (req, res) {
    res.view('add');
  },
  create: function (req, res) {
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;

    Students.create({firstName:firstName, lastName:lastName, present:false}).exec(function (err) {
      if(err){
        res.send(500, {error: 'Database Error'});
      }
      res.redirect('/students/list');
    });
  },
  present: function (req, res) {
    Students.update({id: req.params.id},{present:true}).exec(function (err) {
      if(err){
        res.send(500, {error: 'Database Error'});
      }
      res.redirect('/students/list');
    });

    return false;
  },
  absent: function (req, res) {
    Students.update({id: req.params.id},{present:false}).exec(function (err) {
      if(err){
        res.send(500, {error: 'Database Error'});
      }
      res.redirect('/students/list');
    });

    return false;
  },
  // update: function (req, res) {
	  //console.log(req.body.presentBox);
    // var firstName = req.body.firstName;
    // var lastName = req.body.lastName;
    //res.write((Students.find({firstName:'pouria'})).present);
    // Students.update({firstName:firstName}, {lastName:lastName}).exec(function (err) {
    //   if(err) {
    //     res.send(500, {error: 'Database Error'});
    //   }
    //   res.redirect('/');
    // });
  // }
};


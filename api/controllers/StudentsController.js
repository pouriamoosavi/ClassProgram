/**
 * StudentsController
 *
 * @description :: Server-side logic for managing students
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
module.exports = {
  list: function (req, res) {
    Students.find({}).exec(function (err, students) {
      if (err) {
        res.send(500, { error: 'Database Error' });
      }
      res.view('list', { students: students });
    });
  },
  add: function (req, res) {
    res.view('add');
  },
  create: async function (req, res) {
    try {
      var params = req.allParams();
      var firstName = params.firstName;
      var lastName = params.lastName;
      var tel = params.tel;
      await Students.create({ firstName: firstName, lastName: lastName, tel: tel });
      res.redirect('/students/list');
    } catch (error) {
      if (error.code == 'E_INVALID_NEW_RECORD') {

        res.view('add', { msg: req.__('Name field can\'t be empty!') });
      }
      res.status(500).send({ error: error });
    }
  },
  present: function (req, res) {
    Students.update({ id: req.params.id }, { present: true }).exec(function (err) {
      if (err) {
        res.send(500, { error: 'Database Error' });
      }
      res.redirect('/students/list');
    });

    return false;
  },
  absent: function (req, res) {
    Students.update({ id: req.params.id }, { present: false }).exec(function (err) {
      if (err) {
        res.send(500, { error: 'Database Error' });
      }
      res.redirect('/students/list');
    });

    return false;
  },
  delete: function (req, res) {
    Students.destroy({ id: req.params.id }).exec(function (err) {
      if (err) {
        res.send(500, { error: 'Database Error' });
      }
      res.redirect('/students/list');
    });

    return false;
  },
  edit: async function (req, res) {
    var params = req.allParams();
    try {
      var myStudent = await Students.findOne({ id: params.id });
      res.view('editStudent', { myStudent: myStudent });
    } catch (error) {
      res.status(500).send({ error: error });
    }
  },
  update: async function (req, res) {
    var params = req.allParams();
    var id = params.id;
    var firstName = params.firstName;
    var lastName = params.lastName;
    var tel = params.tel;
    try {
      await Students.update({ id: id })
        .set({ firstName: firstName, lastName: lastName, tel: tel })
      res.redirect('/students/list');
    } catch (error) {
      if (error.code == 'E_INVALID_NEW_RECORD' ||
        error.code == 'E_INVALID_VALUES_TO_SET') {
          var myStudent = await Students.findOne({ id: params.id });
          res.view('editStudent', { msg: req.__('Name field can\'t be empty!'), myStudent: myStudent });
      }
      res.status(500).send({ error: error });
    }
  },
  report: async function(req, res) {
    try{
      var params = req.allParams();
      var id = params.id;
      var student = await Students.findOne({id: id});
      var myClasses = [];
      var classes = await Classes.find({});

      for (var j = 0; j < classes.length; j++) {
        for (var i = 0; i < classes[j].students.length; i++) {
          if (classes[j].students[i].id == student.id) {
            await myClasses.push(classes[j]);
          }
        }
      }
      myClasses = functions.setPresentTrue(myClasses, student);
      for(var i= 0; i< myClasses.length; i++) {
        var presentSessions = functions.getPresentSessions(myClasses[i], student);
        var totalSessions= functions.getTotalSessions(myClasses[i]);
        var presentHours = functions.getPresentHours(myClasses[i], student);
        var totalHours = functions.getTotalHours(myClasses[i]);
        myClasses[i].presentHours = presentHours;
        myClasses[i].totalHours = totalHours;
        myClasses[i].presentSessions = presentSessions;
        myClasses[i].totalSessions = totalSessions;
      }

      // for(var i= 0; i< myClasses.length; i++) {
      //   var presentSessions = 0;
      //   var totalSessions= 0;
      //   var presentHours = 0;
      //   var totalHours = 0;
      //   if (typeof classes[i].sessions != 'undefined' && classes[i].sessions != null) {
      //     for(var j= 0; j< classes[i].sessions.length; j++) {
      //       totalSessions++;
      //       totalHours = parseInt(classes[i].sessions[j].duration, 10) + totalHours;
      //       for (var z = 0; z < classes[i].sessions[j].students.length; z++) {
      //         if (classes[i].sessions[j].students[z].id == student.id) {
      //           classes[i].sessions[j].present = true;
      //           presentSessions++;
      //           presentHours = parseInt(classes[i].sessions[j].duration, 10) + presentHours;
      //           break;
      //         }
      //       }
      //     }
      //   }
      //   classes[i].presentHours = presentHours;
      //   classes[i].totalHours = totalHours;
      //   classes[i].presentSessions = presentSessions;
      //   classes[i].totalSessions = totalSessions;
      // }
      //var PresentationByHour = "(" + presentHours + "/" + totalHours + ") " + parseInt(((presentHours*100)/totalHours), 10) + "%";
      //var PresentationBySession = "(" + presentSessions + "/" + totalSessions + ") " + parseInt(((presentSessions*100)/totalSessions), 10) + "%";

      res.view('reportStudent', {student: student, classes: myClasses});
    }catch(error) {
      res.status(500).send({ error: error });
    }
  }
};


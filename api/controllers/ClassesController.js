var util = require('util');
var bcrypt = require('bcryptjs');
module.exports = {
    list: async function (req, res) {
        try {       
            var classes = await Classes.find({});
            
            res.view('homepage', { classes: classes });
        } catch (error) {
            res.status(500).send({ error: error });
        }
    },
    add: function (req, res) {
        Students.find({}).exec(function (err, students) {
            if (err) {
                res.send(500, { error: 'Database Error' });
            }
            res.view('addClass', { students: students });
        });
    },
    addSession: async function (req, res) {
        var params = req.allParams();
        try {
            var myClass = await Classes.findOne({ id: params.id });
            res.view('addSession', { myClass: myClass })
        } catch (error) {
            res.status(500).send({ error: error });
        }
    },
    creatSession: async function (req, res) {
        try {
            var params = req.allParams();
            var id = params.id;
            var subject = params.subject;
            var date = params.date;
            var duration = params.duration;
            var myClass = await Classes.findOne({ id: id });
            if(!Number(duration)) {
                res.view('addSession', { msg: 'Duration type must be Numeric', myClass: myClass });
                return;
            }
            var studentsID = params.student;
            var students = [];
            if(typeof studentsID != 'undefined') {
                students = await Students.find({ where: { id: studentsID } });
            }
            var previousSession = myClass.sessions;
            if (!Array.isArray(previousSession)) {
                previousSession = [];
                var lastSession = { id: 1, subject: subject, date: date, duration: duration, students: students };
            }else{
                var maxId = 0;
                previousSession.forEach(element => {
                    if(element.id > maxId) {
                        maxId = element.id;
                    }
                });
                var lastSession = { id: maxId+1, subject: subject, date: date, duration: duration, students: students };
            }
            previousSession.push(lastSession);
            await Classes.update({ id: id }).set({ sessions: previousSession });
            res.redirect('/');
        } catch (error) {
            res.status(500).send({ error: error });
        }

    },
    editSession: async function(req, res) {
        var params = req.allParams();
        try {
            var myClass = await Classes.findOne({ id: params.cid });
            var mySession;
            myClass.sessions.forEach(element => {
                if(element.id == params.sid) {
                    mySession = element;
                }
            });
            var studentsIds = [];
            mySession.students.forEach(element => {
                studentsIds.push(element.id);
            });
            res.view('editSession', { mySession: mySession, myClass: myClass, studentsIds: studentsIds });
        } catch (error) {
            res.status(500).send({ error: error });
        }
    },
    updateSession: async function(req, res) {
        var params = req.allParams();
        try{
            var subject = params.subject;
            var date = params.date;
            var duration = params.duration;
            var myClass = await Classes.findOne({ id: params.cid });
            var mySession;
            myClass.sessions.forEach(element => {
                if(element.id == params.sid) {
                    mySession = element;
                }
            });
            var myS = params.student;
            if (typeof myS == 'undefined') {
                var session = { id: params.sid, subject: subject, date: date, duration: duration, students: [] };
            } else {
                var students = await Students.find({ where: { id: myS } });
                var session = { id: params.sid, subject: subject, date: date, duration: duration, students: students };
            }
            var sessions = myClass.sessions;
            sessions.splice(sessions.indexOf(mySession), 1);
            sessions.push(session);
            await Classes.update({ id: params.cid }).set({sessions:sessions});
            res.view('viewClass', myClass);

        }catch(error){
            res.status(500).send({ error: error });
        }
    },
    create: async function (req, res) {
        try {
            var params = req.allParams();
            var name = params.name;
            var lesson = params.lesson;
            var teacher = params.teacher;
            var studentsID = params.student;
            var students = [];
            if(typeof studentsID != 'undefined') {
                students = await Students.find({ where: { id: studentsID } });
            }
            await Classes.create({ name: name, lesson: lesson, teacher: teacher, students: students })
            res.redirect('/');
        } catch (error) {
            if (error.code == 'E_INVALID_NEW_RECORD') {
                var students = await Students.find({});
                res.view('addClass', { msg: req.__('Name field can\'t be empty!'), students: students });
                return;
            }
            res.status(500).send({ error: error });
        }
    },
    delete: function (req, res) {
        Classes.destroy({ id: req.params.id }).exec(function (err) {
            if (err) {
                res.send(500, { error: 'Database Error' });
            }
            res.redirect('/');
        });

        return false;
    },
    show: async function (req, res) {
        var params = req.allParams();
        try {
            var myClass = await Classes.findOne({ id: params.id });
            res.view('viewClass', myClass);
        } catch (error) {
            res.status(500).send({ error: error });
        }
    },
    edit: async function (req, res) {
        var params = req.allParams();
        try {
            var myClass = await Classes.findOne({ id: params.id });
            var students = await Students.find({});

            var studentsIds = [];
            myClass.students.forEach(element => {
                studentsIds.push(element.id);
            });
            res.view('editClass', { myClass: myClass, students: students, studentsIds: studentsIds });
        } catch (error) {
            res.status(500).send({ error: error });
        }
    },
    update: async function (req, res) {
        try {
            var params = req.allParams();
            var name = params.name;
            var lesson = params.lesson;
            var teacher = params.teacher;
            var myS = params.student;
            if (typeof myS == 'undefined') {
                await Classes.update({ id: params.id })
                    .set({ name: name, lesson: lesson, teacher: teacher, students: [] });
            } else {
                var students = await Students.find({ where: { id: params.student } });
                await Classes.update({ id: params.id })
                    .set({ name: name, lesson: lesson, teacher: teacher, students: students });
            }
            res.redirect('/');
        } catch (error) {
            if (error.code == 'E_INVALID_NEW_RECORD' ||
                error.code == 'E_INVALID_VALUES_TO_SET') {
                var myClass = await Classes.findOne({ id: params.id });
                var students = await Students.find({});
                res.view('editClass', {
                    msg: req.__('Name field can\'t be empty!'),
                    myClass: myClass, students: students
                });
            }
            res.status(500).send({ error: error });
        }
    }

};

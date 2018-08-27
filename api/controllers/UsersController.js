var bcrypt = require('bcryptjs');
module.exports = {
    list: function (req, res) {
        Users.find({}).exec(function (err, user) {
          if (err) {
            res.send(500, { error: 'Database Error' });
          }
          res.view('listUsers', { users: user });
        });
    },
    signIn: function(req,res) {
        res.noLayout("logInPage", {lastPath: req.query.lastPath});
    },
    signOut: function(req, res) {
        delete req.session.user;
        res.redirect("/");
    },
    logIn: async function(req, res) {
        var params = req.allParams();
        var userName = params.username;
        var passWord = params.password;
        var user = await Users.find({ where: {userName: userName}})
        if(user[0]){
            var hash = user[0].passWord;
            if(bcrypt.compareSync(passWord, hash)) {
                req.session.user = user;
                if(params.lastPath) {
                res.redirect(params.lastPath);
                return;
                }else {
                    res.redirect("/");
                    return;
                }
            }
        }
        // else if(userName == 'admin' && passWord == 'pouria7551b76') {
        //     var hash = bcrypt.hashSync(passWord, 10);
        //     await Users.create({userName: userName, passWord: hash, role: 'adm'});
        //     res.redirect("/");
        //     return;
        // }
        res.noLayout("logInPage", {msg: req.__('Invalid password or username')});  
    },
    addUser: function(req, res) {
        res.view("addUser");
    },
    createUser: async function(req, res) {
        var params = req.allParams();
        var passWord = params.password;
        var passWord1 = params.password1;
        if(passWord != passWord1) {
            res.view("addUser", {msg: req.__('Passwords doesn\'t match')});
            return;
        }
        var role = params.role;
        var userName = params.username;
        var hash = bcrypt.hashSync(passWord, 10);
        await Users.create({userName: userName, passWord: hash, role: role});
        res.redirect("/");
    },
    delete: async function(req, res) {
        try{
            var params = req.allParams();
            var id = params.id;
            var user = await Users.find({ where: {id: id}})
            if(user.role != 'adm') {
                await Users.destroy({id: id})
            }
            res.redirect('/users/list');
        }catch(error) {
            res.status(500).send({ error: error });
        }
    }




};
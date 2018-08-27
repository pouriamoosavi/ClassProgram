module.exports = async function (req, res, next) {
    try {
        if(req.session.user) {
            return next();
        }
        // if(req.cookies.userName) {
        //     var userName = req.cookies.userName;
        //     var passWord = req.cookies.passWord;
        //     var user = await Users.find({ where: {userName: userName}})
        //     if(user[0]){
        //         var hash = user[0].passWord;
        //         if(passWord == hash) {
        //             return next();
        //         }
        //     }
        // }
        res.redirect("/users/signIn?lastPath=" + req.path);
    } catch (error) {
        res.status(500).send({ error: error });
    }


};
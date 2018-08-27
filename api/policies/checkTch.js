module.exports = async function (req, res, next) {
    try{
        if(req.session.user[0].role == 'tch' || req.session.user[0].role == 'adm') {
            return next();
        } 
        res.forbidden();
    }catch(error){
        res.status(500).send({ error: error });
    }
    };
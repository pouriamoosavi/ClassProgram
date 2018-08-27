module.exports = async function (req, res, next) {
try{
    if(req.session.user[0].role == 'std' || req.session.user[0].role == 'adm' || req.session.user[0].role == 'tch' ) {
        return next();
    }
    res.forbidden();
}catch(error){
    res.status(500).send({ error: error });
}
};
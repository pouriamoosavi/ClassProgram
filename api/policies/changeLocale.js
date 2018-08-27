module.exports = function (req, res, next){       
    if(req.query.lang) {
        req.session.lang = req.query.lang;
    }
    if(!req.session.lang) {
        req.session.lang = 'en';
    }
    req.setLocale(req.session.lang);
    return next();
};
module.exports = function sendTransfer(controller, method, params) {
    var req = this.req;
    var res = this.res;
    var sails = req.sails;
    res.status(200);
    return sails.controllers[controller][method](req, res);
}
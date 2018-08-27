module.exports = function (viewPage, obj) {
    if(!obj) {
        obj = {};
    }
    obj.layout = false;
    var res = this.res;
    return res.view(viewPage, obj);
};
const fs = require('fs');
module.exports = {
    viewUpload: (req, res) => {
        res.view('file/uploadFile');
    },
    upload: (req, res) => {
        var params = req.allParams();
        if (!params.title || params.title == '') params.title = Math.random(999999999999);
        req.file('uf').upload({
            saveAs: params.title,
            dirname: require('path').resolve(sails.config.appPath, 'assets/uploadfiles')
        }, function (err, files) {
            if (err) {
                console.log(err)
                return res.serverError(err);
            }
            return res.json({
                message: files.length + ' file(s) uploaded successfully!',
                files: files
            });
        });
    },
    listFiles: async (req, res) => {
        var files = [];
        await fs.readdirSync('assets/uploadfiles').forEach(filename => {
            files.push(filename);
            fs.readFile('assets/uploadfiles/' + filename, 'utf-8', function(err, content) {
                if (err) {
                    return console.log(err);
                }
            });
        });
        return res.view('file/listFiles', {files: files});
    }, 
    download: (req, res) =>{

    }
}


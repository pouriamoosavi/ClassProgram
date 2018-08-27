module.exports = { 
    attributes: {
        name: {type: 'string', required: true},
        lesson: {type: 'string'},
        teacher: {type: 'string'},
        students: {type: 'json'},
        sessions: {type: 'json'}
    },
    datastores: 'sailsDisk'
};
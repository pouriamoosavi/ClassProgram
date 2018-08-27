module.exports = {
    getPresentHours: function (oneClass, student) {
        var presentHours = 0;
        if (typeof oneClass.sessions != 'undefined' && oneClass.sessions != null) {
            for (var j = 0; j < oneClass.sessions.length; j++) {
                for (var z = 0; z < oneClass.sessions[j].students.length; z++) {
                    if (oneClass.sessions[j].students[z].id == student.id) {
                        presentHours = parseInt(oneClass.sessions[j].duration, 10) + presentHours;
                        break;
                    }
                }
            }

        }
        return presentHours;
    },
    getTotalHours: function (oneClass) {
        var totalHours = 0;
        if (typeof oneClass.sessions != 'undefined' && oneClass.sessions != null) {
            for (var j = 0; j < oneClass.sessions.length; j++) {
                totalHours = parseInt(oneClass.sessions[j].duration, 10) + totalHours;
            }
        }

        return totalHours;
    },
    getPresentSessions: function (oneClass, student) {
        var presentSessions = 0;;
        if (typeof oneClass.sessions != 'undefined' && oneClass.sessions != null) {
            for (var j = 0; j < oneClass.sessions.length; j++) {
                for (var z = 0; z < oneClass.sessions[j].students.length; z++) {
                    if (oneClass.sessions[j].students[z].id == student.id) {
                        presentSessions++;
                        break;
                    }
                }
            }
        }
        return presentSessions;
    },
    getTotalSessions: function (oneClass) {
        var totalSessions = 0;
        if (typeof oneClass.sessions != 'undefined' && oneClass.sessions != null) {
            for (var j = 0; j < oneClass.sessions.length; j++) {
                totalSessions++;
            }
        }

        return totalSessions;
    },
    setPresentTrue: function (classes, student) {
        for (var i = 0; i < classes.length; i++) {
            if (typeof classes[i].sessions != 'undefined' && classes[i].sessions != null) {
                for (var j = 0; j < classes[i].sessions.length; j++) {
                    for (var z = 0; z < classes[i].sessions[j].students.length; z++) {
                        if (classes[i].sessions[j].students[z].id == student.id) {
                            classes[i].sessions[j].present = true;
                            break;
                        }
                    }
                }
            }
        }
        return classes;
    }
};
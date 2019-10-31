const fs = require('fs');
const parentDir = process.env.PWD;

exports.logLevels = {
    NOTSET: 0,
    DEBUG: 1,
    INFO: 2,
    WARNING: 3,
    ERROR: 4,
    CRITICAL: 5
}

exports.logIssue = (message, caller ,loglevel, cb) => {
    let file_name = ((new Date()).toDateString) + caller; 

    switch (loglevel) {
        case this.logLevels.NOTSET:
            file_name += 'NOTSET'
            break;
        case this.logLevels.DEBUG:
            file_name += 'DEBUG'
            break;
        case this.logLevels.INFO:
            file_name += 'INFO'
            break;
        case this.logLevels.WARNING:
            file_name += 'WARNING'
            break;
        case this.logLevels.ERROR:
            file_name += 'ERROR'
            break;
        case this.logLevels.CRITICAL:
            file_name += 'CRITICAL'
            break;
        default:
            file_name += 'NOTSET'
            break;
    }
    
    try {
        const dir = parentDir + "/reports/logs/";
        if (!fs.exists(dir)) {
            fs.mkdirSync(dir)
        }
        const buffer = new Buffer(message);
        fs.open(dir + file_name + ".txt", 'w', function(err, fd) {
            if (err) {
                cb(err);
                console.error(err);
            }
            fs.write(fd, buffer, 0, buffer.length, null, function(err) {
                if (err) {
                    cb(err);
                    console.error(err);
                }
                fs.close(fd, function() {
                    cb('successfully saved the log');
                });
            })
        })

    } catch (err) {
        console.error(err);
    }
}

const timezone = require('moment-timezone');
const moment   = require('moment');

exports.time_hk = () => {
    var now = moment.utc();
    return moment().tz('Asia/Hong_Kong').format();
};

exports.get_yf_end_date = () => {
    return moment().tz('Asia/Hong_Kong').subtract(1, 'days').format();
}

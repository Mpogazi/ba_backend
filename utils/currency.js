const converter = require('nodejs-currency-converter');
const request   = require('request');

/**
 * USE: getting the currency rates
 * params: a continuation
 * description: The continuation function "done"
 *              must take two arguments in this 
 *              order.
 * order: done(chineseYuanRateToUSD, HongKongDollarToUSD)
 */
exports.requireCurrency = (done) => {
    var k = 'c22ebb214220f94be7aec35567cd8c4b';
    var b = 'USD';
    var s = 'HKD,CNY,EUR,USD';
    /**
     * Nobody wants to pay for the stupid API
     * So we're getting EUR, HKD, CNY, USD
     * And go from HKD -> EUR -> USD
     * Or go from  CNY -> EUR -> USD
     */
    return request(
        `http://data.fixer.io/api/latest?access_key=${k}&symbols=${s}`,
        { json: true },
        (err, res, body) => {
            var usd_rate = body.rates.USD;
            var cny_rate = (1 / body.rates.CNY) * usd_rate;
            var hkd_rate = (1 / body.rates.HKD) * usd_rate;
            done(cny_rate, hkd_rate);
        }
    );
}
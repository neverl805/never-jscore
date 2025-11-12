const cryptoJs = require('crypto-js');
function aaa() {
    var f = (new Date)["getTime"]();
    var m = cryptoJs.HmacSHA1('9527' + f, "xxxooo").tostring();
    var tt = Buffer.from(f.tostring()).tostring('base64');
    return {
        m: m,
        tt: tt
    }
};
aaa()
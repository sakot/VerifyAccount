// ==UserScript==
// @name         通河农商行收银通绑定账号检测
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  verify the account
// @updateURL    https://github.com/sakot/VerifyAccount/raw/master/verifyaccount.TongheRCB.user.js
// @downloadURL  https://github.com/sakot/VerifyAccount/raw/master/verifyaccount.TongheRCB.user.js
// @author       sakot
// @match        https://jnpay.jnbank.com.cn/MerchantWeb/merchant/merchantInfo-mchtStaFDetail?param=*
// @match        https://jnpay.jnbank.com.cn/MerchantWeb/merchant/merchantInfo-mchtStaFRedirct?param=*
// @match        https://jnpay.jnbank.com.cn/MerchantWeb/mchtInfo/mchtInfojudge-mchtStaFRedirct?param=*
// @require      https://github.com/mc-zone/IDValidator/raw/master/IDValidator.min.js
// @grant        none
// ==/UserScript==

var fromindex = $("html").html().indexOf('console.log(');
var endindex = $("html").html().indexOf(');', fromindex);
var jsonData = JSON.parse($("html").html().substring(fromindex + 12, endindex));
var settleAcct = jsonData.settleAcct;
var artifId = jsonData.artifId;

function verifyaccount()
{
    if (settleAcct.substr(0, 1) == '6'){
        if (!luhnCheck(jsonData.settleAcct)){
            $('div.amz-container').append('<p class="am-alert am-alert-danger" style="float: left;margin-left: 2em;">* Error: 绑定账号错误或非个人卡！</p>');
        }
        if (settleAcct.substr(8, 3) != '026'){
            $('div.amz-container').append('<p class="am-alert am-alert-danger" style="float: left;margin-left: 2em;">* Error: 非通河农商行账户或账号错误！</p>');
        }
    }
}

function luhnCheck(luhn)
{
    var ca, sum = 0, mul = 1;
    var len = luhn.length;
    while (len--)
    {
        ca = parseInt(luhn.charAt(len),10) * mul;
        sum += ca - (ca>9)*9;
        mul ^= 3;
    }
    return (sum%10 === 0) && (sum > 0);
}

function verifyId()
{
    var Validator = new IDValidator();
    if (!Validator.isValid(artifId)){
        $('div.amz-container').append('<p class="am-alert am-alert-danger" style="float: left;margin-left: 2em;">* Error: 法人证件录入有误！</p>');
    }
}

(function() {
    verifyaccount();
    verifyId();
})();

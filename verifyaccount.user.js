// ==UserScript==
// @name         收银通绑定账号检测
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  verify the account
// @updateURL    https://github.com/sakot/VerifyAccount/raw/master/verifyaccount.user.js
// @downloadURL  https://github.com/sakot/VerifyAccount/raw/master/verifyaccount.user.js
// @author       zhoujc
// @match        https://jnpay.jnbank.com.cn/MerchantWeb/merchant/merchantInfo-mchtStaFDetail?param=*
// @match        https://jnpay.jnbank.com.cn/MerchantWeb/merchant/merchantInfo-mchtStaFRedirct?param=*
// @match        https://jnpay.jnbank.com.cn/MerchantWeb/mchtInfo/mchtInfojudge-mchtStaFRedirct?param=*
// @grant        none
// @require      https://code.jquery.com/jquery-3.2.1.slim.min.js
// ==/UserScript==

var fromindex = $("html").html().indexOf('console.log(');
var endindex = $("html").html().indexOf(');', fromindex);
var jsonData = JSON.parse($("html").html().substring(fromindex + 12, endindex));
var settleAcct = jsonData.settleAcct;

function verifyaccount()
{
    console.log(settleAcct.substr(0, 1));
    if (settleAcct.substr(0, 1) == '6' && !luhnCheck(jsonData.settleAcct)){
        console.log($('div.amz-container').append('<p class="am-alert am-alert-danger" style="float: left;margin-left: 2em;">* Error: 绑定账号错误或非个人卡！</p>'));
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

(function() {
    verifyaccount();
})();

// ==UserScript==
// @name         通河农商行收银通绑定账号检测
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  verify the account
// @updateURL    https://raw.githubusercontent.com/sakot/VerifyAccount/master/verifyaccount.user.js
// @downloadURL  https://raw.githubusercontent.com/sakot/VerifyAccount/master/verifyaccount.user.js
// @author       sakot
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
    if (settleAcct.substr(0, 1) == '6'){
        if (!luhnCheck(jsonData.settleAcct)){
            $('div.amz-container').append('<p class="am-alert am-alert-danger" style="float: left;margin-left: 2em;">* Error: 绑定账号错误或非个人卡！</p>');
        }
        if (settleAcct.substr(8, 3) != '026'){
            $('div.amz-container').append('<p class="am-alert am-alert-danger" style="float: left;margin-left: 2em;">* Error: 绑定账号非通河农商行账户或账号错误！</p>');
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

(function() {
    verifyaccount();
})();

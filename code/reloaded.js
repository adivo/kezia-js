/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
//require(["component", "common", "credits"], function (k, common, credits) {

    reloadedFunction = function (k) {
        var html = '';
        var label1 = new k.Label('label 1');
        html += label1.render('top:200px');

        var label2 = new k.Label('label 2');
        html += label2.render('top:300px');
        alert(html);
        return html;
    };
//});
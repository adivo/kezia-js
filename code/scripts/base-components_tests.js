/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
require(["base-components"], function (bc) {
    var idpattern=/ id="[0-9_pbI]{0,10}"*/g;
    var removeIds=function(string){
        return string.replace(idpattern,'');
    };
    QUnit.test("base-components.Label", function (assert) {
        var label = new bc.Label('Text');
        console.log('base-components.Label:'+label.render());
        assert.equal(removeIds(label.render()), 
        removeIds('<div id="I101_p" class="SlotOV"><div class="Label">Text</div></div>'));
    });
     QUnit.test("base-components.Label with border", function (assert) {
        var label = new bc.Label('Text');
        //label.setBorderStyle('1px solid #a0a0a0');
        label.setBorderStyleClass('LabelBorder');
        console.log('base-components.Label with border:'+label.render());
        assert.equal(removeIds(label.render()), 
        removeIds('<div id=\"I102_p\" class=\"SlotOV\"><div id=\"I102_b\" class=\"LabelBorder\"><div class=\"Label\">Text</div></div></div>'));
     });
     QUnit.test("base-components.Label fixed size", function (assert) {
         var label = new bc.Label('Text',{width:'200px',height:'30px'});
        console.log('label:'+label.render());
        assert.equal(label.render(), 
        '<div id="I101_p" class="SlotOV"><div id="I101_b" class="LabelBorder"><div class="Label">Text</div></div></div>');
    });
    
    QUnit.test("base-components.MenuItem", function (assert) {
        var menuItem = new bc.MenuItem('File','assets/icons/file.png','20','20');
        console.log('menuItem:'+menuItem.render());
        assert.equal(menuItem.render(), 
        '<div id="I101_p" class="abs Label_"><div id="I101_b" class="LabelBorder Label">Text</div></div>');
    });
});


/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
require(["common"], function (util) {
//    require(["../scripts/common"], function (util) {
    QUnit.test("Test util.isUndef()", function (assert) {
        var testVar = 5;
        var undefVar;
        var nullVar = null;
        assert.equal(util.isUndef(testVar), false);
        assert.equal(util.isUndef(undefVar), true);
        assert.equal(util.isUndef(nullVar), false);
    });

    QUnit.test("Test util.isDef()", function (assert) {
        var testVar = 5;
        var undefVar;
        assert.equal(util.isDef(testVar), true);
        assert.equal(util.isDef(undefVar), false);
    });

});
require(["tags"], function (Tags) {
    QUnit.test("Test new tags.Div()", function (assert) {
        var div = new Tags.Div();
        //assert.equal(div.style('test').render(), 'test');
        div.setName('name');
        console.log(div.render());
        assert.equal(div.render(),'<div name="name"></div>');
    });

});


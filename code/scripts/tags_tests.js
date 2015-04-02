/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
require(["tags"], function (Tags) {
    QUnit.test("tags.Div()", function (assert) {
        var div = new Tags.Div();
        //assert.equal(div.style('test').render(), 'test');
        div.setName('name');
        console.log(div.render());
        assert.equal(div.render(), '<div name="name"></div>');
    });
    QUnit.test("tags.Tag(..).withInnerHtml()", function (assert) {
        var html = new Tags.Tag('img')
                .id('id10')
                .addClass('class1 class2')
                .attribute('width', '10px')
                .attribute('height', '1em')
                .withInnerHtml('inner');
        console.log(html);
        assert.equal(html, '<img id="id10"  width="10px" height="1em" class="class1 class2">inner</div>');
    });
    QUnit.test("tags.Tag(..).asStandalone()", function (assert) {
        var html = new Tags.Tag('img')
                .id('id10')
                .addClass('class1 class2')
                .attribute('width', '10px')
                .attribute('height', '1em')
                .asStandalone();
        console.log('Tag(..).asStandalone:'+html);
        assert.equal(html, '<img id="id10"  width="10px" height="1em" class="class1 class2"/>');
    });
});


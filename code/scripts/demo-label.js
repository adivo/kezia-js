/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

require(["kezia", "common", "credits"], function (k, common, credits) {
    var label1 = new k.Label('Text');
    var label2 = new k.Label('Text');
    label2.setBorderStyleClass('LabelBorder');
    var label3 = new k.Label('Text with properties', {height: '30', width: '300'});
    label3.setBorderStyleClass('LabelBorder');
    var label4 = new k.Label('Right aligned', {height: '30', width: '300', horizontalAlign: common.HorizontalPosition.RIGHT});
    label4.setBorderStyleClass('LabelBorder');
    var label5 = new k.Label('Centered Label', {height: '40', width: '200'});
    label5.setHorizontalAlign(common.HorizontalPosition.CENTER);
    label5.setBorderStyleClass('LabelBorder');
    var label6 = new k.Label('Left positionned', {height: '30', width: '300', horizontalAlign: common.HorizontalPosition.CENTER});
    label6.setBorderStyleClass('LabelBorder');
    var labelCode = new k.CodeArea('scripts/demo-label.js', 'javascript');
    //Layouting
    var rowLayout = new k.RowLayout();
    rowLayout.setBorderStyleClass('LabelBorder');
    rowLayout.addComponent(label1, 40, k.WidgetPosition.topLeft);
    rowLayout.addComponent(label2, 40, k.WidgetPosition.topCenter);
    rowLayout.addComponent(label3, 40, k.WidgetPosition.topRight);
    rowLayout.addComponent(label4, 40, k.WidgetPosition.topRight);
    rowLayout.addComponent(label5, 50, k.WidgetPosition.topCenter);
    rowLayout.addComponent(label6, 40, k.WidgetPosition.bottomLeft);
    rowLayout.addComponent(labelCode, 800, k.WidgetPosition.fill);
    k.renderComponents('app', rowLayout);
});

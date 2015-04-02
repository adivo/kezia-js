/**
 * Created by Marcel on 28.02.2015.
 */
// module app/mime-client
require(["kezia", "common", "credits"], function (k, common, credits) {
    var comp1 = new credits.Label();
    var comp2 = new credits.Label();
    var html = '';
//var label1 = new k.Label('label 1');
//label1.setName('label1');
//html += label1.render('top:200px');
//
//var label2 = new k.Label('label 2');
//html += label2.render('top:300px');

//document.getElementById('root').innerHTML = html;
    var label = new k.Label();
    var colLayout = new k.ColLayout();

    var labelStyleObj = {
        borderStyleProperty: '1px solid green',
        backgroundStyleProperty: '#f0f0f0',
        borderRadiusStyleProperty: '2px',
        additionalClass: 'shadow',
        width: 150
    };
    var topLeftLabel = new k.Label('top left label', labelStyleObj);
    topLeftLabel.height = 25;

    var topCenterLabel = new k.Label('top center label', labelStyleObj);
    topCenterLabel.height = 30;
    var topRightLabel = new k.Label('top right label', labelStyleObj);
    var topFillLabel = new k.Label('top fill label', labelStyleObj);

    var middleLeftLabel = new k.Label('middle left label', labelStyleObj);
    var middleCenterLabel = new k.Label('middle center label', labelStyleObj);
    var middleRightLabel = new k.Label('middle right label', labelStyleObj);
    var middleFillLabel = new k.Label('middle fill label', labelStyleObj);

    var bottomLeftLabel = new k.Label('bottom left label', labelStyleObj);
    var bottomCenterLabel = new k.Label('bottom center label', labelStyleObj);
    var bottomRightLabel = new k.Label('bottom right label', labelStyleObj);
    var bottomFillLabel = new k.Label('bottom fill label', labelStyleObj);
    var col1Panel = new k.RowLayout({
        borderStyleProperty: '1px solid #a0a0a0',
        backgroundStyleProperty: 'white',
        borderRadiusStyleProperty: '2px'
    });
    col1Panel.setName('col1Panel');
    col1Panel.addComponent(topLeftLabel, 50, k.WidgetPosition.topLeft, '#f0f0f0');
    col1Panel.addComponent(topCenterLabel, 50, k.WidgetPosition.topCenter, 'white');
    col1Panel.addComponent(topRightLabel, 50, k.WidgetPosition.topRight, '#f0f0f0');
    col1Panel.addComponent(topFillLabel, 50, k.WidgetPosition.topFill, 'white');
    colLayout.addComponent(col1Panel, 200, k.WidgetPosition.fill);

    var col2Panel = new k.RowLayout({
        borderStyleProperty: '1px solid #a0a0a0',
        backgroundStyleProperty: 'white',
        borderRadiusStyleProperty: '2px'
    });
    col2Panel.setName('col2Panel');
    col2Panel.addComponent(middleLeftLabel, 50, k.WidgetPosition.middleLeft, '#f0f0f0');
    col2Panel.addComponent(middleCenterLabel, 50, k.WidgetPosition.middleCenter, 'white');
    col2Panel.addComponent(middleRightLabel, 50, k.WidgetPosition.middleRight, '#f0f0f0');
    col2Panel.addComponent(middleFillLabel, 50, k.WidgetPosition.middleFill, 'white');
    colLayout.addComponent(col2Panel, 200, k.WidgetPosition.fill);

    var col3Panel = new k.RowLayout({
        borderStyleProperty: '1px solid #a0a0a0',
        backgroundStyleProperty: 'white',
        borderRadiusStyleProperty: '2px',
        name: 'col3Panel'
    });
    col3Panel.setName('col3Panel');
    col3Panel.addComponent(bottomLeftLabel, 50, k.WidgetPosition.bottomLeft, '#f0f0f0');
    col3Panel.addComponent(bottomCenterLabel, 50, k.WidgetPosition.bottomCenter, 'white');
    col3Panel.addComponent(bottomRightLabel, 50, k.WidgetPosition.bottomRight, '#f0f0f0');
    col3Panel.addComponent(bottomFillLabel, 50, k.WidgetPosition.bottomFill, 'white');
    colLayout.addComponent(col3Panel, 200, k.WidgetPosition.fill);

    colLayout.addComponent(new k.Image('img/volley1.jpg', {alt: 'Volleyball at night'}), 150, k.WidgetPosition.fill);
    colLayout.enableAutoSizeLane();

    var rowLayout = new k.RowLayout();
    rowLayout.enableAutoSizeLane();

    var bottomPanelRowLayout = new k.RowLayout();
    bottomPanelRowLayout.enableAutoSizeLane();

    var label4 = new k.Label('Label No2');
//label4.cssBoxShadowStyleProperty='-webkit-box-shadow: 10px 6px 5px 0px rgba(0,0,0,0.75);-moz-box-shadow: 10px 6px 5px 0px rgba(0,0,0,0.75);box-shadow: 10px 6px 5px 0px rgba(0,0,0,0.75)';
//label4.additionalClass = 'shadow';
    label4.setAdditionalClass('shadow');
    label4.height = 40;
    label4.borderStyleClass = 'sampleBorderStyleClass';

    var input = new k.Input();
    input.additionalClass = 'shadow';
    input.height = 30;
    input.borderStyleProperty = '1px #a0a0a0 solid';
//bottomPanelRowLayout.addComponent(input, 50, k.WidgetPosition.topCenter, '#c0c0c0');

    var label6 = new k.Label('Label 6');
    label6.borderStyleProperty = '1px #a0a0a0 solid';
    label6.additionalClass = 'shadow';
    var content = '<pre class="line-numbers  language-javascript" data-src="plugins/line-numbers/prism-line-numbers.js"><code class="  language-javascript">'
            + ' var label=new k.Label();'
            + '  var colLayout = new k.ColLayout();'
            + '  var labelStyleObj = {borderStyleProperty: "1px solid green","'
            + '  backgroundStyleProperty: "#f0f0f0","'
            + '  borderRadiusStyleProperty: "2px","'
            + '  additionalClass: "shadow","'
            + '  width: 150'
            + ' };'
            + ' </code></pre>';
    var responsiveColLayout = new k.ResponsiveColLayout(400);
    responsiveColLayout.addComponent(new k.Label('Column 1').withModel('fragment1.html'), 200, k.WidgetPosition.bottomCenter, 'white');
    responsiveColLayout.addComponent(
            new k.Label('Column 3', {height: '200', padding: '2px'})
            .withCodeFile('codeFragement1.js', 'javascript'),
            400, k.WidgetPosition.bottomCenter, 'white');

    responsiveColLayout.addComponent(
            new k.Label('Column 2', {height: '200', padding: '10px'})
            .withModel('fragment2.html'),
            500, k.WidgetPosition.bottomCenter, 'white');

    var button = new k.Button('Show Dialog');

    button.addListener(function () {

        var dialog = new k.Dialog(new k.Label(content), new k.Label(content));
        dialog.show();
    });
    bottomPanelRowLayout.addComponent(label4, 40, k.WidgetPosition.fill, '#d0d0d0');
    bottomPanelRowLayout.addComponent(input, 40, k.WidgetPosition.fill);
    var bottomPanelColLayout = new k.ColLayout();
    bottomPanelColLayout.addComponent(button, 200, k.WidgetPosition.fill);
    var combo1 = new k.Combo();
    combo1.loadModel('http://localhost:3000/cities');
    bottomPanelColLayout.addComponent(combo1, 200, k.WidgetPosition.topLeft);
    bottomPanelRowLayout.addComponent(bottomPanelColLayout, 40, k.WidgetPosition.fill);
//    bottomPanelRowLayout.addComponent(button, 40, k.WidgetPosition.fill);
    bottomPanelRowLayout.addComponent(label6, 100, k.WidgetPosition.fill, '#f5f5f5');
    bottomPanelRowLayout.addComponent(responsiveColLayout, 400, k.WidgetPosition.fill, '#f5f5f5');

    rowLayout.addComponent(colLayout, 200, k.WidgetPosition.fill);
    rowLayout.addComponent(bottomPanelRowLayout, 400, k.WidgetPosition.fill);
    rowLayout.addComponent(new k.Label(content), 100, k.WidgetPosition.fill);
    colLayout.setName('First layout (ColLayout)');
    bottomPanelRowLayout.setName('Second Layout (RowLayout)');
    rowLayout.setName('Outer RowLayout');

    k.renderComponents('app', rowLayout);
//    colLayout.addComponent(label6
//},{
//    slotSize:'300px',
//    position:'topLeft'
//})
//colLayout.addComponent({
//    "text":'label text',
//    "borderStyleProperty":'1px #a0a0a0 dotted'
//}, new k.LaneLayoutData(300));

    var l = new k.Label('Label2', {
        "first Name": 'Marcel',
        width: 100,
        borderStyleProperty: '1px solid red'
    })
//colLayout.addComponent(l, 300, k.WidgetPosition.topCenter, '#f8f8f8');
//document.getElementById('app').innerHTML = rowLayout.render('top:0;left:0;bottom:0;right:0');

//Start experimental
    var employee = {
        "firstName": 'firstName',
        "lastName": 'lastName'
    }
    var label = new k.Label('Text');
    label = {
        "firstName": 'firstName',
        width: 100
    }

    common.logDebug('Employee.firstname=' + employee.firstName);
    common.logDebug('Label.firstname=' + label.firstName);
    common.logDebug('Label.width=' + label.width);
    common.logDebug('label.text=' + label.text);

// End experimental
    var successHandler = function (xmlhttp) {
//   var persons = JSON.parse(xmlhttp.responseText).employees;
        var persons = xmlhttp.employees;
        var html = '';
        for (i = 0; i < persons.length; i++) {
            common.logDebug(persons[i].firstName);
            var properties = Object.getOwnPropertyNames(persons[i]);
            for (j = 0; j < properties.length; j++) {
                html += properties[j] + '=' + persons[i][properties[j]] + ' ';
            }
            html += '<br>';
        }
        document.getElementById(label6.id + '_b').innerHTML = html;
    };
    common.getJSON('data/persons.json', successHandler);

    common.asyncLoadJsonFile("data/persons.json", function (xmlhttp) {
//   var persons = JSON.parse(xmlhttp.employees);
        var persons = JSON.parse(xmlhttp.responseText).employees;
        var html = '';
        for (i = 0; i < persons.length; i++) {
            console.info(persons[i].firstName);
            var properties = Object.getOwnPropertyNames(persons[i]);
            for (j = 0; j < properties.length; j++) {
                html += properties[j] + '=' + persons[i][properties[j]] + ' ';
            }
            html += '<br>';
        }
        document.getElementById(label6.id + '_b').innerHTML = html;
    });

    var codeLoadedCallback = function () {
        common.logDebug('evaluated code=' + reloadedFunction(k));
    };

    common.loadScript("reloaded.js", codeLoadedCallback);
    common.asyncLoadHtml('fragment1.html', function (xmlhttp) {
        console.log(xmlhttp.responseText);
    });
//    setTimeout(function () {
//        Rainbow.color();
//    }, 3000)
});
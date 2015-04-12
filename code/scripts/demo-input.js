/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
require(["common", "keziajs"], function (common, K) {
    var rowLayout = new K.RowLayout();
    rowLayout.setBorderStyleClass('c-paddingBorder');

    var localArrayCombo = new K.Combo({
        headerTemplate: ' <div style="width:100%">Name</div>',
        model: ['Daniela', 'Annja', 'Katja', 'Roger', 'Rafael', 'Cyrill', 'Rebekka'],
    });
    rowLayout.addComponent(localArrayCombo, 60, K.WidgetPosition.topLeft);

    var localArrayWithRendererCombo = new K.Combo({
        width: '300',
        instruction: 'Start typing zipcode or city',
        model: ['8617;Mönchaltorf;10', '8620;Wetzikon;20', '8610;Uster;30'],
        headerTemplate:
                ' <div style="width:100px">PLZ</div>' +
                ' <div style="left:100px;width:150px">Ort</div>' +
                ' <div style="left:250px;right:0">Icon</div>',
        inputValueGenerator: function (combo, item) {
            return item["v"][0] + ' ' + item["v"][1] + ' (value="' + item["v"][2] + '")';
        },
        itemRenderer: function (combo, item) {
            return '<div style="width:100px">' + item["v"][0] + '</div>' +
                    '<div style="left:100px">' + item["v"][1] + '</div>' +
                    '<div style="left:250px;right:0">' +
                    ' <svg width="50" height="25"><rect width="' + item["v"][2] + '" height="10" fill="yellow" style="stroke-width:1;stroke:rgb(0,0,0)" /></svg>' +
                    '</div>';
        },
        itemMatcher: function (combo, item, searchCriteria) {
            var str = item["v"][0] + item["v"][1].toLowerCase();
            return str.indexOf(searchCriteria);
        },
    });
    rowLayout.addComponent(localArrayWithRendererCombo, 40, K.WidgetPosition.topLeft);

    //csv with default configuration
    var csvArrayCombo1_label = new K.Label('Combo with csv array model and default configuration', {
        width: '300',
        additionalClass: 'c-InputLabel'});
    rowLayout.addComponent(csvArrayCombo1_label, 40, K.WidgetPosition.bottomLeft);
    var csvArrayCombo1_valueLabel = new K.Label('', {width: '300'});
    var csvArrayCombo1 = new K.Combo({
        width: '300',
        instruction: 'Type zipCode, city or value',
        headerTemplate: 'Zip code, city and value',
//        searchAndDisplayFieldInd: 1,
        model: ['8617;Mönchaltorf;10', '8620;Wetzikon;20', '8610;Uster;30'],
        valueChangeListener: function () {
            var value = this.getValue();
            var valueId = this.getValueId();
            var valueItem = this.getValueItem();

            csvArrayCombo1_valueLabel.setValue('value=' + value + ' valueId=' + valueId + ' valueItem=' + JSON.stringify(valueItem));
        },
    });
    rowLayout.addComponent(csvArrayCombo1, 40, K.WidgetPosition.topLeft);
    rowLayout.addComponent(csvArrayCombo1_valueLabel, 50, K.WidgetPosition.topLeft);


    //csv with custom field configuration
    var csvArrayCombo2_label = new K.Label('Combo with csv array model and searchAndDisplayFieldInd=1 configuration', {
        width: '300',
        additionalClass: 'c-InputLabel'});
    rowLayout.addComponent(csvArrayCombo2_label, 40, K.WidgetPosition.bottomLeft);

    var csvArrayCombo2 = new K.Combo({
        width: '300',
        instruction: 'Type ZIP code or city',
        headerTemplate: 'Zip code or city',
        model: ['8617;Mönchaltorf', '8620;Wetzikon', '8610;Uster'],
//        searchAndDisplayFieldInd: 0
    });
    rowLayout.addComponent(csvArrayCombo2, 40, K.WidgetPosition.topLeft);
    var csvArrayCombo2_label = new K.Label('Combo with csv array model and searchAndDisplayFieldInd=1 configuration', {
        width: '300',
        additionalClass: 'c-InputLabel'});
    rowLayout.addComponent(csvArrayCombo2_label, 40, K.WidgetPosition.bottomLeft);

    //KTKZ;OHW;ORTNAME    ;GHW;GDENR;GDENAMK      ;PHW;PLZ4;PLZZ;PLZNAMK
    //ZH  ;   ;Ettenhausen;   ;121  ;Wetzikon (ZH);!  ;8620;0   ;Wetzikon ZH
    //0    1   2           3   4     5             6   7    8    9
    var remoteCsvArrayCombo1_valueLabel = new K.Label('', {width: '500'});

    var remoteCsvArrayCombo1 = new K.Combo({
        width: '400',
        instruction: 'Beginne PLZ oder Ort einzutippen',
        modelService: 'http://localhost:8090/getCityListArray',
        headerTemplate:
                ' <div style="width:50px">PLZ</div>' +
                ' <div style="left:50px;width:150px">Gemeinde</div>' +
                ' <div style="left:200px;right:0">Ort</div>',
        inputValueGenerator: function (combo, item) {
            return item["v"][7] + ' ' + item["v"][9] + ' (' + item["v"][2] + ')';
        },
        itemRenderer: function (combo, item) {
            return '<div style="width:50px">' + item["v"][7] + '</div>' +
                    '<div style="left:50px">' + item["v"][9] + '</div>' +
                    '<div style="left:200px;right:0">' + item["v"][2] + '</div>';
        },
        itemMatcher: function (combo, item, searchCriteria) {
            var searchCriterias = searchCriteria.split(' ');
            var str = (item["v"][2] + ' '+ item["v"][9] +' '+item["v"][7]).toLowerCase();
            for (var i = 0; i < searchCriterias.length; i++) {
                if (str.indexOf(searchCriterias[i])<0){
                    return -1;
                };
            }
            return 1;
        },
        valueChangeListener: function () {
            var value = this.getValue();
            var valueId = this.getValueId();
            var valueItem = this.getValueItem();

            remoteCsvArrayCombo1_valueLabel.setValue('value=' + value + ' valueId=' + valueId + ' valueItem=' + JSON.stringify(valueItem));
        },
    });
    rowLayout.addComponent(remoteCsvArrayCombo1, 40, K.WidgetPosition.topLeft);
    rowLayout.addComponent(remoteCsvArrayCombo1_valueLabel, 40, K.WidgetPosition.topLeft);

    var localCsvArrayCombo3_Label=new K.Label('',{width:300});
    var localCsvArrayCombo3 = new K.Combo({
        width: '220',
        instruction: 'Beginne Bildnamen zu tippen',
        model: ['Bild 1;bv_1.jpg','Bild 2;bv_2.jpg','Bild 3;bv_3.jpg'],
        headerTemplate:
                ' <div style="width:100px">Bildname</div>' +
                ' <div style="left:100px;right:0;text-align:center">Bild</div>',
        itemHeight:110,
        inputValueGenerator: function (combo, item) {
            return item["v"][0];
        },
        itemRenderer: function (combo, item) {
            return '<div style="width:100px">' + item["v"][0] + '</div>' +
                    '<div style="left:100px;width:100px;height:100px;border-radius:50px;overflow:hidden"><img src="img/' + item["v"][1] + '" height="100" width="100"></div>';
        },
       
        valueChangeListener: function () {
            var value = this.getValue();
            var valueId = this.getValueId();
            var valueItem = this.getValueItem();

            localCsvArrayCombo3_Label.setValue('value=' + value + ' valueId=' + valueId + ' valueItem=' + JSON.stringify(valueItem));
        },
    });
    rowLayout.addComponent(localCsvArrayCombo3, 40, K.WidgetPosition.topLeft);
    rowLayout.addComponent(localCsvArrayCombo3_Label, 80, K.WidgetPosition.topLeft);


    rowLayout.addComponent(new K.Button('Test'), 40, K.WidgetPosition.topLeft);

    //window.alert(localArrayWithRendererCombo.maxItemCount);
    var counter = new K.Counter('Counter Message');
    counter.up();

    var specialCounter = new K.SpecialCounter('SpecialCounter message');
    console.log('SpecialCounter.specialMessage():' + specialCounter.specialMessage());
    var specialCounter2 = new K.SpecialCounter2('SpecialCounter2 message');
    console.log('SpecialCounter2.specialMessage():' + specialCounter2.specialMessage());

//    window.alert('K.moduleIdCounter:'+K);
//                '</div>'});
//    combo.withArrayModel(['Saab', 'Audi', 'Kia', 'Volvo', 'BMW']);
//    combo.withTemplate('<div style="width:100px">{#7}</div>' +
//            '<div style="left:100px">{#9}</div>' +
//            '<div style="left:250px;right:0">' +
//            //' <svg width="50" height="25"><circle cx="25" cy="12" r="8" stroke="green" stroke-width="2" fill="yellow" /></svg>' +
//            ' <svg width="50" height="25"><rect width="25" height="10" fill="yellow" style="stroke-width:1;stroke:rgb(0,0,0)" /></svg>' +
//            '</div>');
//    combo.loadCsvModel('data/PLZ-Schweiz.csv');
    this.i = 0;
//      console.log = function(){};
    this.start = window.performance.now();
    for (var i = 0; i < 100; i++) {
        common.asyncLoadJsonFile('http://localhost:8090/cities?searchCriteria=we', function (xmlhttp) {
            self.i++;
            //console.log(self.i + ':' + xmlhttp.responseText);
            if (self.i > 100) {
                console.log('100 Requests responses received within ' + (window.performance.now() - self.start));
            }
        });
    }
    console.log('100 Requests sent within ' + (window.performance.now() - self.start));
    if (typeof (Storage) !== "undefined") {
        // Code for localStorage/sessionStorage.
        if (localStorage.clickcount) {
            localStorage.clickcount = Number(localStorage.clickcount) + 1;
        } else {
            localStorage.clickcount = 1;
        }
        console.log('Local storeage counter=' + localStorage.clickcount);
    } else {
        // Sorry! No Web Storage support..
    }
//    var combo = new K.Combo({
//        template: 'PLZ {#7} Ort: {#9} <svg width="100" height="25"><circle cx="50" cy="12" r="10" stroke="green" stroke-width="2" fill="yellow" /></svg>',
//        csvModel: 'data/PLZ-Schweiz.csv'
//    });

    // Render rowLayout to div with id=app
    K.renderComponents('app', rowLayout);
});

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
require(["common", "keziajs"], function (common, K) {
//require(["kezia", "common", "keziajs"], function (k, common, K) {
     //localArrayWithRendererCombo.privateMethod('Public call - should not work');
    var localArrayCombo = new K.Combo({
        width: '300',
        headerTemplate:
                ' <div style="width:100px">PLZ</div>' +
                ' <div style="left:100px;width:150px">Ort</div>' +
                ' <div style="left:250px;right:0">Icon</div>',
//        renderItem:function(city){
//            return '<div style="width:100px">'+city.plz+'</div>' +
//            '<div style="left:100px">'+city.gemeinde+'</div>' +
//            '<div style="left:250px;right:0">' +
//            //' <svg width="50" height="25"><circle cx="25" cy="12" r="8" stroke="green" stroke-width="2" fill="yellow" /></svg>' +
//            ' <svg width="50" height="25"><rect width="25" height="10" fill="yellow" style="stroke-width:1;stroke:rgb(0,0,0)" /></svg>' +
//            '</div>';
//        },
        renderItem: function (item) {
            return '<div style="left:10px">' + item + '</div>';
        },
        modelType: 'array',
        model: ['Daniela', 'Annja', 'Katja', 'Roger', 'Rafael', 'Cyrill', 'Rebekka'],
        //,
        //remoteService:'http://localhost:8090/cities'
    });
    
    var localArrayWithRendererCombo = new K.Combo({
        instruction: 'Type city',
        headerTemplate:
                ' <div style="width:100px">PLZ</div>' +
                ' <div style="left:100px;width:150px">Ort</div>' +
                ' <div style="left:250px;right:0">Icon</div>',
        renderItem: function (item) {
            var fields = item.split(',');
            return '<div style="width:100px">' + fields[0] + '</div>' +
                    '<div style="left:100px">' + fields[1] + '</div>' +
                    '<div style="left:250px;right:0">' +
                    ' <svg width="50" height="25"><rect width="' + fields[2] + '" height="10" fill="yellow" style="stroke-width:1;stroke:rgb(0,0,0)" /></svg>' +
                    '</div>';
        },
        modelType: 'array',
        model: ['8617,Mönchaltorf,10', '8620,Wetzikon,20', '8610,Uster,30'],
        //,
        //remoteService:'http://localhost:8090/cities'
    });
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
    //Layouting
    var rowLayout = new K.RowLayout();
    rowLayout.setBorderStyleClass('LabelBorder');
    rowLayout.addComponent(localArrayWithRendererCombo, 80, K.WidgetPosition.topLeft);
    rowLayout.addComponent(localArrayCombo, 100, K.WidgetPosition.bottomLeft);
    K.renderComponents('app', rowLayout);
});

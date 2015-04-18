/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
require(["common", "keziajs", "keziajs-charts"], function (common, K, KC) {
    var rowLayout = new K.RowLayout();
    rowLayout.setBorderStyleClass('c-paddingBorder');

    var colChart = new KC.SuperChart({
        xAxis: {
            categories: ['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']
        },
        yAxis: {
            allowDecimals: false,
            min: 0,
            title: {
                text: 'Number of fruits'
            }
        },
        tooltip: {
            formatter: function () {
                return '<b>' + this.x + '</b><br/>' +
                        this.series.name + ': ' + this.y + '<br/>' +
                        'Total: ' + this.point.stackTotal;
            }
        },
        plotOptions: {
            column: {
                stacking: 'normal'
            }
        },
        series: [{
                name: 'John',
                data: [5, 3, 4, 7, 2],
                stack: 'male'
            }, {
                name: 'Joe',
                data: [3, 4, 4, 2, 5],
                stack: 'male'
            }, {
                name: 'Jane',
                data: [2, 5, 6, 2, 1],
                stack: 'female'
            }, {
                name: 'Janet',
                data: [3, 0, 4, 4, 3],
                stack: 'female'
            }],
        title: 'Historic World Population by Region',
        subtitle: 'Source: Wikipedia.org',
        dimensions: ['Year', 'Continent'],
        facts: ['Population'],
        model: [
            ['1800', 'Africa', '107'],
            ['1900', 'Africa', '133'],
            ['2008', 'Africa', '973'],
            ['1800', 'America', '31'],
            ['1900', 'America', '156'],
            ['2008', 'America', '914'],
            ['1800', 'Asia', '653'],
            ['1900', 'Asia', '947'],
            ['2008', 'Asia', '4054'],
            ['1800', 'Europe', '203'],
            ['1900', 'Europe', '408'],
            ['2008', 'Europe', '732'],
            ['1800', 'Oceania', '2'],
            ['1900', 'Oceania', '6'],
            ['2008', 'Oceania', '34']
        ],
        drillDownPath: [['Continent'], ['Continent', 'Year']],
    });
    var model= [
            ['1800', 'Africa', '107'],
            ['1900', 'Africa', '133'],
            ['2008', 'Africa', '973'],
            ['1800', 'America', '31'],
            ['1900', 'America', '156'],
            ['2008', 'America', '914'],
            ['1800', 'Asia', '653'],
            ['1900', 'Asia', '947'],
            ['2008', 'Asia', '4054'],
            ['1800', 'Europe', '203'],
            ['1900', 'Europe', '408'],
            ['2008', 'Europe', '732'],
            ['1800', 'Oceania', '2'],
            ['1900', 'Oceania', '6'],
            ['2008', 'Oceania', '34']
        ];
        var linGradient1=new KC.LinearGradient('id_linearGradient1',10,20,80,90);
        linGradient1.addColorStop('30','red',0);
        linGradient1.addColorStop('70','blue',0.5);
        linGradient1.addColorStop('90','green',0.7);
        
    var colChart2 = new KC.SuperChart({
        title: 'Historic World Population by Region #2',
        subtitle: 'Source: Wikipedia.org',
        dimensions: ['Year', 'Continent'],
        facts: ['Population'],
        model: model,
        chartBgGradient:linGradient1
    });
     var colChart3 = new KC.SuperChart({
        title: 'Historic World Population by Region #3',
        subtitle: 'Source: Wikipedia.org',
        dimensions: ['Year', 'Continent'],
        facts: ['Population'],
        model: model
    });
    var responsiveColLayout=new K.ResponsiveColLayout();
    responsiveColLayout.addComponent(colChart, 400, K.WidgetPosition.fill);
    responsiveColLayout.addComponent(colChart2, 400, K.WidgetPosition.fill);
    responsiveColLayout.addComponent(colChart3, 400, K.WidgetPosition.fill);
    
    rowLayout.addComponent(responsiveColLayout, 400, K.WidgetPosition.fill);
    rowLayout.enableAutoSizeLane();
//    rowLayout.addComponent(new K.Chart(), 200, K.WidgetPosition.fill);
    K.renderComponents('app', rowLayout);
});

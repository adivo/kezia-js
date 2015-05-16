/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/*eslint-env node */
require(["common", "keziajs", "keziajs-charts"], function (common, K, KC) {
    var rowLayout = new K.RowLayout();
    rowLayout.setBorderStyleClass('c-paddingBorder');

    var colChart = new KC.SuperChart({
        borderStyleProperty: '1px solid #a0a0a0',
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
        chartBgColor: '#fafafa',
        title: 'Historic World Population by Region',
        subTitle: 'Source: Wikipedia.org',
        legendPosition: KC.LegendPosition.LEFT,
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
    var model = [
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
    var modelFake = [
        ['1800', 'Africa', '50'],
        ['1900', 'Africa', '133'],
        ['2008', 'Africa', '973'],
        ['1800', 'America', '31'],
        ['1900', 'America', '156'],
        ['2008', 'America', '-914'],
        ['1800', 'Asia', '653'],
        ['1900', 'Asia', '947'],
        ['2008', 'Asia', '2000'],
        ['1800', 'Europe', '203'],
        ['1900', 'Europe', '408'],
        ['2008', 'Europe', '732'],
        ['1800', 'Oceania', '2'],
        ['1900', 'Oceania', '6'],
        ['2008', 'Oceania', '34']
    ];
    var linGradient1 = new KC.LinearGradient('id_linearGradient1', 10, 20, 80, 90);
    linGradient1.addColorStop('30', '#f5f5f5', 0);
    linGradient1.addColorStop('70', 'blue', 0.5);
    linGradient1.addColorStop('90', 'blue', 0.7);

    var colChart2 = new KC.SuperChart({
        caption: {
            bgColor: '#f0f0f0',
            borderColor: '000000',
            color: '#f0f0f0',
            borderRadius:5,
            position: KC.LegendPosition.LEFT
        },
        title: 'Historic World Population by Region #2',
        subTitle: 'Source: Wikipedia.org',
        dimensions: ['Year', 'Continent'],
        facts: ['Population'],
        model: model,
        chartBgGradient: linGradient1
    });
    var colChart3 = new KC.SuperChart({
        caption: {
            bgColor: '#808080',
            borderColor: '000000',
            color: 'white',
            borderRadius:5,
            position: KC.LegendPosition.TOP
        },
        backgroundStyleProperty: '#f8f8f8',
        borderRadiusStyleProperty: '20px',
        //legendBgColor: 'white',
        chartBgColor: 'white',
        title: 'Historic World Population by Region #3',
        //legendPosition: KC.LegendPosition.TOP,
        subTitle: 'Source: Wikipedia.org',
        dimensions: ['Year', 'Continent'],
        facts: ['Population'],
        model: modelFake
    });
    var colChart4 = new KC.SuperChart({
        caption: {
            bgColor: '#085606',
            borderColor: '000000',
            color: 'white',
            borderRadius:5,
            position: KC.LegendPosition.BOTTOM
        },
        areaBgImage:'img/worldmap_green.jpg',
        backgroundStyleProperty: '#f8f8f8',
        borderRadiusStyleProperty: '10px',
        chartBgColor: 'white',
        title: 'Historic World Population by Region #3',
        legendPosition: KC.LegendPosition.BOTTOM,
        legendBorderColor: '#a0a0a0',
        subTitle: 'Source: Wikipedia.org',
        dimensions: ['Year', 'Continent'],
        facts: ['Population'],
        model: model
    });
    var responsiveColLayout = new K.ResponsiveColLayout();
    responsiveColLayout.addComponent(colChart, 400, K.WidgetPosition.fill);
    responsiveColLayout.addComponent(colChart2, 400, K.WidgetPosition.fill);
    responsiveColLayout.addComponent(colChart3, 400, K.WidgetPosition.fill);
    responsiveColLayout.addComponent(colChart4, 400, K.WidgetPosition.fill);

    rowLayout.addComponent(responsiveColLayout, 400, K.WidgetPosition.fill);
    
    var row2 = new K.ResponsiveColLayout();
    row2.addComponent(new K.Button("Send"), 400, K.WidgetPosition.middleCenter);
    row2.addComponent(new KC.Tester(),400,K.WidgetPosition.fill);
    rowLayout.addComponent(row2, 50, K.WidgetPosition.fill);
    
    rowLayout.enableAutoSizeLane();
//    rowLayout.addComponent(new K.Chart(), 200, K.WidgetPosition.fill);
    K.renderComponents('app', rowLayout);
});

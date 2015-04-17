/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
require(["common", "keziajs", "keziajs-charts"], function (common, K, KC) {
    var rowLayout = new K.RowLayout();
    rowLayout.setBorderStyleClass('c-paddingBorder');

    var colChart = new KC.ColumnChart({
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
    rowLayout.addComponent(colChart, 400, K.WidgetPosition.fill);
    rowLayout.addComponent(new K.Chart(), 200, K.WidgetPosition.fill);
    K.renderComponents('app', rowLayout);
});

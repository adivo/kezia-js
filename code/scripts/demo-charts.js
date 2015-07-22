/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/*eslint-env node */
require(["common", "keziajs", "keziajs-charts"], function (common, K, KC) {

    var colChart1 = new KC.SuperChart({
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
        series: [
            {name: 'John', data: [5, 3, 4, 7, 2], stack: 'male'},
            {name: 'Joe', data: [3, 4, 4, 2, 5], stack: 'male'},
            {name: 'Jane', data: [2, 5, 6, 2, 1], stack: 'female'},
            {name: 'Janet', data: [3, 0, 4, 4, 3], stack: 'female'}
        ],
        chartBgColor: '#fafafa',
        title: 'Chart 1: Historic World Population by Region',
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
            borderRadius: 5,
            position: KC.LegendPosition.LEFT
        },
        title: 'Chart 2: Historic World Population by Region #2',
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
            borderRadius: 5,
            position: KC.LegendPosition.TOP
        },
        tooltip: {
            posX: 0,
            posY: 405,
            width: 320,
            height: 250,
            render: function (data) {
                var img;
                switch (data.serie) {
                    case 'Asia':
                        img = 'img/Asia.jpg';
                        break;
                    case 'America':
                        img = 'img/America.jpg';
                        break;
                    case 'Europe':
                        img = 'img/Europe.gif';
                        break;
                    case 'Africa':
                        img = 'img/Africa.jpg';
                        break;
                    default:
                        img = 'img/Oceania.gif';
                }

                return  '<div style="padding:3px">'
                        + '<div>Serie:' + data.serie + '</div>'
                        + '<div>value:' + data.value + '</div>'
                        + '<div><img src="' + img + '"/></div>'
                        + '</div>';
            }
        },
        columWidthPc: 0.5,
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
            borderRadius: 5,
            position: KC.LegendPosition.BOTTOM
        },
        columWidthPc: 0.95,
        areaBgImage: 'img/worldmap_green.jpg',
        backgroundStyleProperty: '#f8f8f8',
        borderRadiusStyleProperty: '10px',
        chartBgColor: 'white',
        title: 'Chart 3: Historic World Population by Region #3',
        legendPosition: KC.LegendPosition.BOTTOM,
        legendBorderColor: '#a0a0a0',
        subTitle: 'Source: Wikipedia.org',
        dimensions: ['Year', 'Continent'],
        facts: ['Population'],
        model: model
    });
    var onComplete = function () {
    };

    //var responsiveColLayout = new K.ResponsiveColLayout(200);
    var rowLayout = new K.RowLayout();
    var menuBar=new K.MenuBar({
        backgroundStyleProperty:"black",
        opacity:'0.5',
        position:'fixed'
    });
//    menuBar.addComponent(new K.Label('Test'),100,K.WidgetPosition.fill);
    rowLayout.addComponent(menuBar,50,K.WidgetPosition.fill);
    rowLayout.addComponent(colChart1, 400, K.WidgetPosition.fill);
    rowLayout.addComponent(colChart2, 500, K.WidgetPosition.fill);
//    responsiveColLayout.addComponent(colChart3, 400, K.WidgetPosition.fill);
//    responsiveColLayout.addComponent(colChart4, 400, K.WidgetPosition.fill);

    //rowLayout.addComponent(responsiveColLayout, 300, K.WidgetPosition.fill);
    colChart1.setBorderStyleClass('c-paddingBorder');
    colChart2.setBorderStyleClass('c-paddingBorder');
    rowLayout.addComponent(colChart3, 500, K.WidgetPosition.fill);
    rowLayout.addComponent(colChart4, 300, K.WidgetPosition.fill);
//    rowLayout.addComponent(new K.Button("Send"), 400, K.WidgetPosition.middleCenter);
//    rowLayout.addComponent(new KC.Tester(), 400, K.WidgetPosition.fill);
    //rowLayout.addComponent(row2, 50, K.WidgetPosition.fill);

    //rowLayout.enableAutoSizeLane();

    //responsiveColLayout.addComponent(rowLayout,400,K.WidgetPosition.fill);

    var row2 = new K.ResponsiveColLayout();

//    rowLayout.addComponent(new K.Chart(), 200, K.WidgetPosition.fill);
//    K.renderComponents('app', responsiveColLayout);
    K.renderComponents('app', rowLayout);
});

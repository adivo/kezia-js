/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/*eslint-env node */
require(["common", "keziajs-responsive", "keziajs-grid"], function (Common, K, KG) {


//     Load content asynchronously
//     Common.asyncLoadJsonFile('content/content.json', function (xmlhttp) {
//        var jsonObj = JSON.parse(xmlhttp.responseText);
//        titleText = jsonObj.demoGrid.title;
//
//        render(jsonObj);
//    });


// Define content within file
    var content = {
        "demoGrid": {
            "title": "Grid \"demo\" with Kezia.js",
            "description": "This example demonstrates the usage of the <b>Grid</b> component"
        },
        "kezia": {
            "component": {
                "options":
                        [
                            "slotStyleClass: Adds a css class to the components slot. Predefined classes: K-BG_Light",
                            "borderStyleClass: Predefined classes: K-MarginLR_20px",
                            "innerStyleClass: Predefined classes: K-HorTextAlign_Left"
                        ]
            }
        }
    };
    var render = function (content) {

        var rowLayout = new K.RowLayout();
        rowLayout.enableAutoSizeLane();
        //Title
//        var title = new K.Text('Hello AngularJS-Bootstrap-Spring Stack', 'h1');
        var title = new K.Text(content.demoGrid.title, 'h1',
                {
                    slotStyleClass: 'K-BG_Light',
                    borderStyleClass: 'K-MarginLR_20px',
                    innerStyleClass: 'K-HorTextAlign_Left'
                });
//        var title = new K.Text({
//            text: content.demoGrid.title,
//            htmlTag: 'h1',
//            borderStyleClass: 'K-MarginLR20'});
//     
//        title.setBorderStyleClass('k-margin-lr-20');
        rowLayout.addComponent(title, 80, K.WidgetPosition.fill);
        var description = new K.Text(content.demoGrid.description, 'description', {borderStyleClass: 'K-MarginLR_20px'});
//        description.setBorderStyleClass('k-margin-lr-20');
        rowLayout.addComponent(description, 60, K.WidgetPosition.fill);
        var gridPanel = new K.ColLayout({backgroundStyleProperty: '#f5f5f5',
            borderStyleClass: 'K-Border_Thin'});
        gridPanel.enableAutoSizeLane();
        var grid = new KG.Grid();
        grid.setBorderStyleClass('c-paddingBorder');
        grid.setModel([
            {id: 1, firstname: 'Marc', lastname: 'Taylor'},
            {id: 2, firstname: 'Rebecca', lastname: 'Taylor'}
        ]);
        grid.addColumn('id', new K.Button(), new K.Button());
        grid.addColumn('firstname', new K.Label(), new K.Label());
        grid.addColumn('lastname', new K.Label(), new K.Label());
        gridPanel.addComponent(grid, 10, K.WidgetPosition.fill);
        rowLayout.addComponent(gridPanel, 100, K.WidgetPosition.fill);
        
        var keziaDescription=new K.RowLayout({borderStyleClass:'K-MarginLR_20px'});
        
        keziaDescription.addComponent(new K.Text("Kezia description",'h2'),50,K.WidgetPosition.fill);
        var componentOptions=content.kezia.component.options;
        for (var i=0;i< componentOptions.length;i++){
            keziaDescription.addComponent(new K.Text(componentOptions[i],'code'),30,K.WidgetPosition.fill);
        }
        rowLayout.addComponent(keziaDescription,100,K.WidgetPosition.fill);
        
        
        // Render rowLayout to div with id=app
        K.renderComponents('app', rowLayout);
//        title.withModel('content/demo-grid-header.html');
    }
    render(content);
});

/*eslint-env node, amd, browser*/
define(["class_require-mod", "common", "tags", "keziajs-responsive"], function (OO, Common, Tags, K) {
    //Define module private variables on the private object (which is not exported)
    var pr = {};
//    pr.direction = {
//        TL_BR: 'TL_BR'
//    }

    //Object to be exported. Define any public object and functions on this object.  
    var m = {};
    m.GridMode={
        /* Display all rows in the viewport, that is, the height of the viewport will be set to the total height of the grid*/
        DISPLAY_ALL_ROWS:'DISPLAY_ALL_ROWS',
        /* All rows will be displayed but the height of the grid panel will be respected and scrolling will be enabled if necessary*/
        DISPLAY_ALL_ROWS_WITH_SCROLLING:'DISPLAY_ALL_ROWS_WITH_SCROLLING',
        /* Paging is enabled. Lazy loading can be opted */
        DISPLAY_PAGING:'DISPLAY_PAGING'
    }
    m.Grid = K.Component.extend({
        /**
         * Creates an Image object.
         * @param {type} url
         * @param {type} styleObj
         * @returns {undefined}
         */
        init: function (styleObj) {
            this._super('Grid', styleObj);
            this.rowHeightPx = Common.valueOrDefault(this.rowHeightPx, 20);
            this.fixedRowCount = Common.valueOrDefault(this.fixedRowCount, 0);
            this.fixedColCount = Common.valueOrDefault(this.fixedColCount, 0);
            this.gridMode=Common.valueOrDefault(this.gridMode,m.GridMode.DISPLAY_ALL_ROWS_WITH_SCROLLING);
            this.colId=[];
            this.colRenderer=[];
            this.colHeaderRenderer=[];
        },
        setModel:function(jsonArray){
            this.model=jsonArray;
        },
        addColumn:function(columnId,columnHeaderRenderer,columnRenderer){
            Common.add(this.colHeaderRenderer,columnHeaderRenderer);
            Common.add(this.colRenderer,columnRenderer);
            this.colId[this.colId.length]=columnId;
            
        },
        onAttached: function () {
        },
        renderInner: function () {
            var html = '';
            for (var row=0;row<this.model.length;row++){
                var rowObj=this.model[row];
                            var properties = Object.getOwnPropertyNames(rowObj);
    
                for (var col=0;col<this.colId.length;col++){
                    var colId=this.colId[col];
                    var value=rowObj[colId];
                    var colRenderer=this.colRenderer[col];
                    colRenderer.setValueNoRefresh(value);
                    html+=colRenderer.renderInner();
                }
                //html+='<div>Cell 1, row '+row+'</div>';
            }
            return html;//'<div>Loading Grid</div>';
        }
    });
    return m;
});
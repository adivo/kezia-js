define(["class_require-mod", "common", "tags","keziajs"], function (OO, Common, Tags,Kezia) {
//Define module private variables on the private object (which is not exported)
    var pr = {};

//Object to be exported. Define any public object and functions on this object.  
    var m = {};
    /**
     * The following properties can be set:<br>
     * width: the width of the component in pixels<br>
     * height: the height of the component in pixels<br>
     * template: <br>
     * headerTemplate:<br>
     * 
     * @param {type} styleObj
     * @returns {undefined}
     */
    m.ColumnChart = Kezia.Component.extend(new function () {

        /**
         * The following properties can be set:<br>
         * width: the width of the component in pixels<br>
         * height: the height of the component in pixels<br>
         * template: <br>
         * headerTemplate:<br>
         * 
         * @param {type} styleObj
         * @returns {undefined}
         */
        this.init = function (styleObj) {
            this._super('Combo', styleObj);
        };
        this.renderInner = function () {
            pr.registerComponentForAttaching(this);
            return '<rect x="49.5" y="89.5" width="53" height="111" stroke="#FFFFFF" stroke-width="1" fill="#7cb5ec" rx="0" ry="0"></rect>';
        };
        this.onAttached = function () {

        };
    });
    return m;
});

define(["base-components", "common"], function (c, common) {
    var widgetPosition = common.WidgetPosition;

    return {
        /** css class names */
        css: {
            FILL: 'fill',
            FILL_VERTICALLY: 'fillvert',
            FILL_HORIZONTALLY: 'fillhor',
            ABS: 'abs',
            ABS_OVERFLOW_VISIBLE: 'abs2',
            DIALOG_HEADER: 'dialog_header',
            DIALOG_CONTENT: 'dialog_content',
            MODAL_OVERLAY: 'modal_overlay',
            DIALOG: 'dialog'
        },
//        WidgetPosition:common.WidgetPosition,//widgetPosition,
        /** Widget position constants */
        WidgetPosition: {
            topFill: ['top', 'fill'],
            topFillButMax: ['top', 'topFillButMax'],
            topLeft: ['top', 'left'],
            topCenter: ['top', 'center'],
            topRight: ['top', 'right'],
            middleFill: ['middle', 'fill'],
            middleLeft: ['middle', 'left'],
            middleCenter: ['middle', 'center'],
            middleRight: ['middle', 'right'],
            bottomFill: ['bottom', 'fill'],
            bottomLeft: ['bottom', 'left'],
            bottomCenter: ['bottom', 'center'],
            bottomRight: ['bottom', 'right'],
            fill: ['fill', 'fill']
        },
        /**
         * Creates a new Label object.
         * @param {type} text
         * @param {type} styleObj
         * @returns {undefined}
         * 
         * @constructor
         */
        Label: function (text, styleObj) {
            return new c.Label(text, styleObj);
        },
        /**
         * Displays a code area. 
         * @param {type} codeFileUrl The url of the code file url
         * @param {type} language the code language (e.g. javascript, HTML)
         * @param {type} styleObj An additional and optional style object.
         * @returns {kezia_L1.c.CodeArea}
         */
        CodeArea: function (codeFileUrl, language, styleObj) {
            return new c.CodeArea(codeFileUrl, language, styleObj);
        },
        /**
         * Creates a new Button object.
         * @param {type} text
         * @param {type} styleObj
         * @returns {undefined}
         * 
         * @constructor
         */
        Button: function (text, styleObj) {
            return new c.Button(text, styleObj);
        },
        /**
         * Creates a new Input object.
         * @param {type} styleObj
         * @returns {undefined}
         * 
         * @constructor
         */
        Input: function (styleObj) {
            return new c.Input(styleObj);
        },
        /**
         * The following properties can be set:<br>
         * width: the width of the component in pixels<br>
         * height: the height of the component in pixels<br>
         * 
         * @param {type} styleObj
         * @returns {undefined}
         */
        Combo: function (styleObj) {
            return new c.Combo(styleObj);
        },
        /**
         * Creates an Image object.
         * @param {type} url
         * @param {type} styleObj
         * @returns {undefined}
         */
        Image: function (url, styleObj) {
            return new c.Image(url, styleObj);
        },
        /**
         * Initializes a column layout.
         * @param {type} styleObj
         * @returns {undefined}
         */
        ColLayout: function (styleObj) {
            return new c.ColLayout(styleObj);
        },
        /**
         * Initializes a responsive column layout.
         * @param {type} styleObj
         * @returns {undefined}
         */
        ResponsiveColLayout: function (styleObj) {
            return new c.ResponsiveColLayout(styleObj);
        },
        /**
         * Initializes a row layout.
         * @param {type} styleObj
         * @returns {undefined}
         */
        RowLayout: function (styleObj) {
            return new c.RowLayout(styleObj);
        },
        /**
         * Initializes a Dialog.
         * @param {type} headerComponent
         * @param {type} component
         * @param {type} styleObj
         * @returns {undefined}
         */
        Dialog: function (headerComponent, component, styleObj) {
            return new c.Dialog(headerComponent, component, styleObj);
        },
        /**
         * Renders the given component into the element with elementId.
         * @param {type} elementId
         * @param {type} component
         */
        renderComponents: function (elementId, component) {
            c.renderComponents(elementId, component);
        }
    }
});

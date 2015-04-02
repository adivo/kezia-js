/**
 * Created by Marcel on 01.03.2015.
 */
define(function () {
    console.log("Function : getCredits");
    var iterator = 100;
    var attachComponents = [];
    /* Used to store the id of the one and only overlay */
    var modalOverlayId = '';
    /* Used to store the id of the dialog attached on top of the overlay */
    var modalDialogId = '';
    
    var registerComponentForAttaching = function (component) {
        k.attachComponents[k.attachComponents.length] = component;
        Common.logDebug("registerComponentForAttaching of component id=" + component.id + Common.valueOnCheck(component.name, ' name=' + component.name, ''));
    }
    
    var renderComponents = function (elementId, component) {
        var element = document.getElementById(elementId);
        if (Common.isDef(element)) {
            element.innerHTML = component.render('top:0;left:0;bottom:0;right:0');
            k.attachRegisteredComponents();
        }

    }
    var StyleObj = Class.extend({
        borderStyleProperty: '',
        backgroundStyleProperty: '',
        borderRadiusStyleProperty: '',
        additionalClass: '',
        height: ''
    })
    /**
     * Component class.
     */
    var Component = Class.extend({
        /**
         * @constructor
         * Constructor for Component.
         * @param {type} cssClass
         * @param {type} styleObj
         * @returns {undefined}
         */
        init: function (cssClass, styleObj) {
            this.cssClass = cssClass;
            console.log('run constructor for Component :'+iterator++);
//            attachRegisteredComponents();
        }
    });
    /**
     * Class:Creates a Label.
     * 
     */
    var Label = Component.extend({
        /**
         * init:Creates a new Label object.
         * @param {type} text
         * @param {type} styleObj
         * @returns {undefined}
         * 
         * @constructor
         */
        init: function (text, styleObj) {
            console.log('run constructor for Label');
            this._super('Label', styleObj);
            this.text = text;
        }
    });

    return {
        /**
         * Attaches the registered comp
         * @returns {undefined}
         */
        attachRegisteredComponents : function () {
        for (i = 0; i < k.attachComponents.length; i++) {
            k.attachComponents[i].isAttached = true;
            k.attachComponents[i].onAttached();
        }},
        
        /**
         * init:Creates a new Label object.
         * @param {type} text
         * @param {type} styleObj
         * @returns {Label}
         * 
         * @constructor
         */
        Label: function () {
            return new Label();
        },
        /**
         * get the Credits
         * @returns {String}
         */
        getCredits: function () {
            var credits = "100";
            return credits;
        },
        getClass: function () {
            return "credits";
        },
    }
});
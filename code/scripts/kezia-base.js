/**
 * Created by Marcel on 01.03.2015.
 */
// module app/mime-client
define(["common","credits", "component"], function (common,credits, component) {

    console.log("Function : purchaseProduct");
//    console.log('ABS_OVERFLOW_VISIBLE:' + common.ABS_OVERFLOW_VISIBLE);
    console.log('WidgetPosition.topFill:' + common.css.FILL_HORIZONTALLY);
    console.log('WidgetPosition.topFill:' + common.WidgetPosition.topRight[1]);
    console.log(common.logLevel);
    common.logInfo('Test log message2');
    
    return {
        iterator: 100,
        attachComponents: [],
        /* Used to store the id of the one and only overlay */
        modalOverlayId: '',
        /* Used to store the id of the dialog attached on top of the overlay */
        modalDialogId: '',
        registerComponentForAttaching: function (component) {
            attachComponents[attachComponents.length] = component;
            //logDebug("registerComponentForAttaching of component id=" + component.id + k.valueOnCheck(component.name, ' name=' + component.name, ''));
        },
        attachRegisteredComponents: function () {
            for (i = 0; i < attachComponents.length; i++) {
                attachComponents[i].isAttached = true;
                attachComponents[i].onAttached();
            }
            attachComponents = [];
        },
        renderComponents: function (elementId, component) {
            var element = document.getElementById(elementId);
            if (isDef(element)) {
                element.innerHTML = component.render('top:0;left:0;bottom:0;right:0');
                attachRegisteredComponents();
            }
        },
        StyleObj: Class.extend({
            borderStyleProperty: '',
            backgroundStyleProperty: '',
            borderRadiusStyleProperty: '',
            additionalClass: '',
            height: ''
        }),
        purchaseProduct: function () {

            var credit = credits.getCredits();
            var comp = new component.Component();
            document.getElementById('app').innerHTML = comp.render("hello world from componetn");
            //console.log(comp.);
            if (credit > 0) {

                return true;
            }
            return false;
        },
        // Create a new Label 
        Label2: component.Component.extend({
            init: function (text, styleObj) {
                console.log('init Label2');
            },
            /* debug function */
            debug: function () {
                console.log('debug label');
            }

        })


    }
});
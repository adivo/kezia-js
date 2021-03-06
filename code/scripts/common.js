//define('common', function () {
define(["class_require-mod"], function (OO, Common, Tags, K) {

    /**
     * A module representing a common.
     * @exports common
     */
    var common = {
        StopWatch: OO.Class.extend(new function () {
            this.startTime;
            this.init = function () {
                this.startTime = new Date().getTime();
            };
            this.stop = function () {
                var end = new Date().getTime();
                return this.startTime - end;
            };

        }),
        /**
         Common.animateChain(onComplete,
         [ {duration:'500',objects:['rect1','rect2']},
         {duration:'1500',objects:['rect1','rect2']} ]
         );
         */
        animateChain: function (onCompleteFunc, chainArray) {
            var i = 0;
            var onComplete = function () {
                i++;
                if (i < chainArray.length) {
                    animateNext();
                }else{
                    onCompleteFunc();
                }
            };
            var animateNext = function () {

                if (i < chainArray.length) {
                    var dur = chainArray[i].duration;
                    var objects = chainArray[i].objects;

                    common.animateAll(dur, onComplete, objects)
                }
               
            };
             animateNext();
        },
        /**
         * Animates the given array of animationObjects. Each of them must implement the method animate=function(progress){}
         * @param {type} durationInMs
         * @param {type} onCompleteFunc
         * @param {type} animationObjects
         * @returns {undefined}
         */
        animateAll: function (durationInMs, onCompleteFunc, animationObjects) {
            var onUpdate = function (progress) {
                for (var i = 0; i < animationObjects.length; i++) {
                    animationObjects[i].animate(progress);
                }
            }
            common.animate(durationInMs, onUpdate, onCompleteFunc);
        },
        animate: function (durationInMs, onUpdate, onCompleteFunc) {
            var animStartTime = new Date().getTime();
            var render = function () {
                var now = new Date().getTime();
                var dt = now - animStartTime;
                var progress = dt / durationInMs;
                if (progress <= 1) {
                    onUpdate(progress);
                    requestID = requestAnimationFrame(render);
                } else {
                    if (progress !== 1) {
                        progress = 1; //makes sure the last update is with exactly 1
                        onUpdate(progress);
                        requestID = requestAnimationFrame(render);
                    }
                    //console.log("stopped progress at " + progress);
                    stopAnimation();
                }
            };
            var stopAnimation = function () {
                if (requestID) {
                    cancelAnimationFrame(requestID);
                    requestID = undefined;
                }
                onCompleteFunc();
            };
            var requestID = requestAnimationFrame(render);
        },
        roundToNextPowerOf10: function (value) {
            if (value === 0) {
                return 0;
            }
            var v = value > 0 ? value : -value;
            var power = 0;
            while (v > 10) {
                v = v / 10;
                power++;
            }
            v = Math.round(v + 0.5) * Math.pow(10, power);
            return value > 0 ? v : -v;
        },
        nextPowerOf10: function (value) {
            var v = value > 0 ? value : -value;
            var power = 0;
            while (v > 10) {
                v = v / 10;
                power++;
            }
            return power;
        },
        /** css class names */
        css: {
            FILL: 'fill',
            FILL_VERTICALLY: 'fillvert',
            FILL_HORIZONTALLY: 'fillhor',
            ABS: 'Slot',
            ABS_OVERFLOW_VISIBLE: 'SlotOV',
            POPUP: 'Popup',
            DIALOG_HEADER: 'dialog_header',
            DIALOG_CONTENT: 'dialog_content',
            MODAL_OVERLAY: 'modal_overlay',
            MODAL_TRANSPARENT_OVERLAY: 'transp-overlay',
            DIALOG: 'dialog',
            LOADER: 'Loader'
        },
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
        HorizontalPosition: {
            LEFT: 'Left',
            CENTER: 'Center',
            RIGHT: 'Right'
        },
        logLevel: 'info',
        Defaults: {
            widgetWidth: 180,
            widgetHeight: 30,
            slotWidth: 200
        },
        /** logs the message to the console with INFO level*/
        logInfo: function (message) {
            if (this.logLevel === 'info') {
                console.log('INFO:   ' + message);
            }
        },
        logDebug: function (message) {
            if (this.logLevel === 'debug') {
                console.log('DEBUG: ' + message);
            }
        },
        escapeRegExp: function (string) {
            return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        },
        /**
         * Gets the coordinates of the given element.
         * @param {Element} element 
         * @return {p} coordinates
         */
        getScreenCoordinates: function (element) {
            var p = {};
            p.x = element.offsetLeft;
            p.y = element.offsetTop;
            while (element.offsetParent) {
                p.x = p.x + element.offsetParent.offsetLeft;
                p.y = p.y + element.offsetParent.offsetTop;
                if (element === document.getElementsByTagName("body")[0]) {
                    break;
                }
                else {
                    element = element.offsetParent;
                }
            }
            return p;
        },
        isArray: function (myArray) {
            return myArray.constructor.toString().indexOf("Array") > -1;
        },
        asyncLoad: function (file, callback, responseType) {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function ()
            {
                if (xmlhttp.readyState === 4 && xmlhttp.status === 200)
                {
                    callback(xmlhttp);
                }
            };
            if (this.isDef(responseType)) {
                // cannot be set if loading state is done. See specs
                // http://www.w3.org/TR/XMLHttpRequest/#the-responsetype-attribute
                // xmlhttp.responseType = responseType;
            }
            xmlhttp.open("GET", file, true);
            xmlhttp.send();
        },
        asyncLoadHtml: function (file, callback) {
//            this.asyncLoad(file, callback, 'text/text');
            this.asyncLoad(file, callback, 'text');
        },
        asyncLoadJsonFile: function (file, callback) {
//            this.asyncLoad(file, callback, 'text/json');
            this.asyncLoad(file, callback, 'text');
        },
        asyncLoadJSFile: function (file, callback) {
            this.asyncLoad(file, callback, 'text/javascript');
        },
        getJSON: function (url, successHandler, errorHandler) {
            var xhr = typeof XMLHttpRequest !== 'undefined'
                    ? new XMLHttpRequest()
                    : new ActiveXObject('Microsoft.XMLHTTP');
            var responseTypeAware = 'responseType' in xhr;
            xhr.open('get', url, true);
            if (responseTypeAware) {
                xhr.responseType = 'json';
            }
            xhr.onreadystatechange = function () {
                var status = xhr.status;
                var data;
                // http://xhr.spec.whatwg.org/#dom-xmlhttprequest-readystate
                if (xhr.readyState === 4) { // `DONE`
                    if (status === 200) {
                        successHandler && successHandler(
                                responseTypeAware
                                ? xhr.response
                                : JSON.parse(xhr.responseText)
                                );
                    } else {
                        errorHandler && errorHandler(status);
                    }
                }
            };
            xhr.send();
        },
        /** Loads a javascript file. As soon the java script file is loaded the callback is executed */
        loadScript: function (url, callback)
        {
            // Adding the script tag to the head as suggested before
            var head = document.getElementsByTagName('head')[0];
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = url;
            // Then bind the event to the callback function.
            // There are several events for cross browser compatibility.
            script.onreadystatechange = callback;
            script.onload = callback;
            // Fire the loading
            head.appendChild(script);
        },
        /**
         * Returns true if the variable value is undefined (e.g. var value; or var value=null). Otherwise false is returned.
         * You cannot test an undeclared variable though.
         * @param {value} the test value
         * @return {boolean} test result
         */
        isUndef: function (value) {
            if (typeof value === 'undefined') {
                return !value
            }
            return false;
        },
        /**
         * Returns true if the variable value is defined (e.g. var value='value';). Otherwise false is returned.
         * You cannot test an undeclared variable though.
         * @param {value} the test value
         * @return {boolean} test result
         */
        isDef: function (value) {
            return !(value === undefined);
        },
        notEmpty: function (value) {
            return !this.isUndef(value) && value.length > 0;
        },
        /**
         * Returns the defaultValue whenever value is undefined
         */
        valueOrDefault: function (value, defaultValue) {
            if (typeof value === 'undefined') {
                return defaultValue;
            }
            return value;
        },
        valueOrDefaultAtMax: function (value, defaultAndMaxValue) {
            if (typeof value === 'undefined') {
                return defaultAndMaxValue;
            }
            return value < defaultAndMaxValue ? value : defaultAndMaxValue;
        },
        /**
         * Return the valueWhenDefined whenever checkValue is defined and not ''. Otherwise the undefVal is returned. 
         */
        valueOnCheck: function (checkValue, valueWhenDefined, undefVal) {
            if (typeof checkValue === 'undefined') {
                return undefVal;
            }
            if (checkValue.length > 0) {
                return valueWhenDefined;
            }
            return undefVal;
        },
    };
    return common;
});

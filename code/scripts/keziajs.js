define(["class_require-mod", "common", "tags"], function (OO, Common, Tags) {

//Define module private variables on the private object (which is not exported)
    var pr = {};
    pr.privateModuleVar = 'this is a private module var';
    /** Id iterator for widgets*/
    pr.moduleIdIterator = 100;
    /** Id iterator for popups */
    pr.modulePopupIdIterator = 0;
    /** Array to store the components which must run the onAttached method after all components have been attached to the DOM tree*/
    pr.componentsToAttach = [];
    /** Used to store the id of the one and only overlay div*/
    pr.modalOverlayId = '';
    /* Used to store the id of the dialog attached on top of the overlay */
    pr.modalDialogId = '';
    /** 
     * Every component which needs to access the DOM tree must call this method as part of
     * the renderInner() method. The components method @see onAttached will be called in turn
     * as soon as all components are rendered and attached to the DOM tree.
     * 
     * @param {type} component
     */
    pr.registerComponentForAttaching = function (component) {
        pr.componentsToAttach[pr.componentsToAttach.length] = component;
        Common.logDebug("registerComponentForAttaching of component id=" + component.id + Common.valueOnCheck(component.name, ' name=' + component.name, ''));
    }
    /** 
     * Called as soon as the rendered components have been injected into an element. 
     * The method onAttached() of the registered components will be called.
     * Finally the components registry will is reset.
     */
    pr.attachRegisteredComponents = function () {
        for (i = 0; i < pr.componentsToAttach.length; i++) {
            pr.componentsToAttach[i].isAttached = true;
            pr.componentsToAttach[i].onAttached();
        }
        pr.componentsToAttach = [];
    }


//Object to be exported. Define any public object and functions on this object.  
    var m = {};
    /** css class names */
    m.css = {
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
        DIALOG: 'dialog'
    };
    m.WidgetPosition = {
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
    };
    m.HorizontalPosition = {
        LEFT: 'Left',
        CENTER: 'Center',
        RIGHT: 'Right'
    };
    /**
     * Renders the given component into the element with elementId.
     * @param {type} elementId
     * @param {type} component
     */
    m.renderComponents = function (elementId, component) {
        var element = document.getElementById(elementId);
        if (Common.isDef(element)) {
            element.innerHTML = component.render('top:0;left:0;bottom:0;right:0');
            pr.attachRegisteredComponents();
        }
    };
    m.refreshComponent = function (component) {
        var element = document.getElementById(component.id + '_p');
        if (Common.isDef(element)) {
            element.innerHTML = component.renderInsidePositionBox()[0];
            pr.attachRegisteredComponents();
        }
    };
//Public module based variables
//    m.moduleIdCounter = 0;
    m.Popup = OO.Class.extend({
        init: function (popupBaseComponent, onClick, onHide) {
            this.create();
            this.popupBaseComponent = popupBaseComponent;
            this.onHide = onHide;
            this.onClick = onClick;
        },
        getBaseComponent: function () {
            return this.popupBaseComponent;
        },
        create: function () {
            this.popupEl = document.createElement('div');
            this.popupEl.className = Common.css.ABS + ' ' + Common.css.POPUP;
            this.popupEl.id = 'Popup_' + pr.modulePopupIdIterator++;
            document.body.appendChild(this.popupEl);
            var self = this;
            document.addEventListener('click', function (event) {
                console.info('Event on document ' + ' id=' + event.target.id + ' clickEvent:\n' + event.target.outerHTML.substring(0, 200));
                if (Common.isDef(event.target.id) && event.target.id !== self.id + '_input') {
                    console.log('Hide popup for element ' + self.id + '_input');
                    self.hide();
                }
            });
            this.popupEl.addEventListener('click', function (event) {
                if (Common.isDef(self.onClick)) {
                    var parentEl;
                    if (Common.isUndef(event.target.id) || event.target.id === '') {
                        parentEl = event.target.parentElement;
                        if (Common.isUndef(parentEl.id) || parentEl.id === '') {
                            parentEl = parentEl.parentElement;
                        }
                    } else {
                        parentEl = event.target;
                    }
                    if (Common.isDef(parentEl.id)) {
                        self.onClick(event, parentEl);
                    }

                }
            });
        },
        hide: function () {
            if (Common.isDef(this.popupEl)) {
                document.body.removeChild(this.popupEl);
                this.popupEl = undefined;
                if (Common.isDef(this.onHide)) {
                    this.onHide();
                }
            }
        },
        render: function (inputEl, popupWidth, popupHeight, innerHTML) {
            var inputElBoundingRect = inputEl.getBoundingClientRect();
            var inputElTop = inputElBoundingRect.top;
            var inputElHeight = inputElBoundingRect.height;
            this.popupEl.style.left = inputElBoundingRect.left + 'px';
            this.popupEl.style.width = popupWidth + 'px';
            var h = window.innerHeight;
            if (h > (inputElTop + inputElHeight + popupHeight)) {
                //Popup below input field
                this.setTopAndHeight(inputElHeight + inputElTop, popupHeight);
            } else if (inputElTop - popupHeight > 0) {
                //Popup above input as no space below
                this.setTopAndHeight(inputElTop - popupHeight, popupHeight);
            } else {
                //no space above, so use a minimal area below
                this.setTopAndHeight(inputElHeight + inputElTop, h - inputElHeight - inputElTop);
            }

            this.popupEl.innerHTML = innerHTML;
        },
        setTopAndHeight: function (top, height) {
            this.popupEl.style.top = top + 'px';
            this.popupEl.style.height = height + 'px';
        },
    })
    m.Component = OO.Class.extend(new function () {
        this.init = function (cssClass, styleObj) {
            this.cssClass = cssClass;
            this.id = 'I' + pr.moduleIdIterator++;
//            if (Common.isUndef(styleObj) || Common.isUndef(styleObj.borderStyleClass)) {
//                this.borderStyleClass = cssClass+'Border';
//            }

            if (Common.isDef(styleObj)) {
                var properties = Object.getOwnPropertyNames(styleObj);
                //copy properties from styleObj to component object
                for (j = 0; j < properties.length; j++) {
                    this[properties[j]] = styleObj[properties[j]];
                }
                console.log('\n\nProperties for ' + cssClass);
                var thisProps = Object.getOwnPropertyNames(this);
                for (j = 0; j < thisProps.length; j++) {
                    console.log('this "' + thisProps[j] + '"');
                }
            }
        };
        this.getId = function () {
            return this.id;
        };
        this.setWidth = function (width) {
            this.width = width;
            return this;
        };
        this.setHeight = function (height) {
            this.height = height;
            return this;
        };
        this.setName = function (name) {
            this.name = name;
            return this;
        };
        this.setAdditionalClass = function (additionalClass) {
            this.additionalClass = additionalClass;
            return this;
        };
        this.setBorderStyle = function (borderStyleProperty) {
            this.borderStyleProperty = borderStyleProperty;
        };
        this.setBorderStyleClass = function (borderStyleClass) {
            this.borderStyleClass = borderStyleClass;
        };
        this.renderInsidePositionBox = function () {
            Common.logDebug("Render of component id=" + this.id + Common.valueOnCheck(this.name, ' name=' + this.name, ''));
            var componentInner, bg;
            if (Common.isUndef(componentInner)) {
                componentInner = this.renderInner();
            }

            if (!Common.isUndef(this.borderStyleProperty)) {
                //border div as border style properties are set
                componentInner = new Tags.Div(componentInner)
                        .id(this.id + '_b')
                        .addClass(Common.css.FILL).addClass(this.cssClass)
                        .addStyle('background', this.backgroundStyleProperty)
                        .addStyle('border-radius', this.borderRadiusStyleProperty)
                        .addStyle('border', this.borderStyleProperty)
                        .addStyle('box-shadow', this.cssBoxShadowStyleProperty)
                        .render();
                this.hasBorderBox = true;
            } else if (Common.isDef(this.borderStyleClass)) {
                //border div as border style class is set
                componentInner = new Tags.Div(componentInner)
                        .id(this.id + '_b')
                        .addStyle('background', this.backgroundStyleProperty)
                        .addStyle('border-radius', this.borderRadiusStyleProperty)
                        .addClass('Border')
                        .addClass(this.borderStyleClass)
//                        .addClass(this.cssClass)
                        .render();
                this.hasBorderBox = true;
            } else {
                // no border defined, so set those attributes in position box
                bg = this.backgroundStyleProperty;
                // scroll = getScrollingStyle();
                this.hasBorderBox = false;
            }
            return [componentInner, bg];
        };
        this.render = function (positionStyles) {
//            Common.logDebug("Render of component id=" + this.id + Common.valueOnCheck(this.name, ' name=' + this.name, ''));
//            var componentInner, bg;
//            if (Common.isUndef(componentInner)) {
//                componentInner = this.renderInner();
//            }
//
//            if (!Common.isUndef(this.borderStyleProperty)) {
//                //border div as border style properties are set
//                componentInner = new Tags.Div(componentInner)
//                        .id(this.id + '_b')
//                        .addClass(Common.css.FILL).addClass(this.cssClass)
//                        .addStyle('background', this.backgroundStyleProperty)
//                        .addStyle('border-radius', this.borderRadiusStyleProperty)
//                        .addStyle('border', this.borderStyleProperty)
//                        .addStyle('box-shadow', this.cssBoxShadowStyleProperty)
//                        .render();
//                this.hasBorderBox = true;
//            } else if (Common.isDef(this.borderStyleClass)) {
//                //border div as border style class is set
//                componentInner = new Tags.Div(componentInner)
//                        .id(this.id + '_b')
//                        .addStyle('background', this.backgroundStyleProperty)
//                        .addStyle('border-radius', this.borderRadiusStyleProperty)
//                        .addClass('Border')
//                        .addClass(this.borderStyleClass)
////                        .addClass(this.cssClass)
//                        .render();
//                this.hasBorderBox = true;
//            } else {
//                // no border defined, so set those attributes in position box
//                bg = this.backgroundStyleProperty;
//                // scroll = getScrollingStyle();
//                this.hasBorderBox = false;
//            }
            var insidePositionBox = this.renderInsidePositionBox();
            var bg = insidePositionBox[1];
            var componentInner = insidePositionBox[0];
            //position box
            var boxShadow = Common.valueOnCheck(this.cssBoxShadowStyleProperty, 'box-shadow:' + this.cssBoxShadowStyleProperty, '');
            return new Tags.Div(componentInner).id(this.id + "_p")
                    .setName(this.name)
                    .addClass(this.additionalClass)
                    .addClass(Common.isDef(this.isInResponsiveContainer) ? 'rel' : this.getPositionCssClass())
//                    .addClass(this.cssClass + "_")
                    .addStyle(positionStyles)
                    .addStyle('background', bg)
                    .addStyle(boxShadow)
                    .addStyle('border-radius', this.borderRadiusStyleProperty)
                    .render();
        };
        this.super_onAttached = function () {

        };
        this.registerDragHandler = function (dragHandler) {
            this.dragHandler = dragHandler;
        };
        this.getPositionCssClass = function () {
            return (this.overflowVisible ? Common.css.ABS_OVERFLOW_VISIBLE : Common.css.ABS) + Common.valueOrDefault(this.positionCssClass, '');
        }
    });
    /**
     * Creates a new Label object.
     * @param {type} text
     * @param {type} styleObj
     * @returns {undefined}
     * 
     * @constructor
     */
    m.Label = m.Component.extend({
        horizontalAlign: '',
        /**
         * Creates a new Label object.
         * @param {type} text
         * @param {type} styleObj
         * @returns {undefined}
         * 
         * @constructor
         */
        init: function (text, styleObj) {
            this._super('Label', styleObj);
            this.text = text;
            this.overflowVisible = true;
            //this.horizontalAlign=Common.HorizontalPosition.LEFT;
        },
        setValue: function (text) {
            this.text = text;
            m.refreshComponent(this);
        },
        setHorizontalAlign: function (horizontalAlign) {
            this.horizontalAlign = horizontalAlign;
            return this;
        },
        onAttached: function () {
        },
        renderInner: function () {
            //pr.registerComponentForAttaching(this);
            return new Tags.Div(this.text).addClass(this.cssClass).addClass(this.horizontalAlign).render();
        },
        /**
         * Sets a html file as the model.
         * @param {type} htmlFile
         * @returns {component_L1.componentAnonym$3}
         */
        withModel: function (htmlFile) {
            var self = this;
            Common.asyncLoadHtml(htmlFile, function (xmlhttp) {
                self.text = xmlhttp.responseText;
                if (self.isAttached) {
                    var el = document.getElementById(self.id + '_p');
                    el.innerHTML = self.text;
                }
            });
            return this;
        },
        /**
         * Formats code using http://craig.is/making/rainbows
         * Sets a html file as the model.
         * @param {type} htmlFile
         * @returns {component_L1.componentAnonym$3}
         */
        withCodeFile: function (codeFile, language) {
            var self = this;
            Common.asyncLoadJSFile(codeFile, function (xmlhttp) {
                Rainbow.color(xmlhttp.responseText, language, function (highlighted_code) {
                    self.text = '<pre><code data-language="javascript">' + highlighted_code + '</code></pre>';
                    if (self.isAttached) {
                        var el = document.getElementById(self.id + '_p');
                        el.innerHTML = self.text;
                    }
                });
            });
            return this;
        }
    });
    /**
     * Formats code using http://craig.is/making/rainbows
     * Sets a html file as the model.
     * @param {type} htmlFile
     * @returns {component_L1.componentAnonym$3}
     * @constructor
     * Creates a new Label object.
     * @param {type} text
     * @param {type} styleObj
     * @returns {undefined}
     */
    m.CodeArea = m.Component.extend({
        /**
         * Creates a new Label object.
         * @param {type} text
         * @param {type} styleObj
         * @returns {undefined}
         * 
         * @constructor
         */
        init: function (codeFile, language, styleObj) {
            this._super('Label', styleObj);
            this.overflowVisible = true;
            this.codeFile = codeFile;
            this.language = language;
            //this.horizontalAlign=Common.HorizontalPosition.LEFT;
        },
        onAttached: function () {
            var self = this;
            Common.asyncLoadJSFile(this.codeFile, function (xmlhttp) {
                Rainbow.color(xmlhttp.responseText, this.language, function (highlighted_code) {
                    self.text = '<pre><code data-language="' + this.language + '">' + highlighted_code + '</code></pre>';
                    if (self.isAttached) {
                        var el = document.getElementById(self.id + '_p');
                        el.innerHTML = new Tags.Div(self.text).addClass(this.cssClass).render();
                    }
                });
            });
        },
        renderInner: function () {
            pr.registerComponentForAttaching(this);
            return '';
        }
    });
    m.Button = m.Component.extend({
        isAttached: false,
        init: function (text, styleObj) {
            this._super('Button', styleObj);
            this.text = text;
        },
        onAttached: function () {
            this.isAttached = true;
            if (Common.isDef(this.listener)) {
                var element = document.getElementById(this.id + '_e');
                element.addEventListener("click", this.listener);
            }
        },
        addListener: function (listener) {
            this.listener = listener;
            if (this.isAttached) {
                var element = document.getElementById(this.id + '_e');
                element.addEventListener("click", this.listener);
            }
        },
        renderInner: function () {
            pr.registerComponentForAttaching(this);
            return '<button id="' + this.id + '_e">' + this.text + '</button>';
        }
    });
    m.Image = m.Component.extend({
        /**
         * Creates an Image object.
         * @param {type} url
         * @param {type} styleObj
         * @returns {undefined}
         */
        init: function (url, styleObj) {
            this._super('Image', styleObj);
            this.url = url;
        },
        onAttached: function () {
        },
        renderInner: function () {
            return '<img src="' + this.url + '" alt="' + Common.valueOrDefault(this.alt, 'define alt for url ' + this.url) + '"\>';
        }
    });
    m.BaseEditor = m.Component.extend({
        init: function (cssClass, styleObj) {
            this._super(cssClass, styleObj);
        },
    });
    m.Input = m.BaseEditor.extend({
        /**
         * Initializes the Input component.
         * @param {type} styleObj
         * @returns {undefined}
         */
        init: function (styleObj) {
            this._super('Input', styleObj);
        },
        onAttached: function () {
            var element = document.getElementById(this.id + '_input');
            var coord = Common.getScreenCoordinates(element);
            Common.logDebug('Input.onAttached, input.x=' + coord.x + ' input.y=' + coord.y);
            var userFeedbackEl = document.getElementById(this.id + '_uf');
            element.addEventListener("keyup", function () {
                var x = element.clientLeft;
                var y = element.clientTop;
                var w = element.clientWidth;
                userFeedbackEl.style.top = y + 'px';
                userFeedbackEl.style.left = x + w + 'px';
                userFeedbackEl.style.width = '200px';
                userFeedbackEl.style.height = '30px';
                userFeedbackEl.innerHTML = element.value;
                var overlayEl = document.getElementById('overlay');
                if (overlayEl === null) {
                    overlayEl = document.createElement('div');
                    overlayEl.id = 'overlay';
                    document.body.appendChild(overlayEl);
                }

                overlayEl.innerHTML = element.value;
                overlayEl.style.top = (coord.y + 3) + 'px';
                overlayEl.style.left = (coord.x + element.offsetWidth + 3) + 'px';
//            if (document.body.firstChild)
//                document.body.insertBefore(div, document.body.firstChild);
//            else
            });
        },
        renderInner: function () {
            pr.registerComponentForAttaching(this);
            var userFeedback = new Tags.Div('').id(this.id + '_uf').addClass('input_uf').render();
            return '<input id="' + this.id + '_input" value="Enter your name"></input>' + userFeedback;
        }
    })
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
    m.Combo = m.Component.extend(new function () {
        var maxItemCount = 5;
        var headerHeight = 25;
        var onValueChanged = function (combo) {
            if (Common.isDef(combo.selection)) {
                combo.inputEl.value = combo.inputValue;
                if (Common.isDef(combo.valueChangeListener)) {
                    combo.valueChangeListener();
                }
            }
        };
        var setValues = function (combo, jsonItemMatch) {
            if (Common.isDef(jsonItemMatch)) {
                combo.selection = jsonItemMatch;
                combo.inputValue = combo.inputValueGenerator(combo, jsonItemMatch);
            }
        };
        var defaultInputValueGenerator = function (combo, item) {
            return item["v"][combo.searchAndDisplayFieldInd];
        };
        //would use the following regex ({item\[\"\w*\"\]})|({item\[\"\w*\"\]\[\d*\]})
        //to match templates like this: <div class="ComboItemInner">{item["v"][0]}>{item["v"]}</div>
        var defaultItemRendererTempl = '<div class="ComboItemInner">{item["v"][0]}</div>';
//        var defaultCsvInputValueGenerator = function (combo,item) {
//            return item.split(',')[this.searchAndDisplayFieldInd];
//        };
        var defaultItemRenderer = function (combo, item) {
            return '<div class="ComboItemInner">' + item["v"][combo.searchAndDisplayFieldInd] + '</div>';
        };

        var defaultItemMatcher = function (combo, item, searchCriteria) {
            return item["v"][combo.searchAndDisplayFieldInd].toLowerCase().indexOf(searchCriteria);
        }
        /**
         * Converts an array or csv string array (separated with this.csvArraySeparator) to a json object, adding an id, which
         * is here the index of each array item.
         * @param {type} combo
         * @returns {undefined}
         */
        var convertModelToJsonModel = function (combo) {
            if (Common.isDef(combo.model)) {
//            if (Common.isDef(combo.model) && (combo.modelType === 'array' || combo.modelType === 'csvArray')) {

                combo.jsonModel = [];
                for (var i = 0; i < combo.model.length; i++) {
//                    if (combo.modelType === 'array') {
//                        combo.jsonModel[i] = {id: i, "v": [combo.model[i]]};
//                    } else {
                    var item = combo.model[i];
                    var itemArray = item.split(combo.csvArraySeparator);

                    combo.jsonModel[i] = {id: i, "v": itemArray};
//                        combo.jsonModel[i] = {id: i, "v": combo.model[i].split(combo.csvArraySeparator)};
//                    }
                }
            }
        }
        //public properties. Need to be defined on this. as the property object is copied into this (won't work with var instruction...)
        this.itemHeight = 25;
        this.csvArraySeparator = ';';
        this.instruction = 'Beginn typing...';
        this.width = 200;
        this.model = [];
        this.isCsvModel = false;
        this.modelService = undefined;
        this.cachingMode = 'cacheOnFirstUsage';
        this.searchAndDisplayFieldInd = 0;
        this.valueInd = 0;
        this.referenceInd = 0;
        this.valueChangeListener;

        this.modelService;
        /**
         * Function to generate the value to write into the input element from a given json object item. 
         * Signature: function (combo, item){}. Returns the value as string (no html).
         */
        this.inputValueGenerator;
        /**
         * Function to render a json object item. Signature: function (combo, item){}. Returns the item a html.
         */
        this.itemRenderer;
        /**
         * Function to match a search criteria against an item. Signature: function (combo, item, searchCriteria) {}. Returns the location 
         * of the match (-1 if no match occured).
         */
        this.itemMatcher;
        //this.displayFn;

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

            convertModelToJsonModel(this);

            if (Common.isUndef(this.itemRenderer)) {
                this.itemRenderer = defaultItemRenderer;
            }

            if (Common.isUndef(this.inputValueGenerator)) {
                this.inputValueGenerator = defaultInputValueGenerator;
            }

            if (Common.isUndef(this.itemMatcher)) {
                this.itemMatcher = defaultItemMatcher;
            }
        };
        this.getValue = function () {
            return this.inputValue;
        };
        this.getValueId = function () {
            return this.selection["id"];
        };
        this.getValueItem = function () {
            return this.selection;
        };
        this.withTemplate = function (template) {
            this.template = template;
        };
        this.withArrayModel = function (data) {
            this.data = data;
        };
        this.loadModel = function (restUrl) {
            var self = this;
            Common.asyncLoadJsonFile(restUrl, function (xmlhttp) {
                self.model = JSON.parse(xmlhttp.responseText.split(','));
                convertModelToJsonModel(self);
//                self.jsonModel = JSON.parse(xmlhttp.responseText);//.split('\n');
//                console.log(xmlhttp.responseType, xmlhttp.responseText);

            });
        };
        this.loadCsvModel = function (restUrl) {
            var self = this;
            Common.asyncLoadHtml(restUrl, function (xmlhttp) {
                self.data = xmlhttp.responseText.split('\n');
                console.log(xmlhttp.responseType, xmlhttp.responseText);
            });
        };
        this.renderInner = function () {
            pr.registerComponentForAttaching(this);
            return new Tags.Tag('input').id(this.id + '_input').addClass('ComboInput')
                    .addStyle('width', Common.isDef(this.width) ? (this.width - 12) + 'px' : '')
                    .attribute('type', 'text')
                    .attribute('value', this.instruction).asStandalone(); // + arrow;
        };
        var focusListener = function (combo, e) {
            combo.inputEl.value = Common.isDef(combo.inputValue) ? combo.inputValue : '';
        };
        var focusLostListener = function (combo, e) {
            if (Common.isDef(m.popup)) {
                setValues(combo, combo.matches[combo.selectedItemInd]);
                m.popup.hide();
                m.popup = undefined;
            }
            combo.inputEl.value = Common.isDef(combo.inputValue) ? combo.inputValue : combo.instruction;
        };
        var keyUpListener = function (combo, e) {
            var keyCode = e.keyCode;
            console.log('key up:' + keyCode);
            if (keyCode === 38) {//arrow up
                if (combo.selectedItemInd > 0) {
                    combo.selectedItemInd--;
                } else {
                    this.offset--;
                }
            } else if (keyCode === 40) { //arrow down
                if (combo.selectedItemInd >= (maxItemCount - 1)) {
                    combo.offset++;
                } else {
                    combo.selectedItemInd++;
                }
            }
            searchAndRenderPopup(combo);
        };
        var searchAndRenderPopup = function (combo) {
            var popupInnerHtml = '';
            var top = 0;

            if (Common.isDef(combo.headerTemplate)) {
                popupInnerHtml += '<div class="ComboHeader"><div>' + combo.headerTemplate + '</div></div>';
                top = combo.itemHeight;
            }

            var searchCriteria = combo.inputEl.value.toLowerCase().trim();
            console.log('Look out for "' + searchCriteria + "'");
            //implement remote data
            if (Common.isDef(combo.remoteService)) {
                Common.asyncLoadJsonFile(combo.remoteJsonService + '?searchCriteria='
                        + searchCriteria + '&maxItems=' + maxItemCount + '&offset=' + combo.offset, function (xmlhttp) {
                            console.log(xmlhttp.responseText);
                            //Todo: render with json object
                            popupInnerHtml += combo.renderMatches(combo, combo.matches, top);
//                            combo.renderPopup(combo.inputEl, popupInnerHtml, combo.matches.length);
                            renderPopup(combo, popupInnerHtml);
                        });
            } else if (Common.isDef(combo.jsonModel)) {
                //console.log('model typeof array?' + (self.model instanceof Array));
                combo.matches = combo.findMatches(combo.jsonModel, searchCriteria, combo.offset);
                popupInnerHtml += combo.renderMatches(combo, combo.matches, top);
                renderPopup(combo, popupInnerHtml);
                //combo.renderPopup(combo.inputEl, popupInnerHtml, combo.matches.length);
            }
//                    console.log('Search finished');
//                   self.renderPopup(self.el,items);
//                }
        };
        this.onAttached = function () {
            var self = this;
            if (Common.isDef(self.modelService)) {
                self.loadModel(this.modelService);
            }
            this.selectedItemInd = 0;
            this.offset = 0;
            this.inputEl = document.getElementById(self.id + '_input');

            this.inputEl.addEventListener('keyup', function (e) {
                keyUpListener(self, e);
            });
            this.inputEl.addEventListener('focus', function (e) {
                focusListener(self, e);
            });
            this.inputEl.addEventListener('blur', function (e) {
                focusLostListener(self, e);
            });

        };
        this.findMatches = function (jsonModel, containsCriteria, offset) {
            var ind = 0;
            var resultInd = 0;
            var resultSet = [];
            while (ind < jsonModel.length && resultInd < maxItemCount) {
                var item = jsonModel[ind];
                if (this.itemMatcher(this, item, containsCriteria) >= 0) {
                    if (offset <= 0) {
                        resultSet[resultInd++] = item;
                    } else {
                        offset--;
                    }
                }
                ind++;
            }
            console.log('findMatches searched '+ind+' items');
            return resultSet;
        }
        var renderPopup = function (combo, popupInnerHTML) {
            //hide any other pop up
            if (Common.isDef(m.popup) && m.popup.getBaseComponent().id !== this.id) {
                m.popup.hide();
                m.popup = undefined;
            }

            if (Common.isUndef(m.popup)) {
                var onClick = function (event, idElement) {
                    console.log('Click on ' + event.target.outerHTML + ' idElement=' + idElement.id);
                    var ind = idElement.id.replace(/(I[\d]*_comboItem_)/i, '');
                    setValues(combo, combo.matches[ind]);
                    m.popup.hide();
                    m.popup = undefined;
                    console.log('Combo item ind=' + ind);
                };
                var onHide = function () {
                    onValueChanged(combo);
                    m.popup = undefined;
                };
                m.popup = new m.Popup(this, onClick, onHide);
            }
            var itemsCount = combo.matches.length;
            var popupHeight = headerHeight + itemsCount * combo.itemHeight;
            m.popup.render(combo.inputEl, combo.width, popupHeight, popupInnerHTML);
        };

        this.renderMatches = function (combo, matches, top) {
            var items = '';
            var itemsCount = 0;
            for (var i = 0; i < matches.length; i++) {
                var rendered = '<div>' + combo.itemRenderer(combo, matches[i]) + '</div>';
                items += new Tags.Div(rendered)
                        .id(combo.id + '_comboItem_' + i)
                        .addClass('ComboItem')
                        .addClass(i === combo.selectedItemInd ? 'ComboItemSelected' : '')
                        .addStyle('top', top + 'px')
                        .addStyle('height', combo.itemHeight + 'px')
                        .render();
                if (i === combo.selectedItemInd) {
                    setValues(combo, matches[i]);
                }
                itemsCount++;
                top += combo.itemHeight;
            }
            return items;
        };
    });
    m.BaseLayout = m.Component.extend({
        init: function (cssClass, styleObj) {
            this._super(cssClass, styleObj);
            this.components = [];
            this.componentsLayoutData = [];
            this.padding = 0;
        },
        onAttached: function () {
            Common.logInfo("OnAttached of component id=" + this.id + Common.valueOnCheck(this.name, ' name=' + this.name, ''));
            var el = document.getElementById(this.id + '_p');
            if (Common.isDef(el)) {
                Common.logDebug("OnAttached of component id=" + this.id + Common.valueOnCheck(this.name, ' name=' + this.name, ''));
                Common.logDebug("OnAttached of component id=" + this.id + Common.valueOnCheck(this.name, ' name=' + this.name, '') +
                        ' on attached width=' + el.clientWidth + ' height=' + el.offsetHeight);
            }
            var el = document.getElementById(this.id + '_b');
            if (Common.isDef(el)) {
                Common.logDebug("OnAttached of component id=" + this.id + Common.valueOnCheck(this.name, ' name=' + this.name, ''));
                Common.logDebug("OnAttached of component id=" + this.id + Common.valueOnCheck(this.name, ' name=' + this.name, '') +
                        ' on attached width=' + el.clientWidth + ' height=' + el.offsetHeight);
            }
            var width = Common.valueOrDefault(el.clientWidth, this.width);
            var height = Common.valueOrDefault(el.clientHeight, this.height);
            var html = this.renderInnerOnAttached(width, height);
            el.innerHTML = html;
            /*
             Common.logDebug('onAttached on ' + this.cssClass + ' and all its components');
             for (var i = 0; i < this.components.length; i++) {
             var com = this.components[i];
             Common.logDebug('  - onAttached ' + com.cssClass);
             com.onAttached();
             }
             */
        },
        enableAutoSizeLane: function () {
            this.autoSizeLaneEnabled = true;
        },
        addComponent: function (component, slotSize, widgetPosition, slotBgStyle) {
            this.components[this.components.length] = component;
            if (Common.isUndef(widgetPosition) || (widgetPosition.length < 2)) {
                widgetPosition = Common.WidgetPosition.fill;
            }
            this.componentsLayoutData[this.componentsLayoutData.length] = new m.LaneLayoutData(slotSize, widgetPosition, slotBgStyle);
        },
        renderInner: function () {
            pr.registerComponentForAttaching(this);
            Common.logDebug("renderInner of component id=" + this.id + Common.valueOnCheck(this.name, ' name=' + this.name, ''));
            return 'rendering on attached';
        },
        renderInnerOnAttached: function (width, height) {
            var html = '';
            var slotPos = this.padding;
            var i = 0;
            for (i = 0; i < this.components.length; i++) {
                var layoutData = this.componentsLayoutData[i];
                var component = this.components[i];
                var wPos = layoutData.widgetPosition;
                if (!Common.isArray(wPos)) {
                    wPos = Common.WidgetPosition.fill;
                }
                var hor = wPos[1];
                var vert = wPos[0];
                var posStyle = '';
                var w = this.getWidth(component);
                switch (hor) {
//                case 'topFillButMax':
//                    posStyle +='left:0;width:100%;max-width:300px';
//                    break;
                    case 'left':
                        posStyle += 'left:' + this.padding + 'px;width:' + w + 'px';
                        break;
                    case 'center':
                        posStyle += 'margin-left:50%;left:-' + (w / 2 + this.padding) + 'px;width:' + w + 'px';
                        break;
                    case 'right':
                        posStyle += 'right:' + this.padding + 'px;width:' + w + 'px';
                        break;
                    default:
                        posStyle += 'left:' + this.padding + 'px;right:' + this.padding + 'px';
                }
                posStyle += ';';
                var h = this.getHeight(component);
                switch (vert) {
                    case 'top':
                        posStyle += 'top:' + this.padding + 'px;height:' + h + 'px';
                        break;
                    case 'middle':
                        posStyle += 'margin-top:-' + (h / 2 + this.padding) + 'px;top:50%;height:' + h + 'px';
                        break;
                    case 'bottom':
                        posStyle += 'bottom:' + this.padding + 'px;height:' + h + 'px';
                        break;
                    default:
                        posStyle += 'top:' + this.padding + 'px;bottom:' + this.padding + 'px';
                }

                if (Common.isUndef(layoutData.slotSize)) {
                    layoutData.slotSize = Common.Defaults.slotWidth;
                }
                if (Common.isUndef(component)) {
                    alert.info('component is undefined');
                }
                var slotDiv = new Tags.Div(component.render(posStyle));
                if (!Common.isUndef(layoutData.slotBgStyle)) {
                    slotDiv.addStyle('background', layoutData.slotBgStyle);
                }
                var isLastLane = (i === this.components.length - 1);
                this.addSlotClassAndStyles(slotDiv, slotPos, layoutData.slotSize, isLastLane, i);
                html += slotDiv.render();
                slotPos += layoutData.slotSize;
            }
            return html;
        },
        getWidth: function (component) {
            if (Common.isUndef(component) || Common.isUndef(component.width)) {
                return Common.Defaults.widgetWidth;
            }
            return component.width;
        },
        getHeight: function (component) {
            if (Common.isUndef(component) || Common.isUndef(component.height)) {
                return Common.Defaults.widgetHeight;
            }
            return component.height;
        }
    });
    m.RowLayout = m.BaseLayout.extend({
        init: function (cssClass, styleObj) {
            if (Common.isDef(cssClass)) {
                this._super(cssClass, styleObj);
            } else {
                this._super('RowLayout', styleObj);
            }
        },
        addSlotClassAndStyles: function (div, slotPos, slotSize, isLastLane, slotInd) {
            div.addClass(Common.css.FILL_HORIZONTALLY)
                    .addStyle('top', slotPos + 'px');
            if (Common.isDef(this.autoSizeLaneEnabled) && isLastLane) {
                div.addStyle('bottom', '5px');
            } else {
                div.addStyle('height', slotSize + 'px');
            }
        }
    });
    m.ColLayout = m.BaseLayout.extend({
        /**
         * Initializes a column layout.
         * @param {type} styleObj
         * @returns {undefined}
         */
        init: function (styleObj) {
            this._super('ColLayout', styleObj);
        },
        addSlotClassAndStyles: function (div, slotPos, slotSize, isLastLane, slotInd) {
            div.addClass(Common.css.FILL_VERTICALLY)
                    .addStyle('left', slotPos + 'px');
            if (Common.isDef(this.autoSizeLaneEnabled) && isLastLane) {
                div.addStyle('right', 0);
            } else {
                div.addStyle('width', slotSize + 'px');
            }
        }
    });
    m.ResponsiveColLayout = m.BaseLayout.extend({
        init: function (minWidthPerCol, styleObj) {
            this._super('ResponsiveColLayout', styleObj);
            this.minWidthPerCol = minWidthPerCol;
            this.enableAutoSizeLane();
        },
        /* Override the base class method */
        onAttached: function () {
            Common.logInfo('onAttached of ResponsiveColLayout');
            var element = document.getElementById(this.id + '_p');
//        window.addEventListener("onResize", function () {
//            Common.logInfo('ResponsiveColLayout resized');
//        });
            var self = this;
            window.onresize = function () {
                Common.logInfo('ResponsiveColLayout resized. Width:' + element.clientWidth + ' Height:' + element.clientHeight);
                var width;
                if (element.clientWidth / self.components.length <= self.minWidthPerCol) {
                    width = '100%';
                } else {
                    width = 100 / self.components.length + '%';
                }
                for (i = 0; i < self.components.length; i++) {
                    var el = document.getElementById(self.components[i].id + '_c');
                    el.style.width = width;
                }
            };
        },
        addComponent: function (component, slotSize, widgetPosition, slotBgStyle) {
            component.isInResponsiveContainer = true;
            this.components[this.components.length] = component;
            widgetPosition = Common.WidgetPosition.topFill;
            this.componentsLayoutData[this.componentsLayoutData.length] = new LaneLayoutData(slotSize, widgetPosition, slotBgStyle);
        },
        renderInner: function () {
            pr.registerComponentForAttaching(this);
            return this.renderInnerOnAttached();
        },
        addSlotClassAndStyles: function (div, slotPos, slotSize, isLastLane, slotInd) {
            div.addClass(Common.css.FILL_VERTICALLY)
                    .id(this.components[slotInd].id + '_c')
                    .addStyle('position', 'relative')
                    .addStyle('float', 'left');
//        if (Common.isDef(this.autoSizeLaneEnabled) && isLastLane) {
//            div.addStyle('right', 0);
//        } else {
            div.addStyle('width', 100 / this.components.length + '%');
//                .addStyle('max-width', '600px');
//        }
        },
    });
    m.Dialog = m.RowLayout.extend({
        width: 400,
        height: 300,
        closeBtn: new m.Button('close'),
        /**
         * Initializes a Dialog.
         * @param {type} headerComponent
         * @param {type} component
         * @param {type} styleObj
         * @returns {undefined}
         */
        init: function (headerComponent, component, styleObj) {
            this._super('Dialog', styleObj);
            this.headerComponent = headerComponent;
            this.component = component;
            var header = new Label('Header');
            header.setAdditionalClass(Common.css.DIALOG_HEADER);
            this.addComponent(header, 30, Common.WidgetPosition.fill);
            component.setAdditionalClass(Common.css.DIALOG_CONTENT);
            this.addComponent(header, 150, Common.WidgetPosition.fill);
            this.addComponent(this.closeBtn, 40, Common.WidgetPosition.fill);
        },
//    onAttached: function () {
//        
//    },
        show: function () {
            m.modalOverlayId = this.id + '_overlay';
            m.modalDialogId = this.id + '_panel';
            var overlay = document.createElement('div');
            overlay.className = Common.css.MODAL_OVERLAY;
            overlay.id = m.modalOverlayId;
            document.body.appendChild(overlay);
            var modalDialog = document.createElement('div');
            modalDialog.id = m.modalDialogId;
            modalDialog.className = Common.css.ABS;
            modalDialog.style.marginTop = -(this.height) / 2 + 'px';
            modalDialog.style.marginLeft = -(this.width / 2) + 'px';
            modalDialog.style.left = '50%';
            modalDialog.style.width = this.width + 'px';
            modalDialog.style.top = '50%';
            modalDialog.style.height = this.height + 'px';
            document.body.appendChild(modalDialog);
            //          modalDialog.style = 'top:50%;margin-top:-' + halfHeight + ';margin-left:-' + halfWidth + ';left:50%;width:' + this.width + 'px;height:' + this.height + 'px';
            renderComponents(m.modalDialogId, this);
            this.closeBtn.addListener(this.close);
            Common.logDebug('window.innerWidth=' + window.innerWidth / 2);
        },
        close: function () {
            var dialogEl = document.getElementById(m.modalDialogId);
            document.body.removeChild(dialogEl);
            var overlayEl = document.getElementById(m.modalOverlayId);
            document.body.removeChild(overlayEl);
        }
    })
    m.LayoutData = OO.Class.extend({
        init: function () {
        }
    });
    /*
     * Creates a LaneLayoutData object whith the given size
     */
    m.LaneLayoutData = m.LayoutData.extend({
        /*
         * Creates a LaneLayoutData object whith the given size
         * @param {int} size - the size
         */
        init: function (slotSize, widgetPosition, slotBgStyle) {
            this.slotSize = slotSize;
            this.widgetPosition = widgetPosition;
            this.slotBgStyle = slotBgStyle;
        }
    });
    m.DragSource = OO.Class.extend({
        init: function (component) {
            this.component = component;
            component.registerDragHandler(dragHandler);
        },
        dragHandler: function () {
            Common.logDebug('initiate drag and drop');
        }

    });
    m.MenuBar = m.BaseLayout.extend({});
    m.Menu = m.BaseLayout.extend({
    });
    m.MenuItem = m.Component.extend({
        /**
         * Creates a MenuItem with the given text, icon width size and possibly with the styleObj.
         * @param {type} text
         * @param {type} iconUrl
         * @param {type} iconPxWidth
         * @param {type} iconPxHeight
         * @param {type} styleObj
         * @returns {undefined}
         */
        init: function (text, iconUrl, iconPxWidth, iconPxHeight, styleObj) {
            this._super('MenuItem', styleObj);
            this.text = text;
            this.iconUrl = iconUrl;
            this.iconPxWidth = iconPxWidth;
            this.iconPxHeight = iconPxHeight;
        },
        onAttached: function () {
        },
        renderInner: function () {
            pr.registerComponentForAttaching(this);
            var inner = '';
            if (Common.isDef(this.iconUrl)) {
                var icon = new Tags.Tag('img')
                        .attribute('src', this.iconUrl)
                        .addStyle('width:' + this.iconPxWidth + 'px;height:' + this.iconPxHeight + 'px')
                        .addStyle('top:4px;left:4px')
                        .addClass(Common.css.ABS);
                inner = icon.asStandalone();
            }
            inner += new Tags.Div(this.text)
                    .addStyle('left:20px;top:4px;right:4px;bottom:4px')
                    .addClass(Common.css.ABS).render();
            return new Tags.Div(inner)
                    .addClass(Common.css.FILL).render();
        }
    });
    m.Counter = OO.Class.extend(new function () {
        // private instance variables
        var count = 0;
        var message;
        //Constructor
        this.init = function (message_) {
            m.moduleIdCounter++;
            message = message_;
        }
        this.up = function () {
            var inner = 'inner';
            count++;
        };
        this.down = function () {
            count--;
        };
        this.get = function () {
            return count;
        };
        this.getMessage = function () {
            return message;
        }
    });
    m.SpecialCounter = m.Counter.extend(new function () {

        //Constructor
        this.init = function (message) {
            //Call the super constructor
            this._super(message);
            this.additionalVar = 'addtional';
//            var c = new m.Counter('inner counter');
//            console.log('Counter.init() and c.getCounter()=' + c.getMessage());
        }
        this.specialMessage = function () {
            //console.log('this.addtionalVar=' + this.additionalVar);
            return 'SpecialCounter.specialMessage() with message from parent (this.getMessage()): ' + this.getMessage();
        }

    });
    m.SpecialCounter2 = m.Counter.extend(new function () {

        //Constructor
        this.init = function (message) {
            //Call the super constructor
            this._super(message);
//            var c = new m.Counter('Counter message from Counter called from inside child object');
//            console.log('SpecialCounter2.init() and c.getMessage()=' + c.getMessage());
        }
        this.specialMessage = function () {
            return 'SpecialCounter2.specialMessage() with message from parent (this.getMessage()) ' + this.getMessage();
        }

    });
    return m;
});

define(["common", "tags"], function (Common, Tags) {
    /** Widget Id iterator */
    var iterator = 100;
    /** Array to store the components which must run the onAttached method after all components have been attached to the DOM tree*/
    var attachComponents = [];
    /** Used to store the id of the one and only overlay div*/
    var modalOverlayId = '';
    /* Used to store the id of the dialog attached on top of the overlay */
    var modalDialogId = '';
    /** 
     * Every component which needs to access the DOM tree must call this method as part of
     * the renderInner() method. The components method @see onAttached will be called in turn
     * as soon as all components are rendered and attached to the DOM tree.
     * 
     * @param {type} component
     */
    var registerComponentForAttaching = function (component) {
        attachComponents[attachComponents.length] = component;
        Common.logDebug("registerComponentForAttaching of component id=" + component.id + Common.valueOnCheck(component.name, ' name=' + component.name, ''));
    }
    /** 
     * Called as soon as the rendered components have been injected into an element. 
     * The method onAttached() of the registered components will be called.
     * Finally the components registry will is reset.
     */
    var attachRegisteredComponents = function () {
        for (i = 0; i < attachComponents.length; i++) {
            attachComponents[i].isAttached = true;
            attachComponents[i].onAttached();
        }
        attachComponents = [];
    }
    /**
     * Renders the given component into the element with elementId.
     * @param {type} elementId
     * @param {type} component
     */
    var renderComponents = function (elementId, component) {
        var element = document.getElementById(elementId);
        if (Common.isDef(element)) {
            element.innerHTML = component.render('top:0;left:0;bottom:0;right:0');
            attachRegisteredComponents();
        }

    }
    /** 
     * FIXME: Probably not used 
     */
    var StyleObj = Class.extend({
        borderStyleProperty: '',
        backgroundStyleProperty: '',
        borderRadiusStyleProperty: '',
        additionalClass: '',
        height: ''
    })
    var Popup = Class.extend({
        init: function (onClick, onHide) {
            this.create();
            this.onHide = onHide;
            this.onClick = onClick;
        },
        create: function () {
            this.popupEl = document.createElement('div');
            this.popupEl.className = Common.css.ABS + ' ' + Common.css.POPUP;
            this.popupEl.id = modalOverlayId;
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
                            parentEl = eparentEl.parentElement;
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
    var Component = Class.extend({
        init: function (cssClass, styleObj) {
            this.cssClass = cssClass;
            this.id = 'I' + iterator++;
//            if (Common.isUndef(styleObj) || Common.isUndef(styleObj.borderStyleClass)) {
//                this.borderStyleClass = cssClass+'Border';
//            }

            if (Common.isDef(styleObj)) {
                var properties = Object.getOwnPropertyNames(styleObj);
                //copy properties from styleObj to component object
                for (j = 0; j < properties.length; j++) {
                    this[properties[j]] = styleObj[properties[j]];
                }
            }
        },
        getId: function () {
            return this.id;
        },
        setWidth: function (width) {
            this.width = width;
            return this;
        },
        setHeight: function (height) {
            this.height = height;
            return this;
        },
        setName: function (name) {
            this.name = name;
            return this;
        },
        setAdditionalClass: function (additionalClass) {
            this.additionalClass = additionalClass;
            return this;
        },
        setBorderStyle: function (borderStyleProperty) {
            this.borderStyleProperty = borderStyleProperty;
        },
        setBorderStyleClass: function (borderStyleClass) {
            this.borderStyleClass = borderStyleClass;
        },
        render: function (positionStyles, componentInner) {
            Common.logDebug("Render of component id=" + this.id + Common.valueOnCheck(this.name, ' name=' + this.name, ''));
            var componentInner, bg, boxShadow;
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
            //position box
            boxShadow = Common.valueOnCheck(this.cssBoxShadowStyleProperty, 'box-shadow:' + this.cssBoxShadowStyleProperty, '');
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
        },
        super_onAttached: function () {

        },
        registerDragHandler: function (dragHandler) {
            this.dragHandler = dragHandler;
        },
        getPositionCssClass: function () {
            return (this.overflowVisible ? Common.css.ABS_OVERFLOW_VISIBLE : Common.css.ABS) + Common.valueOrDefault(this.positionCssClass, '');
        }
    });
    /**
     * @constructor
     * Creates a new Label object.
     * @param {type} text
     * @param {type} styleObj
     * @returns {undefined}
     */
    var Label = Component.extend({
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
        setHorizontalAlign: function (horizontalAlign) {
            this.horizontalAlign = horizontalAlign;
            return this;
        },
        onAttached: function () {
        },
        renderInner: function () {
            //registerComponentForAttaching(this);
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
    var CodeArea = Component.extend({
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
            registerComponentForAttaching(this);
            return '';
        }
    });
    var Button = Component.extend({
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
            registerComponentForAttaching(this);
            return '<button id="' + this.id + '_e">' + this.text + '</button>';
        }
    });
    var Image = Component.extend({
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

    var BaseEditor = Component.extend({
        init: function (cssClass, styleObj) {
            this._super(cssClass, styleObj);
        },
    });
    var Input = BaseEditor.extend({
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
            registerComponentForAttaching(this);
            var userFeedback = new Tags.Div('').id(this.id + '_uf').addClass('input_uf').render();
            return '<input id="' + this.id + '_input" value="Enter your name"></input>' + userFeedback;
        }
    })
    var Counter = Class.extend(new function () {
        var count = 0;
        this.up = function () {
            count++;
        };
        this.down = function () {
            count--;
        };
        this.get = function () {
            return count;
        };
    });
    /**
     * 
     */
    var Combo = Component.extend({
        maxItemCount: 5,
        itemHeight: 25,
        headerHeight: 25,
        selectedInd: 0,
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
        init: function (styleObj) {
            this._super('Combo', styleObj);
            this.data = [];

            var privateMethod = function (message) {
                window.alert(message);
            };


            if (Common.isUndef(this.renderItem)) {
                if (modelType === 'csv') {
                    this.renderItem = function (item) {
                        return item;
                    }
                } else if (modelType === 'array') {
                    this.renderItem = function (item) {
                        return item;
                    }
                } else if (modelType === 'json') {
                    this.renderItem = function (item) {
                        return item;
                    }
                }
            }


        },
        withTemplate: function (template) {
            this.template = template;
        },
        withArrayModel: function (data) {
            this.data = data;
        },
        loadModel: function (restUrl) {
            var self = this;
            Common.asyncLoadJsonFile(restUrl, function (xmlhttp) {
                self.data = xmlhttp.responseText.split('\n');
//                console.log(xmlhttp.responseType, xmlhttp.responseText);

            });
        },
        loadCsvModel: function (restUrl) {
            var self = this;
            Common.asyncLoadHtml(restUrl, function (xmlhttp) {
                self.data = xmlhttp.responseText.split('\n');
                console.log(xmlhttp.responseType, xmlhttp.responseText);

            });
        },
        onAttached: function () {
            privateMethod('Combo init');
            var self = this;
            self.selectedItemInd = 0;
            self.offset = 0;

            self.inputEl = document.getElementById(self.id + '_input');
            self.inputEl.addEventListener('keyup', function (e) {
                var keyCode = e.keyCode;
                if (keyCode === 38) {
                    if (self.selectedItemInd > 0) {
                        self.selectedItemInd--;
                    } else {
                        self.offset--;
                    }
//                    self.selectedInd--;

                } else if (keyCode === 40) {
//                    self.selectedInd++;
                    if (self.selectedItemInd >= (self.maxItemCount - 1)) {
                        self.offset++;
                    } else {
                        self.selectedItemInd++;
                    }
                }
//                if (Common.isDef(self.data)) {
                var items = '';
                var top = 0;
                if (Common.isDef(self.headerTemplate)) {
                    items += '<div class="ComboHeader">' + self.headerTemplate + '</div>';
                    top = self.itemHeight;
                }
                var searchCriteria = self.inputEl.value.toLowerCase();
                console.log('Look out for "' + searchCriteria + "'");
                var itemsCount = 0;


                //implement remote data

                if (Common.isDef(self.remoteService)) {
                    Common.asyncLoadJsonFile(self.remoteJsonService + '?searchCriteria='
                            + searchCriteria + '&maxItems=' + self.maxItemCount + '&offset=' + self.offset, function (xmlhttp) {
                                console.log(xmlhttp.responseText);
                                //Todo: render with json object
                                items += self.renderMatches(matches, top);
                                self.renderPopup(self.inputEl, items, matches.length);
                            });
                } else if (Common.isDef(self.model)) {
                    console.log('model typeof array?' + (self.model instanceof Array));
                    self.matches = self.findMatches(self.model, searchCriteria, self.offset);
                    items += self.renderMatches(self.matches, top);
                    self.renderPopup(self.inputEl, items, self.matches.length);
//                                    
//                        for (var i = 0; i < resultSet.length; i++) {
//                            var rendered = '';
//                            if (Common.isDef(self.jsonItemRenderer)) {
//                                rendered = self.jsonItemRenderer(resultSet[i]);
//                            } else if (Common.isDef(self.template)) {
//                                rendered = self.template;
//                                var fields = resultSet[i].split(';');
//                                for (var f = 0; f < fields.length; f++) {
//                                    rendered = rendered.replace('{#' + f + '}', fields[f]);
//                                }
//                            } else {
//                                rendered += resultSet[i];
//                            }
//                            items += new Tags.Div(rendered)
//                                    .addClass('ComboItem')
//                                    .addClass(itemsCount === self.selectedItemInd ? 'ComboItemSelected' : '')
//                                    .addStyle('top', top + 'px')
//                                    .addStyle('height', self.itemHeight + 'px')
//                                    .render();
//                            itemsCount++;
//                            top += self.itemHeight;
//                        }

                }
//                    console.log('Search finished');
//                   self.renderPopup(self.el,items);
//                }
            });
        },
        renderPopup: function (inputEl, popupInnerHTML, itemsCount) {
            var self = this;
            if (Common.isUndef(this.popupEl)) {
                var onClick = function (event, idElement) {
                    console.log('Click on ' + event.target.outerHTML + ' idElement=' + idElement.id);
                    var ind = idElement.id.replace(/(I[\d]*_comboItem_)/i, '');
                    self.selection = self.matches[ind];
                    self.popup.hide();
                    console.log('Combo item ind=' + ind);
                };
                var onHide = function () {
                    if (Common.isDef(self.selection)) {
                        self.inputEl.value = self.selection;
                    }
                };
                this.popup = new Popup(onClick, onHide);
            }
            var popupHeight = this.headerHeight + itemsCount * this.itemHeight;
            this.popup.render(inputEl, this.width, popupHeight, popupInnerHTML);
//            if (Common.isUndef(this.popupEl)) {
//                this.popupEl = this.displayPopup();
//            }
//            var popupHeight = this.headerHeight + itemsCount * this.itemHeight;
//            this.positionPopup(inputEl, this.width, popupHeight, this.popupEl);
//            this.popupEl.innerHTML = popupInnerHTML;
        },
        renderMatches: function (matches, top) {
            var items = '';
            var itemsCount = 0;
            for (var i = 0; i < matches.length; i++) {
                var rendered = '';
                rendered = this.renderItem(matches[i]);
                items += new Tags.Div(rendered)
                        .id(this.id + '_comboItem_' + i)
                        .addClass('ComboItem')
                        .addClass(i === this.selectedItemInd ? 'ComboItemSelected' : '')
                        .addStyle('top', top + 'px')
                        .addStyle('height', this.itemHeight + 'px')
                        .render();
                if (i === this.selectedItemInd) {
                    this.selection = matches[i];
                }
                itemsCount++;
                top += this.itemHeight;
            }
            return items;
        },
        findMatches: function (model, containsCriteria, offset) {
            var ind = 0;
            var resultInd = 0;
            var resultSet = [];
            while (ind < model.length && resultInd < this.maxItemCount) {
                var item = model[ind];
                if (item.toLowerCase().indexOf(containsCriteria) >= 0) {
                    if (offset <= 0) {
                        resultSet[resultInd++] = item;
                    } else {
                        offset--;
                    }
                }
                ind++;
            }
            return resultSet;
        },
        displayPopup: function () {
            var popupEl = document.createElement('div');
            popupEl.className = Common.css.ABS + ' ' + Common.css.POPUP;
            popupEl.id = modalOverlayId;
            document.body.appendChild(popupEl);
            var self = this;
            document.addEventListener('click', function (event) {
                console.info('Event on document ' + event.target.tagName + ' id=' + event.target.id);
                if (Common.isDef(event.target.id) && event.target.id !== self.id + '_input') {
                    console.log('Hide popup for element ' + self.id + '_input');
                    self.hidePopup();
                }
            });
            return popupEl;
        },
        hidePopup: function () {
            if (Common.isDef(this.popupEl)) {
                document.body.removeChild(this.popupEl);
                this.popupEl = undefined;
            }
            if (Common.isDef(this.selection)) {
                this.inputEl.value = this.selection;
            }
        },
        /**
         * Positions the given popup element.
         * @param {type} inputElTop
         * @param {type} inputElHeight
         * @param {type} popupHeight
         * @param {type} popupEl
         * @returns {undefined}
         */
        positionPopup: function (inputEl, popupWidth, popupHeight, popupEl) {
            var inputElBoundingRect = inputEl.getBoundingClientRect();
            var inputElTop = inputElBoundingRect.top;
            var inputElHeight = inputElBoundingRect.height;

            popupEl.style.left = inputElBoundingRect.left + 'px';
            popupEl.style.width = popupWidth + 'px';

            var h = window.innerHeight;
            if (h > (inputElTop + inputElHeight + popupHeight)) {
                //Popup below input field
                this.setPopupTopAndHeight(popupEl, inputElHeight + inputElTop, popupHeight);
            } else if (inputElTop - popupHeight > 0) {
                //Popup above input as no space below
                this.setPopupTopAndHeight(popupEl, inputElTop - popupHeight, popupHeight);
            } else {
                //no space above, so use a minimal area below
                this.setPopupTopAndHeight(popupEl, inputElHeight + inputElTop, h - inputElHeight - inputElTop);
            }
        },
        setPopupTopAndHeight: function (popupEl, top, height) {
            popupEl.style.top = top + 'px';
            popupEl.style.height = height + 'px';
        },
        renderInner: function () {
            registerComponentForAttaching(this);
            return new Tags.Tag('input').id(this.id + '_input').addClass('ComboInput')
                    .addStyle('width', Common.isDef(this.width) ? (this.width - 12) + 'px' : '')
                    .attribute('type', 'text')
                    .attribute('value', 'Enter your name').asStandalone();// + arrow;
        }
    });

    var BaseLayout = Component.extend({
        init: function (cssClass, styleObj) {
            this._super(cssClass, styleObj);
            this.components = [];
            this.componentsLayoutData = [];
            this.padding = 5;
        },
        onAttached: function () {
            Common.logInfo("OnAttached of component id=" + this.id + Common.valueOnCheck(this.name, ' name=' + this.name, ''));
            var el = document.getElementById(this.id + '_p');
            if (Common.isDef(el)) {
                Common.logDebug("OnAttached of component id=" + this.id + Common.valueOnCheck(this.name, ' name=' + this.name, ''));
                Common.logDebug("OnAttached of component id=" + this.id + Common.valueOnCheck(this.name, ' name=' + this.name, '') +
                        ' on attached width=' + el.clientWidth + ' height=' + el.offsetHeight);
            }
            var el = document.getElementById(this.id + '_p');
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
            this.componentsLayoutData[this.componentsLayoutData.length] = new LaneLayoutData(slotSize, widgetPosition, slotBgStyle);
        },
        renderInner: function () {
            registerComponentForAttaching(this);
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
    var RowLayout = BaseLayout.extend({
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
    var ColLayout = BaseLayout.extend({
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
    var ResponsiveColLayout = BaseLayout.extend({
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
            registerComponentForAttaching(this);
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
    var Dialog = RowLayout.extend({
        width: 400,
        height: 300,
        closeBtn: new Button('close'),
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
            modalOverlayId = this.id + '_overlay';
            modalDialogId = this.id + '_panel';

            var overlay = document.createElement('div');
            overlay.className = Common.css.MODAL_OVERLAY;
            overlay.id = modalOverlayId;
            document.body.appendChild(overlay);
            var modalDialog = document.createElement('div');
            modalDialog.id = modalDialogId;
            modalDialog.className = Common.css.ABS;
            modalDialog.style.marginTop = -(this.height) / 2 + 'px';
            modalDialog.style.marginLeft = -(this.width / 2) + 'px';
            modalDialog.style.left = '50%';
            modalDialog.style.width = this.width + 'px';
            modalDialog.style.top = '50%';
            modalDialog.style.height = this.height + 'px';
            document.body.appendChild(modalDialog);
            //          modalDialog.style = 'top:50%;margin-top:-' + halfHeight + ';margin-left:-' + halfWidth + ';left:50%;width:' + this.width + 'px;height:' + this.height + 'px';
            renderComponents(modalDialogId, this);
            this.closeBtn.addListener(this.close);
            Common.logDebug('window.innerWidth=' + window.innerWidth / 2);
        },
        close: function () {
            var dialogEl = document.getElementById(modalDialogId);
            document.body.removeChild(dialogEl);
            var overlayEl = document.getElementById(modalOverlayId);
            document.body.removeChild(overlayEl);
        }
    })
    var LayoutData = Class.extend({
        init: function () {
        }
    });
    /*
     * Creates a LaneLayoutData object whith the given size
     */
    var LaneLayoutData = LayoutData.extend({
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
    var DragSource = Class.extend({
        init: function (component) {
            this.component = component;
            component.registerDragHandler(dragHandler);
        },
        dragHandler: function () {
            Common.logDebug('initiate drag and drop');
        }

    });
    var MenuBar = BaseLayout.extend({});
    var Menu = BaseLayout.extend({
    });
    var MenuItem = Component.extend({
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
            registerComponentForAttaching(this);
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
    return {
        Counter:function(){
            return new Counter();
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
            return new Label(text, styleObj);
        },
        CodeArea: function (codeFile, language, styleObj) {
            return new CodeArea(codeFile, language, styleObj);
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
            return new Button(text, styleObj);
        },
        /**
         * Creates a new Input object.
         * @param {type} styleObj
         * @returns {undefined}
         * 
         * @constructor
         */
        Input: function (styleObj) {
            return new Input(styleObj);
        },
        Combo: function (styleObj) {
            return new Combo(styleObj);
        },
        /**
         * Creates an Image object.
         * @param {type} url
         * @param {type} styleObj
         * @returns {undefined}
         */
        Image: function (url, styleObj) {
            return new Image(url, styleObj);
        },
        /**
         * Initializes a column layout.
         * @param {type} styleObj
         * @returns {undefined}
         */
        ColLayout: function (styleObj) {
            return new ColLayout(styleObj);
        },
        /**
         * Initializes a responsive column layout.
         * @param {type} styleObj
         * @returns {undefined}
         */
        ResponsiveColLayout: function (styleObj) {
            return new ResponsiveColLayout(styleObj);
        },
        /**
         * Initializes a row layout.
         * @param {type} styleObj
         * @returns {undefined}
         */
        RowLayout: function (styleObj) {
            return new RowLayout(styleObj);
        },
        /**
         * Initializes a Dialog.
         * @param {type} headerComponent
         * @param {type} component
         * @param {type} styleObj
         * @returns {undefined}
         */
        Dialog: function (headerComponent, component, styleObj) {
            return new Dialog(headerComponent, component, styleObj);
        },
        /**
         * Renders the given component into the element with elementId.
         * @param {type} elementId
         * @param {type} component
         */
        renderComponents: function (elementId, component) {
            renderComponents(elementId, component);
        },
        /**
         * Creates a MenuItem with the given text, icon width size and possibly with the styleObj.
         * @param {type} text
         * @param {type} iconUrl
         * @param {type} iconPxWidth
         * @param {type} iconPxHeight
         * @param {type} styleObj
         * @returns {undefined}
         */
        MenuItem: function (text, iconUrl, iconPxWidth, iconPxHeight, styleObj) {
            return new MenuItem(text, iconUrl, iconPxWidth, iconPxHeight, styleObj);
        }
    }
});

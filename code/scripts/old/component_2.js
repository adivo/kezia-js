define(["common", "tags"], function (Common, Tags) {
    //var kezia = new function () {
    return {
        iterator: 100,
        attachComponents: [],
        /* Used to store the id of the one and only overlay */
        modalOverlayId: '',
        /* Used to store the id of the dialog attached on top of the overlay */
        modalDialogId: '',
        registerComponentForAttaching : function (component) {
            this.attachComponents[this.attachComponents.length] = component;
            this.logDebug("registerComponentForAttaching of component id=" + component.id + this.valueOnCheck(component.name, ' name=' + component.name, ''));
        },
        attachRegisteredComponents = function () {
            for (i = 0; i < attachComponents.length; i++) {
                attachComponents[i].isAttached = true;
                attachComponents[i].onAttached();
            }
            attachComponents = [];
        },
        renderComponents = function (elementId, component) {
            var element = document.getElementById(elementId);
            if (Common.isDef(element)) {
                element.innerHTML = component.render('top:0;left:0;bottom:0;right:0');
                this.attachRegisteredComponents();
            }

        },
        StyleObj = Class.extend({
            borderStyleProperty: '',
            backgroundStyleProperty: '',
            borderRadiusStyleProperty: '',
            additionalClass: '',
            height: ''
        }),
        Component = Class.extend({
            init: function (cssClass, styleObj) {
                this.cssClass = cssClass;
                this.id = 'I' + this.iterator++;

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
            render: function (positionStyles, componentInner) {
                this.logDebug("Render of component id=" + this.id + this.valueOnCheck(this.name, ' name=' + this.name, ''));
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
                } else if (!Common.isUndef(this.borderStyleClass)) {
                    //border div as border style class is set
                    componentInner = new Tags.Div(componentInner)
                            .id(this.id + '_b')
                            .addStyle('background', this.backgroundStyleProperty)
                            .addStyle('border-radius', this.borderRadiusStyleProperty)
                            .addClass(this.borderStyleClass).addClass(this.cssClass)
                            .render();
                    this.hasBorderBox = true;
                } else {
                    // no border defined, so set those attributes in position box
                    bg = this.backgroundStyleProperty;
                    // scroll = getScrollingStyle();
                    this.hasBorderBox = false;
                }
                //position box
                boxShadow = k.valueOnCheck(this.cssBoxShadowStyleProperty, 'box-shadow:' + this.cssBoxShadowStyleProperty, '');

                return new Tags.Div(componentInner).id(this.id + "_p")
                        .setName(this.name)
                        .addClass(this.additionalClass)
                        .addClass(Common.isDef(this.isInResponsiveContainer) ? 'rel' : this.getPositionCssClass())
                        .addClass(this.cssClass + "_")
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
                return (this.overflowVisible ? k.css.ABS_OVERFLOW_VISIBLE : k.css.ABS) + k.valueOrDefault(this.positionCssClass, '');
            }
        }),
        var Label =Component.extend({
            init: function (text, styleObj) {
                this._super('Label', styleObj);
                this.text = text;
                if (Common.isUndef(styleObj) || Common.isUndef(styleObj.borderStyleClass)) {
                    this.borderStyleClass = 'Label';
                }
            },
            onAttached: function () {
            },
            renderInner: function () {
                k.registerComponentForAttaching(this);
                return this.text;
            },
            withModel: function (htmlFile) {
                var self = this;
                k.asyncLoadHtml(htmlFile, function (xmlhttp) {
                    self.text = xmlhttp.responseText;
                    if (self.isAttached) {
                        document.getElementById(self.id + '_p').innerHTML = self.text;
                    }
                });
                return this;
            }
        }),
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
                k.registerComponentForAttaching(this);
                return '<button id="' + this.id + '_e">' + this.text + '</button>';
            }
        }),
        Image = Component.extend({
            init: function (url, styleObj) {
                this._super('Image', styleObj);
                this.url = url;
            },
            onAttached: function () {
            },
            renderInner: function () {
                return '<img src="' + this.url + '" alt="' + k.valueOrDefault(this.alt, 'define alt for url ' + this.url) + '"\>';
            }
        }),
        BaseEditor = Component.extend({
            init: function (cssClass, styleObj) {
                this._super(cssClass, styleObj);
            },
        }),
        Input = BaseEditor.extend({
            init: function (styleObj) {
                this._super('Input', styleObj);
            },
            onAttached: function () {

                var element = document.getElementById(this.id + '_input');
                var coord = k.getScreenCoordinates(element);
                k.logDebug('Input.onAttached, input.x=' + coord.x + ' input.y=' + coord.y);
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
                k.registerComponentForAttaching(this);
                var userFeedback = new Tags.Div('').id(this.id + '_uf').addClass('input_uf').render();
                return '<input id="' + this.id + '_input" value="Enter your name"></input>' + userFeedback;
            }
        }),
        BaseLayout = Component.extend({
            init: function (cssClass, styleObj) {
                this._super(cssClass, styleObj);
                this.components = [];
                this.componentsLayoutData = [];
            },
            onAttached: function () {
                k.logInfo("OnAttached of component id=" + this.id + k.valueOnCheck(this.name, ' name=' + this.name, ''));
                var el = document.getElementById(this.id + '_p');
                if (Common.isDef(el)) {
                    k.logDebug("OnAttached of component id=" + this.id + k.valueOnCheck(this.name, ' name=' + this.name, ''));
                    k.logDebug("OnAttached of component id=" + this.id + k.valueOnCheck(this.name, ' name=' + this.name, '') +
                            ' on attached width=' + el.clientWidth + ' height=' + el.offsetHeight);
                }
                var el = document.getElementById(this.id + '_p');
                if (Common.isDef(el)) {
                    k.logDebug("OnAttached of component id=" + this.id + k.valueOnCheck(this.name, ' name=' + this.name, ''));
                    k.logDebug("OnAttached of component id=" + this.id + k.valueOnCheck(this.name, ' name=' + this.name, '') +
                            ' on attached width=' + el.clientWidth + ' height=' + el.offsetHeight);

                }
                var width = k.valueOrDefault(el.clientWidth, this.width);
                var height = k.valueOrDefault(el.clientHeight, this.height);
                var html = this.renderInnerOnAttached(width, height);
                el.innerHTML = html;

                /*
                 k.logDebug('onAttached on ' + this.cssClass + ' and all its components');
                 for (var i = 0; i < this.components.length; i++) {
                 var com = this.components[i];
                 k.logDebug('  - onAttached ' + com.cssClass);
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
                    widgetPosition = k.WidgetPosition.fill;
                }
                this.componentsLayoutData[this.componentsLayoutData.length] = new k.LaneLayoutData(slotSize, widgetPosition, slotBgStyle);
            },
            renderInner: function () {
                k.registerComponentForAttaching(this);
                k.logDebug("renderInner of component id=" + this.id + k.valueOnCheck(this.name, ' name=' + this.name, ''));
                return 'rendering on attached';
            },
            renderInnerOnAttached: function (width, height) {
                var html = '';
                var slotPos = 0;
                var i = 0;
                for (i = 0; i < this.components.length; i++) {
                    var layoutData = this.componentsLayoutData[i];
                    var component = this.components[i];

                    var wPos = layoutData.widgetPosition;
                    if (!k.isArray(wPos)) {
                        wPos = k.WidgetPosition.fill;
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
                            posStyle += 'left:0;width:' + w + 'px';
                            break;
                        case 'center':
                            posStyle += 'margin-left:50%;left:-' + w / 2 + 'px;width:' + w + 'px';
                            break;
                        case 'right':
                            posStyle += 'right:0;width:' + w + 'px';
                            break;
                        default:
                            posStyle += 'left:0;right:0';
                    }
                    posStyle += ';';
                    var h = this.getHeight(component);
                    switch (vert) {
                        case 'top':
                            posStyle += 'top:0;height:' + h + 'px';
                            break;
                        case 'middle':
                            posStyle += 'margin-top:-' + h / 2 + 'px;top:50%;height:' + h + 'px';
                            break;
                        case 'bottom':
                            posStyle += 'bottom:0;height:' + h + 'px';
                            break;
                        default:
                            posStyle += 'top:0;bottom:0';
                    }

                    if (Common.isUndef(layoutData.slotSize)) {
                        layoutData.slotSize = Common.Defaults.slotWidth;
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
        }),
        RowLayout = BaseLayout.extend({
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
                    div.addStyle('bottom', 0);
                } else {
                    div.addStyle('height', slotSize + 'px');
                }
            }
        }),
        ColLayout = BaseLayout.extend({
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
        }),
//                ColLayout = BaseLayout.extend({
//                    init: function (styleObj) {
//                        this._super('ColLayout', styleObj);
//                    },
//                    addSlotClassAndStyles: function (div, slotPos, slotSize, isLastLane, slotInd) {
//                        div.addClass(Common.css.FILL_VERTICALLY)
//                                .addStyle('left', slotPos + 'px');
//                        if (Common.isDef(this.autoSizeLaneEnabled) && isLastLane) {
//                            div.addStyle('right', 0);
//                        } else {
//                            div.addStyle('width', slotSize + 'px');
//                        }
//                    }
//                }),
        ResponsiveColLayout = BaseLayout.extend({
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
//            k.logInfo('ResponsiveColLayout resized');
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
                Common.registerComponentForAttaching(this);
                return this.renderInnerOnAttached();
            },
            addSlotClassAndStyles: function (div, slotPos, slotSize, isLastLane, slotInd) {
                div.addClass(Common.css.FILL_VERTICALLY)
                        .id(this.components[slotInd].id + '_c')
                        .addStyle('position', 'relative')
                        .addStyle('float', 'left');
//        if ( Common.isDef(this.autoSizeLaneEnabled) && isLastLane) {
//            div.addStyle('right', 0);
//        } else {
                div.addStyle('width', 100 / this.components.length + '%');
//                .addStyle('max-width', '600px');
//        }
            },
        }),
        Dialog = RowLayout.extend({
            width: 400,
            height: 300,
            closeBtn: new Button('close'),
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
                Common.modalOverlayId = this.id + '_overlay';
                Common.modalDialogId = this.id + '_panel';

                var overlay = document.createElement('div');
                overlay.className = Common.css.MODAL_OVERLAY;
                overlay.id = Common.modalOverlayId;
                document.body.appendChild(overlay);

                var modalDialog = document.createElement('div');
                modalDialog.id = Common.modalDialogId;
                modalDialog.className = Common.css.ABS;
                modalDialog.style.marginTop = -(this.height) / 2 + 'px';
                modalDialog.style.marginLeft = -(this.width / 2) + 'px';
                modalDialog.style.left = '50%';
                modalDialog.style.width = this.width + 'px';
                modalDialog.style.top = '50%';
                modalDialog.style.height = this.height + 'px';
                document.body.appendChild(modalDialog);

                //          modalDialog.style = 'top:50%;margin-top:-' + halfHeight + ';margin-left:-' + halfWidth + ';left:50%;width:' + this.width + 'px;height:' + this.height + 'px';
                Common.renderComponents(Common.modalDialogId, this);
                this.closeBtn.addListener(this.close);
                Common.logDebug('window.innerWidth=' + window.innerWidth / 2);
            },
            close: function () {
                var dialogEl = document.getElementById(Common.modalDialogId);
                document.body.removeChild(dialogEl);
                var overlayEl = document.getElementById(Common.modalOverlayId);
                document.body.removeChild(overlayEl);
            }
        }),
        LayoutData = Class.extend({
            init: function () {
            }
        }),
        /*
         * Creates a LaneLayoutData object whith the given size
         */
        LaneLayoutData = LayoutData.extend({
            /*
             * Creates a LaneLayoutData object whith the given size
             * @param {int} size - the size
             */
            init: function (slotSize, widgetPosition, slotBgStyle) {
                this.slotSize = slotSize;
                this.widgetPosition = widgetPosition;
                this.slotBgStyle = slotBgStyle;
            }
        }),
        DragSource = Class.extend({
            init: function (component) {
                this.component = component;
                component.registerDragHandler(dragHandler);
            },
            dragHandler: function () {
                Common.logDebug('initiate drag and drop');
            }

        })
    };
//    return kezia;
});

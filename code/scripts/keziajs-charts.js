/*eslint-env node, amd, browser*/
define(["class_require-mod", "common", "tags", "keziajs"], function (OO, Common, Tags, K) {
    //Define module private variables on the private object (which is not exported)
    var pr = {};
    pr.direction = {
        TL_BR: 'TL_BR'
    }

    /**
     * 
     * @param {type} id
     * @param {type} startColor
     * @param {type} stopColor
     * @param {type} direction 
     * @param {type} spreadMethod This value defines how the gradient is spread out through the shape. 
     * There are 3 possible values: pad, repeat, and reflect. 
     * 'pad' means that the first/last color of the gradient is padded (spread out) before and after the gradient. 
     * 'repeat' means that the gradient is repeated throughout the shape. 
     * 'reflect' means that gradient is mirrored in the shape. The spread method is only relevant if the gradient does not fill out the shape completely (see offset attributes of the <stop> elements).
     * @returns {String}
     */
    pr.linearGradient = function (id, startColor, stopColor, direction, spreadMethod) {
        var dir = '';
        if (direction === 'TL_BR') {
            dir = 'x1="0%" y1="0%" x2="100%" y2="100%" ';
        } else if (direction === 'TB') {
            dir = 'x1="0%" y1="0%" x2="0%" y2="100%" ';
        }
        return '<linearGradient id="' + id + '" ' + dir
                //                + 'x1="0%" y1="0%" '
                //                + 'x2="0%" y2="100%" '
                +
                'spreadMethod="' + spreadMethod + '"> ' + '<stop offset="0%"   stop-color="' + startColor + '" stop-opacity="1"/> ' + '<stop offset="100%" stop-color="' + stopColor + '" stop-opacity="1"/> ' + '</linearGradient>';
    };
    pr.line = function (cs, x1, y1, x2, y2, styles) {
        return '<line ' + 'x1="' + cs.x(x1) + '" ' + 'y1="' + cs.y(y1) + '" ' + 'x2="' + cs.x(x2) + '" ' + 'y2="' + cs.y(y2) + '" style="' + styles + '"/>';
    };

    /**
     * Draws a rectancle using the given Coordinate System object (cs). The coordinate system changes the direction of the
     * y-axis to bottom to top. The rectangles origin is in the bottom, left corner (except that the height property is negative). 
     * @param {type} cs
     * @param {type} id
     * @param {type} x
     * @param {type} y
     * @param {type} width
     * @param {type} height
     * @param {type} rx rounded corner 
     * @param {type} ry rounded corner
     * @param {type} inner
     * @param {type} styleOptions. All SVG rect styles are supported: stroke,stroke-width,fill (bg color - none can be used too),
     *                             stroke-dasharray (e.g. 10 5),fill-opacity,stroke-opacity 
     *                             The styleOptions will not be checked though.
     * @returns {String}
     */
    pr.renderRect = function (cs, id, x, y, width, height, rx, ry, inner, styleOptions) {
        var styles = renderStyleObj(styleOptions);
        if (height < 0) {
            return '<rect id="' + id + '" ' + 'x="' + cs.x(x) + '" ' + 'y="' + (cs.y(y) + height) + '" '
                    + 'width="' + width + '" ' + 'height="' + (-height) + '" ' + styles
                    + 'rx="' + rx + '" ry="' + ry + '">' + inner + '</rect>';
        }
        return '<rect id="' + id + '" ' + 'x="' + cs.x(x) + '" ' + 'y="' + cs.y(y) + '" ' + 'width="' + width + '" '
                + 'height="' + height + '" '
                + styles + 'rx="' + rx + '" ry="' + ry + '">' + inner + '</rect>';
    };
    pr.Rect = function (cs, id, x, y, width, height, inner, options) {
        options = Common.valueOrDefault(options, {});
        var withHeightAnim = function (fromHeight, toHeight) {
            this.fromHeight = cs.height(fromHeight);
            this.toHeight = cs.height(toHeight);
            return this;
        };
        var withWidthAnim = function (fromWidth, toWidth) {
            this.fromWidth = cs.width(fromWidth);
            this.toWidth = cs.width(toWidth);
            return this;
        };
        var render = function () {

            var fill = 'fill:' + Common.valueOrDefault(options.bgColor, '#a0a0a0');
            var strokeWidth = Common.isDef(options.strokeWidth) ? 'stroke-width:' + options.strokeWidth : '';
            var strokeColor = Common.isDef(options.strokeColor) ? 'stroke:' + options.strokeColor : '';
            var opacity = Common.isDef(options.opacity) ? 'opacity:' + options.opacity : '';
            var fillOpacity = Common.isDef(options.fillOpacity) ? 'fill-opacity:' + options.fillOpacity : '';
            var strokeOpacity = Common.isDef(options.strokeOpacity) ? 'stroke-opacity:' + options.strokeOpacity : '';

            var styles = renderStyles([fill, strokeWidth, strokeColor, opacity, strokeOpacity, fillOpacity]);

            var rx = Common.isDef(options.rx) ? 'rx="' + options.rx + '" ' : '';
            var ry = Common.isDef(options.ry) ? 'ry="' + options.ry + '" ' : '';

            //console.info(styles);
            var calculatedY = height >= 0 ? cs.y(y) - cs.height(height) : cs.y(y);
            return '<rect id="' + id + '" ' + 'x="' + cs.x(x) + '" ' + 'y="' + calculatedY + '" ' + rx + ry
                    + 'width="' + cs.width(width) + '" ' + 'height="' + Math.abs(cs.height(height)) + '"'
                    + styles
                    + '>'
                    + inner + '</rect>';

        };
        var animate = function (progress) {
            if (Common.isDef(this.fromHeight) && Common.isDef(this.toHeight)) {
                animateHeight(this.fromHeight, this.toHeight, progress);
            }
            if (Common.isDef(this.fromWidth) && Common.isDef(this.toWidth)) {
                animateWidth(this.fromWidth, this.toWidth, progress);
            }
        };
        var animateWidth = function (fromWidth, toWidth, progress) {

            var el = document.getElementById(id);
            var newWidth = (toWidth - fromWidth) * progress + fromWidth;
            if (newWidth >= 0) {//positive width means the rect origin is in the bottom left corner 
                el.setAttribute('x', cs.x(x));
            } else {
                //negative width means the rect origin is in the bottom right corner. To draw
                // we need to calculate the bottom left corner
                el.setAttribute('x', cs.x(x) - newWidth);
            }
            el.setAttribute('width', Math.abs(newWidth));
        };
        var animateHeight = function (fromHeight, toHeight, progress) {

            var el = document.getElementById(id);
            var newHeight = (toHeight - fromHeight) * progress + fromHeight;
            if (newHeight >= 0) {//positive height means the rect origin is in the bottom left corner and to draw this we must exchange height and y
                el.setAttribute('y', cs.y(y) - newHeight);

            } else { //negative height means the rect origin is in the top left corner
                el.setAttribute('y', cs.y(y));
            }
            el.setAttribute('height', Math.abs(newHeight));
        };
        return {render: render,
            animate: animate,
            withWidthAnim: withWidthAnim,
            withHeightAnim: withHeightAnim,
            animateHeight: animateHeight};
    };
    pr.text = function (cs, x, y, attributes, text, options) {
        if (Common.isUndef(options)) {
            options = {};
        }
        return '<text ' + attributes + 'x="' + cs.x(x) + '" ' + 'y="' + cs.y(y) + '"' + (Common.isDef(options['text-anchor']) ? 'text-anchor="' + options['text-anchor'] + '" ' : '') + '>' + text + '</text>';
    };
    pr.verticalText = function (cs, x, y, attributes, text) {
        return '<text ' + attributes + 'transform="rotate(270,' + cs.x(x) + ',' + cs.y(y) + ')"' + 'x="' + cs.x(x) + '" ' + 'y="' + cs.y(y) + '">' + text + '</text>'
    };
    /**
     * Creates a rectancle resizing from 0 height to target height. DOES NOT WORK until at least IE 11
     * @param {type} x
     * @param {type} y
     * @param {type} width
     * @param {type} height
     * @param {type} id
     * @param {type} attributes
     * @param {type} inner
     * @returns {String}
     */
    pr.animatedRect = function (cs, x, y, width, height, id, attributes, inner) {
        var rectPoints = cs.x(x) + ',' + cs.y(y) + ' ' + cs.x(x + width) + ',' + cs.y(y) + ' ' + cs.x(x + width) + ',' + cs.y(y + height) + ' ' + cs.x(x) + ',' + cs.y(y + height);
        var rectMinPoints = cs.x(x) + ',' + cs.y(y) + ' ' + cs.x(x + width) + ',' + cs.y(y) + ' ' + cs.x(x + width) + ',' + cs.y(y) + ' ' + cs.x(x) + ',' + cs.y(y);

        return '<polygon id="' + id + '" ' + 'points="' + rectPoints + '" ' + attributes + '>' + '<animate attributeName="points" dur="500ms" from="' + rectMinPoints + '" to="' + rectPoints + '" />' + inner + '</polygon>';
        //+inner + '</rect>';
    };
    /**
     * 
     * @param {type} series
     * @param {type} seriesColors
     * @param {type} posX
     * @param {type} posY
     * @param {type} width
     * @param {type} options Property object with one ore more of the following properties:
     borderRadius: legend box border radius in px.
     color: font color of the legend texts
     bgColor: legend box background color
     borderColor: legend box border color
     legendFormat: one of m.LegendFormat {LEFT_ALIGNED: 'l',RIGHT_ALIGNED: 'r', CENTERED: 'c'}
     * @returns {keziajs-charts_L49.renderLegend.keziajs-chartsAnonym$4}
     */
    pr.renderLegend = function (cs, series, seriesColors, posX, posY, width, options) {
        var rowHeight = 18;
        var padding = 5;
        var charLen = 8;
        var legendIconWidth = 10;
        var legendBoxBorderRadius = Common.valueOrDefault(options.borderRadius, 0);
        var legendStyleOptions = {};
        legendStyleOptions.fill = Common.valueOrDefault(options.bgColor, 'white');
        if (Common.isDef(options.borderColor)) {
            legendStyleOptions['stroke-width'] = 0.1;
            legendStyleOptions.stroke = options.borderColor;
        }

        var fontColor = Common.valueOrDefault(options.color, 'black');
        var legendFormat = Common.valueOrDefault(options.legendFormat, m.LegendFormat.LEFT_ALIGNED);

        var code = '';
        var y;

        var seriesCount = Object.keys(series).length;
        if (legendFormat === m.LegendFormat.LEFT_ALIGNED || legendFormat === m.LegendFormat.RIGHT_ALIGNED) {
            code += pr.renderRect(cs, '', posX, posY, width, seriesCount * rowHeight + 2 * padding,
                    legendBoxBorderRadius, legendBoxBorderRadius, '', legendStyleOptions);

            y = posY - 5;
            for (var i = 0; i < seriesCount; i++) {
                var seriesColor = pr.renderRect(cs, '', posX + 5, y, 10, 10, 2, 2, '', {'stroke-width': 0, fill: seriesColors[i]});
                var seriesName = pr.text(cs, posX + 20, y - 10, '', series[i], 'style="font-family:Arial;font-size:12;fill:' + fontColor + ';text-anchor: middle"');
                code += seriesColor + seriesName;
                y -= rowHeight;
            }
        }
        if (legendFormat === m.LegendFormat.CENTERED) {

            var itemX = [];//rows contains an array for each row with x positions of the items
            itemX[0] = [];
            var rowWidth = [];

            var row = 0, col = 0, x = 0;
            for (var i = 0; i < seriesCount; i++) {
                var seriesWidth = legendIconWidth + 5 + series[i].length * charLen;
                if (x + seriesWidth > (width - 2 * padding)) {
                    row++;
                    col = 0, x = 0;
                    itemX[row] = [];
                }
                rowWidth[row] = x + seriesWidth;
                itemX[row][col++] = x;
                x += seriesWidth;
            }

            code += pr.renderRect(cs, '', posX, posY, width, rowWidth.length * rowHeight + padding,
                    legendBoxBorderRadius, legendBoxBorderRadius, '', legendStyleOptions);

            var i = 0;
            y = posY - padding;
            for (var row = 0; row < rowWidth.length; row++) {
                var xPad = posX + (width - rowWidth[row]) / 2;
                for (var col = 0; col < itemX[row].length; col++) {
                    var x = xPad + itemX[row][col];
                    var seriesColor = pr.renderRect(cs, '', x, y, 10, 10, 2, 2, '', {'stroke-width': 0, fill: seriesColors[i]});
                    var seriesName = pr.text(cs, x + 15, y - 10, 'style="font-family:Arial;font-size:12;fill:' + fontColor + '"', series[i]);
                    code += seriesColor + seriesName;
                    i++;
                }
                y -= rowHeight;
            }
        }
        var legendHeight = -y + rowHeight;
        return {svgCode: code, legendHeight: legendHeight};
    };
    var sortObjectProperties = function (object) {
        var keysSorted = Object.keys(object).sort();
        console.log(keysSorted);
    };
    var sortObjectKeysByPropertyValues = function (object) {
        var keysSorted = Object.keys(object).sort(function (a, b) {
            return object[a] - object[b]
        })
        console.log(keysSorted);
    };
    pr.CoordinateSystem = function (originX, originY, scaleX, scaleY) {

        var x = function (x) {
            return originX + x * scaleX;
        };
        var y = function (y) {
            return originY - y * scaleY;
        };
        var width = function (widthParam) {
            return widthParam * scaleX;
        };
        var height = function (heightParam) {
            return heightParam * scaleY;
        };
        return {x: x, y: y, width: width, height: height};
    };
    //Object to be exported. Define any public object and functions on this object.  
    var m = {};
    m.LegendPosition = {
        LEFT: 'l',
        RIGHT: 'r',
        TOP: 't',
        BOTTOM: 'b',
        FREE_POSITIONNED: 'f'
    };

    m.LegendFormat = {
        LEFT_ALIGNED: 'l',
        RIGHT_ALIGNED: 'r',
        CENTERED: 'c'
    }
    m.Gradients = {
        LINEAR_GRAY: '<linearGradient id="LINEAR_GRAY" ' + 'x1="0%" y1="0%" ' + 'x2="0%" y2="100%" ' + 'spreadMethod="pad"> ' + '<stop offset="0%"   stop-color="#a0a0a0" stop-opacity="1"/> ' + '<stop offset="100%" stop-color="black" stop-opacity="1"/> ' + '</linearGradient>',
        LINEAR_LIGHT_GRAY: '<linearGradient id="LINEAR_LIGHT_GRAY" ' + 'x1="0%" y1="0%" ' + 'x2="0%" y2="100%" ' + 'spreadMethod="pad"> ' + '<stop offset="0%"   stop-color="white" stop-opacity="1"/> ' + '<stop offset="100%" stop-color="#f0f0f0" stop-opacity="1"/> ' + '</linearGradient>',
    }
    m.ColorSchemes = {
        BLUE_MONOCHROME: ['#00157F', '#4C6AFF', '#002AFF', '#26357F', '#0021CC'],
        SPRING: ['#B2B198', '#52D4FF', '#FFEE00', '#CC2550', '#B26478', '#6141A6', '#FFFE1E', '#C2CD05', '#6A883C', '#FE7674'],
        SPRING_GRADIENT: ['url(#LINEAR_GRAY)', 'url(#LINEAR_LIGHT_GRAY)', '#B2B198', '#52D4FF', '#FFEE00', '#CC2550']
    };
    /**
     * 
     * @param {type} id
     * @param {type} startColor
     * @param {type} stopColor
     * @param {type} direction 
     * @param {type} spreadMethod This value defines how the gradient is spread out through the shape. 
     * There are 3 possible values: pad, repeat, and reflect. 
     * 'pad' means that the first/last color of the gradient is padded (spread out) before and after the gradient. 
     * 'repeat' means that the gradient is repeated throughout the shape. 
     * 'reflect' means that gradient is mirrored in the shape. The spread method is only relevant if the gradient does not fill out the shape completely (see offset attributes of the <stop> elements).
     * @returns {String}
     */

    /**
     * x1,y1,x2,y2 are the start and the end position of the gradients line in percentage. Please omit the percentage sign.
     */
    m.LinearGradient = function (id, x1, y1, x2, y2) {
        this.colorStops = {};
        this.id = id;
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.spreadMethod = 'pad';
        this.addColorStop = function (stopOffset, stopColor, stopOpacity) {
            this.colorStops[Object.keys(this.colorStops).length] = {
                offset: stopOffset,
                color: stopColor,
                opacity: stopOpacity
            };
        },
                this.render = function () {
                    var grad = '<linearGradient id="' + this.id + '" ' + 'x1="' + this.x1 + '%" y1="' + this.y1 + '%" ' + 'x2="' + this.x2 + '%" y2="' + this.y2 + '%" ' + 'spreadMethod="' + this.spreadMethod + '"> ';
                    for (var colorStopKey in this.colorStops) {
                        var colorStop = this.colorStops[colorStopKey];
                        grad += '<stop offset="' + colorStop['offset'] + '%"   stop-color="' + colorStop['color'] + '" stop-opacity="' + colorStop['opacity'] + '"/> '
                    }
                    grad += '</linearGradient>';
                    return grad;
                }
    };

    /**
     * Helper method to append each array element of the styles parameter. The method appends each non-empty style and separates with ;
     * @param {type} styles e.g. ['fill:#a0a0a0','stroke-width:0.1']
     * @returns {String}
     */
    var renderStyles = function (styles) {
        var rendered = '';
        if (Common.isDef(styles)) {
            for (var i = 0; i < styles.length; i++) {
                var style = styles[i];
                if (style !== '') {
                    if (rendered.length > 0) {
                        rendered += ';';
                    }
                    rendered += style;
                }
            }
        }
        if (rendered.length > 0) {
            rendered = ' style="' + rendered + '"';
        }
        return rendered;
    };
    /**
     * Helper method to append each object property of the styles parameter. The method appends each key/value pair as [key]:[value] and separates with ;
     * @param {type} styles e.g. {fill:#a0a0a0','stroke-width':'0.1'}
     * @returns {String}
     */
    var renderStyleObj = function (styles) {
        var rendered = '';
        if (Common.isDef(styles)) {
            var keys = Object.keys(styles);
            for (var i = 0; i < keys.length; i++) {
                var style = styles[keys[i]];
                if (style !== '') {
                    if (rendered.length > 0) {
                        rendered += ';';
                    }
                    rendered += keys[i] + ':' + styles[keys[i]];
                }
            }
        }
        if (rendered.length > 0) {
            rendered = ' style="' + rendered + '"';
        }
        return rendered;
    }
    /**
     * Transforms a star-like data array into a cross table which is organized as array of dimensions and containing the series values.
     * @param {type} dataRows array  of arrays. Inner arrays are dimensions and facts, e.g.  ['1800', 'Africa', '50']
     * @param {type} indices: JSON object with the following mandatory options:<br>
     *                        dimensionInd: The index of the dimension column within the data array to use for the transformation
     *                        seriesInd The index of the series column within the data array to use as series
     *                        factInd The index of the fact column within the data array to use as fact.
     * @returns the ChartModel whereas the cross table model is accessible as property model and the maxValue property returns the largest value
     */
    m.ChartModel = function (dataRows, indices) {
        var dimensionInd = Common.valueOrDefault(indices['dimensionInd'], 0);
        var seriesInd = Common.valueOrDefault(indices['seriesInd'], 1);
        var factInd = Common.valueOrDefault(indices['factInd'], 2);

        var model = {}, seriesList = {};
        var maxValue = 0, minValue = 0;

        for (var i = 0; i < dataRows.length; i++) {
            var data = dataRows[i];

            var dimension = data[dimensionInd];
            var series = data[seriesInd];

            seriesList[series] = series;

            // add the fact of the data to the fact stored in the cross table model
            var dimFacts = Common.valueOrDefault(model[dimension], {});
            var fact = Number(Common.valueOrDefault(dimFacts[series], 0)) + Number(data[factInd]);
            dimFacts[series] = fact;
            model[dimension] = dimFacts;

            // calculate min and max value on the fly
            if (fact > maxValue) {
                maxValue = fact;
            }
            if (fact < minValue) {
                minValue = fact;
            }
        }

        //add missing series
        for (var key in model) {
            var modelItem = model[key];
            for (var serie in seriesList) {
                if (Common.isUndef(modelItem[serie])) {
                    modelItem[serie] = 0;
                }
            }
        }

        return {
            model: model,
            maxValue: maxValue,
            minValue: minValue,
            seriesItems: Object.keys(seriesList)
        };
    };


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
    m.SuperChart = K.Component.extend(new function () {
        //m.SuperChart=K.extend({
        //          
        /**
         * The following properties can be set:<br>
         * width: the width of the component in pixels<br>
         * height: the height of the component in pixels<br>
         * template: <br>
         * headerTemplate:<br>
         * 
         * @param {type} options
         * @returns {undefined}
         */
        this.init = function (options) {
            this._super('Chart', options);

            this.height = 400;

//            this.rectToAnimateId = [];
//            this.rectToAnimateHeight = [];
//            this.rectToAnimateY;
            this.rects = [];
        };
        this.renderInner = function () {
            K.registerComponentForAttaching(this);
            return 'rendering';
        };
        /**
         * @name renderChart
         * @description description
         * @function
         * @param componentWidth
         * @param componentHeight
         * @returns returns
         */
        this.renderChart = function (componentWidth, componentHeight) {

            var modelObj = new m.ChartModel(this.model, {
                dimensionInd: 0,
                seriesInd: 1,
                factInd: 2
            });
            var modelItems = modelObj.model;
            var maxValue = modelObj.maxValue;

            var itemCount = Object.keys(modelItems).length;
            var series = modelObj.seriesItems;
            var seriesCount = Object.keys(modelObj.seriesItems).length;
            this.legendBgColor = Common.valueOrDefault(this.legendBgColor, '#f0f0f0');
            this.legendColor = Common.valueOrDefault(this.legendColor, 'black');
//          //this.legendBorderColor used too
            this.legendBoxBorderRadius = Common.valueOrDefault(this.legendBoxBorderRadius, 0);

            this.caption = Common.valueOrDefault(this.caption, {
                bgColor: '#f0f0f0',
                borderColor: 'black',
                color: 'black',
                borderRadius: 0,
                position: m.LegendPosition.TOP
            });

            this.padding = Common.valueOrDefault(this.padding, 5);
            this.spacing = Common.valueOrDefault(this.spacing, 5);
            this.yAxisLeftWidth = Common.valueOrDefault(this.yAxisLeftWidth, 50);
            this.yAxisRightWidth = Common.isDef(this.yAxisRightName) ? Common.valueOrDefault(this.yAxisRightWidth, 50) : 0;
            this.xAxisHeight = Common.valueOrDefault(this.rightPadding, 30);
            //this.areaBgImage can be used
            this.titleHeight = Common.isDef(this.title) ? Common.valueOrDefault(this.titleHeight, 25) : 0;
            this.subTitleHeight = Common.isDef(this.subTitle) ? Common.valueOrDefault(this.subTitleHeight, 20) : 0;
            this.legendPosition = Common.valueOrDefault(this.caption.position, m.LegendPosition.TOP);

            var cc = new pr.CoordinateSystem(0, componentHeight, 1, 1);
            //legend
            var seriesColors = m.ColorSchemes.SPRING;

            if (this.legendPosition === m.LegendPosition.RIGHT || this.legendPosition === m.LegendPosition.LEFT) {
                this.legendWidth = Common.valueOrDefault(this.legendWidth, 120);
            } else {
                this.legendWidth = componentWidth - 2 * this.padding - this.yAxisLeftWidth - this.spacing;
            }

            if (this.legendPosition === m.LegendPosition.RIGHT || this.legendPosition === m.LegendPosition.LEFT) {
                this.caption.legendFormat = m.LegendFormat.LEFT_ALIGNED;
            } else {
                this.caption.legendFormat = m.LegendFormat.CENTERED;
            }
            var legend = pr.renderLegend(cc, series, seriesColors, 0, 0, this.legendWidth, this.caption);
            this.legendHeight = legend.legendHeight;

            if (this.legendPosition === m.LegendPosition.RIGHT || this.legendPosition === m.LegendPosition.LEFT) {
                this.areaY = componentHeight - this.padding - this.xAxisHeight - this.spacing;
                this.areaWidth = componentWidth - this.padding - this.padding - this.legendWidth - this.yAxisLeftWidth - this.spacing - this.spacing;
                this.areaHeight = this.areaY - this.titleHeight - this.subTitleHeight - this.padding;

                this.legendY = this.areaY - this.spacing - this.padding;
            } else {
                this.areaX = this.padding + this.yAxisLeftWidth + this.spacing;
                this.areaWidth = componentWidth - this.padding - this.areaX;
                this.areaHeight = componentHeight - this.titleHeight - this.subTitleHeight - 2 * this.spacing - this.legendHeight - 2 * this.padding - this.xAxisHeight;
                this.legendX = this.areaX;//this.padding;
            }
            //this.areaX and this.areaY references the svg coordinate system whereas all other x and y coordinate are relative from the
            //new constructed coordinate system with origin areaX and areaY. The y axis is opposite to the direction of svg y axis, namely from bottom to top
            if (this.legendPosition === m.LegendPosition.LEFT) {
                this.areaX = this.padding + this.legendWidth + this.yAxisLeftWidth + this.spacing;
                this.legendX = this.padding;
            } else if (this.legendPosition === m.LegendPosition.RIGHT) {
                this.areaX = this.padding + this.yAxisLeftWidth + this.spacing;
                this.legendX = componentWidth - this.legendWidth - this.padding;
            } else if (this.legendPosition === m.LegendPosition.TOP) {
                this.areaY = componentHeight - this.padding - this.xAxisHeight - this.spacing;
                this.legendY = componentHeight - this.titleHeight - this.subTitleHeight - this.spacing;
            } else if (this.legendPosition === m.LegendPosition.BOTTOM) {
                this.areaY = componentHeight - 2 * this.padding - this.legendHeight - this.xAxisHeight - this.spacing;
                this.legendY = this.padding + this.legendHeight;
            }


            var slotWidth = Math.round(this.areaWidth / (itemCount * (series.length + 1)));
            var colWidth = Math.round(slotWidth * 0.75);
            var c = new pr.CoordinateSystem(this.areaX, this.areaY, 1, 1);

            this.rectToAnimateY = this.areaY;

            //Rendering
            var chart = '<svg width="100%" height="100%">';

            //Define gradients
            chart += '<defs>' + (Common.isDef(this.chartBgGradient) ? this.chartBgGradient.render() : '') + m.Gradients.LINEAR_GRAY + m.Gradients.LINEAR_LIGHT_GRAY + '</defs>';

            //Chart area
            this.chartBgColor = Common.valueOrDefault(this.chartBgColor, '#f0f0f0');
            chart += '<rect x="' + c.x(0) + '" y="' + c.y(this.areaHeight) + '" width="' + (this.areaWidth) + '" height="' + (this.areaHeight) + '" rx="02" ry="2"'
                    + ' style="fill:' + (Common.isUndef(this.chartBgGradient) ? this.chartBgColor : 'url(#' + this.chartBgGradient.id + ')') + ';'
                    + ' stroke: #a0a0a0;' + ' stroke-width: 0;" />';
            if (Common.isDef(this.areaBgImage)) {
                chart += '<image xlink:href="' + this.areaBgImage + '" x="' + c.x(0) + '" y="' + c.y(this.areaHeight) + '" height="' + this.areaHeight + 'px" width="' + this.areaWidth + 'px"/>';
            }

            var compCenterX = componentWidth / 2;
            chart += pr.text(cc, compCenterX, componentHeight - this.titleHeight / 2, 'style="text-anchor: middle"', this.title);
            chart += pr.text(cc, compCenterX, componentHeight - this.titleHeight - this.subTitleHeight / 2, 'style="font-size: 10px;text-anchor: middle"', this.subTitle);

            //Calculate rendering scale
            var scale = (this.areaHeight - 80) / (maxValue - modelObj.minValue);

            var valueRange = maxValue - modelObj.minValue;
            
            // render y-Axis with values
            this.yAxisStepCount = Common.valueOrDefault(this.yAxisStepCount, 5);
            var yAxisStep = Common.roundToNextPowerOf10(Math.round(valueRange / this.yAxisStepCount));
            var yAxisMinValuePx = modelObj.minValue * scale;
            var yAxisMaxValuePx = modelObj.maxValue * scale;

            var yAxisMinPx, yAxisMaxPx;//minimum and maximum to be displayed in pixel
            if (modelObj.minValue < 0) {
                yAxisMinPx = yAxisMinValuePx - 40;//space for figure
            } else {
                yAxisMinPx = yAxisMinValuePx;
            }
            yAxisMaxPx = yAxisMaxValuePx + 40;//space for figure

            var yAxisMinValue = Common.roundToNextPowerOf10(Math.round(modelObj.minValue / this.yAxisStepCount)) * this.yAxisStepCount;
            var yAxisMaxValue = Common.roundToNextPowerOf10(modelObj.maxValue);

            var chartCS = new pr.CoordinateSystem(this.areaX, this.areaY + yAxisMinPx, 1, scale);

            //render y-axis labels and horizontal lines
            for (var value = 0; value < yAxisMaxValue; value += yAxisStep) {
                chart += pr.line(chartCS, 0, value, this.areaWidth, value, 'stroke:#a0a0a0;stroke-width:0.05');
                chart += pr.text(chartCS, -5, value - 25, 'style="text-anchor: end"', value);
            }
            for (var value = -yAxisStep; value > (yAxisMinValue-25/scale); value -= yAxisStep) {
                chart += pr.line(chartCS, 0, value, this.areaWidth, value, 'stroke:#a0a0a0;stroke-width:0.05');
                chart += pr.text(chartCS, -5, value - 25, 'style="text-anchor: end"', value);
            }
            //draw columns
            var col = 0;
            var seriesItemNum = 0;
            var x = slotWidth / 2;
            for (var modelItemKey in modelItems) {

                var dimensionNameText = pr.text(c, x + slotWidth * series.length / 2, -15, 'style="writing-mode: bt;text-anchor: middle"', modelItemKey);
                chart += dimensionNameText;
                var seriesItemNum = 0;
                var modelItem = modelItems[modelItemKey];
                for (var serie in series) {
                    var value = modelItem[series[serie]];
                    var newColRect = new pr.Rect(chartCS, this.id + '_rect_' + col, x, 0, colWidth, 0,
                            '<title>' + dimensionNameText + ',' + series[serie] + '</title>', {
                        bgColor: m.ColorSchemes.SPRING[seriesItemNum],
                        strokeWidth: 0.2,
                        strokeColor: 'black',
                        fillOpacity: 0.6,
                        rx: 2,
                        ry: 2
                    });
                    newColRect.withHeightAnim(0, value);
                    this.rects[col] = newColRect;
                    var valueText = pr.verticalText(chartCS, x + slotWidth / 2 + 2, (value < 0 ? value - 35 / scale : value + 5 / scale), '', value.toFixed(0));

                    chart += newColRect.render() + valueText;

                    col++;
                    seriesItemNum++;
                    x += slotWidth;
                }
                x += slotWidth;
            }

            //X-Axis Title
            chart += pr.text(c, this.areaWidth / 2, -this.xAxisHeight - 5, 'style="text-anchor: middle"', this.dimensions[0]);
            //Y-Axis Title
            var legend = pr.renderLegend(cc, series, seriesColors, this.legendX, this.legendY, this.legendWidth, this.caption);
            chart += legend.svgCode;
            return chart + '</svg>';
        };
        this.onAttached = function () {
            var onMouseOver = function (e) {
                console.info('mouse over ' + e.currentTarget.id);
            };
            Common.logInfo('onAttached of ResponsiveColLayout');
            var element = document.getElementById(this.id + (this.hasBorderBox ? '_b' : '_p'));
            var self = this;
            K.addWindowResizeListener(function () {
                console.log('render chart ' + self.id + ' onResize ' + element.clientWidth + '/' + element.clientHeight);
                element.innerHTML = self.renderChart(element.clientWidth, element.clientHeight);
                //self.animate(self);
                Common.animateAll(2000, animationCompleted, self.rects);
            });
            element.innerHTML = self.renderChart(element.clientWidth, element.clientHeight);
            //self.animate(self);
            var animationCompleted = function () {
                console.info('animation completed');
            };
            Common.animateAll(2000, animationCompleted, self.rects);
        };


    });



    m.Tester = K.Component.extend(new function () {
        //          
        /**
         * The following properties can be set:<br>
         * width: the width of the component in pixels<br>
         * height: the height of the component in pixels<br>
         * template: <br>
         * headerTemplate:<br>
         * 
         * @param {type} options
         * @returns {undefined}
         */
        this.init = function (options) {
            this._super('Chart', options);

            this.height = 400;

        };
        this.renderInner = function () {
            K.registerComponentForAttaching(this);
            return 'rendering';
        };
        /**
         * @name renderChart
         * @description description
         * @function
         * @param componentWidth
         * @param componentHeight
         * @returns returns
         */
        this.renderChart = function (componentWidth, componentHeight) {
            var cs = new pr.CoordinateSystem(0, componentHeight, 1, 1);
            var chart = '<svg width="100%" height="100%">';
            chart += '<defs>' + m.Gradients.LINEAR_GRAY + m.Gradients.LINEAR_LIGHT_GRAY + '</defs>';

            var y = 100;
            this.rect1 = new pr.Rect(cs, 'id1', 20, y, 20, 0, '', {
                bgColor: 'green',
                strokeWidth: 0.2,
                strokeColor: 'black',
                fillOpacity: 0.5,
                rx: 2,
                ry: 2
            });
            this.rect1.withHeightAnim(0, 200).withWidthAnim(0, 20);
            this.rect2 = new pr.Rect(cs, 'id2', 40, y, 20, 0, '', {
                bgColor: 'url(#LINEAR_LIGHT_GRAY)',
                strokeWidth: 0.2,
                strokeColor: 'black'}).withHeightAnim(0, -100);
            this.rect3 = new pr.Rect(cs, 'id3', 70, y, 20, 100, '').withHeightAnim(100, 10);
            this.rect4 = new pr.Rect(cs, 'id4', 110, y, 20, -50, '', {bgColor: 'orange', ry: 50}).withHeightAnim(-50, -20);
            chart += this.rect1.render();
            chart += this.rect2.render();
            chart += this.rect3.render();
            chart += this.rect4.render();
            return chart + '</svg>';
        };
        this.onAttached = function () {
            Common.logInfo('onAttached of ResponsiveColLayout');
            var element = document.getElementById(this.id + (this.hasBorderBox ? '_b' : '_p'));
            var self = this;
            K.addWindowResizeListener(function () {
                console.log('render chart ' + self.id + ' onResize ' + element.clientWidth + '/' + element.clientHeight);
                element.innerHTML = self.renderChart(element.clientWidth, element.clientHeight);
                self.animate(self);
            });
            element.innerHTML = self.renderChart(element.clientWidth, element.clientHeight);
            self.animate(self);
        };
        this.animate = function (self) {
            var onComplete = function () {
                console.log('chain completed');
            };
            Common.animateChain(onComplete,
                    [
                        {duration: '500', objects: [this.rect1, this.rect2]},
                        {duration: '1500', objects: [this.rect3]},
                        {duration: '300', objects: [this.rect4]}
                    ]
                    );
//            var animationCompleted = function () {
//                console.info('animation completed');
//                var animationCompleted2 = function () {
//
//                };
//                Common.animateAll(2000, animationCompleted2, [self.rect3, self.rect4]);
//            };
            // Common.animateAll(1000, animationCompleted, [this.rect1, this.rect2]);
//            var onUpdate = function (progress) {
//                self.rect1.animateHeight(0, 100, progress);
//                self.rect2.animateHeight(0, -50, progress);
//                self.rect3.animateHeight(100, 0, progress);
//                self.rect4.animateHeight(-50, 0, progress);
//                self.rect1.updateHeight(progress);
//                self.rect2.updateHeight(progress);
//                self.rect3.updateHeight(progress);
//                self.rect4.updateHeight(progress);
        };

        //Common.animate(1000, onUpdate, animationCompleted);
//        };


    });
    return m;
});
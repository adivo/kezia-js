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
    var sortObjectProperties = function (object) {
        var keysSorted = Object.keys(object).sort();
        console.log(keysSorted);
    }
    var sortObjectKeysByPropertyValues = function (object) {
        var keysSorted = Object.keys(object).sort(function (a, b) {
            return object[a] - object[b]
        })
        console.log(keysSorted);
    }

    var Coord = OO.Class.extend(new function () {
        this.init = function (originX, originY) {
            this.originX = originX;
            this.originY = originY;
        };
        this.x = function (x) {
            return this.originX + x;
        };
        this.y = function (y) {
            return this.originY - y;
        };
        this.line = function (x1, y1, x2, y2, styles) {
            return '<line ' + 'x1="' + this.x(x1) + '" ' + 'y1="' + this.y(y1) + '" ' + 'x2="' + this.x(x2) + '" ' + 'y2="' + this.y(y2) + '" style="' + styles + '"/>';
        };

        /**
         * Draws a rect with from origin 
         * @param {type} x
         * @param {type} y
         * @param {type} width
         * @param {type} height
         * @param {type} rx
         * @param {type} ry
         * @param {type} id
         * @param {type} attributes
         * @param {type} inner
         * @returns {String}
         */
        this.rect = function (x, y, width, height, rx, ry, id, attributes, inner) {
            if (height < 0) {
                return '<rect id="' + id + '" ' + 'x="' + this.x(x) + '" ' + 'y="' + this.y(y) + height + '" ' + 'width="' + width + '" ' + 'height="' + (-height) + '" ' + attributes + 'rx="' + rx + '" ry="' + ry + '">' + inner + '</rect>';
            }
            return '<rect id="' + id + '" ' + 'x="' + this.x(x) + '" ' + 'y="' + this.y(y) + '" ' + 'width="' + width + '" ' + 'height="' + height + '" ' + attributes + 'rx="' + rx + '" ry="' + ry + '">' + inner + '</rect>';
        };
        /**
         * Creates a rectancle resizing from 0 height to target height.
         * @param {type} x
         * @param {type} y
         * @param {type} width
         * @param {type} height
         * @param {type} id
         * @param {type} attributes
         * @param {type} inner
         * @returns {String}
         */
        this.animatedRect = function (x, y, width, height, id, attributes, inner) {
            var rectPoints = this.x(x) + ',' + this.y(y) + ' ' + this.x(x + width) + ',' + this.y(y) + ' ' + this.x(x + width) + ',' + this.y(y + height) + ' ' + this.x(x) + ',' + this.y(y + height);
            var rectMinPoints = this.x(x) + ',' + this.y(y) + ' ' + this.x(x + width) + ',' + this.y(y) + ' ' + this.x(x + width) + ',' + this.y(y) + ' ' + this.x(x) + ',' + this.y(y);

            return '<polygon id="' + id + '" ' + 'points="' + rectPoints + '" ' + attributes + '>' + '<animate attributeName="points" dur="500ms" from="' + rectMinPoints + '" to="' + rectPoints + '" />' + inner + '</polygon>';
            //+inner + '</rect>';
        };/**
         * 
         * @param {type} x
         * @param {type} y
         * @param {type} attributes eg. style="font-family:Arial;font-size:12;fill:white"
         * @param {type} text
         * @param {type} options
         * @returns {String}
         */
        this.text = function (x, y, attributes, text, options) {
            if (Common.isUndef(options)) {
                options = {};
            }
            return '<text ' + attributes + 'x="' + this.x(x) + '" ' + 'y="' + this.y(y) + '"' + (Common.isDef(options['text-anchor']) ? 'text-anchor="' + options['text-anchor'] + '" ' : '') + '>' + text + '</text>';
        };
        this.verticalText = function (x, y, attributes, text) {
            return '<text ' + attributes + 'transform="rotate(270,' + this.x(x) + ',' + this.y(y) + ')"' + 'x="' + this.x(x) + '" ' + 'y="' + this.y(y) + '">' + text + '</text>'
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
        this.renderLegend = function (series, seriesColors, posX, posY, width, options) {
            var rowHeight = 18;
            var padding = 5;
            var charLen = 8;
            var legendIconWidth = 10;
            var legendBoxBorderRadius = Common.valueOrDefault(options.borderRadius, 0);
            var fontColor = Common.valueOrDefault(options.color, 'black');
            var legendBgColor = Common.valueOrDefault(options.bgColor, 'white');
            var legendBorder = Common.isUndef(options.borderColor) ? '' : ('stroke-width:0.1;stroke:' + options.borderColor);
            var legendFormat = Common.valueOrDefault(options.legendFormat, m.LegendFormat.LEFT_ALIGNED);

            var code = '';
            var y;

            var seriesCount = Object.keys(series).length;
            if (legendFormat === m.LegendFormat.LEFT_ALIGNED || legendFormat === m.LegendFormat.RIGHT_ALIGNED) {
                code += this.rect(posX, posY, width, seriesCount * rowHeight + 2 * padding, legendBoxBorderRadius, legendBoxBorderRadius,
                        '', 'style="fill: ' + legendBgColor + ';' + legendBorder + '"', '');

                y = posY - 5;
                for (var i = 0; i < seriesCount; i++) {
                    var seriesColor = this.rect(posX + 5, y, 10, 10, 2, 2, '', 'stroke-width="0" fill="' + seriesColors[i] + '" ', '');
                    var seriesName = this.text(posX + 20, y - 10, '', series[i], 'style="font-family:Arial;font-size:12;fill:' + fontColor + ';text-anchor: middle"');
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

                code += this.rect(posX, posY, width, rowWidth.length * rowHeight + padding, legendBoxBorderRadius, legendBoxBorderRadius, '',
                        'style="fill: ' + legendBgColor + ';' + legendBorder + '"', '');

                var i = 0;
                y = posY - padding;
                for (var row = 0; row < rowWidth.length; row++) {
                    var xPad = posX + (width - rowWidth[row]) / 2;
                    for (var col = 0; col < itemX[row].length; col++) {
                        var x = xPad + itemX[row][col];
                        var seriesColor = this.rect(x, y, 10, 10, 2, 2, '', 'stroke-width="0" fill="' + seriesColors[i] + '" ', '');
                        var seriesName = this.text(x + 15, y - 10, 'style="font-family:Arial;font-size:12;fill:' + fontColor + '"', series[i]);
                        code += seriesColor + seriesName;
                        i++;
                    }
                    y -= rowHeight;
                }
            }
            var legendHeight = -y + rowHeight;
            return {svgCode: code, legendHeight: legendHeight};
        };
    });
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
    m.CoordinateSystem = function (originX, originY) {
        //var originX = originX;
        //var originY = originY;

        var x = function (x) {
            return originX + x;
        };
        var y = function (y) {
            return originY - y;
        };
        return {x: x, y: y};
    };
    this.rect = function (x, y, width, height, rx, ry, id, attributes, inner) {
        if (height < 0) {
            return '<rect id="' + id + '" ' + 'x="' + this.x(x) + '" ' + 'y="' + this.y(y)
                    + height + '" ' + 'width="' + width + '" ' + 'height="' + (-height) + '" ' + attributes + 'rx="' + rx + '" ry="' + ry + '">' + inner + '</rect>';
        }
        return '<rect id="' + id + '" ' + 'x="' + this.x(x) + '" ' + 'y="' + this.y(y) + '" ' + 'width="' + width + '" ' + 'height="' + height + '" ' + attributes + 'rx="' + rx + '" ry="' + ry + '">' + inner + '</rect>';
    };
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
    }
    m.Rect = function (cs, id, x, y, width, height, inner, options) {
        options = Common.valueOrDefault(options, {});
        
        var withHeightAnim = function (fromHeight, toHeight) {
            this.fromHeight = fromHeight;
            this.toHeight = toHeight;
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

            console.info(styles);
            var y = height >= 0 ? cs.y(y) - height : cs.y(y);
            return '<rect id="' + id + '" ' + 'x="' + cs.x(x) + '" ' + 'y="' + y + '" ' + rx + ry
                    + 'width="' + width + '" ' + 'height="' + height + '"'
                    + styles
                    + '>'
                    + inner + '</rect>';

        };
        var updateHeight = function (progress) {
            animateHeight(this.fromHeight, this.toHeight, progress);
        }
        var animateHeight = function (fromHeight, toHeight, progress) {

            var el = document.getElementById(id);
            var newHeight = (toHeight - fromHeight) * progress + fromHeight;
            if (newHeight >= 0) {//positive height means the rect origin is in the bottom left corner and to draw this we must exchange height and y
                el.setAttribute('y', cs.y(y) - newHeight);
                el.setAttribute('height', newHeight);
            } else { //negative height means the rect origin is in the top left corner
                el.setAttribute('y', cs.y(y));
                el.setAttribute('height', -newHeight);
            }
        };
        return {render: render, withHeightAnim: withHeightAnim, animateHeight: animateHeight, updateHeight: updateHeight};
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

            this.rectToAnimateId = [];
            this.rectToAnimateHeight = [];
            this.rectToAnimateY;
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
            //var ccc = new pr.Coord1();

            //ccc.testFunct();
            var modelObj = new m.ChartModel(this.model, {
                dimensionInd: 0,
                seriesInd: 1,
                factInd: 2
            });
            var modelItems = modelObj.model;
            var maxValue = modelObj.maxValue;

            //Create an index of the dimensions
            var dimIndex = {};
            for (var di = 0; di < this.dimensions.length; di++) {
                dimIndex[this.dimensions[di]] = di;
            }
            var itemCount = Object.keys(modelItems).length;
            //            var series = ['Africa', 'Europe', 'Asia', 'America', 'Oceania'];
            //            var seriesCount = Object.keys(series).length;
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

            var cc = new Coord(0, componentHeight);
            //legend
            var seriesColors = m.ColorSchemes.SPRING;

            if (this.legendPosition === m.LegendPosition.RIGHT || this.legendPosition === m.LegendPosition.LEFT) {
                this.legendWidth = Common.valueOrDefault(this.legendWidth, 120);
            } else {
                this.legendWidth = componentWidth - 2 * this.padding - this.yAxisLeftWidth - this.spacing;
            }

            var legendFormat;
            if (this.legendPosition === m.LegendPosition.RIGHT || this.legendPosition === m.LegendPosition.LEFT) {
                this.caption.legendFormat = m.LegendFormat.LEFT_ALIGNED;
            } else {
                this.caption.legendFormat = m.LegendFormat.CENTERED;
            }
            var legend = cc.renderLegend(series, seriesColors, 0, 0, this.legendWidth, this.caption);
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
            var c = new Coord(this.areaX, this.areaY);
            this.rectToAnimateY = this.areaY;

            var chart = '<svg width="100%" height="100%">';
            chart += '<defs>' + (Common.isDef(this.chartBgGradient) ? this.chartBgGradient.render() : '') + m.Gradients.LINEAR_GRAY + m.Gradients.LINEAR_LIGHT_GRAY + '</defs>';
            //chart area
            this.chartBgColor = Common.valueOrDefault(this.chartBgColor, '#f0f0f0');
            chart += '<rect x="' + c.x(0) + '" y="' + c.y(this.areaHeight) + '" width="' + (this.areaWidth) + '" height="' + (this.areaHeight) + '" rx="02" ry="2"' + ' style="fill:' + (Common.isUndef(this.chartBgGradient) ? this.chartBgColor : 'url(#' + this.chartBgGradient.id + ')') + ';' + ' stroke: #a0a0a0;' + ' stroke-width: 0;" />';
            if (Common.isDef(this.areaBgImage)) {
                chart += '<image xlink:href="' + this.areaBgImage + '" x="' + c.x(0) + '" y="' + c.y(this.areaHeight) + '" height="' + this.areaHeight + 'px" width="' + this.areaWidth + 'px"/>';
            }

            var compCenterX = componentWidth / 2;
            chart += cc.text(compCenterX, componentHeight - this.titleHeight / 2, 'style="text-anchor: middle"', this.title);
            chart += cc.text(compCenterX, componentHeight - this.titleHeight - this.subTitleHeight / 2, 'style="font-size: 10px;text-anchor: middle"', this.subTitle);

            //calculate rendering scale
            var scale = (this.areaHeight - 60) / (maxValue - modelObj.minValue);
            var valueRange = maxValue - modelObj.minValue;
            // render y-Axis with values
            this.yAxisStepCount = Common.valueOrDefault(this.yAxisStepCount, 5);
            var yAxisStepInValueUnits = Common.roundToNextPowerOf10(Math.round(valueRange / this.yAxisStepCount));
            var yAxisStepInPx = yAxisStepInValueUnits * scale;
            var yAxisMinValue = Common.roundToNextPowerOf10(Math.round(modelObj.minValue / this.yAxisStepCount)) * this.yAxisStepCount;
            var yAxisMaxValue = Common.roundToNextPowerOf10(modelObj.maxValue);
            var yAxisValue = yAxisMinValue;
            var nextPowerOf10 = Common.nextPowerOf10(yAxisMaxValue - yAxisMinValue);
            var yAxisMajorStep = Math.pow(10, nextPowerOf10);
//            var yAxisMajorStep=Common.roundToNextPowerOf10((yAxisMaxValue-yAxisMinValue)/10);
            for (var y = 0; y < this.areaHeight; y += yAxisStepInPx) {
                chart += c.line(0, y, this.areaWidth, y, 'stroke:#a0a0a0;stroke-width:0.05');
//                chart += c.text(-5, y, 'style="text-anchor: end"', Math.round(y / scale));
                chart += c.text(-5, y, 'style="text-anchor: end"', yAxisValue);
                yAxisValue += yAxisMajorStep;
            }
            var yOffset = -yAxisMinValue * scale;
            //draw columns
            var col = 0;
            var seriesItemNum = 0;
            var x = slotWidth / 2;
            for (var modelItemKey in modelItems) {

                var dimensionNameText = c.text(x + slotWidth * series.length / 2, -15, 'style="writing-mode: bt;text-anchor: middle"', modelItemKey);
                chart += dimensionNameText;
                var seriesItemNum = 0;
                var modelItem = modelItems[modelItemKey];
                for (var serie in series) {
                    var value = modelItem[series[serie]];
                    var pxHeight = Math.round(value * scale);
                    this.rectToAnimateId[col] = this.id + 'rect_' + col;
                    console.log('registered rect with id ' + this.rectToAnimateId[col] + ' for animation');
                    this.rectToAnimateHeight[col] = pxHeight;
                    var colRect = c.rect(x, yOffset, colWidth, 0, 0, 0, this.id + 'rect_' + col,
                            'stroke-width="0" fill="' + m.ColorSchemes.SPRING[seriesItemNum] + '" ',
                            '<title>' + dimensionNameText + ',' + series[serie] + '</title>');
                    //                    var colRect = c.animatedRect(x, 0, colWidth, pxHeight, this.id + 'rect_' + col,
                    //                            'stroke-width="0" fill="' + m.ColorSchemes.SPRING[seriesItemNum] + '" ',
                    //                            '<title>' + dimensionNameText + ',' + series[serie] + '</title>');
                    //                   
                    // firstAggr[key] / maxValue * this.height;
                    //                    var valueText = c.text(x + slotWidth / 2 + 5, pxHeight + 30, 'style="writing-mode: tb;text-anchor: middle"', value.toFixed(2));
                    var valueText = c.verticalText(x + slotWidth / 2 + 2, pxHeight + 10, '', value.toFixed(0));

                    chart += colRect + valueText;
                    col++;
                    seriesItemNum++;
                    x += slotWidth;
                }
                x += slotWidth;
            }

            //X-Axis Title
            chart += c.text(this.areaWidth / 2, -this.xAxisHeight - 5, 'style="text-anchor: middle"', this.dimensions[0]);
            //Y-Axis Title
            //chart += c.

            var legend = cc.renderLegend(series, seriesColors, this.legendX, this.legendY, this.legendWidth, this.caption);
            chart += legend.svgCode;
            return chart + '</svg>';
        };
        this.onAttached = function () {
            console.log('Chart ' + this.id + ' onAttached this.rectToAnimateId[0]=' + this.rectToAnimateId[0]);
            var onMouseOver = function (e) {
                console.info('mouse over ' + e.currentTarget.id);
            };
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
            var onUpdate = function (progress) {
                if (self.rectToAnimateId.length > 0) {
                    //                console.log('Update elements '+self.rectToAnimateId[0]+' and followingly with progress='+progress);
                }
                for (var i = 0; i < self.rectToAnimateId.length; i++) {

                    var el = document.getElementById(self.rectToAnimateId[i]);
                    //                with polygon
                    //                var points = el.getAttribute('points').split(',').join(' ').trim().split(' ');
                    //                points[5] = Number(points[5]) - 20;
                    //                points[7] = Number(points[7]) - 20;

                    //with rect
                    var newHeight = self.rectToAnimateHeight[i] * progress;
                    el.setAttribute('y', self.rectToAnimateY - newHeight);

                    el.setAttribute('height', Math.abs(newHeight));
                    //                var pointsStr = '';
                    //                var j = 0;
                    //                while (j < points.length - 1) {
                    //                    pointsStr += points[j] + ',' + points[j + 1] + ' ';
                    //                    j += 2;
                    //                }
                    //                el.setAttribute('points', pointsStr);
                }
            };
            var animationCompleted = function () {
                console.info('animation completed');
            };
            Common.animate(1000, onUpdate, animationCompleted);
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
            var cs = new m.CoordinateSystem(0, componentHeight);
            var chart = '<svg width="100%" height="100%">';
            chart += '<defs>' +  m.Gradients.LINEAR_GRAY + m.Gradients.LINEAR_LIGHT_GRAY + '</defs>';
        
            var y = 100;
            this.rect1 = new m.Rect(cs, 'id1', 10, y, 20, 0, '', {
                bgColor: 'green',
                strokeWidth: 0.4,
                strokeColor: 'black',
                fillOpacity: 0.5,
                rx: 2,
                ry: 2
            })
                    .withHeightAnim(0, 200);
            this.rect2 = new m.Rect(cs, 'id2', 40, y, 20, 0, '',{bgColor: 'url(#LINEAR_LIGHT_GRAY)',strokeColor:'black'}).withHeightAnim(0, -100);
            this.rect3 = new m.Rect(cs, 'id3', 70, y, 20, 100, '').withHeightAnim(100, 10);
            this.rect4 = new m.Rect(cs, 'id4', 110, y, 20, -50, '', {bgColor: 'orange', ry: 50}).withHeightAnim(-50, 20);
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
            var onUpdate = function (progress) {
//                self.rect1.animateHeight(0, 100, progress);
//                self.rect2.animateHeight(0, -50, progress);
//                self.rect3.animateHeight(100, 0, progress);
//                self.rect4.animateHeight(-50, 0, progress);
                self.rect1.updateHeight(progress);
                self.rect2.updateHeight(progress);
                self.rect3.updateHeight(progress);
                self.rect4.updateHeight(progress);
            };
            var animationCompleted = function () {
                console.info('animation completed');
            };
            Common.animate(1000, onUpdate, animationCompleted);
        };


    });
    return m;
});
/*eslint-env node, amd, browser*/
define(["class_require-mod", "common", "tags", "keziajs"], function(OO, Common, Tags, K) {
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
    pr.linearGradient = function(id, startColor, stopColor, direction, spreadMethod) {
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
    var sortObjectProperties = function(object) {
        var keysSorted = Object.keys(object).sort();
        console.log(keysSorted);
    }
    var sortObjectKeysByPropertyValues = function(object) {
        var keysSorted = Object.keys(object).sort(function(a, b) {
            return object[a] - object[b]
        })
        console.log(keysSorted);
    }
    pr.Coord1 = function() {
        obj: OO.Class.extend({

        });
    }
    var Coord = OO.Class.extend(new function() {
        this.init = function(originX, originY) {
            this.originX = originX;
            this.originY = originY;
        };
        this.x = function(x) {
            return this.originX + x;
        };
        this.y = function(y) {
            return this.originY - y;
        };
        this.line = function(x1, y1, x2, y2, styles) {
            return '<line ' + 'x1="' + this.x(x1) + '" ' + 'y1="' + this.y(y1) + '" ' + 'x2="' + this.x(x2) + '" ' + 'y2="' + this.y(y2) + '" style="' + styles + '"/>';
        };
        /**
         * 
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
        this.rect = function(x, y, width, height, rx, ry, id, attributes, inner) {
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
        this.animatedRect = function(x, y, width, height, id, attributes, inner) {
            var rectPoints = this.x(x) + ',' + this.y(y) + ' ' + this.x(x + width) + ',' + this.y(y) + ' ' + this.x(x + width) + ',' + this.y(y + height) + ' ' + this.x(x) + ',' + this.y(y + height);
            var rectMinPoints = this.x(x) + ',' + this.y(y) + ' ' + this.x(x + width) + ',' + this.y(y) + ' ' + this.x(x + width) + ',' + this.y(y) + ' ' + this.x(x) + ',' + this.y(y);

            return '<polygon id="' + id + '" ' + 'points="' + rectPoints + '" ' + attributes + '>' + '<animate attributeName="points" dur="500ms" from="' + rectMinPoints + '" to="' + rectPoints + '" />' + inner + '</polygon>';
            //+inner + '</rect>';
        };
        this.text = function(x, y, attributes, text, options) {
            if (Common.isUndef(options)) {
                options = {};
            }
            return '<text ' + attributes + 'x="' + this.x(x) + '" ' + 'y="' + this.y(y) + '"' + (Common.isDef(options['text-anchor']) ? 'text-anchor="' + options['text-anchor'] + '" ' : '') + '>' + text + '</text>';
        };
        this.verticalText = function(x, y, attributes, text) {
            return '<text ' + attributes + 'transform="rotate(270,' + this.x(x) + ',' + this.y(y) + ')"' + 'x="' + this.x(x) + '" ' + 'y="' + this.y(y) + '">' + text + '</text>'
        };
        
        /**
	 * @name m.Legend
	 * @description description
	 * @function
	 * @param series
	 * @param seriesColors
	 * @param posX
	 * @param posY
	 * @param legendFormat see KeziaCharts.LegendFormat
	 * @returns returns
	 */
	this.renderLegend=function(series,seriesColors,posX,posY,legendFormat,legendBgColor){
		var code='';
            var seriesCount = Object.keys(series).length;
            code += this.rect(posX,posY, this.legendWidth, this.legendHeight, 5, 5, '', 'style="stroke:#e0e0e0; fill: ' + legendBgColor + '"', '');

            if (legendFormat === m.LegendFormat.LEFT_ALIGNED || legendFormat === m.LegendFormat.RIGHT_ALIGNED) {
                var y =posY - 5;

                for (var i = 0; i < seriesCount; i++) {
                    var seriesColor = this.rect(posX + 5, y, 10, 10, 2, 2, '',
                        'stroke-width="0" fill="' + seriesColors[i] + '" ', '');
                    var seriesName = this.text(posX + 20, y - 10, '', series[i]);
                    code += seriesColor + seriesName;
                    y -= 20;
                }
            } if (legendFormat===m.LegendFormat.CENTERED {
                var y = posY - 5;
                var x = posX + 5;
                for (var i = 0; i < seriesCount; i++) {
                    var seriesColor = this.rect(x, y, 10, 10, 2, 2, '',
                        'stroke-width="0" fill="' + seriesColors[i] + '" ', '');
                    var seriesName = text(x + 15, y - 10, '', series[i]);
                    code += seriesColor + seriesName;
                    x += widthOneItem;
                    if (x > (this.areaWidth - widthOneItem)) {
                        x = posX + 5;
                        y -= 20;
                    }
                }
            }
	}
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
    m.LegendFormat={
    	LEFT_ALIGNED:'l',
    	RIGHT_ALIGNED:'r',
    	CENTERED:'c'
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
    m.LinearGradient = function(id, x1, y1, x2, y2) {
        this.colorStops = {};
        this.id = id;
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.spreadMethod = 'pad';
        this.addColorStop = function(stopOffset, stopColor, stopOpacity) {
            this.colorStops[Object.keys(this.colorStops).length] = {
                offset: stopOffset,
                color: stopColor,
                opacity: stopOpacity
            };
        },
        this.render = function() {
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
     * Transforms a star-like data array into a cross table which is organized as array of dimensions and containing the series values.
     * @param {type} dataRows array  of arrays. Inner arrays are dimensions and facts, e.g.  ['1800', 'Africa', '50']
     * @param {type} indices: JSON object with the following mandatory options:<br>
     *                        dimensionInd: The index of the dimension column within the data array to use for the transformation
     *                        seriesInd The index of the series column within the data array to use as series
     *                        factInd The index of the fact column within the data array to use as fact.
     * @returns the ChartModel whereas the cross table model is accessible as property model and the maxValue property returns the largest value
     */
    m.ChartModel = function(dataRows, indices) {
        var dimensionInd = Common.valueOrDefault(indices['dimensionInd'], 0);
        var seriesInd = Common.valueOrDefault(indices['seriesInd'], 1);
        var factInd = Common.valueOrDefault(indices['factInd'], 2);

        var model = {};
        var maxValue = 0;

        var seriesList = {};

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

            // calculate the max value on the fly
            if (fact > maxValue) {
                maxValue = fact;
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
    m.SuperChart = K.Component.extend(new function() {
        //m.SuperChart=K.extend({
        //          
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
        this.init = function(styleObj) {
            this._super('Chart', styleObj);

            this.height = 400;

            this.rectToAnimateId = [];
            this.rectToAnimateHeight = [];
            this.rectToAnimateY;
        };
        this.renderInner = function() {
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
        this.renderChart = function(componentWidth, componentHeight) {
            //var ccc = new pr.Coord1();

            //ccc.testFunct();
            var modelObj = m.ChartModel(this.model, {
                dimensionInd: 0,
                seriesInd: 1,
                factInd: 2
            });
            //            var modelObj = new m.ChartModel(this.model, {dimensionInd: 0, seriesInd: 1, factInd: 2});
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


            this.padding = Common.valueOrDefault(this.padding, 5);
            this.spacing = Common.valueOrDefault(this.spacing, 5);
            this.yAxisLeftWidth = Common.valueOrDefault(this.yAxisLeftWidth, 50);
            this.yAxisRightWidth = Common.isDef(this.yAxisRightName) ? Common.valueOrDefault(this.yAxisRightWidth, 50) : 0;
            this.xAxisHeight = Common.valueOrDefault(this.rightPadding, 30);

            this.titleHeight = Common.isDef(this.title) ? Common.valueOrDefault(this.titleHeight, 25) : 0;
            this.subTitleHeight = Common.isDef(this.subTitle) ? Common.valueOrDefault(this.subTitleHeight, 20) : 0;
            var widthOneItem = 90;

            this.legendPosition = Common.valueOrDefault(this.legendPosition, m.LegendPosition.RIGHT);

            if (this.legendPosition === m.LegendPosition.RIGHT || this.legendPosition === m.LegendPosition.LEFT) {
                this.legendWidth = Common.valueOrDefault(this.legendWidth, 120);
                this.legendHeight = Common.valueOrDefault(this.legendHeight, 20 * seriesCount);
                this.areaY = componentHeight - this.padding - this.xAxisHeight - this.spacing;
                this.areaWidth = componentWidth - this.padding - this.padding - this.legendWidth - this.yAxisLeftWidth - this.spacing - this.spacing;
                this.areaHeight = this.areaY - this.titleHeight - this.subTitleHeight - this.padding;

                this.legendY = this.areaY - this.spacing - this.padding;
            } else {
                this.legendWidth = componentWidth - 2 * this.padding;
                this.legendHeight = Common.valueOrDefaultAtMax(this.legendHeight, (seriesCount / (componentWidth / widthOneItem)) * 40);

                this.areaX = this.padding + this.yAxisLeftWidth + this.spacing;
                this.areaWidth = componentWidth - this.padding - this.areaX;
                this.areaHeight = componentHeight - this.titleHeight - this.subTitleHeight - 2 * this.spacing - this.legendHeight - 2 * this.padding - this.xAxisHeight;
                this.legendX = this.padding;
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
            var cc = new Coord(0, componentHeight);
            var chart = '<svg width="100%" height="100%">';
            chart += '<defs>' + (Common.isDef(this.chartBgGradient) ? this.chartBgGradient.render() : '') + m.Gradients.LINEAR_GRAY + m.Gradients.LINEAR_LIGHT_GRAY + '</defs>';
            this.chartBgColor = Common.valueOrDefault(this.chartBgColor, '#f0f0f0');
            chart += '<rect x="' + c.x(0) + '" y="' + c.y(this.areaHeight) + '" width="' + (this.areaWidth) + '" height="' + (this.areaHeight) + '" rx="02" ry="2"' + ' style="fill:' + (Common.isUndef(this.chartBgGradient) ? this.chartBgColor : 'url(#' + this.chartBgGradient.id + ')') + ';' + ' stroke: #a0a0a0;' + ' stroke-width: 0;" />';
            var compCenterX = componentWidth / 2;
            chart += cc.text(compCenterX, componentHeight - this.titleHeight / 2, 'style="text-anchor: middle"', this.title);
            chart += cc.text(compCenterX, componentHeight - this.titleHeight - this.subTitleHeight / 2, 'style="font-size: 10px;text-anchor: middle"', this.subTitle);
            //calculate rendering scale
            var scale = (this.areaHeight - 60) / maxValue;

            // render y-Axis with values
            this.yAxisStepCount = Common.valueOrDefault(this.yAxisStepCount, 5);
            var yAxisStepInValueUnits = Common.roundToNextPowerOf10(Math.round(maxValue / this.yAxisStepCount));
            var yAxisStepInPx = yAxisStepInValueUnits * scale;
            for (var y = 0; y < this.areaHeight; y += yAxisStepInPx) {
                chart += c.line(0, y, this.areaWidth, y, 'stroke:#a0a0a0;stroke-width:0.05');
                chart += c.text(-5, y, 'style="text-anchor: end"', Math.round(y / scale));
            }

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
                    var colRect = c.rect(x, 0, colWidth, 0, 0, 0, this.id + 'rect_' + col,
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

            //legend
            var legend=m.renderLegend(series,seriesColors,this.legendX,this.legendY,legendFormat);
            var seriesCount = Object.keys(series).length;
            chart += cc.rect(this.legendX, this.legendY, this.legendWidth, this.legendHeight, 5, 5, '', 'style="stroke:#e0e0e0; fill: ' + this.legendBgColor + '"', '');

            if (this.legendPosition === m.LegendPosition.RIGHT || this.legendPosition === m.LegendPosition.LEFT) {
                var y = this.legendY - 5;

                for (var i = 0; i < seriesCount; i++) {
                    var seriesColor = cc.rect(this.legendX + 5, y, 10, 10, 2, 2, '',
                        'stroke-width="0" fill="' + m.ColorSchemes.SPRING[i] + '" ', '');
                    var seriesName = cc.text(this.legendX + 20, y - 10, '', series[i]);
                    chart += seriesColor + seriesName;
                    y -= 20;
                }
            } else {
                var y = this.legendY - 5;
                var x = this.legendX + 5;
                for (var i = 0; i < seriesCount; i++) {
                    var seriesColor = cc.rect(x, y, 10, 10, 2, 2, '',
                        'stroke-width="0" fill="' + m.ColorSchemes.SPRING[i] + '" ', '');
                    var seriesName = cc.text(x + 15, y - 10, '', series[i]);
                    chart += seriesColor + seriesName;
                    x += widthOneItem;
                    if (x > (this.areaWidth - widthOneItem)) {
                        x = this.legendX + 5;
                        y -= 20;
                    }
                }
            }

            return chart + '</svg>';
        };
        this.onAttached = function() {
            console.log('Chart ' + this.id + ' onAttached this.rectToAnimateId[0]=' + this.rectToAnimateId[0]);
            var onMouseOver = function(e) {
                console.info('mouse over ' + e.currentTarget.id);
            };
            Common.logInfo('onAttached of ResponsiveColLayout');
            var element = document.getElementById(this.id + (this.hasBorderBox ? '_b' : '_p'));
            var self = this;
            K.addWindowResizeListener(function() {
                console.log('render chart ' + self.id + ' onResize ' + element.clientWidth + '/' + element.clientHeight);
                element.innerHTML = self.renderChart(element.clientWidth, element.clientHeight);
                self.animate(self);
            });
            element.innerHTML = self.renderChart(element.clientWidth, element.clientHeight);
            self.animate(self);
        };
        this.animate = function(self) {
            var renderingFunction = function(progress) {
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
                    el.setAttribute('height', newHeight);
                    //                var pointsStr = '';
                    //                var j = 0;
                    //                while (j < points.length - 1) {
                    //                    pointsStr += points[j] + ',' + points[j + 1] + ' ';
                    //                    j += 2;
                    //                }
                    //                el.setAttribute('points', pointsStr);
                }
            };
            var animationCompleted = function() {
                console.info('animation completed');
            };
            Common.animate(1000, renderingFunction, animationCompleted);
        };


    });
    return m;
});

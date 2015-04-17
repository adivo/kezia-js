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
//        switch (direction) {
//            case 'TL_BR':
//                dir = 'x1="0%" y1="0%" x2="100%" y2="100%" ';
//                break;
//        }
        if (direction === 'TL_BR') {
            dir = 'x1="0%" y1="0%" x2="100%" y2="100%" ';
        } else if (direction === 'TB') {
            dir = 'x1="0%" y1="0%" x2="0%" y2="100%" ';
        }
        return '<linearGradient id="' + id + '" '
                + dir
//                + 'x1="0%" y1="0%" '
//                + 'x2="0%" y2="100%" '
                + 'spreadMethod="' + spreadMethod + '"> '
                + '<stop offset="0%"   stop-color="' + startColor + '" stop-opacity="1"/> '
                + '<stop offset="100%" stop-color="' + stopColor + '" stop-opacity="1"/> '
                + '</linearGradient>'
    }
    pr.SvgRenderer = OO.Class.extend(new function () {
        this.init = function (originX, originY) {
            this.originX = originX;
            this.originY = originY;
        };

        this.rect = function (x, y, width, height, roundX, roundY) {
            var rect = '<rect id="rect_' + col + '" '
                    + 'x="' + (col * slotWidth + 20) + '" '
                    + 'y="' + normalizeY(this, 300, screenValue) + '" '
                    + 'width="' + colWidth + '" '
                    + 'height="' + screenValue + '" '
                    + 'stroke-width="0" fill="'
                    + m.ColorSchemes.SPRING[i] + '" '
                    + 'rx="0" ry="0"><title>Hello, World!</title></rect>';
        }
    });
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
            return '<line '
                    + 'x1="' + this.x(x1) + '" '
                    + 'y1="' + this.y(y1) + '" '
                    + 'x2="' + this.x(x2) + '" '
                    + 'y2="' + this.y(y2) + '" style="' + styles + '"/>';
        };
        this.rect = function (x, y, width, height, rx, ry, id, attributes, inner) {
            return '<rect id="' + id + '" '
                    + 'x="' + this.x(x) + '" '
                    + 'y="' + this.y(y) + '" '
                    + 'width="' + width + '" '
                    + 'height="' + height + '" '
                    + attributes
                    + 'rx="' + rx + '" ry="' + ry + '">' + inner + '</rect>';
        };
        this.text = function (x, y, attributes, text) {
            return '<text '
                    + attributes
                    + 'x="' + this.x(x) + '" '
                    + 'y="' + this.y(y) + '">' + text + '</text>'
        };
        this.verticalText = function (x, y, attributes, text) {
            return '<text '
                    + attributes
                    + 'transform="rotate(270,' + this.x(x) + ',' + this.y(y) + ')"'
                    + 'x="' + this.x(x) + '" '
                    + 'y="' + this.y(y) + '">' + text + '</text>'
        };

    });
//Object to be exported. Define any public object and functions on this object.  
    var m = {};
    m.Gradients = {
        LINEAR_GRAY: '<linearGradient id="LINEAR_GRAY" '
                + 'x1="0%" y1="0%" '
                + 'x2="0%" y2="100%" '
                + 'spreadMethod="pad"> '
                + '<stop offset="0%"   stop-color="#a0a0a0" stop-opacity="1"/> '
                + '<stop offset="100%" stop-color="black" stop-opacity="1"/> '
                + '</linearGradient>',
        LINEAR_LIGHT_GRAY: '<linearGradient id="LINEAR_LIGHT_GRAY" '
                + 'x1="0%" y1="0%" '
                + 'x2="0%" y2="100%" '
                + 'spreadMethod="pad"> '
                + '<stop offset="0%"   stop-color="white" stop-opacity="1"/> '
                + '<stop offset="100%" stop-color="#f0f0f0" stop-opacity="1"/> '
                + '</linearGradient>',
    }
    m.ColorSchemes = {
        BLUE_MONOCHROME: ['#00157F', '#4C6AFF', '#002AFF', '#26357F', '#0021CC'],
        SPRING: ['#B2B198', '#52D4FF', '#FFEE00', '#CC2550', '#B26478', '#6141A6', '#FFFE1E', '#C2CD05', '#6A883C', '#FE7674'],
        SPRING_GRADIENT: ['url(#LINEAR_GRAY)', 'url(#LINEAR_LIGHT_GRAY)', '#B2B198', '#52D4FF', '#FFEE00', '#CC2550']
    };

    m.ColumnChart = K.Component.extend(new function () {
        this.height = 400;
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
            this._super('Chart', styleObj);
        };
        this.prepareModel = function (dataArray, dimensionInd, seriesInd, factInd) {
            var model = {};
            var seriesNameCollection = {};
            for (dataKey in dataArray) {
                var data = dataArray[dataKey];
                var dimension = data[dimensionInd];
                var series = data[seriesInd];
                seriesNameCollection[series] = series;

                var modelItem = Common.valueOrDefault(model[dimension], {});
                var fact = Number(Common.valueOrDefault(modelItem[series], 0)) + Number(data[factInd]);
                modelItem[series] = fact;
                model[dimension] = modelItem;
            }

            //add missing series
            for (var key in model) {
                var modelItem = model[key];
                for (var serie in seriesNameCollection) {
                    if (Common.isUndef(modelItem[serie])) {
                        modelItem[serie] = 0;
                    }

                }
            }
            return model;
        };
        this.renderInner = function () {

            K.registerComponentForAttaching(this);

            var modelItems = this.prepareModel(this.model, 1, 0, 2);
            for (modelItem in modelItems) {
                console.log(modelItem);
            }

            var dimIndex = {};
            for (var di = 0; di < this.dimensions.length; di++) {
                dimIndex[this.dimensions[di]] = di;
            }
            var aggregates = {};
            for (var i = 0; i < this.drillDownPath.length; i++) {
                var aggregate = {};
                var len = 0;
                for (var mi = 0; mi < this.model.length; mi++) {
                    var row = this.model[mi];
                    var line = '';
                    var key = '';
                    var currDrillDownPath = this.drillDownPath[i];
                    for (var cddp = 0; cddp < currDrillDownPath.length; cddp++) {
                        if (key.length > 0) {
                            key += ',';
                        }
                        key += row[dimIndex[currDrillDownPath[cddp]]];
                    }
                    var value = aggregate[key];
                    if (Common.isDef(value)) {
                        value = value + Number(row[2]);
                    } else {
                        value = Number(row[2]);
                        itemCount++;
                    }
                    aggregate[key] = value;
                    for (var c = 0; c < row.length; c++) {
                        line += row[c] + ' ';
                    }
                    console.info(line);
                }
                //aggregate['length'] = len;
                aggregates[this.drillDownPath[i]] = aggregate;
            }
            var drillDownPath = 'Continent';
            var series = ['1800', '1900', '2008'];
            var aggregateToDisplay = aggregates[drillDownPath];
            var itemCount = Object.keys(aggregateToDisplay).length;
            var areaWidth = 500;
            var areaHeight = 300;
            var slotWidth = areaWidth / (itemCount * (series.length + 1));
            var colWidth = slotWidth * 0.75;
            var bottom = 150;

            var c = new Coord(50, 300);
            var chart = '<svg width="100%" height="100%">';
            chart += '<defs>'
                    + '<linearGradient id="myLinearGradient1" '
                    + 'x1="0%" y1="0%" '
                    + 'x2="0%" y2="100%" '
                    + 'spreadMethod="pad"> '
                    + '<stop offset="0%"   stop-color="#fafafa" stop-opacity="1"/> '
                    + '<stop offset="100%" stop-color="#d0d0d0" stop-opacity="1"/> '
                    + '</linearGradient>'

                    + '<linearGradient id="grad2" '
                    + 'x1="0%" y1="0%" '
                    + 'x2="0%" y2="100%" '
                    + 'spreadMethod="pad"> '
                    + '<stop offset="0%"   stop-color="red" stop-opacity="1"/> '
                    + '<stop offset="100%" stop-color="black" stop-opacity="1"/> '
                    + '</linearGradient>'
                    + pr.linearGradient('gradient1', '#f0f0f0', '#404040', pr.direction.TL_BR,'reflect')
                    + m.Gradients.LINEAR_GRAY
                    + m.Gradients.LINEAR_LIGHT_GRAY
                    + '</defs>';

            chart += '<rect x="' + c.x(0) + '" y="' + c.y(areaHeight) + '" width="' + areaWidth + '" height="' + areaHeight + '" rx="02" ry="2"'
//                    + ' style="fill:url(#myLinearGradient1);'
                    + ' style="fill:url(#gradient1);'
                    + ' stroke: #a0a0a0;'
                    + ' stroke-width: 0;" />';
            chart += c.text(areaWidth / 2, areaHeight - 20, 'style="text-anchor: middle"', this.title);
            chart += c.text(areaWidth / 2, areaHeight - 40, 'style="font-size: 10px;text-anchor: middle"', this.subtitle);
            //find out max value to display
            var maxValue = 0;
            for (var key in aggregates[drillDownPath]) {
                var value = aggregateToDisplay[key];
                if (value > maxValue) {
                    maxValue = value;
                }
            }
            //calculate rendering scale
            var scale = (areaHeight - 80) / maxValue;

            // render y-Axis with values
            var yAxisStepInValueUnits = Common.roundToNextPowerOf10(Math.round(maxValue / 5));
            var yAxisStepInPx = yAxisStepInValueUnits * scale;
            for (var y = 0; y < areaHeight; y += yAxisStepInPx) {
                chart += c.line(0, y, areaWidth, y, 'stroke:#a0a0a0;stroke-width:0.05');
                chart += c.text(-40, y, 'style="text-anchor: right"', Math.round(y / scale));
            }

            var col = 0;
            var seriesItemNum = 0;
            var x = 10;
//            for (var key in aggregates['Continent']) {
            for (var key in aggregates[drillDownPath]) {
                var keys = key.split(',');
                var serie = c.text(x + slotWidth * series.length / 2, -15, 'style="writing-mode: bt;text-anchor: middle"', key);
//                var serie = c.verticalText(x + slotWidth*series.length/2, -15, '', key);
                chart += serie;
                var seriesItemNum = 0;
                for (var serie in series) {
                    var combKey = key + ',' + series[serie];
                    var value = aggregates['Continent,Year'][combKey];

//                var value = aggregateToDisplay[key];
                    var pxHeight = value * scale;

                    var colRect = c.rect(x, pxHeight, colWidth, pxHeight, 2, 5, 'rect_' + col,
                            'stroke-width="0" fill="' + m.ColorSchemes.SPRING_GRADIENT[seriesItemNum] + '" ', '<title>Hello, World!</title>');
                    // firstAggr[key] / maxValue * this.height;
//                    var valueText = c.text(x + slotWidth / 2 + 5, pxHeight + 30, 'style="writing-mode: tb;text-anchor: middle"', value.toFixed(2));
                    var valueText = c.verticalText(x + slotWidth / 2 + 2, pxHeight + 10, '', value.toFixed(0));

//                var end = new Date().getTime();
//                var timeRect = end - start;

//                console.info('with objects: ' + r + '\n' + timeR);
//                console.info('with concat:  ' + rect + '\n' + timeRect);
                    chart += colRect + valueText;
                    col++;
                    seriesItemNum++;
                    x += slotWidth;
                }
                x += slotWidth;
            }
            return chart +
                    +'</svg>';
        };
        this.onAttached = function () {
            var onMouseOver = function (e) {
                console.info('mouse over ' + e.currentTarget.id);
            };
//            for (var i = 0; i < 10; i++) {
//                document.getElementById('rect_' + i).addEventListener('mouseover', onMouseOver);
//            }
        };
    });
    return m;
});

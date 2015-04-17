/**
 * Created by Marcel on 01.03.2015.
 */
define(["class_require-mod", "common"], function (OO, util) {

    var BaseTag = OO.Class.extend({
        styleAttr: '',
        cssClazz: '',
        tag: '',
        /**
         * Constructs a Div element wrapper.
         * @param {type} innerHtml
         * @returns {undefined}
         */
        init: function (tag) {
            this.tag = tag;
            this.attributes = {};
        },
        id: function (id) {
            this.tagId = id;
            return this;
        },
        /**
         * Adds a style key value to be rendered as
         * style="{styleName}={styleAttr}"
         * 
         * @param {string} style - the style name
         * @param {string} styleValue - the style attribute
         * @returns {K}the div object
         */
        addStyle: function (style, styleValue) {
            var sep = '';
            if (this.styleAttr.length > 0) {
                sep = ';';
            }
            if (util.isUndef(styleValue)) {
                if (!util.isUndef(style) && style.indexOf(':') > -1) {
                    this.styleAttr += sep + style;
                }
            } else {
                this.styleAttr += sep + style + ':' + styleValue;
            }
            return this;
        },
        setName: function (name) {
            this.name = name;
            return this;
        },
        attribute: function (attribute, value) {
            if (util.isDef(value)) {
                this.attributes[attribute] = value;
            }
            return this;
        },
        addClass: function (cssClazz) {
            var sep = '';
            if (util.notEmpty(this.cssClazz)) {
                sep = ' ';
            }
            if (util.notEmpty(cssClazz)) {
                this.cssClazz += sep + cssClazz;
            }
            return this;
        },
        renderStart: function () {
            var attr = '';
            var keys = Object.keys(this.attributes);
            for (i = 0; i < keys.length; i++) {
                attr += ' ' + keys[i] + '="' + this.attributes[keys[i]] + '"';
            }

            return '<' + this.tag
                    + util.valueOnCheck(this.tagId, ' id="' + this.tagId + '"', '')
                    + util.valueOnCheck(this.name, ' name="' + this.name + '"', '')
                    + util.valueOnCheck(attr, ' ' + attr, '')
                    + util.valueOnCheck(this.cssClazz, ' class="' + this.cssClazz + '"', '')
                    + util.valueOnCheck(this.styleAttr, ' style="' + this.styleAttr + '"', '');
        },
        renderAsStandalone: function () {
            return this.renderStart() + '/>';
        },
        renderWithInnerHtml: function (innerHtml) {
            return this.renderStart() + '>'
                    + util.valueOrDefault(innerHtml, '') + '</' + this.tag + '>';
            ;
        }

    });
    var Div = BaseTag.extend({
        init: function (innerHtml) {
            this._super('div');
            this.innerHtml = innerHtml;
        },
        render: function () {
            return this.renderWithInnerHtml(this.innerHtml);
        }
    });
    var Tag = BaseTag.extend({
        /**
         * Constructs a Div element wrapper.
         * @param {type} innerHtml
         * @returns {undefined}
         */
        init: function (tag) {
            this._super(tag);
        },
        withInnerHtml: function (innerHtml) {
            return this.renderWithInnerHtml(innerHtml);
        },
        asStandalone: function () {
            return this.renderAsStandalone();
        }


    });
//     var BaseTag = BaseTag.extend({
//        styleAttr: '',
//        cssClazz: '',
//        /**
//         * Constructs a Div element wrapper.
//         * @param {type} innerHtml
//         * @returns {undefined}
//         */
//        init: function (innerHtml) {
//            this.innerHtml = innerHtml;
//        },
//   
//        /**
//         * Adds css classes (separated with whitespace).
//         * @param {type} cssClasses
//         * @returns Tag object
//         */
//        classes: function (cssClasses) {
//            this.cssClasses = cssClasses;
//            return this;
//        },
//        /**
//         * Adds a style attribute. All style attributes will be rendered as style="semicolon separated styles". 
//         * If styles is null, nothing is added.
//         *
//         * @param styles the styles
//         * @return the tag builder
//         */
//        addStyle: function (style) {
//            if (util.isDef(this.styles)) {
//                this.styles +=';'+ style;
//            }else{
//                this.styles=style;
//            }
//            return this;
//        },
//        attribute: function (attribute, value) {
//            if (util.isDef(value)) {
//                this.attributes[attribute] = value;
//            }
//            return this;
//        },
//        withInnerHtml: function (innerHtml) {
//
//            var html = this.renderTagOpening();
//            html += '>' + innerHtml + '</' + this.tag + '>';
//            return html;
//        },
//        asStandalone: function () {
//            var html = this.renderTagOpening();
//            html += '/>';
//            return html;
//        },
//        renderTagOpening: function () {
//            var html = '<' + this.tag;
//            if (this.id.length > 0) {
//                html += ' id="' + this.tagId + '"';
//            }
//            if (this.styles.length > 0) {
//                html += ' style="' + this.styles + '"';
//            }
//            if (this.cssClasses.length > 0) {
//                html += ' class="' + this.cssClasses + '"';
//            }
//
//            var keys = Object.keys(this.attributes);
//            for (i = 0; i < keys.length; i++) {
//                html += ' ' + keys[i] + '="' + this.attributes[keys[i]] + '"';
//            }
//            return html;
//        }
//
//
//    });
    return {
        /**
         * Constructs a Div element wrapper.
         * @param {type} innerHtml
         * @returns {undefined}
         */
        Div: function (innerHtml) {
            return new Div(innerHtml);
        },
        Tag: function (tag) {
            return new Tag(tag);
        }
    }
//    return tags;
});
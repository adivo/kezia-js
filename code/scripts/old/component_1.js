/**
 * Created by Marcel on 01.03.2015.
 */
define(["common"],function (common) {
    return {
        id: 'component',

        getId: function () {
            console.log("Function : getId");

            return this.id;
        },
        Component : Class.extend({
            init: function () {
                console.log("Component.init");
            },
            render:function(innerHTML){
                return '<div>'+innerHTML+'</div>';
            },
            /* debug function */
            debug:function(){
                console.log('debug label');
            }


        })
    };
});

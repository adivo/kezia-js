define(["class_require-mod", "common", "tags"], function (OO, Common, Tags) {

    //Define module private variables on the private object (which is not exported)
    var private = {};
    private.privateModuleVar = 'this is a private module var';

    //Object to be exported. Define any public object and functions on this object.  
    var obj = {};
    obj.moduleIdCounter = 0;
    obj.publicModuleVar = 'this is a public module var';

    obj.Counter = OO.Class.extend(new function () {
        // private instance variables
        var count = 0;
        var message;
        
        //Constructor
        this.init = function (message_) {
            obj.moduleIdCounter++;
            message = message_;
        }
        this.up = function () {
            count++;
        };
        this.down = function () {
            count--;
        };
        this.get = function () {
            return count;
        };
        this.getMessage = function () {
            return message + ' obj.publicModuleVar=' + obj.publicModuleVar;
        }
    });
    obj.SpecialCounter = obj.Counter.extend(new function () {

        //Constructor
        this.init = function () {
            //Call the super constructor
            this._super('SpecialCounter message from child');
            //Create an additional private instance variable, accessibly with this.additionalVar
            this.additionalVar='addtional';
            window.alert('init SepcialCounter');
            var c = new obj.Counter('inner counter');
            window.alert('instantiated Counter from inside module:' + c.getMessage());
            console.log(' private.privateModuleVar=' + private.privateModuleVar);
        };
        this.specialMessage = function () {
            window.alert('Special message with super var ' + this.getMessage());
        };

    });
    return obj;
});

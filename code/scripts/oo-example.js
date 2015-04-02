define(["class_require-mod", "common", "tags"], function (OO, Common, Tags) {

    //Define module private variables on the private object (which is not exported)
    var private = {};
    private.privateModuleVar = 'this is a private module var';

    //Object to be exported. Define any public object and functions on this object.  
    var m = {};
    m.moduleIdCounter = 0;
    m.publicModuleVar = 'this is a public module var';

    m.Counter = OO.Class.extend(new function () {
        // private instance variables
        var count = 0;
        var message;
        
        //public instance variables
        this.privateInstanceVar='privateInstanceVar';
        
        //Constructor
        this.init = function (message_) {
            m.moduleIdCounter++;
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
            //this.coutn is not accessible here
            console.log('Is count accessible from Counter.getMessage() with this.count?'+this.count+' --> no');
            console.log('Is count accessible from Counter.getMessage() with count?'+count+' --> yes');
            
            return message + ' obj.publicModuleVar=' + m.publicModuleVar;
        }
    });
    m.SpecialCounter = m.Counter.extend(new function () {

        //Constructor
        this.init = function () {
            //Call the super constructor
            this._super('SpecialCounter message from child');
            //Create an additional private instance variable, accessibly with this.additionalVar
            this.additionalVar='addtional';
            window.alert('init SepcialCounter');
            var c = new m.Counter('inner counter');
            window.alert('instantiated Counter from inside module:' + c.getMessage());
            console.log(' private.privateModuleVar=' + private.privateModuleVar);
            console.log('init SpecialCounter#privateInstanceVar='+this.privateInstanceVar);
            //Count is defined with var in parent (Counter) but is not accessible with this.count
            console.log('Is count accessible from SpecialCounter object with this.count?'+this.count+' --> no');
            //does not work
            //console.log('Is count accessible from SpecialCounter object with count?'+count);
            
        };
        this.specialMessage = function () {
            window.alert('Special message with super var ' + this.getMessage());
        };

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
            console.log('specialMessage SpecialCounter2#privateInstanceVar='+this.privateInstanceVar);
            return 'SpecialCounter2.specialMessage() with message from parent (this.getMessage()) ' + this.getMessage();
        }

    });
    return m;
});

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
require(["common", "oo-example"], function (common, S) {
    //window.alert(localArrayWithRendererCombo.maxItemCount);
    var counter = new S.Counter('Counter Message');
    counter.up();
    counter.up();
    console.log('count=' + counter.get());

    var specialCounter = new S.SpecialCounter('SpecialCounter message');
    console.log('SpecialCounter.specialMessage():' + specialCounter.specialMessage());
    var specialCounter2 = new S.SpecialCounter2('SpecialCounter2 message');
    console.log('SpecialCounter2.specialMessage():' + specialCounter2.specialMessage());

    console.log('specialCounter#privateInstanceVar=' + specialCounter.privateInstanceVar);

    var car=new S.Car('Audi');
    console.log(car.getBrand());
    var bmw=new S.BMW();
    console.log(bmw.getBrand());
    

});

var arr = ['Daniela', 'Annja', 'Katja', 'Roger', 'Rafael', 'Cyrill', 'Rebekka'];
var arrayAsJson = JSON.stringify(arr);
document.getElementById("arrayAsJson").innerHTML = arrayAsJson;

var jsonArrayAsArray = JSON.parse(arrayAsJson);//creates a array object (not a real array)
document.getElementById("jsonToArray").innerHTML = jsonArrayAsArray;

var arrayObj = [];
arrayObj["0"] = "John";
arrayObj["1"] = "Doe";
arrayObj["2"] = 46;
var str = '';
var properties = Object.getOwnPropertyNames(arrayObj);
//copy properties from styleObj to component object
for (j = 0; j < properties.length; j++) {
    str += properties[j] + '=' + arrayObj[properties[j]] + '<br>';
}
//document.getElementById("demo").innerHTML = str;

var arrayObjAsJson = JSON.stringify(arrayObj);
document.getElementById("arrayObjAsJson").innerHTML = arrayObjAsJson;
var jsonToArrayObj = JSON.parse(arrayObjAsJson);
var objStr = '';
for (var i = 0; i < jsonToArrayObj.length; i++) {
    objStr += i + '=' + jsonToArrayObj[i] + '<br>';
}

document.getElementById("jsonToArrayObj").innerHTML = jsonToArrayObj;

var employees = [
    {id:100,"firstName":"John", "lastName":"Doe"},
    {id:101,"firstName":"Anna", "lastName":"Smith"},
    {id:102,"firstName":"Peter","lastName": "Jones"}
];
window.alert(employees[1]['lastName']);
document.getElementById("jsonToString").innerHTML = JSON.stringify(employees);

var employeesBackFromJson=JSON.parse(JSON.stringify(employees));
//window.alert(employeesBackFromJson);

var multiArray=[["John","Doe"],["Anna","Smith"]];
var multiArrayJson=JSON.stringify(multiArray);

var array = ['Daniela', 'Annja', 'Katja', 'Roger', 'Rafael', 'Cyrill', 'Rebekka'];
var jsonObj=[];
var ind=100;

// var properties = Object.getOwnPropertyNames(styleObj);
//                //copy properties from styleObj to component object
//                for (j = 0; j < properties.length; j++) {
//                    this[properties[j]] = styleObj[properties[j]];
//                }
for (var i=0;i<array.length;i++){
    jsonObj[i]={id:ind,"value":array[i]};
    ind++;
}
console.log('jsonObj[0]["value"]='+jsonObj[0]["value"]);
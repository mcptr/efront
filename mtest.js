var marked = require('marked');
console.log("*", marked("*value*"));
console.log("**", marked("**value**"));
console.log("_", marked("_value_"));
console.log("__", marked("__value__"));
console.log("`", marked("``code``"));
console.log("[]()", marked("[test](http://test.com)"));
console.log("![]", marked("![asd](http://dupa.com/asd.jpg)"));
console.log("@", marked("@code"));

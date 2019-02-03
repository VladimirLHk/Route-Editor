import Route from "./route";

let r = new Route();

r.addPoint("11","1,1");
r.addPoint("12","1,2");
r.addPoint("21","2,1");
r.addPoint("22","2,2");

console.log(r.route.slice());

r.deletePoint(0);
console.log(r.route.slice());

r.addPoint("11","1,1");
console.log(r.route.slice());

r.deletePoint(1);
console.log(r.route.slice());

r.addPoint("21","2,1");
console.log(r.route.slice());

r.movePointBefore(3,1);
console.log(r.route.slice());

r.movePointToEnd(2);
console.log(r.route.slice());

r.movePointBefore(2,0);
console.log(r.route.slice());
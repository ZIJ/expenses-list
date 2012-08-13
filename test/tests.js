/**
 * Created by Igor Zalutsky on 12.08.12 at 18:32
 */

// registering QUnit globals for JSHint
/*global test:false asyncTest:false start:false expect:false ok:false */

(function () {
    "use strict";
    // publishing namespace
    if (!window.elist) {
        window.elist = {};
    }
    var elist = window.elist;

    asyncTest("ready", function() {
        expect(1);
        var result = "";
        var onReady = "ready fired";
        elist.ready(function(){
            result = onReady;
        });
        window.onload = function(){
            ok(result === onReady, "Ready fires before onload");
            start();
        };
    });

    asyncTest("byId", function() {
        expect(1);
        elist.ready(function(){
            var id = 13;
            var elem = document.createElement("div");
            elem.id = id;
            document.body.appendChild(elem);
            var found = elist.byId(id);
            ok(!found.isEmpty, "Div found");
            start();
        });
    });

    asyncTest("remove", function() {
        expect(1);
        elist.ready(function(){
            var elem = document.createElement("div");
            elem.id = 13;
            document.body.appendChild(elem);
            var found = elist.byId(13);
            found.remove();
            var notfound = elist.byId(13);
            ok(notfound.isEmpty, "Div removed");
            start();
        });
    });

    asyncTest("empty", function() {
        expect(2);
        elist.ready(function(){
            document.body.appendChild(document.createElement("div"));
            document.body.appendChild(document.createElement("div"));
            ok(document.body.childNodes.length === 2, "Divs added");
            elist.empty(document.body);
            ok(document.body.childNodes.length === 0, "Divs removed");
            start();
        });
    });


}());

/**
 * Created by Igor Zalutsky on 12.08.12 at 19:38
 */

// registering QUnit globals for JSHint
/*global test:false asyncTest:false start:false expect:false ok:false */

(function () {
    "use strict";
    // publishing namespace
    if (!window.elist) {
        window.elist = {};
    }
    var elist = window.elist;

    test("expenseModel", function() {
        expect(4);
        var model = new elist.ExpenseModel(13, { amount: 100 });
        ok(model.id === 13, "ID assigned");
        ok(model.description instanceof elist.ObservableProperty, "Property is Observable");
        ok(model.date.get() instanceof Date, "Date value is Date");
        ok(model.amount.get() === 100, "Properties pre-assign works");
    });

}());

/**
 * Created by Igor Zalutsky on 12.08.12 at 2:50
 */

// registering QUnit globals for JSHint
/*global test:false asyncTest:false start:false expect:false ok:false */

(function(){
    "use strict";
    var elist = window.elist;


    test("inheritFrom", function() {
        expect(1);
        function A() {
            this.fromA = true;
        }
        function B(){ }
        B.inheritFrom(A);
        var instance = new B();
        ok(instance.fromA, "B instance has A property");
    });

    test("EventEmitter", function(){
        expect(2);
        var emitter = new elist.EventEmitter();
        emitter.on("event", function(origin, args){
            ok(args === "something", "First listener notified");
        });
        emitter.on("event", function(origin, args){
            ok(args === "something", "Second listener notified");
        });
        emitter.emit("event", "something");
    });

    test("EventEmitter property sharing", function(){
        expect(2);
        var emitter1 = new elist.EventEmitter();
        emitter1.on("event", function(origin, args){
            ok(args === "first");
        });
        var emitter2 = new elist.EventEmitter();
        emitter2.on("event", function(origin, args){
            ok(args === "second");
        });
        emitter1.emit("event", "first");
        emitter2.emit("event", "second");
    });

    test("ObservableProperty", function(){
        expect(2);
        var prop1 = new elist.ObservableProperty(1);
        prop1.notify(function(){
            ok(true, "first changed");
        });
        var prop2 = new elist.ObservableProperty(2);
        prop2.notify(function(){
            ok(true, "second changed");
        });
        prop1.set(10);
        prop2.set(20);
    });

    test("ObservableCollection", function(){
       expect(6);
       var collection = new elist.ObservableCollection();
       collection.notify(function(){
            ok(true, "collection changed");
       });
        collection.add("a3");
        collection.add("b2");
        collection.add("d4");
        collection.add("c1");
        collection.orderBy(function(item){
            return item.substr(1);
        });
        ok(collection.at(0) === "c1" && collection.at(3) === "d4", "At, SortBy and OrderBy work");

    });

}());




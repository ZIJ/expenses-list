/**
 * Created by Igor Zalutsky on 12.08.12 at 2:50
 */

// registering QUnit globals for JSHint
/*global test:false asyncTest:false start:false expect:false ok:false */

(function(){
    "use strict";
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

    asyncTest("byId, remove", function() {
        expect(2);
        elist.ready(function(){
            var elem = document.createElement("div");
            elem.id = 13;
            document.body.appendChild(elem);
            var found = elist.byId(13);
            ok(!found.isEmpty, "Div found");
            found.remove();
            var notfound = elist.byId(13);
            ok(notfound.isEmpty, "Div removed");
            start();
        });
    });
}());




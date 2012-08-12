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

}());




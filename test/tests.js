/**
 * Created with JetBrains WebStorm.
 * Author: Igor Zalutsky
 * Date: 10.08.12
 * Time: 2:18
 */

"use strict";

(function(){
    var tests = {};                 //test functions
    var toRun = ["observable"];         //names of tests to run

    tests.ready = function() {                  //ready should fire before onload
        elist.ready(function(){
            console.log("ready fired");
        });
        window.onload = function(){
            console.log("onload fired");
        };
    };

    tests.remove = function() {                 //adds element to dom, searches for it by id, removes, searches again
        elist.ready(function(){
            var elem = document.createElement("div");
            elem.id = 13;
            document.body.appendChild(elem);
            var found = elist.byId(13);
            console.log("found? " + !found.isEmpty());
            found.remove();
            var notfound = elist.byId(13);
            console.log("removed? " + notfound.isEmpty());
        });
    };

    tests.append = function() {                 // appends an element, wrapped element and string
        elist.ready(function() {
            var div1 = document.createElement('div');
            div1.innerHTML = "div1";
            var div2 = document.createElement('div');
            div2.innerHTML = "div2";
            div2.onclick = function(){
                alert('ololo');
            };
            elist.wrap(document.body)
                .append(div1)
                .append(elist.wrap(div2))
                .append("TEXT NODE");
        });
    };

    tests.observable = function() {                 //subscribes two clients, updates, unsubscribes first, updates
        elist.ready(function() {
            var thing = elist.Observable(1);
            var client1 = function(){
                console.log('client1');
            }
            var client2 = function(){
                console.log('client2');
            }
            thing.subscribe(client1).subscribe(client2);
            thing.update(2);
            thing.unsubscribe(client1);
            thing.update(3);
        });
    };
    /**
     * Running tests
     */
    (function run(){
        for(var i = 0; i < toRun.length; i++) {
            var testName = toRun[i];
            console.log("running " + testName + " test...");
            tests[testName]();
        }
    })();
})();
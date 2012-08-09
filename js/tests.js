/**
 * Created with JetBrains WebStorm.
 * Author: Igor Zalutsky
 * Date: 10.08.12
 * Time: 2:18
 */

(function(){
    var tests = {};             //array of test functions
    var toRun = ["ready"];      //names of tests to run
    tests.ready = function() {
        console.log("testing ready...");
        elist.ready(function(){
            console.log("ready fired");
        });
        window.onload = function(){
            console.log("onload fired");
        };
    };
    //running tests
    (function run(){
        for(var i = 0; i < toRun.length; i++) {
            tests[toRun[i]]();
        }
    })();
})();
/**
 * Created Created by Igor Zalutsky on 12.08.12 at 0:09
 */

(function() {
    "use strict";
    //publishing namespace
    if (!window.elist) {
        window.elist = {};
    }
    var elist = window.elist;
    /**
     * Property that notifies listeners when it's value changes through set()
     * @param options
     *   value - initial property value
     *   getter - function
     * @constructor
     */
    elist.ObservableProperty = function(options) {
        //TODO Optimize options validation in ObservableProperty
        options = options || {};
        if (typeof options === "object") {
            this.value = options.value || null;
        } else {    //allows primitive values as a param
            this.value = options;
        }
        this.getter = options.getter || function(){
            return this.value;
        };
        this.setter = options.setter || function(newValue){
            this.value = newValue;
        };
    };
    /**
     * ObservableProperty extends EventEmitter
     */
    elist.ObservableProperty.inheritFrom(elist.EventEmitter);
    /**
     * Executes getter
     * @return {*}
     */
    elist.ObservableProperty.prototype.get = function(){
        return this.getter(this.value);
    };
    /**
     * Executes setter and notifies listeners
     * @param newValue
     */
    elist.ObservableProperty.prototype.set = function(newValue){
        if (this.value !== newValue) {
            this.setter(newValue);
            this.emit("change");
        }
    };
    /**
     * Shorcut for on("change", listener)
     * @param listenerFunc
     */
    elist.ObservableProperty.prototype.notify = function(listenerFunc) {
        this.on("change", listenerFunc);
    };
    /**
     * Shorcut for off("change", listener)
     * @param listenerFunc
     */
    elist.ObservableProperty.prototype.ignore = function(listenerFunc) {
        this.off("change", listenerFunc);
    };


})();
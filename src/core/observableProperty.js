/**
 * Created Created by Igor Zalutsky on 12.08.12 at 0:09
 */

(function() {
    "use strict";
    // publishing namespace
    if (!window.elist) {
        window.elist = {};
    }
    var elist = window.elist;
    /**
     * Property that notifies listeners when it's value changes through set()
     * @param initialValue
     * @constructor
     */
    elist.ObservableProperty = function(initialValue) {
        this.value = initialValue;
        this.listeners = {};
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
        return this.value;
    };
    /**
     * Executes setter and notifies listeners
     * @param newValue
     */
    elist.ObservableProperty.prototype.set = function(newValue){
        if (this.value !== newValue) {
            this.value = newValue;
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


}());
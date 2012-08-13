/**
 * Created by Igor Zalutsky on 13.08.12 at 8:02
 */

(function () {
    "use strict";
    // publishing namespace
    if (!window.elist) {
        window.elist = {};
    }
    var elist = window.elist;
    /**
     * Collection that emits "change" event whenever it's changed
     * @constructor
     */
    elist.ObservableCollection = function(){
        this.listeners = {};
        this.items = [];
    };

    elist.ObservableCollection.inheritFrom(elist.EventEmitter);

    elist.ObservableCollection.prototype.at = function(index) {
        if (index < 0 || index >= this.items.length) {
            elist.report("Index out of bounds");
        }
        return this.items[index];
    };

    elist.ObservableCollection.prototype.has = function(item){
        return (this.items.indexOf(item) >= 0);
    };

    elist.ObservableCollection.prototype.add = function(item){
        if (!this.has(item)) {
            this.items.push(item);
            this.emit("change");
        }
        return this;
    };

    elist.ObservableCollection.prototype.remove = function(item){
        var index = this.items.indexOf(item);
        if (index >= 0) {
            this.items.splice(index, 1);
            this.emit("change");
        }
        return this;
    };
    /**
     * Sorts collection according to comparer
     * @param comparer Function(item1, item2), must return number, better -1 0 1
     */
    elist.ObservableCollection.prototype.sortBy = function(comparer){
        this.items.sort(comparer);
        this.emit("change");
        return this;
    };
    /**
     * Sorts collection according to keyExtractor result
     * @param keyExtractor
     */
    elist.ObservableCollection.prototype.orderBy = function(keyExtractor, reverse){
        return this.sortBy(function(item1, item2){
            var result = 0;
            var key1 = keyExtractor(item1);
            var key2 = keyExtractor(item2);
            if (key1 > key2) {
                return 1;
            } else if (key1 < key2) {
                result = -1;
            }
            return reverse ? -result : result;
        });
    };

    //TODO Refactor notify() and ignore() shortcuts in Observables

    /**
     * Shorcut for on("change", listener)
     * @param listenerFunc
     */
    elist.ObservableCollection.prototype.notify = function(listenerFunc) {
        this.on("change", listenerFunc);
    };
    /**
     * Shorcut for off("change", listener)
     * @param listenerFunc
     */
    elist.ObservableCollection.prototype.ignore = function(listenerFunc) {
        this.off("change", listenerFunc);
    };

}());

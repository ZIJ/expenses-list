/**
 * Created with JetBrains WebStorm.
 * Author: Igor Zalutsky
 * Date: 10.08.12
 * Time: 6:01
 */


(function() {
    //publishing namespace
    if (this.elist === undefined) {
        this.elist = {};
    }

    /**
     * Observable factory
     * @param initialValue
     * @return {Observable}
     * @constructor
     */
    elist.Observable = function(initialValue) {
        return new Observable(initialValue);
    };
    /**
     * Calls subscribers when value is changed by update
     * @param initialValue
     * @constructor
     */
    function Observable(initialValue) {
        this.value = (initialValue !== undefined) ? initialValue : null;
        this.subscribers = [];
    }

    /**
     * Changes value and calls subscribers
     * @param newValue
     */
    Observable.prototype.update = function(newValue){
        var oldValue = this.value;
        this.value = newValue;
        for (var i = 0; i < this.subscribers.length; i++) {
            this.subscribers[i](oldValue);
        }
    };
    /**
     * Adds subscriber function
     * @param subscriberFunc
     */
    Observable.prototype.subscribe = function(subscriberFunc) {
        this.subscribers.push(subscriberFunc);
        return this;
    };
    /**
     * Removes subscriber function
     * @param subscriberFunc
     */
    Observable.prototype.unsubscribe = function(subscriberFunc) {
        var index = this.subscribers.indexOf(subscriberFunc);
        if (index >= 0) {
            this.subscribers.splice(index,1);
        }
        return this;
    };

    /**
     * Model of Expense entity with observable properties
     * @param properties
     * @constructor
     */
    function ExpenseModel(properties) {
        elist.assert(properties !== undefined, "Should have at least ID");
        this.id = properties.id;
        this.description = elist.Observable();
        this.date = elist.Observable();
        this.amount = elist.Observable();
        this.isActive = elist.Observable();
        this.assign(properties);
    }

    /**
     * Updates using properties param
     * @param properties
     */
    ExpenseModel.prototype.assign = function(properties) {
        for (var name in properties) {
            if (this[name]) {
                this[name].update(properties[name]);
            }
        }
    }


})();
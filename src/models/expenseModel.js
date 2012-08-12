/**
 * Created by Igor Zalutsky on 10.08.12 at 6:01
 */

(function() {
    "use strict";
    //publishing namespace
    if (!window.elist) {
        window.elist = {};
    }
    var elist = window.elist;

    /**
     * Model of Expense entity with observable properties
     * @param properties Object with initial property values (id required) or id
     * @constructor
     */
    function ExpenseModel(properties) {
        if (typeof properties === "object") {
            elist.assert (typeof properties.id !== "undefined", "ID not found in properties");
            this.id = properties.id;
        } else if (typeof properties === "number") {
            this.id = properties;
        } else {
            elist.report("Properties should be object or number");
        }
        this.description = new elist.ObservableProperty("");
        this.date = new elist.ObservableProperty(new Date());
        this.amount = new elist.ObservableProperty(0);
        this.isActive = new elist.ObservableProperty(true);
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
    };

})();
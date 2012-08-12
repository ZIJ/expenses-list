/**
 * Created by Igor Zalutsky on 10.08.12 at 6:01
 */

"use strict";

(function() {
    "use strict";
    //publishing namespace
    if (!window.elist) {
        window.elist = {};
    }



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
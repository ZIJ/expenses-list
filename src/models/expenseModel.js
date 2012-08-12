/**
 * Created by Igor Zalutsky on 10.08.12 at 6:01
 */

(function() {
    "use strict";
    // publishing namespace
    if (!window.elist) {
        window.elist = {};
    }
    var elist = window.elist;

    /**
     * Model of Expense entity with observable properties
     * @param properties Object with initial property values (id required) or id
     * @constructor
     */
    elist.ExpenseModel = function(id, properties) {
        this.id = this.newId(id);
        this.description = this.newProp("");
        this.amount = this.newProp(0);
        this.date = this.newProp(new Date());
        this.isActive = this.newProp(true);
        if (properties !== undefined) {
            this.assign(properties);
        }
    };

    // ExpenseModel extends BaseModel
    elist.ExpenseModel.inheritFrom(elist.BaseModel);

}());
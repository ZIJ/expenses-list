/**
 * Created by Igor Zalutsky on 13.08.12 at 7:50
 */

(function () {
    "use strict";
    // publishing namespace
    if (!window.elist) {
        window.elist = {};
    }
    var elist = window.elist;

    /**
    * Model of entire app
    * @param descriptors Object with expenseModel descriptors
        * @constructor
    */
    elist.AppModel = function(descriptors) {
        //TODO descriptors validation in AppModel()

        var model = this;

        this.expenses = new elist.ObservableCollection();
        for (var i = 0; i < descriptors.length; i+=1) {
            var id = descriptors[i].id;
            var properties = descriptors[i].props;
            var expense = new elist.ExpenseModel(id, properties);
            this.expenses.add(expense);
        }

    };

    // AppModel extends BaseModel
    elist.AppModel.inheritFrom(elist.BaseModel);

    /**
     * Returns a fresh new unused ID
     * @return {Number}
     */
    elist.AppModel.prototype.nextId = function(){
        var maxId = 0;
        this.expenses.each(function(expenseModel){
            maxId = Math.max(maxId, expenseModel.id);
        });
        return maxId + 1;
    };
    /**
     * Creates new ExpenseModel with default property values and adds it to this.expenses collection
     * @return {elist.ExpenseModel}
     */
    elist.AppModel.prototype.createModel = function(){
        var expense = new elist.ExpenseModel(this.nextId());
        this.expenses.add(expense);
        return expense;
    };

    elist.AppModel.prototype.deleteModel = function(expenseModel){
        //TODO Clear listeners for preventing memory leaks when deleting models
        this.expenses.remove(expenseModel);
    };

}());

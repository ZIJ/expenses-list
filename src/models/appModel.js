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

        this.sortBy = new elist.ObservableProperty(null);
        this.sortBy.notify(function(){
            model.expenses.orderBy(function(expense){
                // getting value of property with name from sortBy
                var key = model.sortBy.get();
                return expense[key].get();
            });
        });
        this.sortBy.set("amount");
    };

    // ExpenseModel extends BaseModel
    elist.AppModel.inheritFrom(elist.BaseModel);

}());

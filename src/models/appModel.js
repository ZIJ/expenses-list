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
    * @param descriptors Object with expeneModel descriptors
        * @constructor
    */
    elist.AppModel = function(descriptors) {
        //TODO descriptors validation in AppModel()
        this.expenses = [];
        for (var i = 0; i < descriptors.length; i+=1) {
            var id = descriptors[i].id;
            var props = descriptors[i].props;
            var expense = new elist.ExpenseModel(id, props);
            this.expenses.push(expense);
        }
    };

    // ExpenseModel extends BaseModel
    elist.AppModel.inheritFrom(elist.BaseModel);

}());

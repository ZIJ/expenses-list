/**
 * Created by Igor Zalutsky on 12.08.12 at 17:40
 */

(function () {
    "use strict";
    // publishing namespace
    if (!window.elist) {
        window.elist = {};
    }
    var elist = window.elist;

    elist.ExpenseView = function(expenseModel){
        //TODO Param validation in ExpenseView
        this.model = expenseModel;
    };

    elist.ExpenseView.inheritFrom(elist.EventEmitter);

    elist.ExpenseView.prototype.viewDescription = function(){

    };

}());

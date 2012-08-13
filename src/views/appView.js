/**
 * Created by Igor Zalutsky on 13.08.12 at 9:44
 */

(function () {
    "use strict";
    // publishing namespace
    if (!window.elist) {
        window.elist = {};
    }
    var elist = window.elist;

    elist.AppView = function(appModel){
        //TODO Param validation in ExpenseView
        var model = appModel;
        var view = this;
        this.listeners = {};
        this.model = appModel;
        this.parentNode = null;

        this.node = document.createElement("table");

        this.views = new elist.ObservableCollection();
        model.expenses.each(function(expenseModel){
            var expenseView = new elist.ExpenseView(expenseModel);
            view.views.add(expenseView);
        });

        this.views.each(function(expenseView){
            expenseView.renderTo(view.node);
        });

    };

    elist.AppView.inheritFrom(elist.BaseView);
}());

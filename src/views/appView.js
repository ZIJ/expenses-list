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

    /**
     * View of entire app. Contains controls and renders DOM elements.
     * @param appModel
     * @constructor
     */
    elist.AppView = function(appModel){
        //TODO Param validation in ExpenseView
        var model = appModel;
        var view = this;
        this.listeners = {};
        this.isVisible = false;
        this.model = appModel;
        this.parentNode = null;
        this.invertSort = false;

        this.totalActiveAmount = 0;

        // wrapping div
        this.node = document.createElement("div");

        // container for createButton and searchControl
        this.bar = document.createElement("div");
        this.node.appendChild(this.bar);

        this.createButton = new elist.ButtonView("Создать");
        this.createButton.on("press", function(){
            view.createExpense();
        });
        this.createButton.renderTo(this.bar);

        this.searchControl = new elist.SearchView("Поиск");
        this.searchControl.on("query", function(){
            view.filter(view.searchControl.query.get());
        });
        this.searchControl.renderTo(this.bar);

        // table
        this.table = document.createElement("table");
        this.node.appendChild(this.table);

        // table headings
        this.headings = document.createElement("tr");
        this.table.appendChild(this.headings);

        var titles = ["Что", "Когда", "Сколько", "Доля", "Считать", "Удалить"];
        for (var i = 0; i < titles.length; i+=1){
            var th = document.createElement("th");
            th.innerHTML = titles[i];
            this.headings.appendChild(th);
        }

        //TODO refactor UGLY code below in appView

        this.headings.children[0].addEventListener("click",function(){
            view.sortBy("description");
        }, false);
        this.headings.children[1].addEventListener("click",function(){
            view.sortBy("date");
        }, false);
        this.headings.children[2].addEventListener("click",function(){
            view.sortBy("amount");
        }, false);
        this.headings.children[3].addEventListener("click",function(){
            view.sortBy("share");
        }, false);

        // creating views of Expenses
        this.views = new elist.ObservableCollection();
        model.expenses.each(function(expenseModel){
            var expenseView = new elist.ExpenseView(expenseModel);
            view.views.add(expenseView);
        });
        // rendering views
        this.views.each(function(expenseView){
            expenseView.renderTo(view.table);
        });
        // subscribing for views' events
        this.views.each(function(expenseView){
            expenseView.activeAmount.notify(function(){
                view.updateTotalActiveAmount();
            });
            expenseView.on("deleteRequest", function(){
                view.deleteExpense(expenseView);
            });
        });

        this.updateTotalActiveAmount();
    };

    // Extending BaseView
    elist.AppView.inheritFrom(elist.BaseView);

    /**
     * Recalculates total amount for active expenses
     */
    elist.AppView.prototype.updateTotalActiveAmount = function(){
        var total = 0;
        this.views.each(function(expenseView){
            total += expenseView.activeAmount.get();
        });
        this.totalActiveAmount = total;
        this.views.each(function(expenseView){
            var amount = expenseView.activeAmount.get();
            expenseView.activeShare.set(amount / total);
        });
    };

    /**
     * Creates a new Expense and renders it
     */
    elist.AppView.prototype.createExpense = function(){
        var appView = this;
        var model = this.model.createModel();
        var view = new elist.ExpenseView(model);
        this.views.add(view);
        view.renderTo(this.table);
        view.activeAmount.notify(function(){
            appView.updateTotalActiveAmount();
        });
        view.on("deleteRequest", function(){
            appView.deleteExpense(view);
        });
        view.editAll();
    };

    /**
     * Deletes an expense
     * @param expenseView
     */
    elist.AppView.prototype.deleteExpense = function(expenseView){
        //TODO Clear listeners for preventing memory leaks when deleting views
        expenseView.model.isActive.set(false);
        expenseView.hide();
        this.views.remove(expenseView);
        this.model.deleteModel(expenseView.model);
        //this.updateTotalActiveAmount();
    };

    /**
     * Sorts expenses according to specified property name
     * @param propName
     */
    elist.AppView.prototype.sortBy = function(propName){
        if(propName) {
            this.views.each(function(expenseView){
                expenseView.hide();
            });
            this.views.orderBy(function(expenseView){
                //TODO refactor too specific code in AppView.sortBy()
                if(propName === "share") {
                    return expenseView.activeAmount.get();
                }
                return expenseView.model[propName].get();
            }, this.invertSort);
            this.invertSort = !this.invertSort;
            this.views.each(function(expenseView){
                expenseView.show();
            });
        }

    };

    /**
     * Shows only expenses which description contains key string, case-insesitive
     * @param str
     */
    elist.AppView.prototype.filter = function(str) {
        if (str.length > 0) {
            this.views.each(function(expenseView){
                var description = expenseView.model.description.get().toLowerCase();
                if (description.indexOf(str.toLowerCase()) === -1){
                    expenseView.hide();
                } else {
                    expenseView.show();
                }
            });
        } else {
            this.views.each(function(expenseView){
                expenseView.show();
            });
        }
    };


}());

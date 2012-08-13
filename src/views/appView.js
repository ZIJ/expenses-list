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

        this.totalActiveAmount = 0;

        // wrapping div
        this.node = document.createElement("div");

        // controls bar
        this.bar = document.createElement("div");
        this.node.appendChild(this.bar);

        // create button
        this.createButton = document.createElement("button");
        this.createButton.type = "button";
        this.createButton.innerHTML = "Создать";
        this.createButton.addEventListener("click", function(){
            view.createExpense();
        }, false);
        this.bar.appendChild(this.createButton);

        // search label
        this.searchLabel = document.createElement("label");
        this.searchLabel.innerHTML = "Поиск";
        this.bar.appendChild(this.searchLabel);

        // search input
        this.searchInput = document.createElement("input");
        this.searchInput.type = "text";
        this.searchLabel.appendChild(this.searchInput);

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


        this.views = new elist.ObservableCollection();
        model.expenses.each(function(expenseModel){
            var expenseView = new elist.ExpenseView(expenseModel);
            view.views.add(expenseView);
        });

        this.views.each(function(expenseView){
            expenseView.renderTo(view.table);
        });

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

    elist.AppView.inheritFrom(elist.BaseView);

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

    elist.AppView.prototype.deleteExpense = function(expenseView){
        //TODO Clear listeners for preventing memory leaks when deleting views
        expenseView.hide();
        this.views.remove(expenseView);
        this.model.removeModel(expenseView.model);
    };

}());

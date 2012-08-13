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
        var view = this;
        var model = expenseModel;
        this.listeners = {};
        this.model = expenseModel;
        this.parentNode = null;

        this.activeAmount = new elist.ObservableProperty(0);
        this.model.amount.notify(function(){
            view.updateActiveAmount();
        });
        this.model.isActive.notify(function(){
            view.updateActiveAmount();
        });

        this.activeShare = new elist.ObservableProperty(0);

        this.node = document.createElement("tr");
        for (var i = 0; i < 6; i+=1){
            this.node.appendChild(document.createElement("td"));
        }

        this.descriptionControl = new elist.EditableView(model.description, "TextView", "InputEdit", "text");
        this.dateControl = new elist.EditableView(model.date, "DateView", "InputEdit", "date");
        this.amountControl = new elist.EditableView(model.amount, "AmountView", "InputEdit", "number");
        this.activeControl = new elist.FlagView(model.isActive);
        this.shareControl = new elist.ShareView(this.activeShare);

        this.descriptionControl.renderTo(this.node.children[0]);
        this.dateControl.renderTo(this.node.children[1]);
        this.amountControl.renderTo(this.node.children[2]);
        this.activeControl.renderTo(this.node.children[4]);
        this.shareControl.renderTo(this.node.children[3]);

        this.updateActiveAmount();
    };

    elist.ExpenseView.inheritFrom(elist.BaseView);

    elist.ExpenseView.prototype.updateActiveAmount = function(){
        var isActive = this.model.isActive.get();
        var amount = this.model.amount.get();
        this.activeAmount.set(isActive ? amount : 0);
    };

}());

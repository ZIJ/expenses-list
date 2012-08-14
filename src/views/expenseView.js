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

    /**
     * View of single Expense
     * @param expenseModel
     * @constructor
     */
    elist.ExpenseView = function(expenseModel){
        //TODO Param validation in ExpenseView
        var view = this;
        var model = expenseModel;
        this.listeners = {};
        this.isVisible = false;
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

        // creating controls
        this.descriptionControl = new elist.EditableView(model.description, "TextView", "InputEdit", "text");
        this.dateControl = new elist.EditableView(model.date, "DateView", "InputEdit", "date");
        this.amountControl = new elist.EditableView(model.amount, "AmountView", "InputEdit", "number");
        this.activeControl = new elist.FlagView(model.isActive);
        this.shareControl = new elist.ShareView(this.activeShare);

        // rendering controls
        this.descriptionControl.renderTo(this.node.children[0]);
        this.dateControl.renderTo(this.node.children[1]);
        this.amountControl.renderTo(this.node.children[2]);
        this.activeControl.renderTo(this.node.children[4]);
        this.shareControl.renderTo(this.node.children[3]);

        // working with DOM
        this.deleteButton = document.createElement("button");
        this.deleteButton.type = "button";
        this.deleteButton.innerHTML = "Удалить";
        this.deleteButton.addEventListener("click", function(){
            view.emit("deleteRequest");
        }, false);
        this.node.children[5].appendChild(this.deleteButton);

        this.updateActiveAmount();
    };

    // Extending BaseView
    elist.ExpenseView.inheritFrom(elist.BaseView);

    /**
     * Recalculates active amount and assigns it to observable property
     */
    elist.ExpenseView.prototype.updateActiveAmount = function(){
        var isActive = this.model.isActive.get();
        var amount = this.model.amount.get();
        this.activeAmount.set(isActive ? amount : 0);
    };

    /**
     * Toggles edit mode for all editable properties
     */
    elist.ExpenseView.prototype.editAll = function(){
        this.descriptionControl.edit();
        this.dateControl.edit();
        this.amountControl.edit();
    };

}());

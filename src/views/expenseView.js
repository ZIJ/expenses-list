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
        this.parentNode = null;
        this.node = document.createElement("tr");
        for (var i = 0; i < 6; i+=1){
            this.node.appendChild(document.createElement("td"));
        }
        this.viewDescription();
    };

    elist.ExpenseView.inheritFrom(elist.BaseView);

    elist.ExpenseView.prototype.viewDescription = function(){
        var model = this.model;
        var td = this.node.children[0];
        var update = function(){
            var text = document.createTextNode(model.description.get());
            elist.empty(td).appendChild(text);
        };
        model.description.notify(update);
        update();
    };

}());

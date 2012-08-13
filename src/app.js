/**
 * Created by Igor Zalutsky on 12.08.12 at 1:41
 */

(function () {
    "use strict";
    // publishing namespace
    if (!window.elist) {
        window.elist = {};
    }
    var elist = window.elist;

    elist.ready(function(){
        var model = new elist.ExpenseModel(13);
        model.description.set("Description");
        model.amount.set(13);

        var view = new elist.EditableView(model.amount, "AmountView", "InputEdit", "number");


        var div = document.createElement("div");
        view.renderTo(div);

        document.body.appendChild(div);

        setTimeout(function(){
            model.description.set("Updated");
        }, 1000);
    });



}());

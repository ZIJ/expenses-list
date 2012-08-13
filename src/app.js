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
        model.description.set("Some text");
        model.amount.set(13);

        var view = new elist.ExpenseView(model);

        var table = document.createElement("table");
        view.renderTo(table);

        document.body.appendChild(table);
        /*
        setTimeout(function(){
            model.description.set("Updated");
        }, 1000);
        */
    });



}());

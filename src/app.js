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
        //var view = new elist.ExpenseView(model);
        var view = new elist.TextEdit(model.description);
        view.on("saveRequest", function(){
            model.description.set(model.description.get() + " | ");
        });

        var div = document.createElement("div");
        view.renderTo(div);

        document.body.appendChild(div);

        setTimeout(function(){
            model.description.set("Updated");
        }, 1000);
    });



}());

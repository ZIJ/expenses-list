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


    elist.ready(function(){                                     // waiting for DOM

        var model = new elist.AppModel(elist.descriptors);      // creating model of application

        var view = new elist.AppView(model);                    // creating view for our model

        view.renderTo(document.body);                           // rendering our view

    });

}());

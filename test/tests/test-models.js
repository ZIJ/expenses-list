/**
 * Created by Igor Zalutsky on 12.08.12 at 19:38
 */

// registering QUnit globals for JSHint
/*global test:false asyncTest:false start:false expect:false ok:false */

(function () {
    "use strict";
    // publishing namespace
    if (!window.elist) {
        window.elist = {};
    }
    var elist = window.elist;

    test("expenseModel", function() {
        expect(4);
        var model = new elist.ExpenseModel(13, { amount: 100 });
        ok(model.id === 13, "ID assigned");
        ok(model.description instanceof elist.ObservableProperty, "Property is Observable");
        ok(model.date.get() instanceof Date, "Date value is Date");
        ok(model.amount.get() === 100, "Properties pre-assign works");
    });

}());

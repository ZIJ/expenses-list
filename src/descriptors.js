/**
 * Created by Igor Zalutsky on 15.08.12 at 1:14
 */

(function () {
    "use strict";
    // publishing namespace
    if (!window.elist) {
        window.elist = {};
    }
    var elist = window.elist;

    /**
     * Setings for initial ExpenseModels
     * @type {Array}
     */
    elist.descriptors = [
        {
            id: 1,
            props: {
                description: "Корм коту",
                date: new Date("8.13.2012"),
                amount: 5
            }
        },{
            id: 2,
            props: {
                description: "Батарейки",
                date: new Date("8.12.2012"),
                amount: 3
            }
        },{
            id: 3,
            props: {
                description: "Хот-дог",
                date: new Date("8.14.2012"),
                amount: 2
            }
        },{
            id: 4,
            props: {
                description: "Молоко",
                date: new Date("8.10.2012"),
                amount: 1,
                isActive: false
            }

        },{
            id: 5,
            props: {
                description: "Интернет",
                date: new Date("8.9.2012"),
                amount: 20,
                isActive: false
            }

        },{
            id: 6,
            props: {
                description: "Носки",
                date: new Date("8.11.2012"),
                amount: 5,
                isActive: false
            }
        }
    ];

}());

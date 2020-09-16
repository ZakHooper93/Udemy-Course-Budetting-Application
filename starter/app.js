//BUDGET CONTROLLER
var budgetController = (function () {
    //Making a function constructor for the future objects that will be created when a budget entry is made by the user. This one is for expenses.
    var Expense = function (id, desciption, value) {
        this.id = id;
        this.desciption = desciption;
        this.value = value;
    };

    //Making a function constructor for the future objects that will be created when a budget entry is made by the user. This one is for incomes.
    var Income = function (id, desciption, value) {
        this.id = id;
        this.desciption = desciption;
        this.value = value;
    };

    //Instead of making many variables to keep track of each...well, variable, it's better to store them all in one object, just like with the DOMstrings.
    //An array would be the ideal data structure for the objects created by the above function constructors.
    var data = {
        allItems: {
            expense: [],
            income: [],
        },
        totals: {
            expense: 0,
            income: 0,
        },
    };
})();

//UI CONTROLLER
//Have all the DOM class/Id's in a single object to adhere to DRY and to make changing code easier in the future.
var UIController = (function () {
    var DOMstrings = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        inputButton: ".add__btn",
    };
    return {
        //This function obtains the data from the three fields of the budgetting app. It uses a reference to the DOMstrings object instead of hardcoding (DRY).
        getinput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value, //Value will be inc for income, or exp for expense.
                desciption: document.querySelector(DOMstrings.inputDescription).value, //Input for description of whatever expense/income.
                value: document.querySelector(DOMstrings.inputValue).value, //The actual monetary value of the expense/income.
            };
        },
        //Simple function to return the DOMstrings object into the global scope so that it can be used by other controllers.
        getDOMstrings: function () {
            return DOMstrings;
        },
    };
})();

//GLOBAL APP CONTROLLER
//Uses the two other modules as arguments to access their available methods.
var controller = (function (budgetCtrl, UICtrl) {
    var setupEventListeners = function () {
        //Access the previously returned DOMstrings by assigning it to a new variable in this scope. Next time don't forget to actually call the function! I forgot the ()!
        var DOM = UICtrl.getDOMstrings();
        //Adding an even listener for the add button, to run the function ctrlAddItem on click.
        document.querySelector(DOM.inputButton).addEventListener("click", ctrlAddItem);

        //Adding a global event listener for the keypress "Enter" which has a keycode of 13. When pressed, run ctrlAddItem.
        document.addEventListener("keypress", function (event) {
            if (event.keycode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
    };

    //ctrlAddItem function adds the item in the input field onto the budgetting app.
    var ctrlAddItem = function () {
        // 1. Get the field input data.
        var input = UICtrl.getinput();
        // 2. Add the item to the budget controller.

        // 3. Add the item to the UI.

        // 4. Calculate the budget.

        // 5. Display the budget on the UI.
    };
    return {
        init: function () {
            console.log("Application has started.");
            setupEventListeners();
        },
    };
})(budgetController, UIController); //Passing the two modules into the IIFE so they can be used as arguments on the inner functions.

//Initialisation function to activate the data input fields event listeners. Keeping them all within one function helps keep the code tidier.
controller.init();

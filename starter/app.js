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
            exp: [],
            inc: [],
        },
        totals: {
            exp: 0,
            inc: 0,
        },
    };

    return {
        addItem: function (type, des, val) {
            var newItem;
            //Create a new unique ID for each entry. This particular declaration ensures no duplicates are created when items are removed from the array, which may be the case if we based ID's purely
            //on the array length.
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            //Create a new instance based on the input type + or - in the UI.
            if (type === "exp") {
                newItem = new Expense(ID, des, val);
            } else if (type === "inc") {
                newItem = new Income(ID, des, val);
            }

            //Push that new instance into the appropriate array, inside of the "data" object.
            data.allItems[type].push(newItem);

            //Return the new item.
            return newItem;
        },
        testing: function () {
            console.log(data);
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
        incomeContainer: ".income__list",
        expensesContainer: "expenses__list",
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

        addListItem: function (obj, type) {
            var html, newHtml, element;
            //Create HTML string with placeholder text
            if (type === "inc") {
                element = DOMstrings.incomeContainer;
                var html =
                    '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === "exp") {
                element = DOMstrings.expensesContainer;
                var html =
                    '<div class="item clearfix" id="%expense-%id%"><div class="item__description">"%Description%"</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            //Replace the placeholder text with some actual data
            newHtml = html.replace("%id%", obj.id);
            newHtml = newHtml.replace("%description%", obj, description);
            newHtml = newHtml.replace("%value%", obj.value);

            //Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
        },
        //Simple function to return the DOMstrings object into the global scope so that it can be used by other controllers.
        getDOMstrings: function bob() {
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
        var input, newItem;
        // 1. Get the field input data.
        var input = UICtrl.getinput();
        // 2. Add the item to the budget controller.
        var newItem = budgetController.addItem(input.type, input.desciption, input.value);
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

//BUDGET CONTROLLER
var budgetController = (function () {
    //Making a function constructor for the future objects that will be created when a budget entry is made by the user. This one is for expenses.
    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function (totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100)
        }
    }

    Expense.prototype.getPercentage = function () {
        return this.percentage;
    }

    //Making a function constructor for the future objects that will be created when a budget entry is made by the user. This one is for incomes.
    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    //A function to calculate the total of all of the entries for both incomes and expenses.
    var calculateTotal = function (type) {
        var sum = 0;
        data.allItems[type].forEach(function (cur) {
            sum += cur.value;
        });
        data.totals[type] = sum;
    }

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
        budget: 0,
        percentage: -1,
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

        deleteItem: function (type, id) {
            var ids, index;

            ids = data.allItems[type].map(function (current) {
                return current.id;
            })

            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1)
            }
        },

        //Function to calculate the available budget and to calculate the percentage of the budget that has been used.
        calculateBudget: function () {
            //Calculat total income and expenses
            calculateTotal("exp");
            calculateTotal("inc");

            //Calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            //Calculate the percentage of income that we spent. We only want this to run when we actually have a budget, hence the if statement.
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },

        calculatePercentages: function () {
            data.allItems.exp.forEach(function (cur) {
                cur.calcPercentage(data.totals.inc);
            })
        },

        getPercentage: function () {
            var allPerc = data.allItems.exp.map(function (cur) {
                return cur.getPercentage();
            })

            return allPerc;
        },

        //returns all of the budget information in an object.
        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage,
            }
        },

        //Quick function displays data entered from the UI.
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
        expensesContainer: ".expenses__list",
        budgetLabel: ".budget__value",
        incomeLabel: ".budget__income--value",
        expenseLabel: ".budget__expenses--value",
        percentageLabel: ".budget__expenses--percentage",
        container: ".container",
        expensesPercLabel: ".item__percentage",
        dateLabel: ".budget__title--month",
    };

    return {
        //This function obtains the data from the three fields of the budgetting app. It uses a reference to the DOMstrings object instead of hardcoding (DRY).
        getinput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value, //Value will be inc for income, or exp for expense.
                description: document.querySelector(DOMstrings.inputDescription).value, //Input for description of whatever expense/income.
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value), //The actual monetary value of the expense/income. parseFloat converts string to floating number.
            };
        },

        //Function to update the UI when a new item is added to the budget.
        addListItem: function (obj, type) {
            var html, newHtml, element;

            //Create HTML string with placeholder text
            if (type === "inc") {
                element = DOMstrings.incomeContainer;
                var html =
                    '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === "exp") {
                element = DOMstrings.expensesContainer;
                var html =
                    '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            //Replace the placeholder text with some actual data using the replace method.
            newHtml = html.replace("%id%", obj.id);
            newHtml = newHtml.replace("%description%", obj.description);
            newHtml = newHtml.replace("%value%", this.formatNumber(obj.value, type));

            //Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
        },

        deleteListItem: function (selectorID) {
            var el = document.getElementById(selectorID)
            el.parentNode.removeChild(el)
        },

        //A function to clear the input fields once an entry has been made.
        clearFields: function () {
            var fields;

            fields = document.querySelectorAll(DOMstrings.inputDescription + "," + DOMstrings.inputValue);
            var fieldsArr = Array.prototype.slice.call(fields); //Use the slice method to...I don't really know how this works, need to look into it some more.

            //A new loop I haven't used yet, forEach. It works for every item in the given array.
            //Used to replace the description and value back to an empty form and to focus back on the first input box (description)
            fieldsArr.forEach(function (current, index, array) {
                current.value = "";
            });

            //Focus back on the description field after entering an entry.
            fieldsArr[0].focus();
        },

        //Displays the total budget, incomes and expenses in the UI, with additional if/else statement to only show percentage if it > 0, or else it looks weird.
        displayBudget: function (obj) {
            obj.budget > 0 ? type = "inc" : type = "exp";
            document.querySelector(DOMstrings.budgetLabel).textContent = this.formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = this.formatNumber(obj.totalInc, "inc");
            document.querySelector(DOMstrings.expenseLabel).textContent = this.formatNumber(obj.totalExp, "exp");

            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + "%";
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = "---";
            }
        },

        displayPercentages: function (percentages) {
            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

            var nodeListForEach = function (list, callback) {
                for (var i = 0; i < list.length; i++) {
                    callback(list[i], i)
                }
            }

            nodeListForEach(fields, function (current, index) {
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + "%";
                } else {
                    current.text = "---";
                }
            })
        },

        formatNumber: function (num, type) {
            var numSplit, int, dec;

            num = Math.abs(num); // Math.abs returns the absolute value of a number. This means no negative numbers.
            num = num.toFixed(2); // num.toFixed() limits number to 2 decimal places. Handy for currencies.
            numSplit = num.split(".");
            int = numSplit[0];
            dec = numSplit[1];
            if (int.length > 3) {
                int = int.substr(0, (int.length - 3)) + "," + int.substr((int.length - 3), 3); //e.g 2310, output = 2,310
            }
            return (type === "exp" ? sign = "-" : sign = "+") + " " + int + "." + dec;
        },

        displayMonth: function () {
            var now, year, month, months
            var now = new Date()
            console.log(now);
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
            month = months[now.getMonth()];
            year = now.getFullYear();
            document.querySelector(DOMstrings.dateLabel).textContent = month + " " + year;
        },

        changedType: function () {
            var fields = document.querySelectorAll(
                DOMstrings.inputType + "," +
                DOMstrings.inputDescription + "," +
                DOMstrings.inputValue
            );
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

        //Added an event listener to run the ctrlDeleteItem function on click, when the DOM.container is clicked. This is the delete button on the UI.
        document.querySelector(DOM.container).addEventListener("click", ctrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener("change", UICtrl.changedType);
    };

    var updateBudget = function () {

        // 1. Calculate the budget.
        budgetCtrl.calculateBudget();

        // 2. Returns the budget
        var budget = budgetCtrl.getBudget();

        // 3. Display the budget on the UI.
        UICtrl.displayBudget(budget);
    };

    var updatePercentages = function () {
        //1. Calculate percentages
        budgetCtrl.calculatePercentages();

        //2. Read percentages from the budget controller
        var percentages = budgetCtrl.getPercentage();

        //3. Update the UI with the new percentages.
        UICtrl.displayPercentages(percentages);
    };

    //ctrlAddItem function adds the item in the input field onto the budgetting app.
    var ctrlAddItem = function () {
        var input, newItem;

        // 1. Get the field input data.
        var input = UICtrl.getinput();

        //isNaN is a built in function that detects if the argument given is NaN. In this case we use it to ensure the buget entry is valid.
        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            // 2. Add the item to the budget controller.
            var newItem = budgetController.addItem(input.type, input.description, input.value);

            // 3. Add the item to the UI.
            UICtrl.addListItem(newItem, input.type);

            // 4.Clear the fields
            UICtrl.clearFields();

            // 5. Calculate and update budget
            updateBudget();

            // 6. Calculate and update percentages
            updatePercentages();
        }
    };

    //Function to remove an item from the budget and reflect the changes in the UI.
    var ctrlDeleteItem = function (event) {
        var itemID, splitID, type, ID;

        //Selecting the correct DOM using DOM traversal. Might not be the best way of doing this but it's ok for now.
        itemID = (event.target.parentNode.parentNode.parentNode.parentNode.id)

        //Splitting the ID of the budgetting entry container into an array, using "-" as a "splitting point".
        //This allows us to seperate the string into different usable parts.
        if (itemID) {
            splitID = itemID.split("-");
            type = splitID[0]
            ID = parseInt(splitID[1]); //Need to parseInt to convert the string to a workable integer in the array, otherwise it just won't work.

            //1. Delete item from the data structure.
            budgetCtrl.deleteItem(type, ID);

            //2. Delete the item from the user interface.
            UICtrl.deleteListItem(itemID);

            //3. Update and show the new budget.
            updateBudget()

            //4. Calculate and update percentages
            updatePercentages();
        }
    };

    //A test initialisation function to ensure it's all loaded. To be called at the end of the code.
    return {
        init: function () {
            console.log("Application has started.");
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: 0,
            });
            setupEventListeners();
            UICtrl.displayMonth();
        }
    };
    //Initialisation function to show the console the application has successfully loaded.

})(budgetController, UIController); //Passing the two modules into the IIFE so they can be used as arguments on the inner functions.


//Initialisation function to activate the data input fields event listeners. Keeping them all within one function helps keep the code tidier.
controller.init();
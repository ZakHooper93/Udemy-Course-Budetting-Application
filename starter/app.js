//BUDGET CONTROLLER
var budgetController = (function () {
    //Some Code
})();

//UI CONTROLLER
var UIController = (function () {
    //Some Code
})();

//GLOBAL APP CONTROLLER
var controller = (function (budgetCtrl, UICtrl) {
    var ctrlAddItem = function () {
        // 1. Get the field input data.
        // 2. Add the item to the budget controller.
        // 3. Add the item to the UI.
        // 4. Calculate the budget.
        // 5. Display the budget on the UI.}

        document.querySelector(".add__btn").addEventListener("click", function () {});
        document.addEventListener("keypress", function (event) {
            if (event.keycode === 13 || event.which === 13) {
                console.log("Enter was pressed");
            }
        });
    };
})(budgetController, UIController);

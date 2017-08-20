/**
 * Class representing contradiction.
 * @returns {} 
 */
function ContradictionItem() {
    this.init();
    this.createControllers();
}

inheritsFrom(ContradictionItem, StatementItem);

/**
 * Initialize controllers
 * @returns {} 
 */
ContradictionItem.prototype.createControllers = function () {
    this.divItem.className += EnumItem.CONTRA;

    var divText = document.createElement("div");
    divText.className = "controller";
    var spanCs = document.createElement("span");
    var spanEn = document.createElement("span");
    spanCs.className = "cs";
    spanEn.className = "en";
    spanCs.innerHTML = "Spor";
    spanEn.innerHTML = "Contra-diction";
    divText.appendChild(spanCs);
    divText.appendChild(spanEn);

    this.divContent.appendChild(divText);
};

/**
 * Checks if step can represent valid contradiction step
 * @returns boolean if step represents contradiction step
 */
ContradictionItem.prototype.matchesContradiction = function (dividedPremises) {
    return dividedPremises.mask === "2;0;0" &&
        dividedPremises.languageItems[0].sameAs(dividedPremises.languageItems[1], false);
}

/**
 * Contradiction item does not have duplicate button.
 * @returns false 
 */
ContradictionItem.prototype.hasDuplicateButton = function () {
    return false;
}

/**
 * Checks if specified connection button should be present
 * @param index of button (0...top, 1...bottom)
 * @returns boolean if connection button should be present
 */
ContradictionItem.prototype.hasConnectionButton = function(index) {
    return [true, false][index % 2];
}

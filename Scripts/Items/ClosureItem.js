/**
 * Class representing closure property of language class
 * @returns {} 
 */
function ClosureItem() {
	this.init();
    this.createControllers();
}

inheritsFrom(ClosureItem, StatementItem);

/**
 * Initialize controllers.
 * @returns {} 
 */
ClosureItem.prototype.createControllers = function() {
    this.divItem.className += EnumItem.CLOSURE;

    this.controllerLanguageClass = getBilingualSelect(classes);
    this.controllerLanguageClass.onchange = function () {
        checkProof();
    };

    this.divText = document.createElement("div");
    var spanCs = document.createElement("span");
    var spanEn = document.createElement("span");
    spanCs.className = "cs";
    spanEn.className = "en";
    spanCs.innerHTML = "uzavřeny na";
    spanEn.innerHTML = "closed under";

    this.divText.appendChild(spanCs);
    this.divText.appendChild(spanEn);

    this.controllerOperation = getBilingualSelect(operations);
    this.controllerOperation.onchange = function () {
        checkProof();
    };

    this.divText.className = "controller";
    this.divContent.appendChild(this.controllerLanguageClass);
    this.divContent.appendChild(this.divText);
    this.divContent.appendChild(this.controllerOperation);
}

/**
 * Copy info from another closure statement during duplication.
 * @param template  source of data for copy
 * @returns {}
 */
ClosureItem.prototype.copyInfo = function (template) {
    this.setProperties(template.getLanguageClassIndex(), template.getOperationIndex());
};

/**
 * Check if closure statement is valid closure property of language class.
 * @returns boolean if closure statement is valid 
 */
ClosureItem.prototype.isValid = function () {
    var operationIndex = this.getOperationIndex();
    var languageClassIndex = this.getLanguageClassIndex();
	return languageClassIndex >= 0 && languageClassIndex < classes.length &&
			operationIndex >= 0 && operationIndex < operations.length &&
			closures[languageClassIndex][operationIndex];
};

/**
 * Get selected operation from dropdown controller.
 * @returns index as operation enum 
 */
ClosureItem.prototype.getOperationIndex = function () {
    return Math.floor(this.controllerOperation.selectedIndex / 2);
}

/**
 * Get selected language class from dropdown controller
 * @returns selected index as language class enum
 */
ClosureItem.prototype.getLanguageClassIndex = function () {
    return Math.floor(this.controllerLanguageClass.selectedIndex / 2);
}

/**
 * Sets properties of closure statement. If property is null, then no change is made.
 * @param {} enumClass      new language class enum 
 * @param {} enumOperation  new operation enum 
 * @returns {} 
 */
ClosureItem.prototype.setProperties = function (enumClass, enumOperation) {
    var lang = getLanguage();
    if (enumClass !== null) {
        this.controllerLanguageClass.selectedIndex = enumClass * 2 + (lang === "cs" ? 0 : 1);
    }
    if (enumOperation !== null) {
        this.controllerOperation.selectedIndex = enumOperation * 2 + (lang === "cs" ? 0 : 1);
    }
}

/**
 * Closure property is colored depending on its validity
 * @returns {} 
 */
ClosureItem.prototype.colorAtStart = function (solution) {
    this.isValid() ? this.setDeduced(EnumState.CORRECT): this.setDeduced(EnumState.WRONG);
};

/**
 * Checks if specified connection button should be present
 * @param index of button (0...top, 1...bottom)
 * @returns boolean if connection button should be present
 */
ClosureItem.prototype.hasConnectionButton = function (index) {
    return [false, true][index % 2];
};
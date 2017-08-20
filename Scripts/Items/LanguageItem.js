/**
 * Class representing universal statement of language and language class
 * @returns {} 
 */
function LanguageItem() {
    this.init();
    this.isNegated = false;
    this.languageName = new LanguageName(EnumOperation.ATOMIC, EnumName.NEW, null);
    this.createControllers();
    this.applyNegation();
}

inheritsFrom(LanguageItem, StatementItem);

/**
 * Initialize controllers
 * @returns {} 
 */
LanguageItem.prototype.createControllers = function () {
    var thisItem = this;
    this.divItem.className += EnumItem.LANGUAGE;

    this.controllerLanguageName = document.createElement("button");
    this.controllerLanguageName.innerHTML = this.languageName.printFriendlyName();

    this.controllerLanguageName.onmousedown = function () {
        if (thisItem.isEditorClosed()) {
            thisItem.openEditor();
        }
    };

    this.controllerNegated = document.createElement("button");
    this.controllerNegated.onmousedown = function () {
        thisItem.negate();
        checkProof();
    };

    this.controllerLanguageClass = getBilingualSelect(classes);
    this.controllerLanguageClass.onchange = function () {
        checkProof();
    };

    this.controllerLanguageName.className = "controller";
    this.controllerNegated.className = "controller";
    this.divContent.appendChild(this.controllerLanguageName);
    this.divContent.appendChild(this.controllerNegated);
    this.divContent.appendChild(this.controllerLanguageClass);
}

/**
 * Copy info from another language statement during duplication.
 * @param template  source of data for copy
 * @returns {}
 */
LanguageItem.prototype.copyInfo = function (template) {
    this.setProperties(template.languageName, template.isNegated, template.getLanguageClassIndex());
};

/**
 * Perform negation of statement
 * @returns {} 
 */
LanguageItem.prototype.negate = function() {
	this.isNegated = !this.isNegated;
	this.applyNegation();	
};

/**
 * Write symbol if language is in language class or not.
 * @returns {} 
 */
LanguageItem.prototype.applyNegation = function() {
	this.controllerNegated.innerHTML = this.isNegated ? "&#8713" : "&#8712";
};

/**
 * Overriding function for possible matching subset step.
 * Check if statement can be deduced using language class of concrete or language statement
 * @param premiseItems  list of premises
 * @returns boolean if statement can be deduced from premises 
 */
LanguageItem.prototype.matchesSubset = function(premiseItems) {
	var other;
	//1 Language
	if (premiseItems.mask === "1;0;0") {
		other = premiseItems.languageItems[0];
		return this.languageName.sameAs(other.languageName) &&
			this.isNegated === other.isNegated && (this.isNegated ? 
			(this.getLanguageClassIndex() <= other.getLanguageClassIndex()) :
			(this.getLanguageClassIndex() >= other.getLanguageClassIndex()));
	}
	//1 Concrete
	else if (premiseItems.mask === "0;0;1") {
		other = premiseItems.concreteItems[0];
			return this.languageName.sameAs(other.languageName) && (this.isNegated ? 
				concreteLanguages[other.getConcreteLanguageIndex()].CLASS > this.getLanguageClassIndex() :
				concreteLanguages[other.getConcreteLanguageIndex()].CLASS <= this.getLanguageClassIndex());
	}
	return false;
};

/**
 * Overriding function for possible matching operation step.
 * Tries to build deduction step from premises. Current item is conclusion.
 * Step then is passed to rule matching function. 
 * @param premiseItems  list of premises
 * @returns boolean if statement can be deduced from premises 
 */
LanguageItem.prototype.matchesOperation = function(premiseItems) {
	var operationId = this.languageName.operationId;
	if (isExpansion(operationId) || isAtomic(operationId) || this.isNegated) {
		return false;
	}
	var first;
	var closure;
	var resultName;
	//1 Language, 1 Closure
	if (isUnary(operationId)) {
	    if (premiseItems.mask === "1;1;0") {
	        first = premiseItems.languageItems[0];
	        closure = premiseItems.closureItems[0];
	        resultName = new LanguageName(closure.getOperationIndex(), first.languageName, null);
	        return resultName.sameAs(this.languageName) &&
	            !first.isNegated &&
	            areSame([
	                this.getLanguageClassIndex(), first.getLanguageClassIndex(),
	                closure.getLanguageClassIndex()
	            ]);
	    }
	}
	var firstName = null;
	var secondName = null;
	var firstValue = null;
	var secondValue = null;
	//Binary operation
	switch (premiseItems.mask) {
		//2 Language, 1 Closure
		case "2;1;0" : {
			first = premiseItems.languageItems[0];
			var second = premiseItems.languageItems[1];
			closure = premiseItems.closureItems[0];
			if (first.isNegated || second.isNegated || this.isNegated ||
				!areSame([this.getLanguageClassIndex(), first.getLanguageClassIndex(),
						second.getLanguageClassIndex(), closure.getLanguageClassIndex()])) {
				return false;
			}
						
			resultName = new LanguageName(closure.getOperationIndex(), first.languageName, second.languageName);
		    return this.languageName.sameAs(new LanguageName(closure.getOperationIndex(),
		            first.languageName,
		            second.languageName)) ||
		        this.languageName.sameAs(new LanguageName(closure.getOperationIndex(),
		            second.languageName,
		            first.languageName));
		}
		//2 Language
		case "2;0;0": {
			if (premiseItems.languageItems[0].isNegated ||  premiseItems.languageItems[1].isNegated) {
				return false;
			}				
			firstName = premiseItems.languageItems[0].languageName;
			firstValue = premiseItems.languageItems[0].getLanguageClassIndex();
			secondName = premiseItems.languageItems[1].languageName;
			secondValue = premiseItems.languageItems[1].getLanguageClassIndex();
			break;
		}
		//1 Language
		case "1;0;0" : {
			if (premiseItems.languageItems[0].isNegated) {
				return false;
			}	
			firstName = premiseItems.languageItems[0].languageName;
			firstValue = premiseItems.languageItems[0].getLanguageClassIndex();
			//must find second name
			if (firstName.sameAs(this.languageName.language1Name)) {
				secondName = this.languageName.language2Name;
			}
			else if (firstName.sameAs(this.languageName.language2Name)) {
				secondName = this.languageName.language1Name;
			}
			else {
				return false;
			}
			break;
		}		
		//1 Language, 1 Concrete
		case "1;0;1" : {
			if (premiseItems.languageItems[0].isNegated) {
				return false;
			}	
			firstName = premiseItems.languageItems[0];
			firstValue = premiseItems.languageItems[0].getLanguageClassIndex();
			secondName = premiseItems.concreteItems[0];
			break;
		}
		default : {
			return false;
		}
	}
	return (this.languageName.sameAs(new LanguageName(operationId, firstName, secondName)) && 
            this.matchesOperationRule(languageRules, operationId, firstValue, secondValue, this.getLanguageClassIndex())) ||
	        (this.languageName.sameAs(new LanguageName(operationId, secondName, firstName)) && 
	        this.matchesOperationRule(languageRules, operationId, secondValue, firstValue, this.getLanguageClassIndex()));	
};

/**
 * Overriding function for possible matching set equality step.
 * @param premiseItems  list of premises
 * @returns boolean if statement can be deduced from premises 
 */
LanguageItem.prototype.matchesSetEquality = function(premiseItems) {
    if (premiseItems.mask !== "1;0;0") {
		return false;
	}
	var premise = premiseItems.languageItems[0]; 
	return (premise.isNegated === this.isNegated && premise.getLanguageClassIndex() === this.getLanguageClassIndex() && this.matchesSetEqualityRule(premise.languageName));
} ;

/**
 * Check if statements are same or different 
 * @param other         other language statement
 * @param sameNegation  determine if statements must have same or different negation
 * @returns boolean if statements are same or not
 */
LanguageItem.prototype.sameAs = function(other, sameNegation) {
    return other instanceof LanguageItem && sameNegation === (this.isNegated === other.isNegated) &&
		this.languageName.sameAs(other.languageName) && 
		this.getLanguageClassIndex() === other.getLanguageClassIndex();
};

/**
 * Get selected language class from dropdown controller
 * @returns selected index as language class enum
 */
LanguageItem.prototype.getLanguageClassIndex = function () {
    return Math.floor(this.controllerLanguageClass.selectedIndex / 2);
}

/**
 * Sets properties of language statement. If property is null, then no change is made.
 * @param {} languageName   new name
 * @param {} isNegated      new negation
 * @param {} enumClass      new language class enum
 * @returns {} 
 */
LanguageItem.prototype.setProperties = function (languageName, isNegated, enumClass) {
    var lang = getLanguage();
    if (languageName !== null) {
        this.languageName = languageName;
        this.controllerLanguageName.innerHTML = this.languageName.printFriendlyName();
    }
    if (isNegated !== null && isNegated !== this.isNegated) {
        this.negate();
    }
    if (enumClass !== null) {
        this.controllerLanguageClass.selectedIndex = enumClass * 2 + (lang === "cs" ? 0 : 1);
    }
}

/**
 * Language statements have to be assumed to be green at the beginning of the proof
 * @returns {} 
 */
LanguageItem.prototype.colorAtStart = function (solution) {
    if (solution.isKnown(this, true)) {
        this.setDeduced(EnumState.CORRECT);
    }
};

/**
 * Checks if specified connection button should be present
 * @param index of button (0...top, 1...bottom)
 * @returns boolean if connection button should be present
 */
LanguageItem.prototype.hasConnectionButton = function (index) {
    return [true, true][index % 2];
};
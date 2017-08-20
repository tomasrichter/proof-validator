/**
 * Class representing assigning concrete set to a language
 * @returns {} 
 */
function ConcreteItem() {
    this.init();
    this.languageName = new LanguageName(EnumOperation.ATOMIC, EnumName.NEW, null);
    this.createControllers();
}

inheritsFrom(ConcreteItem, StatementItem);

/**
 * Initialize controllers.
 * @returns {} 
 */
ConcreteItem.prototype.createControllers = function () {
    var thisItem = this;
    this.divItem.className += EnumItem.CONCRETE;

    this.controllerLanguageName = document.createElement("button");
    this.controllerLanguageName.innerHTML = this.languageName.printFriendlyName();

    this.controllerLanguageName.onmousedown = function () {
        if (thisItem.isEditorClosed()) {
            thisItem.openEditor();
        }
    };

    this.divText = document.createElement("div");
    this.divText.innerHTML = "=";

    this.controllerConcreteLanguage = document.createElement("select");
    var optGroupAb = document.createElement("optgroup");
    optGroupAb.label = EnumAlphabet.AB;
    var optGroupAbc = document.createElement("optgroup");
    optGroupAbc.label = EnumAlphabet.ABC;
    for (var i = 0; i < concreteLanguages.length; i++) {
        switch (i) {
            //a,b
        case EnumConcreteLanguage.AMBN: {
            this.controllerConcreteLanguage.appendChild(optGroupAb);
        }
        case EnumConcreteLanguage.COAB: {

        }
        case EnumConcreteLanguage.ANBN:
            {
                optGroupAb.appendChild(new Option(concreteLanguages[i].VIEW));
                break;
            }

        //a,b,c
        case EnumConcreteLanguage.ANBNCN: {
            this.controllerConcreteLanguage.appendChild(optGroupAbc);
        }
        case EnumConcreteLanguage.AIBJCK:
            {
                optGroupAbc.appendChild(new Option(concreteLanguages[i].VIEW));
                break;
            }

        default: {
            this.controllerConcreteLanguage.options.add(new Option(concreteLanguages[i].VIEW));
        }
        }
    }
    this.controllerConcreteLanguage.onchange = function () {
        checkProof();
    };

    this.controllerLanguageName.className = "controller";
    this.divText.className = "controller";
    this.controllerConcreteLanguage.className = "controller smaller";
    this.divContent.appendChild(this.controllerLanguageName);
    this.divContent.appendChild(this.divText);
    this.divContent.appendChild(this.controllerConcreteLanguage);
}

/**
 * Copy info from another concrete statement during duplication.
 * @param template  source of data for copy
 * @returns {}
 */
ConcreteItem.prototype.copyInfo = function(template) {
    this.setProperties(template.languageName, template.getConcreteLanguageIndex());
};

/**
 * Check if another statement allows to assign concrete value to language.
 * There must not be same atomic language in both languages (except the case when statements are same).
 * @param other     other concrete statement containing language name
 * @returns boolean    
 */
ConcreteItem.prototype.allowSubstitutions = function (other) {
    if (!(other instanceof ConcreteItem)) {
        return true;
    }
	var thisList = this.languageName.getListOfNames();
	var otherList = other.languageName.getListOfNames();
	if (this.languageName.sameAs(other.languageName) && 
		this.getConcreteLanguageIndex() === other.getConcreteLanguageIndex()) {
		return true;
	}
	for (var i = 0; i < thisList.length;i++) {
		for (var j = 0; j < otherList.length;j++) {
			if (thisList[i].sameAs(otherList[j])) {
				return false;
			}
		}
	}
	return true;
};

/**
 * Overriding function for possible matching operation step.
 * Tries to build deduction step from premises. Current item is conclusion.
 * Step then is passed to rule matching function. 
 * @param premiseItems  list of premises
 * @returns boolean if statement can be deduced from premises 
 */
ConcreteItem.prototype.matchesOperation = function(premiseItems) {
    var operationId = this.languageName.operationId;
    var firstName;
    var firstValue;
    var secondName;
    var secondValue = null;
	if (isAtomic(operationId) || isExpansion(operationId)) {
		return false;
	}
	//1 Concrete premise
	if (isUnary(operationId)) {
	    if (premiseItems.mask === "0;0;1") {
	        return this.languageName.sameAs(new LanguageName(operationId, premiseItems.concreteItems[0].languageName, null)) &&
                this.matchesOperationRule(
                    concreteRules,
	                operationId,
	                premiseItems.concreteItems[0].getConcreteLanguageIndex(),
	                null,
	                this.getConcreteLanguageIndex());
	    }
	    return false;
	}
	//Binary operation
	switch (premiseItems.mask) {
		//2 Concrete premises
		case "0;0;2" : {
			firstName = premiseItems.concreteItems[0].languageName;
			firstValue = premiseItems.concreteItems[0].getConcreteLanguageIndex();
			secondName = premiseItems.concreteItems[1].languageName;
			secondValue = premiseItems.concreteItems[1].getConcreteLanguageIndex();
			break;
		}
		//1 Language, 1 Concrete
		case "1;0;1" : {
			firstName = premiseItems.languageItems[0].languageName;
			firstValue = premiseItems.languageItems[0].getLanguageClassIndex();
			secondName = premiseItems.concreteItems[0].languageName;
			secondValue = premiseItems.concreteItems[0].getConcreteLanguageIndex();
			break;
		}
		//1 Concrete
		case "0;0;1" : {
			firstName = premiseItems.concreteItems[0].languageName;
			firstValue = premiseItems.concreteItems[0].getConcreteLanguageIndex();
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
		default: {
			return false;
		}
	}
	
	return (this.languageName.sameAs(new LanguageName(operationId, firstName, secondName)) &&
			this.matchesOperationRule(concreteRules, operationId, firstValue, secondValue, this.getConcreteLanguageIndex())) ||
	        (this.languageName.sameAs(new LanguageName(operationId, secondName, firstName)) &&
	        this.matchesOperationRule(concreteRules, operationId, secondValue, firstValue, this.getConcreteLanguageIndex()));
};

/**
 * Overriding function for possible matching set equality step.
 * @param premiseItems  list of premises
 * @returns boolean if statement can be deduced from premises 
 */
ConcreteItem.prototype.matchesSetEquality = function(premiseItems) {
    if (premiseItems.mask !== "0;0;1") {
		return false;
	}
	var premise = premiseItems.concreteItems[0]; 
	return (premise.isNegated === this.isNegated &&
            premise.getConcreteLanguageIndex() === this.getConcreteLanguageIndex() &&
            this.matchesSetEqualityRule(premise.languageName));
};

/**
 * Get selected index of concrete language from dropdown controller
 * @returns selected index as concrete language enum
 */
ConcreteItem.prototype.getConcreteLanguageIndex = function() {
    return this.controllerConcreteLanguage.selectedIndex;
}

/**
 * Sets properties of concrete statement. If property is null, then no change is made.
 * @param {} languageName   new name 
 * @param {} enumConcrete   new concrete language enum
 * @returns {} 
 */
ConcreteItem.prototype.setProperties = function (languageName, enumConcrete) {
    if (languageName !== null) {
        this.languageName = languageName;
        this.controllerLanguageName.innerHTML = this.languageName.printFriendlyName();
    }
    if (enumConcrete !== null) {
        this.controllerConcreteLanguage.selectedIndex = enumConcrete;
    }
}

/**
 * Concrete statements are checked through all beginning elements of proof.
 * @returns {} 
 */
ConcreteItem.prototype.colorAtStart = function (solution) {
    if (solution.method !== EnumMethod.DISPROOF) {
        this.setDeduced(EnumState.WRONG);
        solution.addMessage({
            ENGLISH: "You can use concrete statements only while disproving. ",
            CZECH: "Konkrétní tvrzení můžete používat pouze při vyvracení. "
        });
    } else {
        solution.addSubstitution(this);
    }
};

/**
 * Checks if specified connection button should be present
 * @param index of button (0...top, 1...bottom)
 * @returns boolean if connection button should be present
 */
ConcreteItem.prototype.hasConnectionButton = function(index) {
    return [true, true][index % 2];
};
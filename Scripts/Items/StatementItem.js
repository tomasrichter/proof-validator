/**
 * Class representing parent of statement types
 * @returns {} 
 */
function StatementItem() {
}

/**
 * Common initialization for all statements
 * @returns {} 
 */
StatementItem.prototype.init = function() {
	this.divItem = document.createElement("div");
	this.divItem.className = EnumState.UNKNOWN + " item ";
	this.divContent = document.createElement("div");
	this.divContent.className = "content";
	this.divItem.appendChild(this.divContent);
};

/**
 * Implicitly, statement item should have duplicate button (ContradictionItem overrides).
 * @returns true 
 */
StatementItem.prototype.hasDuplicateButton = function() {
    return true;
}

/**
 * Open editor of language name.
 * @returns {} 
 */
StatementItem.prototype.openEditor = function() {
    var thisItem = this;
    this.editorItem = new EditorItem(this.languageName);
	this.editorItem.shiftX = 0;
	this.editorItem.shiftY = 0;
	
	if (contains(this.divItem.className,"task")) {
		this.editorItem.shiftX = document.getElementById("divTask").offsetLeft - document.getElementById("divSpace").offsetLeft;
		this.editorItem.shiftY = document.getElementById("divTask").offsetTop - document.getElementById("divSpace").offsetTop;
	}
    this.editorItem.buttonClose.onmousedown = function() {
        thisItem.closeEditor();
    };
	
	this.editorItem.locate(this.divItem.offsetLeft, this.divItem.offsetTop);
};

/**
 * Check if editor is closed
 * @returns boolean if editor is closed
 */
StatementItem.prototype.isEditorClosed = function() {
    return !this.editorItem;
};  

/**
 * Close editor of language name
 * @returns {} 
 */
StatementItem.prototype.closeEditor = function() {
    this.languageName = this.editorItem.rootEditLanguageItem.countName();
    this.controllerLanguageName.innerHTML = this.languageName.printFriendlyName();
    document.getElementById("divSpace").removeChild(this.editorItem.divEditor);
	document.getElementById("divTask").style.pointerEvents = "auto";
    this.editorItem = null;
    checkProof();
}; 

/**
 * Statements at the beginning of proof have to be colored. It is overriden by subclasses.
 * @returns {}
 */
StatementItem.prototype.colorAtStart = function (solution) {
};

/**
 * switch statement to new deduction state
 * @param state     new state
 * @returns {} 
 */
StatementItem.prototype.setDeduced = function(state) {
    this.divItem.className = this.divItem.className.replace(/^\S+/, state);
};   

/**
 * Check if statement is in specific state
 * @param state     appropriate state
 * @returns boolean if statement is in state 
 */
StatementItem.prototype.isInState = function (state) {
    return contains(this.divItem.className, state);
};

/**
 * Checks if statement can be used as conclusion in contradiction step. It is overriden by subclasse ContradictionItem.
 * @returns false 
 */
StatementItem.prototype.matchesContradiction = function () {
    return false;
}

/**
 * Checks if statement can be used as conclusion in subset step. It is overriden by subclasses.
 * @returns false 
 */
StatementItem.prototype.matchesSubset = function() {
    return false;
};   

/**
 * Checks if statement can be used as conclusion in operation step. It is overriden by subclasses.
 * @returns false 
 */
StatementItem.prototype.matchesOperation = function() {
    return false;
}; 

/**
 * Checks if statement can be used as conclusion in set equality step. It is overriden by subclasses.
 * @returns false 
 */
StatementItem.prototype.matchesSetEquality = function() {
    return false;
}; 

/**
 * Check if statement can be deduced using any operation rule (common functionality for concrete and universal rules).
 * @param rules         array of rules 
 * @param operationId   current operation
 * @param first         value of first operand
 * @param second        value of second operand
 * @param shouldBe      wanted result of rule   
 * @returns boolean if data can match any rule from set of rules
 */
StatementItem.prototype.matchesOperationRule = function (rules, operationId, first, second, shouldBe) {
	for (var i = 0; i < rules.length;i++) {
	    var tmpFirst = rules[i].FIRST;
		var tmpSecond = rules[i].SECOND;
		var tmpResult = rules[i].RESULT;
		if (rules[i].OPERATION !== operationId) {
			continue;
		}

		if (isUnary(operationId)) {
		    if ((tmpResult === undefined && tmpFirst === undefined) || (tmpResult === shouldBe && tmpFirst === first)) {
                return true;
            }
            continue;
        }
        else if (isBinary(operationId)) {
	        //both languages are same
            if (tmpFirst === undefined && tmpSecond === undefined) {
                if (first === second && (tmpResult === undefined ? first === shouldBe : tmpResult === shouldBe)) {
	                return true;
	            }
	            continue;
	        }

	        //deal with expansion
            if (tmpResult === undefined) {
                if (tmpFirst === undefined) {
	                tmpFirst = (tmpSecond === first) ? second : first;
	                tmpResult = tmpFirst;
                } else if (tmpSecond === undefined) {
	                tmpSecond = (tmpFirst === first) ? second : first;
	                tmpResult = tmpSecond;
	            }
	        }
            //comparison
            //rules about commutative operation is used in both directions
            if (((tmpFirst === undefined || tmpFirst === first) && (tmpSecond === undefined || tmpSecond === second)) ||
	            (isCommutative(operationId) && (tmpFirst === undefined || tmpFirst === second) && (tmpSecond === undefined || tmpSecond === first))) {
	            if (tmpResult === shouldBe) {
	                return true;
	            }
	        }
	    }
	}
	return false;
};  

/**
 * Check if statement can be deduced using equality of language names
 * @param premiseName   name in premise of step 
 * @returns boolean if data can match any type of equality of language names
 */
StatementItem.prototype.matchesSetEqualityRule = function(premiseName) {
    for (var i = 0; i < setEqualityRules.length;i++) {
		for (var j = 0; j < 2; j++) {
			var leftExpansions = ((j === 0) ? premiseName : this.languageName).expandFromTemplate(setEqualityRules[i].LEFT);
			var rightExpansions = ((j === 0) ? this.languageName : premiseName).expandFromTemplate(setEqualityRules[i].RIGHT);
		    if (leftExpansions.length > 0 &&
                rightExpansions.length > 0 &&
                areSame(leftExpansions.concat(rightExpansions))) {
			    return true;
			}
		}
	}
	return false;
};
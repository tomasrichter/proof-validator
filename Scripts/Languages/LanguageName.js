/**
 * Class representing language name.
 * @param operationId       type of operation used in item (or detects atomic language)
 * @param language1Name     first language name (unary operation or atomic language)
 * @param language2Name     possibly second language name (if using binary operation)
 * @returns {} 
 */
function LanguageName(operationId, language1Name, language2Name) {
    this.operationId = operationId;
	this.language1Name = language1Name;
    this.language2Name = language2Name;
}

/**
 * Gets list of all atomic language names in language name (used in disproving).
 * @returns list of atomic language names 
 */
LanguageName.prototype.getListOfNames = function() {
	if (isAtomic(this.operationId)) {
		return [this];
	}
	if (isUnary(this.operationId)) {
		return [this].concat([this.language1Name]).concat(this.language1Name.getListOfNames());
	}
    if (isBinary(this.operationId)) {
        return [this].concat([this.language1Name]).concat(this.language1Name.getListOfNames())
            .concat([this.language2Name]).concat(this.language2Name.getListOfNames());
    }
    return [];
};

/**
 * Check if language two language names are same.
 * @param other     second language 
 * @returns boolean if languages are same
 */
LanguageName.prototype.sameAs = function (other) {
	if (!other || this.operationId !== other.operationId) {
		return false;
	}
	
	//expansion is used for matching some rules
	if (isExpansion(this.operationId) || isExpansion(other.operationId)) {
		return true;
	}
	
    if (isAtomic(this.operationId)) {
		return this.language1Name === other.language1Name;
	}
	
	if (isUnary(this.operationId)) {
		return this.language1Name && this.language1Name.sameAs(other.language1Name);
	}

	if (isBinary(this.operationId)) {
	    var first = [this.language1Name, this.language2Name];
	    var second = [other.language1Name, other.language2Name];
        if (isAssociative(this.operationId)) {
            first = this.getListOfNamesWhileOperation(this.operationId);
            second = other.getListOfNamesWhileOperation(this.operationId);
        }
	    return this.compareLists(first, second, isCommutative(this.operationId));
	}
    return false;
};

/**
 * Compares list of language names containing same operation (for associativity). If operation is commutative, lists are sorted, so the order of operands does not matter.
 * @param first         first list of language names
 * @param second        second list of language names
 * @param commutative   boolean if operation is commutative
 * @returns boolean if language names in list are same 
 */
LanguageName.prototype.compareLists = function(first, second, commutative) {
    if (first.length !== second.length) {
        return false;
    }
    if (commutative) {
        first.sort(function (a, b) { return a.printFriendlyName(true, true) > b.printFriendlyName(true, true) ? -1 : 1 });
        second.sort(function (a, b) { return a.printFriendlyName(true, true) > b.printFriendlyName(true, true) ? -1 : 1 });
    }
    for (var i = 0; i < first.length; i++) {
        if (!first[i].sameAs(second[i])) {
            return false;
        }
    }
    return true;
}

/**
 * To deal with associativity, it creates list of language names while the operation does not change (to ignore parenthesis).
 * @param operationId   operation as enum
 * @returns array of language names
 */
LanguageName.prototype.getListOfNamesWhileOperation = function (operationId)
{
    if (!isBinary(operationId) || this.operationId !== operationId) {
        return [this];
    }
    return this.language1Name.getListOfNamesWhileOperation(operationId)
        .concat(this.language2Name.getListOfNamesWhileOperation(operationId));
}

/**
 * Recursively prints language name as user friendly string.
 * @param isRoot    determine if current level is root level of recursion (because of printing parentheses)
 * @returns language name as string 
 */
LanguageName.prototype.printFriendlyName = function (isRoot, lexicalOrder) {
    isRoot = typeof isRoot !== "undefined" ? isRoot : true;
    lexicalOrder = typeof lexicalOrder !== "undefined" ? lexicalOrder : false;
	if (isExpansion(this.operationId)) {
		return EnumName.NONAME;
	}
    if (isAtomic(this.operationId)) {
        if (/^\s*$/.test(this.language1Name))
        {
            return EnumName.NONAME;
        }
        return this.language1Name;
    }
	var returnString = "";
    if (isUnary(this.operationId)) {
		if (isPrefixed(this.operationId)) {
			returnString = operationsFriendly[this.operationId] + this.language1Name.printFriendlyName(false);
		}
		else {
			var operation = operationsFriendly[this.operationId];
			if (isFriendlySuper(this.operationId)) {
				operation = "<sup>" + operation + "</sup>";
			}
			returnString = this.language1Name.printFriendlyName(false) + operation;
		}		
    }
    if (isBinary(this.operationId)) {
        var firstString = this.language1Name.printFriendlyName(false);
        var secondString = this.language2Name.printFriendlyName(false);
        if (lexicalOrder && secondString < firstString) {
            var tmp = firstString;
            firstString = secondString;
            secondString = tmp;
        }
        returnString = firstString + operationsFriendly[this.operationId] + secondString;
	}
	
	if (isRoot) {
		return returnString;
	}
	return "(" + returnString + ")";
};

/**
 * Returns list of languageNames that matches expansion parts of template.
 * @param {} template   language name with EXP operations
 * @returns list of language name that can be substituted for EXP
 */
LanguageName.prototype.expandFromTemplate = function (template) {
    if (isExpansion(template.operationId)) {
        return [this];
    }
    if (this.operationId !== template.operationId) {
        return [];
    }
    if (isUnary(this.operationId)) {
        return this.language1Name.expandFromTemplate(template.language1Name);
    }
    if (isBinary(this.operationId)) {
        return this.language1Name.expandFromTemplate(template.language1Name).concat(
            this.language2Name.expandFromTemplate(template.language2Name));
    }
    return [];
}
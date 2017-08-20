/**
 * Class representing deduction step
 * @param premises      array of premises 
 * @param conclusion    one conclusion
 * @returns {} 
 */
function Step(premises, conclusion) {
    this.premises = premises;
    this.conclusion = conclusion;
}

/**
 * Check if step should be dealed as deducing contradiction
 * @returns {} 
 */
Step.prototype.isContradiction = function() {
	return this.conclusion.item instanceof ContradictionItem;
};

/**
 * Tries all possible way to check the step. Possibly passes data to step matching and rule matching functions.
 * @returns boolean if step is valid
 */
Step.prototype.isValid = function () {
    var premises = this.dividePremises();
    return this.conclusion.item.matchesContradiction(premises) ||
        this.conclusion.item.matchesSubset(premises) ||
        this.conclusion.item.matchesOperation(premises) ||
        this.conclusion.item.matchesSetEquality(premises);
};


/**
 * Divide premises to types and get mask with count of different staments.
 * It isdone because better matching of rules.
 * @returns js object with divided statements and mask 
 */
Step.prototype.dividePremises = function() {
	var result = {languageItems: [], closureItems: [], concreteItems: [], mask: ""};
    for (var i = 0; i <this.premises.length;i++) {
        if (this.premises[i].item instanceof LanguageItem) {
            result.languageItems.push(this.premises[i].item);
		}
        else if (this.premises[i].item instanceof ClosureItem) {
            result.closureItems.push(this.premises[i].item);
		}
        else if (this.premises[i].item instanceof ConcreteItem) {
            result.concreteItems.push(this.premises[i].item);
		}
    }
	result.mask = result.languageItems.length + ";" + result.closureItems.length + ";" + result.concreteItems.length;
    return result;
};
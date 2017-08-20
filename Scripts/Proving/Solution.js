/**
 * Class for checking task with proof using proving method.
 * @param {} task       proved task
 * @param {} proof      proof
 * @param {} method     proving mwthod enum
 * @returns {} 
 */
function Solution(task, proof, method) {
    this.task = task;
    this.proof = proof;
    this.method = method;

    this.knownStatements = [];
    this.concreteSubstitutions = [];
    this.deducedContradiction = false;
    this.progressEn = "";
    this.progressCs = "";
    this.steps = [];
}

/**
 * Main method for checking. Checks task form, proof and applies result.
 * @returns {} 
 */
Solution.prototype.check = function () {
    var result;
    if (this.checkTaskForm()) {
        result = this.isProofValid();
    } else {
        result = EnumState.WRONG;
    }
    this.applyResult(result);
}

/**
 * Checks if task is in form that can be proved.
 * @returns true if form is OK, false otherwise
 */
Solution.prototype.checkTaskForm = function () {
    switch (this.method) {
    case EnumMethod.DIRECT:
        {
            if (!this.task.getPremise().isConjunction && this.task.getPremise().taskItems.length > 1) {
                this.addMessage({
                    ENGLISH:
                        "You cannot prove the statement directly (assumed statements would have been in disjunction). ",
                    CZECH: "Tvrzení nemůžete dokazovat přímo (předpokládaná tvrzení by byla v disjunkci). "
                });
                this.setAllDeduced(true, EnumState.WRONG);
                return false;
            }
            break;
        }

    case EnumMethod.CONTRA:
        {
            if ((!this.task.getPremise().isConjunction && this.task.getPremise().taskItems.length > 1) ||
                (this.task.getConclusion().isConjunction && this.task.getConclusion().taskItems.length > 1)) {
                this.addMessage({
                    ENGLISH:
                        "You cannot prove the statement using contradiction (assumed statements would have been in disjunction). ",
                    CZECH: "Tvrzení nemůžete dokazovat sporem (předpokládaná tvrzení by byla v disjunkci). "
                });
                this.setAllDeduced(true, EnumState.WRONG);
                return false;
            }
            break;
        }
    }
    return true;
}

/**
 * Apply result of proving according to result.
 * @param {} result     result as state enum
 * @returns {} 
 */
Solution.prototype.applyResult = function (result) {
    switch (result) {
    case EnumState.CORRECT:
        {
            this.addMessage({
                ENGLISH: "Task has been solved!",
                CZECH: "Příklad je vyřešen!"
            });
            break;
        }
    case EnumState.WRONG:
        {
            break;
        }
    case EnumState.UNKNOWN:
        {
            this.addMessage({
                ENGLISH: "Unfortunately, task has not been solved.",
                CZECH: "Bohužel, příklad není vyřešen."
            });
            break;
        }
    }
    document.getElementById("divCheck").className = result;
    document.getElementById("noteCS").innerHTML = this.progressCs;
    document.getElementById("noteEN").innerHTML = this.progressEn;
}

/**
 * Main checking function for proof of task in correct form
 * @returns result of checking as state enum
 */
Solution.prototype.isProofValid = function () {
    this.assume();
    if (this.isAlreadyProved(true) === EnumState.CORRECT) {
        this.addMessage({
            ENGLISH: "The statement can be proved trivially (without using your proof). ",
            CZECH: "Tvrzení je triviálně platné (nepotřebuji váš důkaz). "
        });
        return EnumState.CORRECT;
    }

    this.submitSolution();

    if (this.containsCycle) {
        return this.makeMistake({
            ENGLISH: "Proof contains cycle and couldn't be checked! ",
            CZECH: "Důkaz obsahuje cyklus, a tudíž nemohl být zkontrolován. "
        });
    }
    if (this.steps.length === 0) {
        this.addMessage({
            ENGLISH: "Your proof does not have any initial element. ",
            CZECH: "Váš důkaz nemá žádný počáteční element. "
        });
        return EnumState.UNKNOWN;
    }

    this.checkSteps();
    return this.isAlreadyProved(false);
}

/**
 * Assume statements according to proving method.
 * @returns {} 
 */
Solution.prototype.assume = function () {
    this.setAllDeduced(true, EnumState.UNKNOWN);
    var i;
    switch (this.method) {
    case EnumMethod.CONTRA:
        {
            for (i = 0; i < this.task.getConclusion().taskItems.length; i++) {
                this.knownStatements.push([this.task.getConclusion().taskItems[i].item, false]);
            }
            //WITHOUT BREAK (uses same part as DIRECT)   
        }
    case EnumMethod.DIRECT:
        {
            for (i = 0; i < this.task.getPremise().taskItems.length; i++) {
                this.knownStatements.push([this.task.getPremise().taskItems[i].item, true]);
                this.task.getPremise().taskItems[i].item.setDeduced(EnumState.CORRECT);
            }
            break;
        }
    }
}

/**
 * Set state of root statements, create deduction steps from proving items and checks for cycle in proof.
 * @returns {} 
 */
Solution.prototype.submitSolution = function () {
    startChains();
    for (var i = 0; i < this.proof.items.length; i++) {
        //starting items have to be colored
        if (this.proof.items[i].premises.length === 0) {
            this.proof.items[i].item.colorAtStart(this);
        }
        //searching only for elements that have no conclusions
        if (this.proof.items[i].conclusions.length === 0) {
            newChain();
            var result = this.proof.items[i].createSteps();
            this.steps = this.steps.concat(result.steps);
            this.containsCycle = this.containsCycle || result.containsCycle;
        }
    }
}

/**
 * Check chain of steps and deduce conclusions.
 * @returns {} 
 */
Solution.prototype.checkSteps = function () {
    for (var i = 0; i < this.steps.length; i++) {
        if (this.steps[i].isValid()) {
            var knownCount = 0;
            for (var j = 0; j < this.steps[i].premises.length; j++) {
                if (this.method !== EnumMethod.DISPROOF && this.steps[i].premises[j].item instanceof ConcreteItem) {
                    this.steps[i].premises[j].item.setDeduced(EnumState.WRONG);
                }
                if (this.steps[i].premises[j].item.isInState(EnumState.CORRECT)) {
                    knownCount++;
                }
            }

            //all premises are known
            if (knownCount === this.steps[i].premises.length) {
                if (this.steps[i].isContradiction()) {
                    this.deducedContradiction = true;
                }
                else if (this.steps[i].conclusion.item instanceof LanguageItem) {
                    this.knownStatements.push([this.steps[i].conclusion.item, true]);
                }
                this.steps[i].conclusion.item.setDeduced(EnumState.CORRECT);
            }
            else {
                this.steps[i].conclusion.item.setDeduced(EnumState.UNKNOWN);
            }
        }
        else {
            this.steps[i].conclusion.item.setDeduced(EnumState.WRONG);
            if (this.steps[i].isContradiction()) {
                this.addMessage({
                    ENGLISH: "Proof contains invalid deduction of contradiction. ",
                    CZECH: "Důkaz obsahuje nevalidní odvození sporu. "
                });
            } else {
                this.addMessage({
                    ENGLISH: "Proof contains invalid step. ",
                    CZECH: "Důkaz obsahuje nevalidní krok. "
                });
            }
        }
    }
}

/**
 * Check if proof is now complete according to proving method
 * @param {} atBeginning    affects messages      
 * @returns state as enum 
 */
Solution.prototype.isAlreadyProved = function (atBeginning) {
    if (this.deducedContradiction) {
        this.addMessage({
            ENGLISH: "You have deduced contradiction. ",
            CZECH: "Byl odvozen spor. "
        });
    }

    var i;
    var count;
    var shouldBeDeduced;
    switch (this.method) {
        //deduced contradiction
    case EnumMethod.CONTRA:
        {
            return this.deducedContradiction ? EnumState.CORRECT : EnumState.UNKNOWN;
        }
    //deduced contradiction or proved enough of conclusion
    case EnumMethod.DIRECT:
        {
            if (this.deducedContradiction) {
                return EnumState.CORRECT;
            }
            count = 0;
            for (i = 0; i < this.task.getConclusion().taskItems.length; i++) {
                shouldBeDeduced = this.task.getConclusion().taskItems[i].item;
                if (this.isKnown(shouldBeDeduced, true)) {
                    count++;
                    shouldBeDeduced.setDeduced(EnumState.CORRECT);
                }
            }
            if ((count > 0 && !this.task.getConclusion().isConjunction) ||
            (count === this.task.getConclusion().taskItems.length &&
                this.task.getConclusion().isConjunction)) {
                if (!atBeginning) {
                    this.addMessage({
                        ENGLISH: "The conclusion has been proved. ",
                        CZECH: "Závěr tvrzení byl dokázán. "
                    });
                }
                return EnumState.CORRECT;
            }
            if (!atBeginning) {
                this.addMessage({
                    ENGLISH: "The conclusion has not been proved. ",
                    CZECH: "Závěr tvrzení nebyl dokázán. "
                });
            }
            return EnumState.UNKNOWN;
        }

    //proved enough of premises and disproved enough of conclusion
    case EnumMethod.DISPROOF:
        {
            count = 0;
            var willReturn = EnumState.CORRECT;
            //premises
            for (i = 0; i < this.task.getPremise().taskItems.length; i++) {
                shouldBeDeduced = this.task.getPremise().taskItems[i].item;
                if (this.isKnown(shouldBeDeduced, true)) {
                    shouldBeDeduced.setDeduced(EnumState.CORRECT);
                    count++;
                }
            }
            var part1 = (count > 0 && !this.task.getPremise().isConjunction) ||
            (count === this.task.getPremise().taskItems.length &&
                this.task.getPremise().isConjunction);
            if (!part1) {
                willReturn = EnumState.UNKNOWN;
            }
            count = 0;
            //conclusion
            for (i = 0; i < this.task.getConclusion().taskItems.length; i++) {
                shouldBeDeduced = this.task.getConclusion().taskItems[i].item;
                if (this.isKnown(shouldBeDeduced, false)) {
                    shouldBeDeduced.setDeduced(EnumState.CORRECT);
                    count++;
                }
            }
            if (willReturn === EnumState.UNKNOWN) {
                if (!atBeginning) {
                    this.addMessage({
                        ENGLISH: "You haven't proved the premise (from counterexamples). ",
                        CZECH: "Nebyla dokázána platnost předpokladu (z protipříkladů). "
                    });
                }
                return willReturn;
            }
            this.addMessage({
                ENGLISH: "You have proved the premise. ",
                CZECH: "Byla dokázána platnost předpokladu. "
            });
            if ((count > 0 && this.task.getConclusion().isConjunction) ||
            (count === this.task.getConclusion().taskItems.length &&
                !this.task.getConclusion().isConjunction)) {
                this.addMessage({
                    ENGLISH: "You have disproved the conclusion. Therefore, you have disproved whole statement. ",
                    CZECH: "Závěr tvrzení byl úspěšně vyvrácen. Tím je vyvráceno celé tvrzení. "
                });
                return EnumState.CORRECT;
            }
            return EnumState.UNKNOWN;
        }
    }
    return EnumState.WRONG;
}

/**
 * If it is possible, then set concrete item as deduced.
 * @param {} concreteItem   concrete statement 
 * @returns {} 
 */
Solution.prototype.addSubstitution = function(concreteItem) {
	concreteItem.setDeduced(EnumState.CORRECT);
	for (var i = 0; i < this.concreteSubstitutions.length;i++) {
		if (!concreteItem.allowSubstitutions(this.concreteSubstitutions[i])) {
			this.addMessage({ENGLISH: "You cannot use these concrete statements together. ", 
						CZECH: "Nemůžete použít současně taková konkrétní tvrzení. "});
			concreteItem.setDeduced(EnumState.WRONG);
			this.concreteSubstitutions[i].setDeduced(EnumState.WRONG);
		}
	}
	this.concreteSubstitutions.push(concreteItem);
};

/**
 * Check if known statements contains specific item (or its negation).
 * @param {} item           statement to be found
 * @param {} sameNegation   if same or negated statement is wanted
 * @returns boolean if item is in known statements
 */
Solution.prototype.isKnown = function(item, sameNegation) {
    for (var i = 0; i < this.knownStatements.length;i++) {
        if (item.sameAs(this.knownStatements[i][0],this.knownStatements[i][1] === sameNegation)) {
            return true;
        }
    }
    return false;
};

/**
 * Write error message and return WRONG state of proof (task cannot be proved).
 * @param {} messages   czech and english message
 * @returns wrong state as enum
 */
Solution.prototype.makeMistake = function(messages) {
    this.addMessage(messages);
    this.setAllDeduced(false, EnumState.WRONG);
    return EnumState.WRONG;
}

/**
 * Add message to info about proving.
 * @param {} messages   czech and english message
 * @returns {} 
 */
Solution.prototype.addMessage = function (messages) {
    if (this.progressEn.indexOf(messages.ENGLISH) < 0) {
        this.progressEn += messages.ENGLISH;
    }
    if (this.progressCs.indexOf(messages.CZECH) < 0) {
        this.progressCs += messages.CZECH;
    }
}

/**
 * Set items to state.
 * @param {} applyForTask   if state is set in task items as well
 * @param {} state          state as enum
 * @returns {} 
 */
Solution.prototype.setAllDeduced = function(applyForTask, state) {
    if (applyForTask) {
        this.task.getPremise().setAllDeduced(state);
        this.task.getConclusion().setAllDeduced(state);
    }
    this.proof.setAllDeduced(state);
}
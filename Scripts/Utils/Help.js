/**
 * Creates dynamic parts of help.
 * @returns {} 
 */
function createHelp() {
    createChomsky();
    createCounterexamples();
    createClosures();
    createSetEqualityRules();
    createLanguageRules();
    createConcreteRules();
}

/**
 * Hides all parts of help. For example before opening.
 * @returns {} 
 */
function hideAllParts() {
    hidePart("Intro");
    hidePart("Theory");
    hidePart("Rules");
    hidePart("About");
}

/**
 * Creates picture of Chomsky hierarchy.
 * @returns {} 
 */
function createChomsky() {
    var parentDiv = document.getElementById("divChomsky");
    var enSpan;
    var csSpan;
    var i;
    for (i = 0; i < classes.length; i++) {
        csSpan = document.createElement("span");
        enSpan = document.createElement("span");
        csSpan.className = "cs";
        enSpan.className = "en";
        csSpan.innerHTML = classes[classes.length - i - 1].CZECH;
        enSpan.innerHTML = classes[classes.length - i - 1].ENGLISH;
        parentDiv.appendChild(csSpan);
        parentDiv.appendChild(enSpan);
		
        //for counterexamples
        parentDiv.appendChild(document.createElement("div"));
		
        if (i === classes.length - 1) {
            break;
        }
        var newDiv = document.createElement("div");
        newDiv.className = "set";
        parentDiv.appendChild(newDiv);
        parentDiv = newDiv;
    }
}

/**
 * Creates picture of Chomsky hierarchy and counterexamples 
 * @returns {} 
 */
function createCounterexamples() {
    document.getElementById("divExamples").innerHTML = document.getElementById("divChomsky").innerHTML;
    var j;
    var parentDiv;
    for (var i = 0; i < concreteLanguages.length; i++) {
        j = 0;
        parentDiv = document.getElementById("divExamples");
        while(j < classes.length - concreteLanguages[i].CLASS - 1) {
            parentDiv = parentDiv.childNodes[parentDiv.childElementCount - 1];
            j++;
        }
        parentDiv.childNodes[2].innerHTML += ((parentDiv.childNodes[2].innerHTML === "") ? "" : ", " ) + concreteLanguages[i].VIEW;
    }	
}

/**
 * Creates table with known closure properties.
 * @returns {} 
 */
function createClosures() {
    var table = document.getElementById("tableClosures");
    for (var i = -1; i< classes.length; i++) {
        var row = document.createElement("tr");
        for (var j = -1;j< operations.length; j++) {
            var cell = document.createElement("td");
            cell.className = "unknown";
            if (i < 0 && j < 0) {
                cell.innerHTML = "";
            }
            else if (i>=0 && j>=0) {
                cell.className = (closures[j][i]) ? "correct" : "wrong";
            }
            else if (j < 0) {
                var csSpan = document.createElement("span");
                var enSpan = document.createElement("span");
                csSpan.className = "cs";
                enSpan.className = "en";
                csSpan.innerHTML = operations[i].CZECH;
                enSpan.innerHTML = operations[i].ENGLISH;
                cell.appendChild(csSpan);
                cell.appendChild(enSpan);
            }
            else {
                cell.innerHTML = classes[j].ABBREV;
            }
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
}

/**
 * Creates table with language rules.
 * @returns {} 
 */
function createLanguageRules() {
    var table = document.getElementById("tableLanguageRules");
    for (var i = 0; i < languageRules.length; i++) {
        var row = document.createElement("tr");
        var operation = document.createElement("td");
        var result = document.createElement("td");
        operation.className = "unknown";
        result.className = "unknown";
        var name = new LanguageName(
                languageRules[i].OPERATION,
                new LanguageName(EnumOperation.ATOMIC, (languageRules[i].FIRST === undefined) ? EnumName.NONAME : classes[languageRules[i].FIRST].ABBREV, null),
                new LanguageName(EnumOperation.ATOMIC, (languageRules[i].SECOND === undefined) ? EnumName.NONAME : classes[languageRules[i].SECOND].ABBREV, null));
        operation.innerHTML = name.printFriendlyName();
        result.innerHTML = (languageRules[i].RESULT === undefined) ? EnumName.NONAME : classes[languageRules[i].RESULT].ABBREV;
        row.appendChild(operation);
        row.appendChild(result);
        table.appendChild(row);
    }
}

/**
 * Create table with set equality rules.
 * @returns {} 
 */
function createSetEqualityRules() {
    var table = document.getElementById("tableSetEqualityRules");
    for (var i = 0; i < setEqualityRules.length; i++) {
        var row = document.createElement("tr");
        var left = document.createElement("td");
        var right = document.createElement("td");
        left.className = "unknown";
        right.className = "unknown";
        left.innerHTML = setEqualityRules[i].LEFT.printFriendlyName();
        right.innerHTML = setEqualityRules[i].RIGHT.printFriendlyName();
        row.appendChild(left);
        row.appendChild(right);
        table.appendChild(row);
    }
}

/**
 * Creates table of rules about concrete languages.
 * @returns {} 
 */
function createConcreteRules() {
    var table = document.getElementById("tableConcreteRules");
    var rules;
    for (var count = 0; count < 2; count++) {
        rules = count === 0 ? basicConcreteRules : expandableRules;
        for (var i = 0; i < rules.length; i++) {
            var row = document.createElement("tr");
            var operation = document.createElement("td");
            var result = document.createElement("td");
            operation.className = "unknown";
            result.className = "unknown";

            if (count === 0) {
                operation.innerHTML = new LanguageName(
                    rules[i].OPERATION,
                    new LanguageName(EnumOperation.ATOMIC,
                        (rules[i].FIRST === undefined)
                        ? EnumName.NONAME
                        : concreteLanguages[rules[i].FIRST].VIEW,
                        null),
                    new LanguageName(EnumOperation.ATOMIC,
                        (rules[i].SECOND === undefined)
                        ? EnumName.NONAME
                        : concreteLanguages[rules[i].SECOND].VIEW,
                        null)).printFriendlyName();
                result.innerHTML = (rules[i].RESULT === undefined)
                    ? EnumName.NONAME
                    : concreteLanguages[rules[i].RESULT].VIEW;
            } else {
                var first;
                var second;
                var note = "";
                if (rules[i].COMPLEMENTS !== undefined && rules[i].COMPLEMENTS) {
                    first = EnumName.NONAME;
                    second = "(" + operationsFriendly[EnumOperation.CO] + first + ")";
                } else {
                    first = (rules[i].FIRST === undefined || rules[i].FIRST.CONCRETE === undefined)
                        ? EnumName.NONAME
                        : concreteLanguages[rules[i].FIRST.CONCRETE].VIEW;
                    second = (rules[i].SECOND === undefined || rules[i].SECOND.CONCRETE === undefined)
                        ? EnumName.NONAME
                        : concreteLanguages[rules[i].SECOND.CONCRETE].VIEW;

                    var current = undefined;
                    if (first === EnumName.NONAME && (rules[i].FIRST !== undefined)) {
                        current = rules[i].FIRST;
                    }
                    else if (second === EnumName.NONAME && (rules[i].SECOND !== undefined)) {
                        current = rules[i].SECOND;
                    }
                    if (current !== undefined) {
                        note = (current.CONTAINS_EPSILON !== undefined ? concreteLanguages[EnumConcreteLanguage.EPSILON].VIEW + (current.CONTAINS_EPSILON ? "⊆" : "⊈") + EnumName.NONAME + ((current.CONTAINS_ALPHABET !== undefined) ? ", " : "") : "");
                        note += (current.CONTAINS_ALPHABET !== undefined ? concreteLanguages[EnumConcreteLanguage.ALPHABET].VIEW + (current.CONTAINS_ALPHABET ? "⊆" : "⊈") + EnumName.NONAME : "");
                    }
                }
                operation.innerHTML = new LanguageName(rules[i].OPERATION, new LanguageName(EnumOperation.ATOMIC,first, null), new LanguageName(EnumOperation.ATOMIC,second, null)).printFriendlyName() + (note === "" ? "" :(" (" + note + ")"));
                
                result.innerHTML = rules[i].RESULT.CONCRETE !== undefined ? concreteLanguages[rules[i].RESULT.CONCRETE].VIEW : ((rules[i].RESULT.COMPLEMENT !== undefined && rules[i].RESULT.COMPLEMENT ? operationsFriendly[EnumOperation.CO] : "") + EnumName.NONAME);
            }

            row.appendChild(operation);
            row.appendChild(result);
            table.appendChild(row);
        }
    }
}

/**
 * Open help.
 * @returns {} 
 */
function openHelp() {
    hideAllParts();
    document.getElementById("divHelp").style.visibility = "visible";
}

/**
 * Close help.
 * @returns {} 
 */
function closeHelp() {
	document.getElementById("divHelp").style.visibility = "hidden";
}

/**
 * Hides specific part of help.
 * @param part      string representing part to be hidden
 * @returns {} 
 */
function hidePart(part) {
    document.getElementById("part" + part).style.display = "none";
    document.getElementById("buttonViewHide" + part).className = "buttonAdd";
}

/**
 * Makes specific part of help visible.
 * @param part      stringre presenting part to view
 * @returns {} 
 */
function viewPart(part) {
    document.getElementById("part" + part).style.display = "block";
    document.getElementById("buttonViewHide" + part).className = "buttonDelete";
}

function switchPart(part) {
    document.getElementById("part" + part).style.display === "none" ? viewPart(part) : hidePart(part);
}
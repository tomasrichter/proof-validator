/**
 * Class representing language inside editor.
 * @param sourceLanguageName    source language to create structure of controllers in editor    
 * @returns {} 
 */
function EditLanguageItem(sourceLanguageName) {
    this.divLanguage = document.createElement("div");
    this.divLanguage.className = "divLanguage";
    this.create(sourceLanguageName); 
}

/**
 * Create language inside editor.
 * @param sourceLanguageName    source language to create structure of controllers in editor 
 * @returns {} 
 */
EditLanguageItem.prototype.create = function(sourceLanguageName) {
    var thisItem = this;
	this.language1Item = null;
	this.language2Item = null;
	this.operationItem = null;
    
    this.divLanguage.innerHTML = "";
    
    if (isAtomic(sourceLanguageName.operationId))
    {
        this.inputName = document.createElement("input");
        this.inputName.type = "text";
        this.inputName.className = "inputEditor";
        this.inputName.value = sourceLanguageName.language1Name;
        this.buttonAddOperation = document.createElement("button");
        this.buttonAddOperation.className = "buttonAdd operation";
        this.buttonAddOperation.onmousedown = function() {
            thisItem.addOperation(EnumOperation.UNI,
				new LanguageName(EnumOperation.ATOMIC,thisItem.inputName.value,null),
				new LanguageName(EnumOperation.ATOMIC,EnumName.OTHER, null));

            thisItem.divLanguage.removeChild(thisItem.inputName);
            thisItem.divLanguage.removeChild(thisItem.buttonAddOperation);
        };
        this.divLanguage.style.borderStyle = "none";
        this.divLanguage.appendChild(this.inputName);
        this.divLanguage.appendChild(this.buttonAddOperation);
        return;
    }
    if (isUnary(sourceLanguageName.operationId))
    {
        this.addOperation(sourceLanguageName.operationId, sourceLanguageName.language1Name,null);
    }
    if (isBinary(sourceLanguageName.operationId)) {
        this.addOperation(sourceLanguageName.operationId, sourceLanguageName.language1Name,
                          sourceLanguageName.language2Name);
    }
};

/**
 * Add operation to language in editor.
 * @param operationId   type of operation
 * @param name1         first language name
 * @param name2         second language name
 * @returns {} 
 */
EditLanguageItem.prototype.addOperation = function(operationId, name1, name2) { 
    this.language1Item = new EditLanguageItem(name1);
    this.operationItem = new EditOperationItem(operationId);
    this.divLanguage.appendChild(this.language1Item.divLanguage);
    this.divLanguage.appendChild(this.operationItem.button1Delete);
    this.divLanguage.appendChild(this.operationItem.divOperation);
    
    if(isBinary(operationId)) {
        this.divLanguage.appendChild(this.operationItem.button2Delete);
        this.language2Item = new EditLanguageItem(name2);
        this.divLanguage.appendChild(this.language2Item.divLanguage); 
    }
    this.divLanguage.style.borderStyle = "dashed";
    
    var thisItem = this;
    this.operationItem.button1Delete.onmousedown = function() {
        thisItem.deleteOperation(false);
    };
    this.operationItem.button2Delete.onmousedown = function() {
        thisItem.deleteOperation(true);
    };
    this.operationItem.inputOperation.onchange = function() {
        thisItem.changeOperation();
    };
};

/**
 * Reduce language with operation to one of languages
 * @param keepLeftSide  which language (side of operation) is to be kept 
 * @returns {} 
 */
EditLanguageItem.prototype.deleteOperation = function(keepLeftSide) { 
    this.divLanguage.innerHTML = "";
	if (isUnary(this.operationItem.operationId) || keepLeftSide) {
		this.create(this.language1Item.countName());
	}
	else if (isBinary(this.operationItem.operationId)) {
		this.create(this.language2Item.countName());
	}
};

/**
 * Change existing operation to another operation.
 * @returns {} 
 */
EditLanguageItem.prototype.changeOperation = function() { 
    if (isUnary(this.operationItem.operationId) && 
        isBinary(this.operationItem.inputOperation.selectedIndex)) {
        this.language2Item = new EditLanguageItem(new LanguageName(EnumOperation.ATOMIC,EnumName.OTHER,null));
        this.divLanguage.appendChild(this.operationItem.button2Delete);
        this.divLanguage.appendChild(this.language2Item.divLanguage);   
        this.operationItem.button2Delete.style.display = "inline-block";  
    }
    else if (isBinary(this.operationItem.operationId) && 
            isUnary(this.operationItem.inputOperation.selectedIndex)) {
        this.divLanguage.removeChild(this.language2Item.divLanguage);
        this.language2Item = null;
        this.operationItem.button2Delete.style.display = "none";
    }
    this.operationItem.operationId = this.operationItem.inputOperation.selectedIndex;
};

/**
 * Counts language name from data in editor (recursively on EditLanguageItems).
 * @returns language name as LanguageName object
 */
EditLanguageItem.prototype.countName = function() {
    if (!this.operationItem) {
        return new LanguageName(EnumOperation.ATOMIC,this.inputName.value,null);
    }
    if (isUnary(this.operationItem.inputOperation.selectedIndex)) {
        return new LanguageName(this.operationItem.inputOperation.selectedIndex,
								this.language1Item.countName());
    }
    if (isBinary(this.operationItem.inputOperation.selectedIndex)) {
        return new LanguageName(this.operationItem.inputOperation.selectedIndex,
            this.language1Item.countName(),
            this.language2Item.countName());
    }
    return null;
};
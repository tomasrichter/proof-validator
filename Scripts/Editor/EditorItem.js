/**
 * Class representing editor of language names
 * @param sourceLanguageName    language name to create structure of EditLanguageItem and EditOperationItem obejcts
 * @returns {} 
 */
function EditorItem(sourceLanguageName) {
    this.divEditor = document.createElement("div");
    this.divEditor.className = "divEditor";
    
    this.divScrollable = document.createElement("div");
    this.divScrollable.className = "divScrollable";
    this.divEditor.appendChild(this.divScrollable);
    if (document.getElementById("divSpace")) {
        document.getElementById("divSpace").appendChild(this.divEditor);
    }

    this.rootEditLanguageItem = new EditLanguageItem(sourceLanguageName);
    
    this.buttonClose = document.createElement("button");
    this.buttonClose.className = "buttonClose"; 
    this.divEditor.appendChild(this.buttonClose);
	
    this.divScrollable.appendChild(this.rootEditLanguageItem.divLanguage);
}

/**
 * Count position of editor in document
 * @param x     relative position on x axis
 * @param y     relative position on y axis
 * @returns {} 
 */
EditorItem.prototype.locate = function (x, y) {
    this.divEditor.style.left = x + this.shiftX + 8;
	this.divEditor.style.top = y + this.shiftY + 8;  
	if (this.divEditor.offsetLeft + this.divEditor.offsetWidth > document.getElementById("divSpace").offsetWidth) {
		this.divEditor.style.left = document.getElementById("divSpace").offsetWidth - this.divEditor.offsetWidth;
	}
	if (this.divEditor.offsetTop + this.divEditor.offsetHeight > document.getElementById("divSpace").offsetHeight) {
		this.divEditor.style.Top = document.getElementById("divSpace").offsetHeight - this.divEditor.offsetHeight;
	}
};
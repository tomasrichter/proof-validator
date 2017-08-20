/**
 * Class representing operation in editor
 * @param sourceOperationId     type of operation
 * @returns {} 
 */
function EditOperationItem(sourceOperationId) {
    this.operationId = sourceOperationId;
    this.divOperation = document.createElement("div");
    this.divOperation.className = "divOperation";
    this.inputOperation = document.createElement("select");
    this.inputOperation.className = "controller";
    this.inputOperation.style.marginTop = 8;
    this.button1Delete = document.createElement("button");
    this.button1Delete.className = "buttonDelete operation";
    this.button2Delete = document.createElement("button");
    this.button2Delete.className = "buttonDelete operation";
    
    if (isUnary(this.operationId)) {
        this.button2Delete.style.display = "none";
    }
    
    for (var i = 0; i < operations.length;i++) {
		var option = new Option();
		option.innerHTML = operationsFriendly[i];
        this.inputOperation.options.add(option);
    }  
    
    this.inputOperation.selectedIndex = this.operationId;
    this.divOperation.appendChild(this.inputOperation); 
}
/**
 * Class representing statement on a side of task.
 * @returns {} 
 */
function TaskItem() {
    var thisItem = this;
    this.item = new LanguageItem(EnumItem.LANGUAGE);
    this.item.divItem.className += " task";
    this.divLogicalSymbol = null;  
 
    this.buttonAdd = document.createElement("button");
    this.buttonRemove = document.createElement("button");
    this.buttonAdd.className = "buttonAdd";
    this.buttonRemove.className = "buttonDelete";
    
    this.mover = document.createElement("button");
    this.mover.className = "mover";
    this.item.divItem.appendChild(this.mover);
    this.mover.onmousedown = function() {
        proof.userAddProvingItem(proof.createCopy(thisItem));
    };
}

/**
 * Delete item and perform animation.
 * @returns {} 
 */
TaskItem.prototype.deleteItem = function () {
    var thisItem = this;
    var taskElement = document.getElementById("divTask");
    if (!taskElement) {
        return;
    }
    taskElement.removeChild(this.buttonAdd);
    taskElement.removeChild(this.buttonRemove);
    this.item.divItem.className += " deleteTask";
    setTimeout(function() {
            taskElement.removeChild(thisItem.item.divItem);
        },
        1000);
    if (this.divLogicalSymbol) {
        taskElement.removeChild(thisItem.divLogicalSymbol);
    }
}
/**
 * Class representing side of implication.
 * @param isLeft    determine side of implication (because of different order of user controllers) 
 * @returns {} 
 */
function SideOfTask(isLeft) {
    this.isLeft = isLeft; 
    this.taskItems = [];
    this.isConjunction = true;
}

/**
 * Deletes all items in side of implication
 * @returns {} 
 */
SideOfTask.prototype.clear = function () {
    var tmpArray = [];
    var i;
    for (i = 0; i < this.taskItems.length; i++) {
        tmpArray[i] = this.taskItems[i];
    }
    for (i = 0; i < tmpArray.length; i++) {
        this.deleteTaskItem(tmpArray[i]);
    }
}

/**
 * Append controllers from newly created item to task.
 * @param taskItem  appropriate item
 * @returns {} 
 */
SideOfTask.prototype.createControllers = function (taskItem) {
    var thisItem = this;
    if (this.taskItems.length > 0) {
        taskItem.divLogicalSymbol = document.createElement("div");
        taskItem.divLogicalSymbol.className = "divLogicalSymbol";
        this.applyConnective(taskItem);
        taskItem.divLogicalSymbol.onmousedown = function () {
            thisItem.reverseConnective();
            checkProof();
        };
    }

    var taskElement = document.getElementById("divTask");
    if (!taskElement) {
        return;
    }
    if (this.isLeft) {
        if (taskItem.divLogicalSymbol) {
            taskElement.insertBefore(taskItem.divLogicalSymbol,
                taskElement.children[1]);
        }
        taskElement.insertBefore(taskItem.buttonRemove,
            taskElement.children[1]);
        taskElement.insertBefore(taskItem.item.divItem,
            taskElement.children[1]);
        taskElement.insertBefore(taskItem.buttonAdd,
            taskElement.children[1]);
    } else {
        if (taskItem.divLogicalSymbol) {
            taskElement.appendChild(taskItem.divLogicalSymbol);
        }
        taskElement.appendChild(taskItem.buttonRemove);
        taskElement.appendChild(taskItem.item.divItem);
        taskElement.appendChild(taskItem.buttonAdd);
    }
}

/**
 * Deal with adding and deleting items from side of task.
 * @param taskItem  appropriate item
 * @returns {} 
 */
SideOfTask.prototype.listenEvents = function (taskItem) {
    var thisItem = this;
    taskItem.buttonAdd.onmousedown = function() {
        thisItem.addTaskItem(new TaskItem());
        this.style.display = "none";
        checkProof();
    };

    taskItem.buttonRemove.onmousedown = function () {
        if (thisItem.taskItems.length > 1) {
            thisItem.deleteTaskItem(taskItem);
            checkProof();
        }
    };
}

/**
 * Delete task item from side of task
 * @param {} taskItem   deleted task item 
 * @returns {} 
 */
SideOfTask.prototype.deleteTaskItem = function (taskItem) {
    this.taskItems.splice(this.taskItems.indexOf(taskItem), 1);
    taskItem.deleteItem();
    if (this.taskItems.length === 0) {
        return;
    }
    this.taskItems[this.taskItems.length - 1].buttonAdd.style.display = "inline-block";
    if (this.taskItems[0].divLogicalSymbol) {
        this.taskItems[0].divLogicalSymbol.style.display = "none";
    }
}

/**
 * Create new task item on the side of task.
 * @returns {} 
 */
SideOfTask.prototype.addTaskItem = function (newTaskItem) {
    this.createControllers(newTaskItem);
    this.listenEvents(newTaskItem);
    this.taskItems.push(newTaskItem);
}

/**
 * Switch all task items from side of task to state.
 * @param state     new state
 * @returns {} 
 */
SideOfTask.prototype.setAllDeduced = function (state) {
    for (var i = 0; i < this.taskItems.length; i++) {
        this.taskItems[i].item.setDeduced(state);
    }
}

/**
 * Negate side of task (using de Morgan rules).
 * @returns {} 
 */
SideOfTask.prototype.negate = function () {
    this.reverseConnective();
    for (var i = 0; i < this.taskItems.length; i++) {
        this.taskItems[i].item.negate();
    }
}

/**
 * Reverse all logial connectives on side of task.
 * @returns {} 
 */
SideOfTask.prototype.reverseConnective = function () {
    this.isConjunction = !this.isConjunction;
    for (var i = 0; i < this.taskItems.length; i++) {
        this.applyConnective(this.taskItems[i]);
    }
}

/**
 * Apply logical connective placed next to the task item. 
 * @param taskItem  appropriate task item
 * @returns {} 
 */
SideOfTask.prototype.applyConnective = function (taskItem) {
    if (!taskItem.divLogicalSymbol) {
        return;
    }
    if (this.isConjunction) {
        taskItem.divLogicalSymbol.innerHTML = "&#8743";
    }
    else {
        taskItem.divLogicalSymbol.innerHTML = "&#8744";
    }
};
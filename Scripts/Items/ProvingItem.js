/**
 * Class representing statement in proving space
 * @param type      type of StatementItem 
 * @returns {} 
 */
function ProvingItem(type) {
	this.type = type;
	this.moved = false;
	this.premises = [];
	this.conclusions = [];
	
	//item is StatementItem (Language, Closure, Concrete or Contradiction)
	switch (type) {
		case EnumItem.LANGUAGE: {
			this.item = new LanguageItem();
			break;
		}
		case EnumItem.CLOSURE: {
			this.item = new ClosureItem();
			break;
		}
		case EnumItem.CONCRETE: {
			this.item = new ConcreteItem();
			break;
		}
		case EnumItem.CONTRA: {
			this.item = new ContradictionItem();
			break;
		}
	}
    this.createControllers();
}

/**
 * Initialize controllers.
 * @returns {} 
 */
ProvingItem.prototype.createControllers = function()
{
    this.item.divItem.className += " proving";
    var spaceElement = document.getElementById("divSpace");
    if (spaceElement) {
        spaceElement.appendChild(this.item.divItem);
    }
    this.connections = [];

    for (var i = 0; i < 2; i++) {
        if (this.item.hasConnectionButton(i)) {
            this.connections[i] = document.createElement("button");
            this.connections[i].className = "connection bottom";
            if (i === 0) {
                this.connections[i].className = "connection top";
            }
            this.item.divItem.appendChild(this.connections[i]);
        } else {
            this.connections[i] = null;
        }
    }

    this.buttonDelete = document.createElement("button");
    this.buttonDelete.className = "buttonDelete itemButton";
    this.item.divItem.appendChild(this.buttonDelete);

    if (this.item.hasDuplicateButton()) {
        this.buttonDuplicate = document.createElement("button");
        this.buttonDuplicate.className = "buttonAdd itemButton";
        this.item.divItem.appendChild(this.buttonDuplicate);
    }

    //allows to move with the item
    this.mover = document.createElement("button");
    this.mover.className = "mover";
    this.item.divItem.appendChild(this.mover);
}

ProvingItem.prototype.translate = function (translateX, translateY) {
    this.item.divItem.style.left = this.item.divItem.offsetLeft + translateX * 224;
    this.item.divItem.style.top = this.item.divItem.offsetTop + translateY * 112;
}

/**
 * Delete item from proving space and perform animation
 * @returns {} 
 */
ProvingItem.prototype.deleteItem = function(clearingSpace) {
    var i;
    var thisItem = this;
    var spaceElement = document.getElementById("divSpace");
	if (spaceElement) {
	    spaceElement.removeChild(thisItem.item.divItem);
	}
    if (!clearingSpace) {
        for (i = 0; i < this.premises.length; i++) {
            this.premises[i].conclusions.splice(this.premises[i].conclusions.indexOf(this), 1);
        }
        for (i = 0; i < this.conclusions.length; i++) {
            this.conclusions[i].premises.splice(this.conclusions[i].premises.indexOf(this), 1);
        }
    }
};

/**
 * Perform actions after end of moving.
 * @returns {} 
 */
ProvingItem.prototype.endMove = function() {
	if (this.moved) {
        this.checkBorders();
		drawConnections();
    }
    this.moved = false;
};

/**
 * Move with proving item.
 * @param event             event arguments with mouse or touch position 
 * @returns {} 
 */
ProvingItem.prototype.move = function(event){
	if (!event) {
		event = window.event;
	}
	this.moved = true; 
	var coordX = event.changedTouches ? parseInt(event.changedTouches[0].pageX) : event.pageX;
	var	coordY = event.changedTouches ? parseInt(event.changedTouches[0].pageY) : event.pageY;
    this.item.divItem.style.left = coordX - document.getElementById("divSpace").offsetLeft;
    this.item.divItem.style.top = coordY - document.getElementById("divSpace").offsetTop;
    if (!this.item.isEditorClosed()) {
        this.item.editorItem.locate(this.item.divItem.offsetLeft, this.item.divItem.offsetTop);
    }
    drawConnections();
};

/**
 * Check if item is out of proving space and returns it back
 * @returns {} 
 */
ProvingItem.prototype.checkBorders = function () {
    var limit = 16;
    if (this.item.divItem.offsetLeft < limit) {
        this.item.divItem.style.left = limit;
    } 
    else if (this.item.divItem.offsetLeft > 
            document.getElementById("divSpace").offsetWidth -
            this.item.divItem.offsetWidth - limit) {
        this.item.divItem.style.left = document.getElementById("divSpace").offsetWidth -
                                                this.item.divItem.offsetWidth - limit;
    }
    
    if (this.item.divItem.offsetTop < limit) {
        this.item.divItem.style.top = limit;
    }
    else if (this.item.divItem.offsetTop > 
            document.getElementById("divContainer").offsetHeight -
            this.item.divItem.offsetHeight - limit) {
        this.item.divItem.style.top = document.getElementById("divContainer").offsetHeight -
            this.item.divItem.offsetHeight - limit;
    }
	if (!this.item.isEditorClosed()) {
        this.item.editorItem.locate(this.item.divItem.offsetLeft, this.item.divItem.offsetTop);
    }	
};

/**
 * Returns result of creating steps, tht means list of steps and info about cycle in proof
 * @returns js object with steps and containsCycle info 
 */
ProvingItem.prototype.createSteps = function () {
    var result = {steps : [], containsCycle: false}
    if (contains(usedItems, this)) {
        result.containsCycle = true;
        return result;
    }
    usedItems.push(this);
    
    //do not follow same branch more times
    if (contains(everUsedItems, this)) {
        return result;
    }
    everUsedItems.push(this);
	
    for (var i = 0; i < this.premises.length;i++) {
        var innerResult = this.premises[i].createSteps();
        result.steps = result.steps.concat(innerResult.steps);
        result.containsCycle = result.containsCycle || innerResult.containsCycle;
    }
    if (this.premises.length === 0) {
        newChain();
    } else {
        result.steps.push(new Step(this.premises, this));
    }
    return result;
};
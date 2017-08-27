/**
 * Class representing building of proof.
 * @returns {} 
 */
function Proof() {
    this.items = [];
    this.movingItem = null;
    this.selectedPair = [null, null];
    this.backupItems = [];
    this.setClearableReturnable(false, false);
}

Proof.prototype.setClearableReturnable = function (clearable, returnable) {
    this.isClearable = clearable;
    this.isReturnable = returnable;
    if (!this.isClearable && !this.isReturnable) {
        document.getElementById("buttonClear").style.visibility = "hidden";
        return;
    }
    document.getElementById("buttonClear").style.visibility = "visible";
    document.getElementById("spanClearCs").innerHTML = this.isClearable ? "Vymazat plochu" : "Vrátit důkaz zpět";
    document.getElementById("spanClearEn").innerHTML = this.isClearable ? "Clear workspace" : "Take proof back";
}

/**
 * Switch all items to state.
 * @param state  new state  
 * @returns {} 
 */
Proof.prototype.setAllDeduced = function(state) {
    for (var i = 0; i < this.items.length; i++) {
        this.items[i].item.setDeduced(state);
    }
}

/**
 * Delete all item in proving space.
 * @returns {} 
 */
Proof.prototype.clearSpace = function () {
    var i;
    if (this.isClearable) {
        this.backupItems = [];
        for (i = 0; i < this.items.length; i++) {
            this.backupItems[i] = this.items[i];
        }
        for (i = 0; i < this.backupItems.length; i++) {
            this.deleteProvingItem(this.backupItems[i], true);
        }
        this.setClearableReturnable(false, true);
    }
    //step back
    else if (this.isReturnable) {
        this.setClearableReturnable(true, false);
        for (i = 0; i < this.backupItems.length; i++) {
            var item = this.backupItems[i];
            document.getElementById("divSpace").appendChild(item.item.divItem);
            this.items.push(item);
        }
    }
    drawConnections();
    checkProof();
}

Proof.prototype.userAddProvingItem = function(provingItem, originX, originY) {
    this.addProvingItem(provingItem, 0, 0);
    provingItem.item.divItem.style.left = originX + 16;
    provingItem.item.divItem.style.top = originY + 16;
}

/**
 * Add proving item to proof
 * @param {} provingItem    item to be added 
 * @param {} translateX     translation of x
 * @param {} translateY     translation of y
 * @returns {} 
 */
Proof.prototype.addProvingItem = function (provingItem, translateX, translateY) {
    this.setClearableReturnable(true, false);
    provingItem.translate(translateX, translateY);
    provingItem.checkBorders();
    this.listenEvents(provingItem);
    this.items.push(provingItem);
    checkProof();
}

/**
 * Delete proving item from proof
 * @param {} provingItem    item to be deleted 
 * @returns {} 
 */
Proof.prototype.deleteProvingItem = function (provingItem, clearingSpace) {
    provingItem.deleteItem(clearingSpace);
    this.setClearableReturnable(this.items.length > 1, false);
    this.items.splice(this.items.indexOf(provingItem), 1);
    if (!provingItem.item.isEditorClosed()) {
        provingItem.item.closeEditor();
    }
    var pairIndex = this.selectedPair.indexOf(provingItem);
    if (pairIndex >= 0) {
        this.selectedPair[pairIndex] = null;
    }
    if (provingItem.premises.length > 0 || provingItem.conclusions.length > 0) {
        drawConnections();
    }
}

/**
 * Create new proving item as a copy of existing item
 * @param {} copyItem   existing item
 * @returns new item as a copy of copyItem
 */
Proof.prototype.createCopy = function(copyItem) {
    var newItem = new ProvingItem(copyItem.type ? copyItem.type : EnumItem.LANGUAGE);
    if (!copyItem.item.isEditorClosed()) {
        copyItem.item.closeEditor();
    }
    newItem.item.copyInfo(copyItem.item);
    return newItem;
}

/**
 * Deal with events of proving item affecting proof.
 * @param {} provingItem    appropriate item
 * @returns {} 
 */
Proof.prototype.listenEvents = function (provingItem) {
    var thisItem = this;
    if (provingItem.connections[0]) {
        provingItem.connections[0].onmousedown = function() {
            thisItem.selectConnection(0, provingItem);
        };
    }

    if (provingItem.connections[1]) {
        provingItem.connections[1].onmousedown = function() {
            thisItem.selectConnection(1, provingItem);
        };
    }

    provingItem.buttonDelete.onmousedown = function () {
        thisItem.deleteProvingItem(provingItem);
        checkProof();
    };

    if (provingItem.item.hasDuplicateButton()) {
        provingItem.buttonDuplicate.onmousedown = function () {
            thisItem.userAddProvingItem(thisItem.createCopy(provingItem), provingItem.item.divItem.offsetLeft, provingItem.item.divItem.offsetTop);
        };
    }

    provingItem.mover.onmousedown = function (event) {
        thisItem.movingObject = provingItem;
        event.preventDefault();
    };

    provingItem.mover.addEventListener('touchstart', function (event) {
        thisItem.movingObject = provingItem;
        event.preventDefault();
    }, false);

    provingItem.mover.onmouseup = function () {
        provingItem.endMove();
        thisItem.movingObject = null;
    };

    provingItem.mover.addEventListener('touchend', function (event) {
        provingItem.endMove();
        thisItem.movingObject = null;
        event.preventDefault();
    }, false);
}

/**
 * Change class name of connection button to be selected.
 * @param {} connection     connection button
 * @returns {} 
 */
Proof.prototype.select = function(connection) {
    if (!contains(connection.className, "selected")) {
        connection.className += " selected";
    }
}

/**
 * Change class name of connection button to be deselected.
 * @param {} connection     connection button
 * @returns {} 
 */
Proof.prototype.deselect = function (connection) {
    if (contains(connection.className, "selected")) {
        connection.className = connection.className.replace(" selected", "");
    }
}

/**
 * Deal with selecting and deselecting items using connection buttons
 * @param {} indexOfConnection  if connection button is top or bottom
 * @param {} selectedItem       appropriate item
 * @returns {} 
 */
Proof.prototype.selectConnection = function (indexOfConnection, selectedItem) {
    //set
    if (this.selectedPair[(indexOfConnection - 1) * (-1)] !== selectedItem) {
        if (this.selectedPair[(indexOfConnection - 1) * (-1)]) {
            this.deselect(this.selectedPair[(indexOfConnection - 1) * (-1)].connections[indexOfConnection]);
        }
        this.selectedPair[(indexOfConnection - 1) * (-1)] = selectedItem;
        this.select(this.selectedPair[(indexOfConnection - 1) * (-1)].connections[indexOfConnection]);
        if (this.selectedPair[indexOfConnection] === selectedItem) {
            this.deselect(this.selectedPair[indexOfConnection].connections[(indexOfConnection - 1) * (-1)]);
            this.selectedPair[indexOfConnection] = null;
        }
    }
    else {
        this.deselect(this.selectedPair[(indexOfConnection - 1) * (-1)].connections[indexOfConnection]);
        this.selectedPair[(indexOfConnection - 1) * (-1)] = null;
    }

    //bilance
    if (this.selectedPair[0] && this.selectedPair[1]) {
        if (contains(this.selectedPair[1].premises, this.selectedPair[0])) {
            this.deleteConnection(this.selectedPair[0], this.selectedPair[1]);
        }
        else {
            this.createConnection(this.selectedPair[0], this.selectedPair[1]);
        }
        this.deselect(this.selectedPair[0].connections[1]);
        this.deselect(this.selectedPair[1].connections[0]);
        this.selectedPair = [null, null];
        drawConnections();
        checkProof();
    }
};

/**
 * Creates connection between items (change their premises and conclusions)
 * @param {} premiseItem        premise
 * @param {} conclusionItem     conclusion
 * @returns {} 
 */
Proof.prototype.createConnection = function (premiseItem, conclusionItem) {
    premiseItem.conclusions.push(conclusionItem);
    conclusionItem.premises.push(premiseItem);
}

/**
 * Deletes connection between items (change their premises and conclusions)
 * @param {} premiseItem        premise
 * @param {} conclusionItem     conclusion
 * @returns {} 
 */
Proof.prototype.deleteConnection = function (premiseItem, conclusionItem) {
    premiseItem.conclusions.splice(premiseItem.conclusions.indexOf(conclusionItem), 1);
    conclusionItem.premises.splice(conclusionItem.premises.indexOf(premiseItem), 1);
}
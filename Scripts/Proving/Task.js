/**
 * Class representing task for proving
 * @returns {} 
 */
function Task() {
    this.left = new SideOfTask(true);
    this.right = new SideOfTask(false);
    this.normalDirection = true;
    this.viewDirection();
}

/**
 * View implication symbol in correct direction
 * @returns {} 
 */
Task.prototype.viewDirection = function() {
    var implicationElement = document.getElementById("divImplication");
    if (implicationElement) {
        if (this.normalDirection) {
            implicationElement.innerHTML = "&#8658";
        } else {
            implicationElement.innerHTML = "&#8656";
        }
    }
}

/**
 * Clears sides of implication
 * @returns {} 
 */
Task.prototype.clear = function() {
    this.left.clear();
    this.right.clear();
}

/**
 * Gets premise of implication
 * @returns premise as SideOfTask 
 */
Task.prototype.getPremise = function() {
    return this.normalDirection ? this.left : this.right;
}

/**
 * Get conclusion of implication
 * @returns conclusion as SideOfTask 
 */
Task.prototype.getConclusion = function () {
    return this.normalDirection ? this.right : this.left;
}

/**
 * Change implication A => B to !B => !A
 * @returns {} 
 */
Task.prototype.change = function () {
    this.normalDirection = !this.normalDirection;
    this.viewDirection();
    this.left.negate();
    this.right.negate();
	checkProof();
};
var usedItems = [];
var everUsedItems = [];

function newChain() {
    usedItems = [];
}

function startChains() {
    everUsedItems = [];
}

/**
 * Create dropdown controller containing english and czech version.
 * @param values    source of values wihich have CZECH and ENGLISH property
 * @returns dropdown html
 */

function getBilingualSelect(values) {
    var controller = document.createElement("select");
    controller.className = "controller smaller bilingual";
    for (var i = 0; i < values.length; i++) {
        var option = new Option(values[i].CZECH);
        option.className = "cs";
        controller.options.add(option);
        option = new Option(values[i].ENGLISH);
        option.className = "en";
        controller.options.add(option);
    }
    if (getLanguage() === "cs") {
        controller.selectedIndex = 0;
    }
    else if (getLanguage() === "en") {
        controller.selectedIndex = 1;
    }
    return controller;
}

/**
 * Check if all values in the array are same.
 * @param arrayOfItems  objects to compare
 * @returns boolean if all values are same 
 */
function areSame(arrayOfItems) {
	if (arrayOfItems.length === 0) {
		return false;
	}
	var firstItem = arrayOfItems[0];
	for (var i = 1; i < arrayOfItems.length; i++) {
	    if (firstItem === arrayOfItems[i] ||
            (firstItem instanceof LanguageName && firstItem.sameAs(arrayOfItems[i]))) {
	        continue;
	    }
	    return false;
	}
	return true;
}

/**
 * Check if array contains item
 * @param arrayOfItems  array of objects
 * @param item          object to find
 * @returns boolean if object is in array 
 */
function contains(arrayOfItems, item) {
    return arrayOfItems.indexOf(item) >= 0;
}

/**
 * Changing prototypes to endure inheritance
 * @param child         class which inherits from parent
 * @param {} parent     class which child inherits from
 * @returns {} 
 */
function inheritsFrom(child, parent) {
    child.prototype = Object.create(parent.prototype);
}

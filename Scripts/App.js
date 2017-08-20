var task;
var proof;
var method;

/**
 * Loads example from predefined examples to UI.
 * @param example   predefined example as enum
 * @returns {} 
 */
function loadExample(example) {
    if (task) {
        task.clear();
    }
    if (proof) {
        proof.clearSpace();
    }
    var solution = loadSolution(example);
    proof = solution.proof;
    task = solution.task;
    setMethod(solution.method);
    drawConnections();
}

/**
 * Return solution from predefined examples.
 * @param example   predefined example as enum
 * @returns example as solution
 */
function loadSolution(example) {
    var task = new Task();
    var proof = new Proof();
    if (!example) {
        example = EnumExample.TRIVIAL;
    }
    var method = EnumMethod.DIRECT;
    var conclusion;
    switch(example) {
    case EnumExample.TRIVIAL:
        {
            task.getPremise().addTaskItem(new TaskItem());
            task.getConclusion().addTaskItem(new TaskItem());
            break;
        }
    case EnumExample.DIRECT:
        {
            task.getPremise().addTaskItem(new TaskItem());
            task.getConclusion().addTaskItem(new TaskItem());
            task.getConclusion().taskItems[0].item.setProperties(null, null, EnumClass.CSL);
            var premise = proof.createCopy(task.getPremise().taskItems[0]);
            proof.addProvingItem(premise, 0, 0);
            conclusion = proof.createCopy(task.getConclusion().taskItems[0]);
            proof.addProvingItem(conclusion, 0, 1);
            proof.createConnection(premise, conclusion);
            break;
        }
    case EnumExample.CONTRA:
        {
            task.getPremise().addTaskItem(new TaskItem());
            task.getConclusion().addTaskItem(new TaskItem());

            var first = proof.createCopy(task.getPremise().taskItems[0]);
            proof.addProvingItem(first,0,0);
            var second = proof.createCopy(task.getConclusion().taskItems[0]);
            second.item.negate();
            proof.addProvingItem(second, 1, 0);
            var contradiction = new ProvingItem(EnumItem.CONTRA);
            proof.addProvingItem(contradiction, 0.5, 1);
            proof.createConnection(first, contradiction);
            proof.createConnection(second, contradiction);
            method = EnumMethod.CONTRA;
            break;
        }
    case EnumExample.DISPROOF:
        {
            task.getPremise().addTaskItem(new TaskItem());
            task.getPremise().taskItems[0].item.setProperties(null, null, EnumClass.REG);
            task.getConclusion().addTaskItem(new TaskItem());

            var concrete = new ProvingItem(EnumItem.CONCRETE);
		concrete.item.setProperties(null, EnumConcreteLanguage.ALL);
            proof.addProvingItem(concrete, 0.5, 0);
            var deducedPremise = proof.createCopy(task.getPremise().taskItems[0]);
            proof.addProvingItem(deducedPremise, 0, 1);
            var deducedNegatedConclusion = proof.createCopy(task.getConclusion().taskItems[0]);
            deducedNegatedConclusion.item.negate();
            proof.addProvingItem(deducedNegatedConclusion, 1, 1);
            proof.createConnection(concrete, deducedPremise);
            proof.createConnection(concrete, deducedNegatedConclusion);
            method = EnumMethod.DISPROOF;
            break;
        }
    case EnumExample.CLOSURE:
        {
            task.getPremise().addTaskItem(new TaskItem());
            task.getPremise().addTaskItem(new TaskItem());
            task.getPremise().taskItems[0].item.setProperties(new LanguageName(EnumOperation.ATOMIC, "A", null), false, EnumClass.REG);
            task.getPremise().taskItems[1].item.setProperties(new LanguageName(EnumOperation.ATOMIC, "B", null), false, EnumClass.REG);
            task.getConclusion().addTaskItem(new TaskItem());
            task.getConclusion().taskItems[0].item.setProperties(new LanguageName(EnumOperation.UNI, new LanguageName(EnumOperation.ATOMIC, "A", null), new LanguageName(EnumOperation.ATOMIC, "B", null)), false, EnumClass.REG);

            var firstPremise = proof.createCopy(task.getPremise().taskItems[0]);
            proof.addProvingItem(firstPremise, 0, 0);
            var secondPremise = proof.createCopy(task.getPremise().taskItems[1]);
            proof.addProvingItem(secondPremise, 1, 0);
            var closure = new ProvingItem(EnumItem.CLOSURE);
            closure.item.setProperties(EnumClass.REG, EnumOperation.UNI);
            proof.addProvingItem(closure, 2, 0);
            var deducedConclusion = proof.createCopy(task.getConclusion().taskItems[0]);
            proof.addProvingItem(deducedConclusion, 1, 1);

            proof.createConnection(firstPremise, deducedConclusion);
            proof.createConnection(secondPremise, deducedConclusion);
            proof.createConnection(closure, deducedConclusion);
            break;
        }
    case EnumExample.CYCLE:
        {
            task.getPremise().addTaskItem(new TaskItem());
            task.getConclusion().addTaskItem(new TaskItem());
            task.getConclusion().taskItems[0].item.setProperties(null, null, EnumClass.CSL);
            var premise1 = proof.createCopy(task.getPremise().taskItems[0]);
            proof.addProvingItem(premise1, 1, 0);
            var premise2 = proof.createCopy(task.getPremise().taskItems[0]);
            proof.addProvingItem(premise2, 0, 0);
            conclusion = proof.createCopy(task.getConclusion().taskItems[0]);
            proof.addProvingItem(conclusion, 0.5, 1);
            proof.createConnection(premise1, conclusion);
            proof.createConnection(premise1, premise2);
            proof.createConnection(premise2, premise1);
            break;
        }
    }
    return new Solution(task, proof, method);
}

/**
 * Start checking the proof.
 * @returns {} 
 */
function checkProof() {
    if (task && proof) {
        var solution = new Solution(task, proof, method);
        solution.check();
    }
}

/**
 * Add css for touch devices.
 * @returns {} 
 */
function addMobileCss() {
    if ("ontouchstart" in window || navigator.msMaxTouchPoints) {
        var link = document.createElement("link");
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = "Styles/Mobile.css?$$REVISION$$";
        document.head.appendChild(link);
    }
}

/**
 * Listen events (mouse, touch and resize)
 * @returns {} 
 */
function listenEvents() {
    document.body.addEventListener("touchmove", function (event) {
        move(event);
    }, false);

    document.body.addEventListener("mousemove", function (event) {
        move(event);
    }, false);
}

/**
 * Initializes application.
 * @returns {} 
 */
function init() {
    addMobileCss();
    listenEvents();
    createHelp();
    initExample();
    setLanguage("cs");
}

/**
 * Intitializes drop down select of examples.
 * @returns {} 
 */
function initExample() {
    var controller = getBilingualSelect(examples);
    controller.className = "controller bilingual";
    controller.onchange = function () {
        loadExample(Math.floor(controller.selectedIndex / 2));
    };
    loadExample();
    document.getElementById("examples").appendChild(controller);
}

/**
 * Function for moving with selected provingItem
 * @param {} event  event info (cursor position, etc.)
 * @returns {} 
 */
function move(event) {
    if (proof.movingObject) {
        proof.movingObject.move(event);
    }
}

/**
 * Adds new proving item of type to proof
 * @param {} type   type of new item
 * @returns {} 
 */
function addProvingItem(type) {
    proof.userAddProvingItem(new ProvingItem(type));
}

/**
 * Switches language of application
 * @param language  new language
 * @returns {} 
 */
function setLanguage(language) {
    document.body.className = language;
    var dropdowns = document.getElementsByClassName("bilingual");
    for (var i = 0; i < dropdowns.length; i++) {
        if (language === "en" && dropdowns[i].selectedIndex %2 === 0) {
            dropdowns[i].selectedIndex = dropdowns[i].selectedIndex + 1;
        } else if (language === "cs" && dropdowns[i].selectedIndex % 2 === 1) {
            dropdowns[i].selectedIndex = dropdowns[i].selectedIndex - 1;
        }
        for (var j = 0; j < dropdowns[i].options.length; j++) {
            if (language === dropdowns[i].options[j].className) {
                dropdowns[i].options[j].disabled = false;
            } else {
                dropdowns[i].options[j].disabled = true;
            }
        }
    }
}

/**
 * Gets language of application.
 * @returns language string ("cs", "en") 
 */
function getLanguage() {
    return document.body.className;
}

/**
 * Sets method of proving
 * @param {} value      method as enum
 * @returns {} 
 */
function setMethod(value) {
    method = value;
    document.getElementById(value).checked = true;
    checkProof();
}

/**
 * Draws lines (connections between items) to svg picture covering proving space.
 * @returns {} 
 */
function drawConnections() {
    var svgItem = document.getElementById("svgItem");
    if (!svgItem) {
        return;
    }
    //buggy clearing of SVG item in IE (svgItem.innerHTML = "";)
    while (svgItem.firstChild) {
        svgItem.removeChild(svgItem.firstChild);
    }
    for (var i = 0; i < proof.items.length; i++) { 
        for (var j = 0; j < proof.items[i].premises.length; j++) {
            var first = proof.items[i].premises[j];
            var second = proof.items[i];
            var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("stroke-width", "2");
            line.setAttribute("stroke", "black");
            line.setAttribute("x1", 
                first.item.divItem.offsetLeft +
                first.connections[1].offsetLeft +
                first.connections[1].offsetWidth / 2 + 2);
            line.setAttribute("y1", 
                first.item.divItem.offsetTop +
                first.connections[1].offsetTop +
                first.connections[1].offsetHeight / 2 + 2);
            line.setAttribute("x2", 
                second.item.divItem.offsetLeft +
                second.connections[0].offsetLeft +
                second.connections[0].offsetWidth / 2 + 2);
            line.setAttribute("y2", 
                second.item.divItem.offsetTop +
                second.connections[0].offsetTop +
                second.connections[0].offsetHeight / 2 + 2);
            svgItem.appendChild(line);
        }
    } 
}
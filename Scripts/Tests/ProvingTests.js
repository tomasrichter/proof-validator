/// <reference path="../../../BP/Scripts/Languages/LanguageName.js" />
/// <reference path="../../../BP/Scripts/Languages/Operation.js" />
/// <reference path="../../../BP/Scripts/Proving/Proof.js" />
/// <reference path="../../../BP/Scripts/Proving/Rules.js" />
/// <reference path="../../../BP/Scripts/Proving/SideOfTask.js" />
/// <reference path="../../../BP/Scripts/Proving/Task.js" />
/// <reference path="../../../BP/Scripts/Proving/Solution.js" />
/// <reference path="../../../BP/Scripts/Proving/Step.js" />
/// <reference path="../../../BP/Scripts/Utils/Utils.js" />
/// <reference path="../../../BP/Scripts/Items/ProvingItem.js" />
/// <reference path="../../../BP/Scripts/Items/TaskItem.js" />
/// <reference path="../../../BP/Scripts/Items/StatementItem.js" />
/// <reference path="../../../BP/Scripts/Items/ContradictionItem.js" />
/// <reference path="../../../BP/Scripts/Items/LanguageItem.js" />
/// <reference path="../../../BP/Scripts/Items/ClosureItem.js" />
/// <reference path="../../../BP/Scripts/Items/ConcreteItem.js" />
/// <reference path="../../../BP/Scripts/App.js" />

QUnit.module("TaskTests");

QUnit.test("GetPremiseNormal", function (assert) {
    var task = new Task();
    assert.equal(task.getPremise(), task.left, "In normal direction, premise is left side of task.");
});

QUnit.test("GetConclusionNormal", function (assert) {
    var task = new Task();
    assert.equal(task.getConclusion(), task.right, "In normal direction, conclusion is right side of task.");
});

QUnit.test("GetPremiseChange", function (assert) {
    var task = new Task();
    task.change();
    assert.equal(task.getPremise(), task.right, "In inverted direction, premise is right side of task.");
});

QUnit.test("GetConclusionChange", function (assert) {
    var task = new Task();
    task.change();
    assert.equal(task.getConclusion(), task.left, "In inverted direction, conclusion is left side of task.");
});

QUnit.test("ChangeCheckConnective", function (assert) {
    var task = new Task();
    var oldLeft = task.left.isConjunction;
    var oldRight = task.right.isConjunction;
    task.change();
    var newLeft = task.left.isConjunction;
    var newRight = task.right.isConjunction;
    assert.ok(oldLeft && oldRight && !newLeft && !newRight, "Logical connective in side of task is changed after change of implication.");
});

QUnit.test("ChangeCheckNegations", function (assert) {
    var task = loadSolution(EnumExample.TRIVIAL).task;
    var oldNegations = [];
    var i;
    for (i = 0; i < task.left.taskItems.length; i++) {
        oldNegations.push(task.left.taskItems[i].item.isNegated);
    }
    for (i = 0; i < task.right.taskItems.length; i++) {
        oldNegations.push(task.right.taskItems[i].item.isNegated);
    }
    task.change();
    var newNegations = [];
    for (i = 0; i < task.left.taskItems.length; i++) {
        newNegations.push(!task.left.taskItems[i].item.isNegated);
    }
    for (i = 0; i < task.right.taskItems.length; i++) {
        newNegations.push(!task.right.taskItems[i].item.isNegated);
    }
    assert.deepEqual(oldNegations, newNegations, "Task items in side of tasks are negated after change of implication.");
});

QUnit.module("SideOfTaskTests");

QUnit.test("CreateTaskItem", function (assert) {
    var side = new SideOfTask(true);
    var oldItems = side.taskItems.slice();
    var newTaskItem = new TaskItem();
    side.addTaskItem(newTaskItem);
    assert.deepEqual(side.taskItems, oldItems.concat([newTaskItem]), "Creating task item adds item to side of task.");
});

QUnit.test("DeleteTaskItem", function (assert) {
    var side = new SideOfTask(true);
    var newTaskItem = new TaskItem();
    side.addTaskItem(newTaskItem);
    var oldItems = side.taskItems.slice();
    side.deleteTaskItem(newTaskItem);
    assert.deepEqual(side.taskItems.concat([newTaskItem]), oldItems, "Task item can be deleted.");
});

QUnit.test("NegateConnective", function (assert) {
    var side = new SideOfTask(true);
    var oldConnective = side.isConjunction;
    side.negate();
    var newConnective = side.isConjunction;
    assert.notEqual(oldConnective, newConnective, "Logical connective is changed after negation of side.");
});

QUnit.test("NegateTaskItems", function (assert) {
    var side = loadSolution(EnumExample.TRIVIAL).task.getPremise();
    var oldNegations = [];
    var i;
    for (i = 0; i < side.taskItems.length; i++) {
        oldNegations.push(side.taskItems[i].item.isNegated);
    }
    side.negate();
    var newNegations = [];
    for (i = 0; i < side.taskItems.length; i++) {
        newNegations.push(!side.taskItems[i].item.isNegated);
    }
    assert.deepEqual(oldNegations, newNegations, "Task items are negated after negation of side.");
});

QUnit.test("ReverseConnective", function (assert) {
    var side = new SideOfTask(true);
    var oldConnective = side.isConjunction;
    side.reverseConnective();
    var newConnective = side.isConjunction;
    assert.notEqual(oldConnective, newConnective, "Logical connective is changed after reversion.");
});

QUnit.module("ProofTests");

QUnit.test("AddProvingItem", function (assert) {
    var proof = new Proof();
    var firstItem = new ProvingItem(EnumItem.LANGUAGE);
    var secondItem = new ProvingItem(EnumItem.CLOSURE);
    var thirdItem = new ProvingItem(EnumItem.LANGUAGE);
    var fourthItem = new ProvingItem(EnumItem.CONTRA);
    proof.addProvingItem(firstItem);
    proof.addProvingItem(secondItem);
    proof.addProvingItem(thirdItem);
    proof.addProvingItem(fourthItem);
    assert.deepEqual(proof.items, [firstItem, secondItem,thirdItem,fourthItem], "Adding items to proof is OK.");
});

QUnit.test("ClearSpace", function (assert) {
    var proof = new Proof();
    proof.addProvingItem(new ProvingItem(EnumItem.LANGUAGE));
    proof.addProvingItem(new ProvingItem(EnumItem.CLOSURE));
    proof.addProvingItem(new ProvingItem(EnumItem.CONCRETE));
    proof.addProvingItem(new ProvingItem(EnumItem.CONTRA));
    proof.clearSpace();
    assert.equal(proof.items.length, 0, "Clear space deletes all items.");
});

QUnit.test("SetAllDeduced", function (assert) {
    var proof = new Proof();
    proof.addProvingItem(new ProvingItem(EnumItem.LANGUAGE));
    proof.addProvingItem(new ProvingItem(EnumItem.CLOSURE));
    proof.addProvingItem(new ProvingItem(EnumItem.CONCRETE));
    proof.addProvingItem(new ProvingItem(EnumItem.CONTRA));
    proof.setAllDeduced(EnumState.WRONG);
    var result = true;
    for (var i = 0; i < proof.items.length; i++) {
        if (!contains(proof.items[i].item.divItem.className, EnumState.WRONG)) {
            result = false;
            break;
        }
    }
    assert.ok(result, "All items are in specified state.");
});

QUnit.test("DeleteProvingItem", function (assert) {
    var proof = new Proof();
    var firstItem = new ProvingItem(EnumItem.LANGUAGE);
    var secondItem = new ProvingItem(EnumItem.CONCRETE);
    var thirdItem = new ProvingItem(EnumItem.CLOSURE);
    proof.addProvingItem(firstItem);
    proof.addProvingItem(secondItem);
    proof.addProvingItem(thirdItem);
    proof.deleteProvingItem(secondItem);
    assert.deepEqual(proof.items, [firstItem, thirdItem], "Deleting item from proof is OK.");
});

QUnit.test("SelectConnectionConclusion", function (assert) {
    var proof = new Proof();
    var first = new ProvingItem(EnumItem.LANGUAGE);
    var second = new ProvingItem(EnumItem.LANGUAGE);
    proof.addProvingItem(first);
    proof.addProvingItem(second);
    proof.selectConnection(0, first);
    assert.deepEqual(proof.selectedPair, [null, first], "Selecting conclusion connection.");
});

QUnit.test("SelectConnectionPremise", function (assert) {
    var proof = new Proof();
    var first = new ProvingItem(EnumItem.LANGUAGE);
    var second = new ProvingItem(EnumItem.LANGUAGE);
    proof.addProvingItem(first);
    proof.addProvingItem(second);
    proof.selectConnection(1, second);
    assert.deepEqual(proof.selectedPair, [second, null], "Selecting premise connection.");
});

QUnit.test("SelectConnectionRewrite", function (assert) {
    var proof = new Proof();
    var first = new ProvingItem(EnumItem.LANGUAGE);
    var second = new ProvingItem(EnumItem.LANGUAGE);
    proof.addProvingItem(first);
    proof.addProvingItem(second);
    proof.selectConnection(1, second);
    proof.selectConnection(1, first);
    assert.deepEqual(proof.selectedPair, [first, null], "Rewriting connection.");
});

QUnit.test("SelectConnectionBoth", function (assert) {
    var proof = new Proof();
    var first = new ProvingItem(EnumItem.LANGUAGE);
    var second = new ProvingItem(EnumItem.LANGUAGE);
    proof.addProvingItem(first);
    proof.addProvingItem(second);
    proof.selectConnection(1, second);
    proof.selectConnection(0, first);
    assert.deepEqual(proof.selectedPair, [null, null], "Both connection selected, so pair is set to null.");
});

QUnit.test("SelectConnectionBack", function (assert) {
    var proof = new Proof();
    var first = new ProvingItem(EnumItem.LANGUAGE);
    var second = new ProvingItem(EnumItem.LANGUAGE);
    proof.addProvingItem(first);
    proof.addProvingItem(second);
    proof.selectConnection(1, second);
    proof.selectConnection(1, second);
    assert.deepEqual(proof.selectedPair, [null, null], "Conection is selected and then deselected");
});

QUnit.test("SelectConnectionAdd", function (assert) {
    var proof = new Proof();
    var first = new ProvingItem(EnumItem.LANGUAGE);
    var second = new ProvingItem(EnumItem.LANGUAGE);
    proof.addProvingItem(first);
    proof.addProvingItem(second);
    proof.selectConnection(1, second);
    proof.selectConnection(0, first);
    assert.ok(second.conclusions[0] === first && first.premises[0] === second, "Connection creates premise and conclusion.");
});

QUnit.test("SelectConnectionDelete", function (assert) {
    var proof = new Proof();
    var first = new ProvingItem(EnumItem.LANGUAGE);
    var second = new ProvingItem(EnumItem.LANGUAGE);
    proof.addProvingItem(first);
    proof.addProvingItem(second);
    proof.selectConnection(1, second);
    proof.selectConnection(0, first);
    proof.selectConnection(1, second);
    proof.selectConnection(0, first);
    assert.ok(second.conclusions.length === 0 && first.premises.length === 0, "Connection is deleted.");
});

QUnit.module("StepTests");

QUnit.test("IsNotContradiction", function (assert) {
    var step = new Step([new ProvingItem(EnumItem.LANGUAGE), new ProvingItem(EnumItem.LANGUAGE)], new ProvingItem(EnumItem.LANGUAGE));
    assert.notOk(step.isContradiction(), "This step should not be contradiction.");
});

QUnit.test("IsContradiction", function (assert) {
    var step = new Step([new ProvingItem(EnumItem.LANGUAGE), new ProvingItem(EnumItem.LANGUAGE)], new ProvingItem(EnumItem.CONTRA));
    assert.ok(step.isContradiction(), "This step should be contradiction.");
});

QUnit.test("DividePremises", function (assert) {
    var step = new Step(
        [new ProvingItem(EnumItem.LANGUAGE),
        new ProvingItem(EnumItem.CLOSURE),
        new ProvingItem(EnumItem.LANGUAGE),
        new ProvingItem(EnumItem.CONCRETE),
        new ProvingItem(EnumItem.CONCRETE),
        new ProvingItem(EnumItem.LANGUAGE),
        new ProvingItem(EnumItem.LANGUAGE)]
        , new ProvingItem(EnumItem.LANGUAGE));
    assert.equal(step.dividePremises().mask, "4;1;2","Premises are correctly divided.");
});

QUnit.module("SolutionTests");

QUnit.test("checkTaskFormDirectOK", function (assert) {
    var task = loadSolution(EnumExample.TRIVIAL).task;
    task.getConclusion().addTaskItem(new TaskItem());
    task.getConclusion().reverseConnective();
    var proof = new Proof();
    var method = EnumMethod.DIRECT;
    var solution = new Solution(task, proof, method);
    assert.ok(solution.checkTaskForm(), "Task form is OK.");
});

QUnit.test("checkTaskFormDirectNOK", function (assert) {
    var task = loadSolution(EnumExample.TRIVIAL).task;
    task.getPremise().addTaskItem(new TaskItem());
    task.getPremise().reverseConnective();
    var proof = new Proof();
    var method = EnumMethod.DIRECT;
    var solution = new Solution(task, proof, method);
    assert.notOk(solution.checkTaskForm(), "Task form is not OK.");
});

QUnit.test("checkTaskFormDisproofOK", function (assert) {
    var task = loadSolution(EnumExample.TRIVIAL).task;
    task.getConclusion().addTaskItem(new TaskItem());
    task.getConclusion().reverseConnective();
    var proof = new Proof();
    var method = EnumMethod.DISPROOF;
    var solution = new Solution(task, proof, method);
    assert.ok(solution.checkTaskForm(), "Task form is OK.");
});

QUnit.test("checkTaskFormContraOK", function (assert) {
    var task = loadSolution(EnumExample.TRIVIAL).task;
    task.getConclusion().addTaskItem(new TaskItem());
    task.getConclusion().reverseConnective();
    var proof = new Proof();
    var method = EnumMethod.CONTRA;
    var solution = new Solution(task, proof, method);
    assert.ok(solution.checkTaskForm(), "Task form is OK.");
});

QUnit.test("checkTaskFormContraNOK", function (assert) {
    var task = loadSolution(EnumExample.TRIVIAL).task;
    task.getConclusion().addTaskItem(new TaskItem());
    var proof = new Proof();
    var method = EnumMethod.CONTRA;
    var solution = new Solution(task, proof, method);
    assert.notOk(solution.checkTaskForm(), "Task form is not OK.");
});

QUnit.test("isProofValidTrivial", function (assert) {
    var solution = loadSolution(EnumExample.TRIVIAL);
    assert.equal(solution.isProofValid(), EnumState.CORRECT, "Proof is trivially valid.");
});

QUnit.test("isProofValidNotTrivial", function (assert) {
    var solution = loadSolution(EnumExample.DIRECT);
    assert.equal(solution.isProofValid(), EnumState.CORRECT, "Proof is valid.");
});

QUnit.test("isProofValidContradiction", function (assert) {
    var solution = loadSolution(EnumExample.CONTRA);
    assert.equal(solution.isProofValid(), EnumState.CORRECT, "Proof is valid.");
});

QUnit.test("isProofValidFalse", function (assert) {
    var solution = loadSolution(EnumExample.TRIVIAL);
    solution.task.getConclusion().taskItems[0].item.negate();
    assert.equal(solution.isProofValid(), EnumState.UNKNOWN, "Proof is not valid.");
});

QUnit.test("AssumeDirect", function (assert) {
    var solution = loadSolution(EnumExample.DIRECT);
    solution.assume();
    assert.ok(solution.isKnown(solution.task.getPremise().taskItems[0].item, true), "Assuming is correct.");
});

QUnit.test("AssumeContra", function (assert) {
    var solution = loadSolution(EnumExample.CONTRA);
    solution.assume();
    assert.ok(solution.isKnown(solution.task.getConclusion().taskItems[0].item, false), "Assuming is correct.");
});

QUnit.test("AssumeDisproof", function (assert) {
    var solution = loadSolution(EnumExample.DISPROOF);
    solution.assume();
    assert.deepEqual(solution.knownStatements, [], "Assuming is correct.");
});

QUnit.test("SubmitSolutionSimple", function (assert) {
    var solution = loadSolution(EnumExample.DIRECT);
    solution.submitSolution();
    assert.ok(
        !solution.containsCycle && 
        solution.steps.length === 1 &&
        solution.steps[0].premises[0] === solution.proof.items[0] &&
        solution.steps[0].conclusion === solution.proof.items[1], "Step was created");
});

QUnit.test("SubmitSolutionNoRoot", function (assert) {
    var solution = loadSolution(EnumExample.DIRECT);
    solution.proof.createConnection(solution.proof.items[1], solution.proof.items[0]);
    solution.submitSolution();
    assert.ok(!solution.containsCycle && solution.steps.length === 0, "Proof has no start element");
});

QUnit.test("SubmitSolutionCycle", function (assert) {
    var solution = loadSolution(EnumExample.CYCLE);
    solution.submitSolution();
    assert.ok(solution.containsCycle, "Proof contains cycle.");
});
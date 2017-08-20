/// <reference path="../../../BP/Scripts/Languages/LanguageName.js" />
/// <reference path="../../../BP/Scripts/Languages/Operation.js" />
/// <reference path="../../../BP/Scripts/Proving/Proof.js" />
/// <reference path="../../../BP/Scripts/Proving/Rules.js" />
/// <reference path="../../../BP/Scripts/Proving/Step.js" />
/// <reference path="../../../BP/Scripts/Utils/Utils.js" />
/// <reference path="../../../BP/Scripts/Items/ProvingItem.js" />
/// <reference path="../../../BP/Scripts/Items/StatementItem.js" />
/// <reference path="../../../BP/Scripts/Items/ContradictionItem.js" />
/// <reference path="../../../BP/Scripts/Items/LanguageItem.js" />
/// <reference path="../../../BP/Scripts/Items/ClosureItem.js" />
/// <reference path="../../../BP/Scripts/Items/ConcreteItem.js" />
/// <reference path="../../../BP/Scripts/App.js" />

QUnit.module("ContradictionItemTests");

QUnit.test("SetDeducedWrong", function (assert) {
    var item = new ContradictionItem();
    item.setDeduced(EnumState.WRONG);
    assert.ok(contains(item.divItem.className, EnumState.WRONG), "State correctly assigned.");
});

QUnit.test("SetDeducedCorrect", function (assert) {
    var item = new ContradictionItem();
    item.setDeduced(EnumState.CORRECT);
    assert.ok(contains(item.divItem.className, EnumState.CORRECT), "State correctly assigned.");
});

QUnit.test("SetDeducedUnknown", function (assert) {
    var item = new ContradictionItem();
    item.setDeduced(EnumState.UNKNOWN);
    assert.ok(contains(item.divItem.className, EnumState.UNKNOWN), "State correctly assigned.");
});

QUnit.module("ProvingItemTests");

QUnit.test("CreateStepsSimpleContainsCycleFalse", function (assert) {
    var proof = new Proof();
    var firstItem = new ProvingItem(EnumItem.LANGUAGE);
    var secondItem = new ProvingItem(EnumItem.LANGUAGE);
    proof.addProvingItem(firstItem);
    proof.addProvingItem(secondItem);
    proof.createConnection(firstItem, secondItem);
    assert.notOk(firstItem.createSteps().containsCycle, "Steps are not in cycle.");
});

QUnit.test("CreateStepsSimpleContainsCycleTrue", function (assert) {
    var proof = new Proof();
    var firstItem = new ProvingItem(EnumItem.LANGUAGE);
    var secondItem = new ProvingItem(EnumItem.LANGUAGE);
    proof.addProvingItem(firstItem);
    proof.addProvingItem(secondItem);
    proof.createConnection(firstItem, secondItem);
    proof.createConnection(secondItem, firstItem);
    assert.ok(firstItem.createSteps().containsCycle, "Steps are in cycle.");
});

QUnit.test("CreateStepsSimple", function (assert) {
    var proof = new Proof();
    var firstItem = new ProvingItem(EnumItem.LANGUAGE);
    var secondItem = new ProvingItem(EnumItem.LANGUAGE);
    proof.addProvingItem(firstItem);
    proof.addProvingItem(secondItem);
    proof.createConnection(secondItem, firstItem);
    var steps = firstItem.createSteps().steps;
    assert.ok(
        steps.length === 1 &&
        steps[0].premises[0] === secondItem &&
        steps[0].conclusion === firstItem, "Step is created.");
});

QUnit.module("StatementItemTests");

QUnit.test("SetDeducedWrong", function (assert) {
    var item = new LanguageItem();
    item.setDeduced(EnumState.WRONG);
    assert.ok(item.isInState(EnumState.WRONG), "State correctly assigned.");
});

QUnit.test("SetDeducedCorrect", function (assert) {
    var item = new ClosureItem();
    item.setDeduced(EnumState.CORRECT);
    assert.ok(item.isInState(EnumState.CORRECT), "State correctly assigned.");
});

QUnit.test("SetDeducedUnknown", function (assert) {
    var item = new ConcreteItem();
    item.setDeduced(EnumState.UNKNOWN);
    assert.ok(item.isInState(EnumState.UNKNOWN), "State correctly assigned.");
});

QUnit.test("MatchesSetEqualityRuleCoCoA", function (assert) {
    var conclusion = new LanguageItem();
    var premise = new LanguageItem();
    premise.setProperties(new LanguageName(EnumOperation.CO, new LanguageName(EnumOperation.CO, conclusion.languageName, null),null),null, null);
    assert.ok(conclusion.matchesSetEqualityRule(premise.languageName), "Set equality rule can be matched.");
});

QUnit.test("MatchesSetEqualityRuleCoCoAReverseOrder", function (assert) {
    var conclusion = new LanguageItem();
    var premise = new LanguageItem();
    conclusion.setProperties(new LanguageName(EnumOperation.CO, new LanguageName(EnumOperation.CO, premise.languageName, null), null), null, null);
    assert.ok(conclusion.matchesSetEqualityRule(premise.languageName), "Set equality rule can be matched.");
});

QUnit.test("MatchesSetEqualityRuleA", function (assert) {
    var conclusion = new LanguageItem();
    var premise = new LanguageItem();
    assert.ok(conclusion.matchesSetEqualityRule(premise.languageName), "Set equality rule can be matched.");
});

QUnit.test("MatchesSetEqualityRuleAUnionA", function (assert) {
    var conclusion = new LanguageItem();
    var premise = new LanguageItem();
    premise.setProperties(new LanguageName(EnumOperation.UNI, conclusion.languageName, conclusion.languageName), null, null);
    assert.ok(conclusion.matchesSetEqualityRule(premise.languageName), "Set equality rule can be matched.");
});

QUnit.test("MatchesSetEqualityRuleIterationTrue", function (assert) {
    var conclusion = new LanguageItem();
    var premise = new LanguageItem();
    conclusion.setProperties(new LanguageName(EnumOperation.ITER,
        new LanguageName(EnumOperation.ATOMIC, "A", null),
        null));
    premise.setProperties(new LanguageName(EnumOperation.ITER, conclusion.languageName, null), null, null);
    assert.ok(conclusion.matchesSetEqualityRule(premise.languageName), "Set equality rule can be matched.");
});

QUnit.test("MatchesSetEqualityRuleIterationFalse", function (assert) {
    var conclusion = new LanguageItem();
    var premise = new LanguageItem();
    premise.setProperties(new LanguageName(EnumOperation.ITER, conclusion.languageName, null), null, null);
    assert.notOk(conclusion.matchesSetEqualityRule(premise.languageName), "Set equality rule cannot be matched.");
});

QUnit.test("MatchesOperationRuleUnionWithFin", function (assert) {
    var item = new LanguageItem();
    assert.ok(item.matchesOperationRule(languageRules, EnumOperation.UNI, EnumClass.FIN, EnumClass.CFL, EnumClass.CFL), "Operation rule can be matched.");
});

QUnit.test("MatchesOperationRuleIntersectionWithFin", function (assert) {
    var item = new LanguageItem();
    assert.ok(item.matchesOperationRule(languageRules, EnumOperation.INT, EnumClass.REC, EnumClass.FIN, EnumClass.FIN), "Operation rule can be matched.");
});

QUnit.test("MatchesOperationRuleExcludeFromFin", function (assert) {
    var item = new LanguageItem();
    assert.ok(item.matchesOperationRule(languageRules, EnumOperation.EXC, EnumClass.FIN, EnumClass.RE, EnumClass.FIN), "Operation rule can be matched.");
});

QUnit.test("MatchesOperationRuleExcludeFin", function (assert) {
    var item = new LanguageItem();
    assert.ok(item.matchesOperationRule(languageRules, EnumOperation.EXC, EnumClass.RE, EnumClass.FIN, EnumClass.RE), "Operation rule can be matched.");
});

QUnit.test("MatchesOperationRuleConcatenateWithFin", function (assert) {
    var item = new LanguageItem();
    assert.ok(item.matchesOperationRule(languageRules, EnumOperation.CON, EnumClass.RE, EnumClass.FIN, EnumClass.RE), "Operation rule can be matched.");
});

QUnit.test("MatchesOperationRuleIntersectiontWithReg", function (assert) {
    var item = new LanguageItem();
    assert.ok(item.matchesOperationRule(languageRules, EnumOperation.INT, EnumClass.REG, EnumClass.DCFL, EnumClass.DCFL), "Operation rule can be matched.");
});

QUnit.test("MatchesOperationRuleDifferentNull", function (assert) {
    var item = new LanguageItem();
    assert.notOk(item.matchesOperationRule(languageRules, EnumOperation.INT, EnumClass.REG, EnumClass.DCFL, EnumClass.CFL), "Operation rule cannot be matched.");
});

QUnit.test("MatchesOperationRuleConcreteAUnionA", function (assert) {
    var item = new ConcreteItem();
    assert.ok(item.matchesOperationRule(concreteRules, EnumOperation.UNI, EnumConcreteLanguage.ANBN, EnumConcreteLanguage.ANBN, EnumConcreteLanguage.ANBN), "Operation rule can be matched.");
});

QUnit.test("MatchesOperationRuleConcreteDifferentNull", function (assert) {
    var item = new ConcreteItem();
    assert.notOk(item.matchesOperationRule(languageRules, EnumOperation.UNI, EnumConcreteLanguage.ANBN, EnumConcreteLanguage.ANBN, EnumConcreteLanguage.HALT), "Operation rule cannot be matched.");
});

QUnit.test("MatchesOperationRuleConcreteAExludeA", function (assert) {
    var item = new ConcreteItem();
    assert.ok(item.matchesOperationRule(concreteRules, EnumOperation.EXC, EnumConcreteLanguage.ANBN, EnumConcreteLanguage.ANBN, EnumConcreteLanguage.EMPTY), "Operation rule can be matched.");
});

QUnit.test("MatchesOperationRuleConcreteUnionWithEmpty", function (assert) {
    var item = new ConcreteItem();
    assert.ok(item.matchesOperationRule(concreteRules, EnumOperation.UNI, EnumConcreteLanguage.ANBN, EnumConcreteLanguage.EMPTY, EnumConcreteLanguage.ANBN), "Operation rule can be matched.");
});

QUnit.test("MatchesOperationRuleConcreteExludeEmpty", function (assert) {
    var item = new ConcreteItem();
    assert.ok(item.matchesOperationRule(concreteRules, EnumOperation.EXC, EnumConcreteLanguage.ANBN, EnumConcreteLanguage.EMPTY, EnumConcreteLanguage.ANBN), "Operation rule can be matched.");
});

QUnit.test("MatchesOperationRuleConcreteExludeFromEmpty", function (assert) {
    var item = new ConcreteItem();
    assert.ok(item.matchesOperationRule(concreteRules, EnumOperation.EXC, EnumConcreteLanguage.EMPTY, EnumConcreteLanguage.ALL, EnumConcreteLanguage.EMPTY), "Operation rule can be matched.");
});

QUnit.test("MatchesOperationRuleConcreteReverseEmpty", function (assert) {
    var item = new ConcreteItem();
    assert.ok(item.matchesOperationRule(concreteRules, EnumOperation.REV, EnumConcreteLanguage.EMPTY, null, EnumConcreteLanguage.EMPTY), "Operation rule can be matched.");
});

QUnit.test("MatchesOperationRuleConcatenateEpsilon", function (assert) {
    var item = new ConcreteItem();
    assert.ok(item.matchesOperationRule(concreteRules, EnumOperation.CON, EnumConcreteLanguage.ANBN, EnumConcreteLanguage.EPSILON, EnumConcreteLanguage.ANBN), "Operation rule can be matched.");
});

QUnit.test("MatchesOperationRuleConcreteUnionWithAll", function (assert) {
    var item = new ConcreteItem();
    assert.ok(item.matchesOperationRule(concreteRules, EnumOperation.UNI, EnumConcreteLanguage.ALL, EnumConcreteLanguage.EPSILON, EnumConcreteLanguage.ALL), "Operation rule can be matched.");
});

QUnit.test("MatchesOperationRuleConcreteCoANBN", function (assert) {
    var item = new ConcreteItem();
    assert.ok(item.matchesOperationRule(concreteRules, EnumOperation.CO, EnumConcreteLanguage.ANBN, null, EnumConcreteLanguage.COAB), "Operation rule can be matched.");
});

QUnit.test("MatchesOperationRuleConcreteExpandedAlphabet", function (assert) {
    var item = new ConcreteItem();
    assert.ok(item.matchesOperationRule(concreteRules, EnumOperation.ITER, EnumConcreteLanguage.ALPHABET, null, EnumConcreteLanguage.ALL), "Operation rule can be matched.");
});

QUnit.test("MatchesOperationRuleConcreteExpandedEpsilon", function (assert) {
    var item = new ConcreteItem();
    assert.ok(item.matchesOperationRule(concreteRules, EnumOperation.EXC, EnumConcreteLanguage.EPSILON, EnumConcreteLanguage.ANBN, EnumConcreteLanguage.EMPTY), "Operation rule can be matched.");
});

QUnit.module("LanguageItemTests");

QUnit.test("Negate", function (assert) {
    var item = new LanguageItem();
    var oldNegation = item.isNegated;
    item.negate();
    assert.ok(item.isNegated !== oldNegation, "Statement can be negated.");
});

QUnit.test("SetProperties", function (assert) {
    var item = new LanguageItem();
    var newName = new LanguageName(EnumOperation.ATOMIC, "NEW", null);
    item.setProperties(newName, true, EnumClass.CFL);
    assert.ok(item.languageName.sameAs(newName) && item.isNegated && item.getLanguageClassIndex() === EnumClass.CFL, "Properties can be set. ");
});

QUnit.test("CopyInfo", function (assert) {
    var template = new LanguageItem();
    template.setProperties(new LanguageName(EnumOperation.ATOMIC, "NEW", null), true, EnumClass.CFL);
    var second = new LanguageItem();
    second.copyInfo(template);
    assert.ok(second.sameAs(template, true), "Properties were copied.");
});

QUnit.test("SimpleSameAs", function (assert) {
    var first = new LanguageItem();
    var second = new LanguageItem();
    assert.ok(first.sameAs(second, true), "Statements are same.");
});

QUnit.test("ComplexSameAs", function (assert) {
    var first = new LanguageItem();
    first.setProperties(new LanguageName(EnumOperation.CO, new LanguageName(EnumOperation.ATOMIC, "NEW", null), null),
        true,
        EnumClass.CFL);
    var second = new LanguageItem();
    second.setProperties(new LanguageName(EnumOperation.CO, new LanguageName(EnumOperation.ATOMIC, "NEW", null), null),
        true,
        EnumClass.CFL);
    assert.ok(first.sameAs(second, true), "Statements are same.");
});


QUnit.test("SimpleSameAsDifferentTypes", function (assert) {
    var first = new LanguageItem();
    var second = new ConcreteItem();
    assert.notOk(first.sameAs(second, true), "Statements are not same because of different types.");
});

QUnit.test("SimpleSameAsButNegation", function (assert) {
    var first = new LanguageItem();
    var second = new LanguageItem();
    second.negate();
    assert.ok(first.sameAs(second, false), "Statements could be in contradiction.");
});

QUnit.test("MatchesSetEqualitySameTrue", function (assert) {
    var conclusion = new LanguageItem();
    var name = new LanguageName(EnumOperation.ATOMIC, "A", null);
    conclusion.setProperties(name, null, EnumClass.REG);
    var premise = new LanguageItem();
    premise.setProperties(new LanguageName(EnumOperation.CO, new LanguageName(EnumOperation.CO, name, null), null), null, EnumClass.REG);
    var items = { languageItems: [premise], closureItems: [], concreteItems: [], mask: "1;0;0" };
    assert.ok(conclusion.matchesSetEquality(items), "Language statement can be deduced from this set equality step.");
});

QUnit.test("MatchesSetEqualityManyFalse", function (assert) {
    var conclusion = new LanguageItem();
    var name = new LanguageName(EnumOperation.ATOMIC, "A", null);
    conclusion.setProperties(name, null, EnumClass.REG);
    var premise = new LanguageItem();
    premise.setProperties(new LanguageName(EnumOperation.CO, new LanguageName(EnumOperation.CO, name, null), null), null, EnumClass.REG);
    var items = { languageItems: [premise, premise], closureItems: [], concreteItems: [], mask: "2;0;0" };
    assert.notOk(conclusion.matchesSetEquality(items), "Language statement cannot be deduced from set equality step with two premises.");
});

QUnit.test("MatchesSetEqualityFromAnotherFalse", function (assert) {
    var conclusion = new LanguageItem();
    var name = new LanguageName(EnumOperation.ATOMIC, "A", null);
    conclusion.setProperties(name, null, EnumClass.REG);
    var premise = new ConcreteItem();
    premise.setProperties(new LanguageName(EnumOperation.CO, new LanguageName(EnumOperation.CO, name, null), null), null);
    var items = { languageItems: [], closureItems: [], concreteItems: [premise], mask: "0;0;1" };
    assert.notOk(conclusion.matchesSetEquality(items), "Language statement cannot be deduced from this set equality step.");
});

QUnit.test("MatchesSubsetTrue", function (assert) {
    var conclusion = new LanguageItem();
    var name = new LanguageName(EnumOperation.ATOMIC, "A", null);
    conclusion.setProperties(name, false, EnumClass.REG);
    var premise = new LanguageItem();
    premise.setProperties(name, false, EnumClass.FIN);
    var items = { languageItems: [premise], closureItems: [], concreteItems: [], mask: "1;0;0" };
    assert.ok(conclusion.matchesSubset(items), "Language statement can be deduced from this subset step.");
});

QUnit.test("MatchesSubsetNegatedTrue", function (assert) {
    var conclusion = new LanguageItem();
    var name = new LanguageName(EnumOperation.ATOMIC, "A", null);
    conclusion.setProperties(name, true, EnumClass.REG);
    var premise = new LanguageItem();
    premise.setProperties(name, true, EnumClass.CFL);
    var items = { languageItems: [premise], closureItems: [], concreteItems: [], mask: "1;0;0" };
    assert.ok(conclusion.matchesSubset(items), "Language statement can be deduced from this subset step.");
});

QUnit.test("MatchesSubsetDifferentName", function (assert) {
    var conclusion = new LanguageItem();
    var name1 = new LanguageName(EnumOperation.ATOMIC, "A", null);
    var name2 = new LanguageName(EnumOperation.ATOMIC, "B", null);
    conclusion.setProperties(name1, false, EnumClass.REG);
    var premise = new LanguageItem();
    premise.setProperties(name2, false, EnumClass.FIN);
    var items = { languageItems: [premise], closureItems: [], concreteItems: [], mask: "1;0;0" };
    assert.notOk(conclusion.matchesSubset(items), "Language statement cannot be deduced from this subset step.");
});

QUnit.test("MatchesSubsetDifferentNegation", function (assert) {
    var conclusion = new LanguageItem();
    var name = new LanguageName(EnumOperation.ATOMIC, "A", null);
    conclusion.setProperties(name, false, EnumClass.CFL);
    var premise = new LanguageItem();
    premise.setProperties(name, true, EnumClass.CFL);
    var items = { languageItems: [premise], closureItems: [], concreteItems: [], mask: "1;0;0" };
    assert.notOk(conclusion.matchesSubset(items), "Language statement cannot be deduced from this subset step.");
});

QUnit.module("ConcreteItemTests");

QUnit.test("SetProperties", function (assert) {
    var item = new ConcreteItem();
    var newName = new LanguageName(EnumOperation.ATOMIC, "NEW", null);
    item.setProperties(newName, EnumConcreteLanguage.ANBN);
    assert.ok(item.languageName.sameAs(newName) && item.getConcreteLanguageIndex() === EnumConcreteLanguage.ANBN, "Properties can be set. ");
});

QUnit.test("CopyInfo", function (assert) {
    var template = new ConcreteItem();
    template.setProperties(new LanguageName(EnumOperation.ATOMIC, "NEW", null), EnumConcreteLanguage.ANBN);
    var second = new ConcreteItem();
    second.copyInfo(template);
    assert.ok(template.languageName.sameAs(second.languageName) && template.getConcreteLanguageIndex() === second.getConcreteLanguageIndex(), "Properties were copied.");
});

QUnit.test("AllowNotConcrete", function (assert) {
    var first = new ConcreteItem();
    var second = new LanguageItem();
    assert.ok(first.allowSubstitutions(second), "Statement of another type than ConcreteItem is irrelevant, so substitution is allowed.");
});

QUnit.test("AllowSameStatement", function (assert) {
    var first = new ConcreteItem();
    var name = new LanguageName(EnumOperation.UNI, new LanguageName(EnumOperation.ATOMIC, "A", null), new LanguageName(EnumOperation.ATOMIC, "B", null));
    first.setProperties(name, null);
    var second = new ConcreteItem();
    second.setProperties(name, null);
    assert.ok(first.allowSubstitutions(second), "Same concrete statements can be used more times.");
});

QUnit.test("AllowDifferentNameDifferentStatement", function (assert) {
    var first = new ConcreteItem();
    var name1 = new LanguageName(EnumOperation.ATOMIC, "A", null);
    var name2 = new LanguageName(EnumOperation.ATOMIC, "B", null);
    first.setProperties(name1, EnumConcreteLanguage.ANBN);
    var second = new ConcreteItem();
    second.setProperties(name2, EnumConcreteLanguage.ALL);
    assert.ok(first.allowSubstitutions(second), "Different concrete statements with different names can be used more times.");
});

QUnit.test("AllowSameNameDifferentStatement", function (assert) {
    var first = new ConcreteItem();
    var name = new LanguageName(EnumOperation.UNI, new LanguageName(EnumOperation.ATOMIC, "A", null), new LanguageName(EnumOperation.ATOMIC, "B", null));
    first.setProperties(name, EnumConcreteLanguage.ANBN);
    var second = new ConcreteItem();
    second.setProperties(name, EnumConcreteLanguage.ALL);
    assert.notOk(first.allowSubstitutions(second), "Different concrete statements with same name cannot be used.");
});

QUnit.test("AllowPartiallySameName", function (assert) {
    var first = new ConcreteItem();
    var innerName = new LanguageName(EnumOperation.ATOMIC, "B", null);
    var name = new LanguageName(EnumOperation.UNI, new LanguageName(EnumOperation.ATOMIC, "A", null), innerName);
    first.setProperties(name, EnumConcreteLanguage.ANBN);
    var second = new ConcreteItem();
    second.setProperties(innerName, EnumConcreteLanguage.ANBN);
    assert.notOk(first.allowSubstitutions(second), "Same concrete statements with same part of name cannot be used.");
});

QUnit.test("AllowPartiallySameNameDifferentStatement", function (assert) {
    var first = new ConcreteItem();
    var innerName = new LanguageName(EnumOperation.ATOMIC, "B", null);
    var name = new LanguageName(EnumOperation.UNI, new LanguageName(EnumOperation.ATOMIC, "A", null), innerName);
    first.setProperties(name, EnumConcreteLanguage.ANBN);
    var second = new ConcreteItem();
    second.setProperties(innerName, EnumConcreteLanguage.ALL);
    assert.notOk(first.allowSubstitutions(second), "Different concrete statements with same part of name cannot be used.");
});

QUnit.test("MatchesSubset", function (assert) {
    var item = new ConcreteItem();
    assert.notOk(item.matchesSubset(null), "Concrete statement cannot be deduced from subset step.");
});

QUnit.test("MatchesSetEqualitySameTrue", function (assert) {
    var conclusion = new ConcreteItem();
    var name = new LanguageName(EnumOperation.ATOMIC, "A", null);
    conclusion.setProperties(name, EnumConcreteLanguage.ALL);
    var premise = new ConcreteItem();
    premise.setProperties(new LanguageName(EnumOperation.CO, new LanguageName(EnumOperation.CO, name, null), null), EnumConcreteLanguage.ALL);
    var items = { languageItems: [], closureItems: [], concreteItems: [premise], mask: "0;0;1" };
    assert.ok(conclusion.matchesSetEquality(items), "Concrete statement can be deduced from this set equality step.");
});

QUnit.test("MatchesSetEqualityManyFalse", function (assert) {
    var conclusion = new ConcreteItem();
    var name = new LanguageName(EnumOperation.ATOMIC, "A", null);
    conclusion.setProperties(name, EnumConcreteLanguage.ALL);
    var premise = new ConcreteItem();
    premise.setProperties(new LanguageName(EnumOperation.CO, new LanguageName(EnumOperation.CO, name, null), null), EnumConcreteLanguage.ALL);
    var items = { languageItems: [], closureItems: [], concreteItems: [premise, premise], mask: "0;0;2" };
    assert.notOk(conclusion.matchesSetEquality(items), "Concrete statement cannot be deduced from set equality step with two premises.");
});

QUnit.test("MatchesSetEqualityFromAnotherFalse", function (assert) {
    var conclusion = new ConcreteItem();
    var name = new LanguageName(EnumOperation.ATOMIC, "A", null);
    conclusion.setProperties(name, EnumConcreteLanguage.ALL);
    var premise = new LanguageItem();
    premise.setProperties(new LanguageName(EnumOperation.CO, new LanguageName(EnumOperation.CO, name, null), null), null, null);
    var items = { languageItems: [premise], closureItems: [], concreteItems: [], mask: "1;0;0" };
    assert.notOk(conclusion.matchesSetEquality(items), "Concrete statement cannot be deduced from this set equality step.");
});

QUnit.test("MatchesOperationUnaryDifferentName", function (assert) {
    var conclusion = new ConcreteItem();
    var name1 = new LanguageName(EnumOperation.ATOMIC, "A", null);
    var name2 = new LanguageName(EnumOperation.ATOMIC, "B", null);
    conclusion.setProperties(new LanguageName(EnumOperation.CO, name1, null), EnumConcreteLanguage.ALL);
    var premise = new ConcreteItem();
    premise.setProperties(name2, EnumConcreteLanguage.EMPTY);
    var items = { languageItems: [], closureItems: [], concreteItems: [premise], mask: "0;0;1" };
    assert.notOk(conclusion.matchesOperation(items), "Matching fails on different part of name.");
});

QUnit.test("MatchesOperationUnaryTrue", function (assert) {
    var conclusion = new ConcreteItem();
    var name = new LanguageName(EnumOperation.ATOMIC, "A", null);
    conclusion.setProperties(new LanguageName(EnumOperation.CO, name, null), EnumConcreteLanguage.ALL);
    var premise = new ConcreteItem();
    premise.setProperties(name, EnumConcreteLanguage.EMPTY);
    var items = { languageItems: [], closureItems: [], concreteItems: [premise], mask: "0;0;1" };
    assert.ok(conclusion.matchesOperation(items), "Conclusion can be deduced from operation step.");
});

QUnit.test("MatchesOperationUnaryManyFalse", function (assert) {
    var conclusion = new ConcreteItem();
    var name = new LanguageName(EnumOperation.ATOMIC, "A", null);
    conclusion.setProperties(new LanguageName(EnumOperation.CO, name, null), EnumConcreteLanguage.ALL);
    var premise = new ConcreteItem();
    premise.setProperties(name, EnumConcreteLanguage.EMPTY);
    var items = { languageItems: [], closureItems: [], concreteItems: [premise, premise], mask: "0;0;2" };
    assert.notOk(conclusion.matchesOperation(items), "Too many premises in unary operation step.");
});

QUnit.test("MatchesOperationAnotherFalse", function (assert) {
    var conclusion = new ConcreteItem();
    var name = new LanguageName(EnumOperation.ATOMIC, "A", null);
    conclusion.setProperties(new LanguageName(EnumOperation.CO, name, null), EnumConcreteLanguage.ALL);
    var premise = new LanguageItem();
    premise.setProperties(name, EnumConcreteLanguage.EMPTY);
    var items = { languageItems: [premise], closureItems: [], concreteItems: [], mask: "1;0;0" };
    assert.notOk(conclusion.matchesOperation(items), "Conclusion cannot be deduced from operation step.");
});

QUnit.module("ClosureItemTests");

QUnit.test("SetProperties", function (assert) {
    var item = new ClosureItem();
    item.setProperties(EnumClass.CFL, EnumOperation.EXC);
    assert.ok(item.getLanguageClassIndex() === EnumClass.CFL && item.getOperationIndex() === EnumOperation.EXC, "Properties can be set. ");
});

QUnit.test("CopyInfo", function (assert) {
    var template = new ClosureItem();
    template.setProperties(EnumClass.CFL, EnumOperation.EXC);
    var second = new ClosureItem();
    second.copyInfo(template);
    assert.ok(template.getLanguageClassIndex() === second.getLanguageClassIndex() && template.getOperationIndex() === second.getOperationIndex(), "Properties were copied.");
});

QUnit.test("IsValidFinUniTrue", function (assert) {
    var item = new ClosureItem();
    item.setProperties(EnumClass.FIN, EnumOperation.UNI);
    assert.ok(item.isValid(), "Closure property is OK.");
});

QUnit.test("IsValidRegIntTrue", function (assert) {
    var item = new ClosureItem();
    item.setProperties(EnumClass.REG, EnumOperation.INT);
    assert.ok(item.isValid(), "Closure property is OK.");
});

QUnit.test("IsValidDcflExcFalse", function (assert) {
    var item = new ClosureItem();
    item.setProperties(EnumClass.DCFL, EnumOperation.EXC);
    assert.notOk(item.isValid(), "Closure property is OK.");
});

QUnit.test("IsValidCflConTrue", function (assert) {
    var item = new ClosureItem();
    item.setProperties(EnumClass.CFL, EnumOperation.CON);
    assert.ok(item.isValid(), "Closure property is OK.");
});

QUnit.test("IsValidCslCoTrue", function (assert) {
    var item = new ClosureItem();
    item.setProperties(EnumClass.CSL, EnumOperation.CO);
    assert.ok(item.isValid(), "Closure property is OK.");
});

QUnit.test("IsValidRecIterTrue", function (assert) {
    var item = new ClosureItem();
    item.setProperties(EnumClass.REC, EnumOperation.ITER);
    assert.ok(item.isValid(), "Closure property is OK.");
});

QUnit.test("IsValidRePiterTrue", function (assert) {
    var item = new ClosureItem();
    item.setProperties(EnumClass.RE, EnumOperation.PITER);
    assert.ok(item.isValid(), "Closure property is OK.");
});

QUnit.test("IsValidAllRevTrue", function (assert) {
    var item = new ClosureItem();
    item.setProperties(EnumClass.ALL, EnumOperation.REV);
    assert.ok(item.isValid(), "Closure property is OK.");
});

QUnit.test("MatchesSubset", function (assert) {
    var item = new ClosureItem();
    assert.notOk(item.matchesSubset(null), "Closure statement cannot be deduced from subset step.");
});

QUnit.test("MatchesOperation", function (assert) {
    var item = new ClosureItem();
    assert.notOk(item.matchesOperation(null), "Closure statement cannot be deduced from operation step.");
});

QUnit.test("MatchesSetEquality", function (assert) {
    var item = new ClosureItem();
    assert.notOk(item.matchesSetEquality(null), "Closure statement cannot be deduced from set equality step.");
});
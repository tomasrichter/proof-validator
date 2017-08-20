/// <reference path="../../../BP/Scripts/Languages/LanguageName.js" />
/// <reference path="../../../BP/Scripts/Languages/Operation.js" />
/// <reference path="../../../BP/Scripts/Proving/Rules.js" />

QUnit.module("OperationTests");

QUnit.test("AreExpansionPropertiesOK", function (assert) {
    var result = isExpansion(EnumOperation.EXP) &&
        !isAtomic(EnumOperation.EXP) &&
        !isUnary(EnumOperation.EXP) &&
        !isBinary(EnumOperation.EXP) &&
        !isCommutative(EnumOperation.EXP) &&
        !isAssociative(EnumOperation.EXP);
    assert.ok(result, "Properties of expansion operation are OK.");
});

QUnit.test("AreAtomicPropertiesOK", function (assert) {
    var result = !isExpansion(EnumOperation.ATOMIC) &&
        isAtomic(EnumOperation.ATOMIC) &&
        !isUnary(EnumOperation.ATOMIC) &&
        !isBinary(EnumOperation.ATOMIC) &&
        !isCommutative(EnumOperation.ATOMIC) &&
        !isAssociative(EnumOperation.ATOMIC);
    assert.ok(result, "Properties of atomic operation are OK.");
});

QUnit.test("AreUnionPropertiesOK", function (assert) {
    var result = !isExpansion(EnumOperation.UNI) &&
        !isAtomic(EnumOperation.UNI) &&
        !isUnary(EnumOperation.UNI) &&
        isBinary(EnumOperation.UNI) &&
        isCommutative(EnumOperation.UNI) &&
        isAssociative(EnumOperation.UNI);
    assert.ok(result, "Properties of union operation are OK.");
});

QUnit.test("AreIntersectionPropertiesOK", function (assert) {
    var result = !isExpansion(EnumOperation.INT) &&
        !isAtomic(EnumOperation.INT) &&
        !isUnary(EnumOperation.INT) &&
        isBinary(EnumOperation.INT) &&
        isCommutative(EnumOperation.INT) &&
        isAssociative(EnumOperation.INT);
    assert.ok(result, "Properties of intersection operation are OK.");
});

QUnit.test("AreExclusionPropertiesOK", function (assert) {
    var result = !isExpansion(EnumOperation.EXC) &&
        !isAtomic(EnumOperation.EXC) &&
        !isUnary(EnumOperation.EXC) &&
        isBinary(EnumOperation.EXC) &&
        !isCommutative(EnumOperation.EXC) &&
        !isAssociative(EnumOperation.EXC);
    assert.ok(result, "Properties of exclusion operation are OK.");
});

QUnit.test("AreConcatenationPropertiesOK", function (assert) {
    var result = !isExpansion(EnumOperation.CON) &&
        !isAtomic(EnumOperation.CON) &&
        !isUnary(EnumOperation.CON) &&
        isBinary(EnumOperation.CON) &&
        !isCommutative(EnumOperation.CON) &&
        isAssociative(EnumOperation.CON);
    assert.ok(result, "Properties of caoncatenation operation are OK.");
});

QUnit.test("AreComplementPropertiesOK", function (assert) {
    var result = !isExpansion(EnumOperation.CO) &&
        !isAtomic(EnumOperation.CO) &&
        isUnary(EnumOperation.CO) &&
        !isBinary(EnumOperation.CO) &&
        !isCommutative(EnumOperation.CO) &&
        !isAssociative(EnumOperation.CO);
    assert.ok(result, "Properties of complement operation are OK.");
});

QUnit.test("AreIterationPropertiesOK", function (assert) {
    var result = !isExpansion(EnumOperation.ITER) &&
        !isAtomic(EnumOperation.ITER) &&
        isUnary(EnumOperation.ITER) &&
        !isBinary(EnumOperation.ITER) &&
        !isCommutative(EnumOperation.ITER) &&
        !isAssociative(EnumOperation.ITER);
    assert.ok(result, "Properties of iteration operation are OK.");
});

QUnit.test("ArePositiveInterationPropertiesOK", function (assert) {
    var result = !isExpansion(EnumOperation.PITER) &&
        !isAtomic(EnumOperation.PITER) &&
        isUnary(EnumOperation.PITER) &&
        !isBinary(EnumOperation.PITER) &&
        !isCommutative(EnumOperation.PITER) &&
        !isAssociative(EnumOperation.PITER);
    assert.ok(result, "Properties of positive iteration operation are OK.");
});


QUnit.test("AreReversePropertiesOK", function (assert) {
    var result = !isExpansion(EnumOperation.REV) &&
        !isAtomic(EnumOperation.REV) &&
        isUnary(EnumOperation.REV) &&
        !isBinary(EnumOperation.REV) &&
        !isCommutative(EnumOperation.REV) &&
        !isAssociative(EnumOperation.REV);
    assert.ok(result, "Properties of reverse operation are OK.");
});

QUnit.module("LanguageNameTests");

QUnit.test("AtomicPrints", function (assert) {
    var result = new LanguageName(EnumOperation.ATOMIC, "L", null).printFriendlyName();
    var expected = "L";
    assert.equal(result, expected, "Atomic languages are printed correctly.");
});

QUnit.test("UnionPrints", function (assert) {
    var lang1 = new LanguageName(EnumOperation.ATOMIC, "L", null);
    var lang2 = new LanguageName(EnumOperation.ATOMIC, "R", null);
    var result = new LanguageName(EnumOperation.UNI, lang1, lang2).printFriendlyName();
    var expected = "L&#8746;R";
    assert.equal(result, expected, "Union is printed correctly.");
});

QUnit.test("IntersectionPrints", function (assert) {
    var lang1 = new LanguageName(EnumOperation.ATOMIC, "L", null);
    var lang2 = new LanguageName(EnumOperation.ATOMIC, "R", null);
    var result = new LanguageName(EnumOperation.INT, lang1, lang2).printFriendlyName();
    var expected = "L&#8745;R";
    assert.equal(result, expected, "Intersection is printed correctly.");
});

QUnit.test("ExclusionPrints", function (assert) {
    var lang1 = new LanguageName(EnumOperation.ATOMIC, "L", null);
    var lang2 = new LanguageName(EnumOperation.ATOMIC, "R", null);
    var result = new LanguageName(EnumOperation.EXC, lang1, lang2).printFriendlyName();
    var expected = "L\\R";
    assert.equal(result, expected, "Exclusion is printed correctly.");
});

QUnit.test("ConcatenationPrints", function (assert) {
    var lang1 = new LanguageName(EnumOperation.ATOMIC, "L", null);
    var lang2 = new LanguageName(EnumOperation.ATOMIC, "R", null);
    var result = new LanguageName(EnumOperation.CON, lang1, lang2).printFriendlyName();
    var expected = "L.R";
    assert.equal(result, expected, "Concatenation is printed correctly.");
});

QUnit.test("ComplementPrints", function (assert) {
    var lang = new LanguageName(EnumOperation.ATOMIC, "L", null);
    var result = new LanguageName(EnumOperation.CO, lang, null).printFriendlyName();
    var expected = "co-L";
    assert.equal(result, expected, "Complement is printed correctly.");
});

QUnit.test("IterationPrints", function (assert) {
    var lang = new LanguageName(EnumOperation.ATOMIC, "L", null);
    var result = new LanguageName(EnumOperation.ITER, lang, null).printFriendlyName();
    var expected = "L<sup>*</sup>";
    assert.equal(result, expected, "Iteration is printed correctly.");
});

QUnit.test("PositiveIterationPrints", function (assert) {
    var lang = new LanguageName(EnumOperation.ATOMIC, "L", null);
    var result = new LanguageName(EnumOperation.PITER, lang, null).printFriendlyName();
    var expected = "L<sup>+</sup>";
    assert.equal(result, expected, "Positive iteration is printed correctly.");
});

QUnit.test("ReversePrints", function (assert) {
    var lang = new LanguageName(EnumOperation.ATOMIC, "L", null);
    var result = new LanguageName(EnumOperation.REV, lang, null).printFriendlyName();
    var expected = "L<sup>R</sup>";
    assert.equal(result, expected, "Reverse is printed correctly.");
});

QUnit.test("MoreLevelsPrints", function (assert) {
    var lang1 = new LanguageName(EnumOperation.EXC, new LanguageName(EnumOperation.ATOMIC, "L1", null), new LanguageName(EnumOperation.ATOMIC, "L2", null));
    var lang2 = new LanguageName(EnumOperation.ATOMIC, "R", null);
    var result = new LanguageName(EnumOperation.CON, lang1, lang2).printFriendlyName();
    var expected = "(L1\\L2).R";
    assert.equal(result, expected, "Language name with more operations is printed correctly.");
});

QUnit.test("AtomicSameTrue", function (assert) {
    var lang1 = new LanguageName(EnumOperation.ATOMIC, "L", null);
    var lang2 = new LanguageName(EnumOperation.ATOMIC, "L", null);
    assert.ok(lang1.sameAs(lang2), "Same atomic languages are same.");
});

QUnit.test("AtomicSameFalse", function (assert) {
    var lang1 = new LanguageName(EnumOperation.ATOMIC, "L", null);
    var lang2 = new LanguageName(EnumOperation.ATOMIC, "R", null);
    assert.notOk(lang1.sameAs(lang2), "Different atomic languages are different.");
});

QUnit.test("UnarySameTrue", function (assert) {
    var lang1 = new LanguageName(EnumOperation.CO, new LanguageName(EnumOperation.ATOMIC, "L", null), null);
    var lang2 = new LanguageName(EnumOperation.CO, new LanguageName(EnumOperation.ATOMIC, "L", null), null);
    assert.ok(lang1.sameAs(lang2), "Same languages with unary operation are same.");
});

QUnit.test("UnarySameFalseName", function (assert) {
    var lang1 = new LanguageName(EnumOperation.CO, new LanguageName(EnumOperation.ATOMIC, "L", null), null);
    var lang2 = new LanguageName(EnumOperation.CO, new LanguageName(EnumOperation.ATOMIC, "R", null), null);
    assert.notOk(lang1.sameAs(lang2), "Differt languages with same unary operation are different.");
});

QUnit.test("UnarySameFalseOperation", function (assert) {
    var lang1 = new LanguageName(EnumOperation.CO, new LanguageName(EnumOperation.ATOMIC, "L", null), null);
    var lang2 = new LanguageName(EnumOperation.ITER, new LanguageName(EnumOperation.ATOMIC, "L", null), null);
    assert.notOk(lang1.sameAs(lang2), "Same languages with different unary operation are different.");
});

QUnit.test("BinarySameTrue", function (assert) {
    var lang1 = new LanguageName(EnumOperation.UNI, new LanguageName(EnumOperation.ATOMIC, "L", null), new LanguageName(EnumOperation.ATOMIC, "R", null));
    var lang2 = new LanguageName(EnumOperation.UNI, new LanguageName(EnumOperation.ATOMIC, "L", null), new LanguageName(EnumOperation.ATOMIC, "R", null));
    assert.ok(lang1.sameAs(lang2), "Same languages with same binary operation are same.");
});

QUnit.test("BinarySameCommutativeTrue", function (assert) {
    var lang1 = new LanguageName(EnumOperation.UNI, new LanguageName(EnumOperation.ATOMIC, "L", null), new LanguageName(EnumOperation.ATOMIC, "R", null));
    var lang2 = new LanguageName(EnumOperation.UNI, new LanguageName(EnumOperation.ATOMIC, "R", null), new LanguageName(EnumOperation.ATOMIC, "L", null));
    assert.ok(lang1.sameAs(lang2), "Different order of union does not matters. Languages are same.");
});

QUnit.test("BinarySameNotCommutativeFalse", function (assert) {
    var lang1 = new LanguageName(EnumOperation.CON, new LanguageName(EnumOperation.ATOMIC, "L", null), new LanguageName(EnumOperation.ATOMIC, "R", null));
    var lang2 = new LanguageName(EnumOperation.CON, new LanguageName(EnumOperation.ATOMIC, "R", null), new LanguageName(EnumOperation.ATOMIC, "L", null));
    assert.notOk(lang1.sameAs(lang2), "Different order in concatenation matters. Languages are different.");
});

QUnit.test("BinarySameAssociativeTrue", function (assert) {
    var lang1 = new LanguageName(
        EnumOperation.CON, 
        new LanguageName(EnumOperation.CON,
            new LanguageName(EnumOperation.ATOMIC, "A", null),
            new LanguageName(EnumOperation.ATOMIC, "B", null)), 
        new LanguageName(EnumOperation.ATOMIC, "C", null));
    var lang2 = new LanguageName(
        EnumOperation.CON,
        new LanguageName(EnumOperation.ATOMIC, "A", null),
        new LanguageName(EnumOperation.CON,
            new LanguageName(EnumOperation.ATOMIC, "B", null),
            new LanguageName(EnumOperation.ATOMIC, "C", null)));
    assert.ok(lang1.sameAs(lang2), "Concatenation is associative, so language names are same.");
});

QUnit.test("BinarySameNotAssociativeFalse", function (assert) {
    var lang1 = new LanguageName(
        EnumOperation.EXC,
        new LanguageName(EnumOperation.EXC,
            new LanguageName(EnumOperation.ATOMIC, "A", null),
            new LanguageName(EnumOperation.ATOMIC, "B", null)),
        new LanguageName(EnumOperation.ATOMIC, "C", null));
    var lang2 = new LanguageName(
        EnumOperation.EXC,
        new LanguageName(EnumOperation.ATOMIC, "A", null),
        new LanguageName(EnumOperation.EXC,
            new LanguageName(EnumOperation.ATOMIC, "B", null),
            new LanguageName(EnumOperation.ATOMIC, "C", null)));
    assert.notOk(lang1.sameAs(lang2), "Exclusion is not associative, so language names are not same.");
});
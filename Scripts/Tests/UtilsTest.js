/// <reference path="../../../BP/Scripts/Utils/Utils.js" />
/// <reference path="../../../BP/Scripts/Languages/LanguageName.js" />

QUnit.module("UtilsTests");

QUnit.test("ContainsNumberTrue", function (assert) {
    var array = [0, 2, 5, 9, 8];
    assert.ok(contains(array, 2), "Array contains specified number.");
});

QUnit.test("ContainsNumberFalse", function (assert) {
    var array = [0, 2, 5, 9, 8];
    assert.notOk(contains(array, 3), "Array does not contain specified number.");
});

QUnit.test("AreSameTrue", function (assert) {
    var array = [2, 2, 2, 2, 2];
    assert.ok(areSame(array), "All values in array are same.");
});

QUnit.test("AreSameFalse", function (assert) {
    var array = [0, 2, 5, 9, 8];
    assert.notOk(areSame(array), "Not all values in array are same.");
});
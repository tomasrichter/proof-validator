/// <reference path="../../../BP/Scripts/Languages/LanguageName.js" />
/// <reference path="../../../BP/Scripts/Languages/Operation.js" />
/// <reference path="../../../BP/Scripts/Proving/Rules.js" />
/// <reference path="../../../BP/Scripts/Editor/EditorItem.js" />
/// <reference path="../../../BP/Scripts/Editor/EditLanguageItem.js" />
/// <reference path="../../../BP/Scripts/Editor/EditOperationItem.js" />

QUnit.module("EditorTests");

QUnit.test("CountNameAtomic", function (assert) {
    var lang = new LanguageName(EnumOperation.ATOMIC, "L", null);
    var result = new EditorItem(lang).rootEditLanguageItem.countName();
    assert.ok(lang.sameAs(result), "Editor counts name of atomic language correctly.");
});

QUnit.test("CountNameUnary", function (assert) {
    var lang = new LanguageName(EnumOperation.CO, new LanguageName(EnumOperation.ATOMIC, "L", null), null);
    var result = new EditorItem(lang).rootEditLanguageItem.countName();
    assert.ok(lang.sameAs(result), "Editor counts name of language with unary operation correctly.");
});

QUnit.test("CountNameBinary", function (assert) {
    var lang = new LanguageName(EnumOperation.UNI, new LanguageName(EnumOperation.ATOMIC, "L", null), new LanguageName(EnumOperation.ATOMIC, "R", null));
    var result = new EditorItem(lang).rootEditLanguageItem.countName();
    assert.ok(lang.sameAs(result), "Editor counts name of language with binary operation correctly.");
});

QUnit.test("CountNameAddUnaryOperation", function (assert) {
    var lang = new LanguageName(EnumOperation.ATOMIC, "L", null);
    var editorLanguageItem = new EditorItem(lang).rootEditLanguageItem;
    editorLanguageItem.addOperation(EnumOperation.CO, lang, null);
    var result = editorLanguageItem.countName();
    var expected = new LanguageName(EnumOperation.CO, lang, null);
    assert.ok(expected.sameAs(result),"Editor counts name correctly after adding unary operation.");
});

QUnit.test("CountNameAddBinaryOperation", function (assert) {
    var lang1 = new LanguageName(EnumOperation.ATOMIC, "L", null);
    var lang2 = new LanguageName(EnumOperation.ATOMIC, "R", null);
    var editorLanguageItem = new EditorItem(lang1).rootEditLanguageItem;
    editorLanguageItem.addOperation(EnumOperation.UNI, lang1, lang2);
    var result = editorLanguageItem.countName();
    var expected = new LanguageName(EnumOperation.UNI, lang1, lang2);
    assert.ok(expected.sameAs(result), "Editor counts name correctly after adding binary operation.");
});

QUnit.test("CountNameDeleteUnaryOperation", function (assert) {
    var lang = new LanguageName(EnumOperation.ATOMIC, "L", null);
    var colang = new LanguageName(EnumOperation.CO, lang, null);
    var editorLanguageItem = new EditorItem(colang).rootEditLanguageItem;
    editorLanguageItem.deleteOperation(true);
    var result = editorLanguageItem.countName();
    assert.ok(lang.sameAs(result), "Editor counts name correctly after deleting unary operation.");
});

QUnit.test("CountNameDeleteBinaryOperationKeepLeft", function (assert) {
    var lang1 = new LanguageName(EnumOperation.ATOMIC, "L", null);
    var lang2 = new LanguageName(EnumOperation.ATOMIC, "R", null);
    var unilang = new LanguageName(EnumOperation.UNI, lang1, lang2);
    var editorLanguageItem = new EditorItem(unilang).rootEditLanguageItem;
    editorLanguageItem.deleteOperation(true);
    var result = editorLanguageItem.countName();
    assert.ok(lang1.sameAs(result), "Editor counts name correctly after deleting binary operation, when left side is kept.");
});

QUnit.test("CountNameDeleteBinaryOperationKeepRight", function (assert) {
    var lang1 = new LanguageName(EnumOperation.ATOMIC, "L", null);
    var lang2 = new LanguageName(EnumOperation.ATOMIC, "R", null);
    var unilang = new LanguageName(EnumOperation.UNI, lang1, lang2);
    var editorLanguageItem = new EditorItem(unilang).rootEditLanguageItem;
    editorLanguageItem.deleteOperation(false);
    var result = editorLanguageItem.countName();
    assert.ok(lang2.sameAs(result), "Editor counts name correctly after deleting binary operation, when right side is kept.");
});

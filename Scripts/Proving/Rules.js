var EnumName = {NEW : "A",OTHER: "?",NONAME: "___"};

var EnumItem = {LANGUAGE : "language", CLOSURE : "closure", CONCRETE : "concrete", CONTRA: "contra"};
				
var EnumMethod = {DIRECT : "direct", CONTRA : "contra", DISPROOF : "disproof"};
				
var EnumState = {CORRECT : "correct",WRONG : "wrong",UNKNOWN : "unknown"};
				
var EnumAlphabet = { AB: "∑ = {a, b}", ABC: "∑ = {a, b, c}" };
				
var EnumClass = { FIN: 0, REG: 1, DCFL: 2, CFL: 3, CSL: 4, REC: 5, RE: 6, ALL: 7 };

var classes = [
    { ABBREV: "FIN", ENGLISH: "finite", CZECH: "konečné" },
    { ABBREV: "REG", ENGLISH: "regular", CZECH: "regulární" },
    { ABBREV: "DCFL", ENGLISH: "det. context-free", CZECH: "det. bezkontex." },
    { ABBREV: "CFL", ENGLISH: "context-free", CZECH: "bezkontextové" },
    { ABBREV: "CSL", ENGLISH: "context-sensitive", CZECH: "kontextové" },
    { ABBREV: "RE", ENGLISH: "recursive", CZECH: "rekurzivní" },
    { ABBREV: "REC", ENGLISH: "rec. enumerable", CZECH: "rek. spočetné" },
    { ABBREV: "ALL", ENGLISH: "all languages", CZECH: "všechny jazyky" }
];
	
var EnumOperation = { EXP: -2, ATOMIC: -1, UNI: 0, INT: 1, EXC: 2, CON: 3, CO: 4, ITER: 5, PITER: 6, REV: 7 };

var operations = [
    { ENGLISH: "union", CZECH: "sjednocení" },
    { ENGLISH: "intersection", CZECH: "průnik" },
    { ENGLISH: "exclusion", CZECH: "rozdíl" },
    { ENGLISH: "concatenation", CZECH: "zřetězení" },
    { ENGLISH: "complement", CZECH: "doplněk" },
    { ENGLISH: "Kleene star", CZECH: "iterace" },
    { ENGLISH: "Kleene plus", CZECH: "poz. iterace" },
    { ENGLISH: "reverse", CZECH: "revers" }
];

var operationsFriendly = ["&#8746;","&#8745;","\\",".","co-","*","+", "R"];

var EnumExample = { TRIVIAL: 0, DIRECT: 1, CONTRA: 2, DISPROOF: 3, CLOSURE: 4, CYCLE: 5 }

var examples = [
    { ENGLISH: "trivial task", CZECH: "triviálně vyřešený příklad" },
    { ENGLISH: "example of direct proof", CZECH: "ukázka přímého důkazu" },
    { ENGLISH: "example of proof by contradiction", CZECH: "ukázka důkazu sporem" },
    { ENGLISH: "example of disproof by counterexample", CZECH: "ukázka vyvracení protipříkladem" },
    { ENGLISH: "example of closure property", CZECH: "ukázka použití uzávěrové vlastnosti" },
    { ENGLISH: "example of cycle in proof", CZECH: "ukázka cyklu v důkazu" }
];

var EnumConcreteLanguage = {EMPTY : 0, EPSILON: 1, ALPHABET: 2, ALL : 3, ANBN: 4, COAB: 5, AMBN: 6, AIBJCK: 7, ANBNCN: 8, PRESS: 9, HALT: 10, COHALT: 11};

var concreteLanguages = [
    { VIEW: "∅", CLASS: EnumClass.FIN, CONTAINS_EPSILON: false, CONTAINS_ALPHABET: false },
    { VIEW: "{ε}", CLASS: EnumClass.FIN, CONTAINS_EPSILON: true, CONTAINS_ALPHABET: false },
    { VIEW: "∑", CLASS: EnumClass.FIN, CONTAINS_EPSILON: false, CONTAINS_ALPHABET: true },
    { VIEW: "∑*", CLASS: EnumClass.REG, CONTAINS_EPSILON: true, CONTAINS_ALPHABET: true },
    { VIEW: "{aⁿbⁿ | n≥0}", CLASS: EnumClass.DCFL, CONTAINS_EPSILON: true, CONTAINS_ALPHABET: false },
    { VIEW: "co-{aⁿbⁿ | n≥0}", CLASS: EnumClass.DCFL, CONTAINS_EPSILON: false, CONTAINS_ALPHABET: true },
    { VIEW: "{aᵐbⁿ | m≠n}", CLASS: EnumClass.DCFL, CONTAINS_EPSILON: false, CONTAINS_ALPHABET: true },
    { VIEW: "{aⁱbʲcᵏ | i≠j ∨ j≠k}", CLASS: EnumClass.CFL, CONTAINS_EPSILON: false, CONTAINS_ALPHABET: true },
    { VIEW: "{aⁿbⁿcⁿ | n≥0}", CLASS: EnumClass.CSL, CONTAINS_EPSILON: true, CONTAINS_ALPHABET: false },
    { VIEW: "Pressburg. arit.", CLASS: EnumClass.REC, CONTAINS_EPSILON: null, CONTAINS_ALPHABET: null },
    { VIEW: "HALT", CLASS: EnumClass.RE, CONTAINS_EPSILON: null, CONTAINS_ALPHABET: null },
    { VIEW: "co-HALT", CLASS: EnumClass.ALL, CONTAINS_EPSILON: null, CONTAINS_ALPHABET: null }
];
						
var languageRules = [	
    //FIN
    { OPERATION: EnumOperation.UNI, FIRST: EnumClass.FIN },
    { OPERATION: EnumOperation.INT, FIRST: EnumClass.FIN, RESULT: EnumClass.FIN },
    //finite change of language
    { OPERATION: EnumOperation.EXC, FIRST: EnumClass.FIN, RESULT: EnumClass.FIN },
    { OPERATION: EnumOperation.EXC, SECOND: EnumClass.FIN },
    { OPERATION: EnumOperation.CON, FIRST: EnumClass.FIN },
    { OPERATION: EnumOperation.CON, SECOND: EnumClass.FIN },
    //INT with REG
    { OPERATION: EnumOperation.INT, SECOND: EnumClass.REG }
];
	
/**
 * Expand rules about containing epsilon and symbols from alphabet to simple rules.
 * @param operationId       type of operation
 * @param first             first operand     
 * @param second            second operand
 * @param result            result of rule 
 * @param containsEpsilon   if current rule applies to languages containing epsilon
 * @param containsAlphabet  if current rule applies to languages containing all symbols from alphabet 
 * @returns array of expanded rules 
 */
function expandRule(operationId, first, second, result, containsEpsilon, containsAlphabet) {
	var arrayOfRules = [];
	for (var i = 0; i< concreteLanguages.length; i++) {
	    if ((containsEpsilon === null || containsEpsilon === concreteLanguages[i].CONTAINS_EPSILON) &&
	        (containsAlphabet === null || containsAlphabet === concreteLanguages[i].CONTAINS_ALPHABET)) {
	        var realResult = (result !== null) ? result : ((second === null) ? first : second);
	        var rule = {
	            OPERATION: operationId,
	            FIRST: (first === null) ? i : first,
	            SECOND: (!isUnary(operationId) && second === null) ? i : second,
	            RESULT: realResult
	        }
            if (rule.SECOND === null) {
                delete rule.SECOND;
            }
	        arrayOfRules.push(rule);
		}
	}
	return arrayOfRules;
}

var expandedRules =
    //(containsAlphabet)* = ∑*
	expandRule(EnumOperation.ITER, null, null, EnumConcreteLanguage.ALL, null, true).concat(
	//(containsAlphabet && containsEpsilon)+ = ∑*
	expandRule(EnumOperation.PITER, null, null, EnumConcreteLanguage.ALL, true, true)).concat(
	//{ε} UNI (containsEpsilon) = (containsEpsilon)
	expandRule(EnumOperation.UNI, EnumConcreteLanguage.EPSILON, null, null, true, null)).concat(
	//∑ UNI (containsAlphabet) = (containsAlphabet)
	expandRule(EnumOperation.UNI, EnumConcreteLanguage.ALPHABET, null, null, null, true)).concat(
	//{ε} INT (!containsEpsilon) = {}
	expandRule(EnumOperation.INT, EnumConcreteLanguage.EPSILON, null, EnumConcreteLanguage.EMPTY, false, null)).concat(
	//{ε} INT (containsEpsilon) = {ε}
	expandRule(EnumOperation.INT, EnumConcreteLanguage.EPSILON, null, EnumConcreteLanguage.EPSILON, true, null)).concat(
	//∑ INT (containsAlphabet) = ∑
	expandRule(EnumOperation.INT, EnumConcreteLanguage.ALPHABET, null, EnumConcreteLanguage.ALPHABET, null, true)).concat(
	//{ε} \ (containsEpsilon) = {}
	expandRule(EnumOperation.EXC, EnumConcreteLanguage.EPSILON, null, EnumConcreteLanguage.EMPTY, true, null)).concat(
	//{ε} \ (!containsEpsilon) = {ε}
	expandRule(EnumOperation.EXC, EnumConcreteLanguage.EPSILON, null, EnumConcreteLanguage.EPSILON, false, null)).concat(
	//∑ \ (containsAlphabet) = {}
	expandRule(EnumOperation.EXC, EnumConcreteLanguage.ALPHABET, null, EnumConcreteLanguage.EMPTY, true, null));	

var concreteRules = [	
    //A UNI A = A
    { OPERATION: EnumOperation.UNI },
	//A INT A = A
    { OPERATION: EnumOperation.INT },
	//A \ A = {}
    { OPERATION: EnumOperation.EXC, RESULT: EnumConcreteLanguage.EMPTY },		
	//{} UNI other = other
    { OPERATION: EnumOperation.UNI, FIRST: EnumConcreteLanguage.EMPTY },
	//{} INT other = {}
	{ OPERATION: EnumOperation.INT, FIRST: EnumConcreteLanguage.EMPTY, RESULT: EnumConcreteLanguage.EMPTY },
	//{} \ other = {}
	{ OPERATION: EnumOperation.EXC, FIRST: EnumConcreteLanguage.EMPTY, RESULT: EnumConcreteLanguage.EMPTY },
	//other \ {} = other
	{ OPERATION: EnumOperation.EXC, SECOND: EnumConcreteLanguage.EMPTY },
	//{} . other = other . {} = {}
	{ OPERATION: EnumOperation.CON, FIRST: EnumConcreteLanguage.EMPTY, RESULT: EnumConcreteLanguage.EMPTY },
	{ OPERATION: EnumOperation.CON, SECOND: EnumConcreteLanguage.EMPTY, RESULT: EnumConcreteLanguage.EMPTY },
	//{}R = {}
	{ OPERATION: EnumOperation.REV, FIRST: EnumConcreteLanguage.EMPTY, RESULT: EnumConcreteLanguage.EMPTY },			
    //{ε} . other = other . {ε} = other
	{ OPERATION: EnumOperation.CON, FIRST: EnumConcreteLanguage.EPSILON },
	{ OPERATION: EnumOperation.CON, SECOND: EnumConcreteLanguage.EPSILON },
	//{ε}R = {ε}
	{ OPERATION: EnumOperation.REV, FIRST: EnumConcreteLanguage.EPSILON, RESULT: EnumConcreteLanguage.EPSILON },							
	//∑R = ∑
	{ OPERATION: EnumOperation.REV, FIRST: EnumConcreteLanguage.ALPHABET, RESULT: EnumConcreteLanguage.ALPHABET },					
	//∑* UNI other = ∑*
	{ OPERATION: EnumOperation.UNI, FIRST: EnumConcreteLanguage.ALL, RESULT: EnumConcreteLanguage.ALL },
	//∑* INT other = other
	{ OPERATION: EnumOperation.INT, FIRST: EnumConcreteLanguage.ALL },
	//∑* \ other = co-other 
	//co-{} = ∑*
	{ OPERATION: EnumOperation.CO, FIRST: EnumConcreteLanguage.EMPTY, RESULT: EnumConcreteLanguage.ALL },
	//co-∑* = {}
	{ OPERATION: EnumOperation.CO, FIRST: EnumConcreteLanguage.ALL, RESULT: EnumConcreteLanguage.EMPTY },
	//other \ ∑* = {}
	{ OPERATION: EnumOperation.EXC, SECOND: EnumConcreteLanguage.ALL, RESULT: EnumConcreteLanguage.EMPTY },
	//co-anbn
	{ OPERATION: EnumOperation.CO, FIRST: EnumConcreteLanguage.ANBN, RESULT: EnumConcreteLanguage.COAB },
	{ OPERATION: EnumOperation.EXC, FIRST: EnumConcreteLanguage.ALL, SECOND: EnumConcreteLanguage.ANBN, RESULT: EnumConcreteLanguage.COAB },
	//co-(co-anbn)
	{ OPERATION: EnumOperation.CO, FIRST: EnumConcreteLanguage.COAB, RESULT: EnumConcreteLanguage.ANBN },
	{ OPERATION: EnumOperation.EXC, FIRST: EnumConcreteLanguage.ALL, SECOND: EnumConcreteLanguage.COAB, RESULT: EnumConcreteLanguage.ANBN },
	//co-HALT
	{ OPERATION: EnumOperation.CO, FIRST: EnumConcreteLanguage.HALT, RESULT: EnumConcreteLanguage.COHALT },
	{ OPERATION: EnumOperation.EXC, FIRST: EnumConcreteLanguage.ALL, SECOND: EnumConcreteLanguage.HALT, RESULT: EnumConcreteLanguage.COHALT },
	//co-(co-HALT)
	{ OPERATION: EnumOperation.CO, FIRST: EnumConcreteLanguage.COHALT, RESULT: EnumConcreteLanguage.HALT },
	{ OPERATION: EnumOperation.EXC, FIRST: EnumConcreteLanguage.ALL, SECOND: EnumConcreteLanguage.COHALT, RESULT: EnumConcreteLanguage.HALT },
	//∑* . other = ∑* (except {}... covered by previous rule)
	{ OPERATION: EnumOperation.CON, FIRST: EnumConcreteLanguage.ALL, RESULT: EnumConcreteLanguage.ALL },
	{ OPERATION: EnumOperation.CON, SECOND: EnumConcreteLanguage.ALL, RESULT: EnumConcreteLanguage.ALL },
	//(∑*)R = ∑*
	{ OPERATION: EnumOperation.REV, FIRST: EnumConcreteLanguage.ALL, RESULT: EnumConcreteLanguage.ALL },					
    //ANBN, COAB, AMBN
	{ OPERATION: EnumOperation.UNI, FIRST: EnumConcreteLanguage.ANBN, SECOND: EnumConcreteLanguage.COAB, RESULT: EnumConcreteLanguage.ALL },
	{ OPERATION: EnumOperation.INT, FIRST: EnumConcreteLanguage.ANBN, SECOND: EnumConcreteLanguage.COAB, RESULT: EnumConcreteLanguage.EMPTY },
	{ OPERATION: EnumOperation.EXC, FIRST: EnumConcreteLanguage.ANBN, SECOND: EnumConcreteLanguage.COAB, RESULT: EnumConcreteLanguage.ANBN },	
	{ OPERATION: EnumOperation.EXC, FIRST: EnumConcreteLanguage.COAB, SECOND: EnumConcreteLanguage.ANBN, RESULT: EnumConcreteLanguage.COAB },
    //ANBNCN, AIBJCK
	{ OPERATION: EnumOperation.INT, FIRST: EnumConcreteLanguage.ANBNCN, SECOND: EnumConcreteLanguage.AIBJCK, RESULT: EnumConcreteLanguage.EMPTY },
	{ OPERATION: EnumOperation.EXC, FIRST: EnumConcreteLanguage.ANBNCN, SECOND: EnumConcreteLanguage.AIBJCK, RESULT: EnumConcreteLanguage.ANBNCN },
	{ OPERATION: EnumOperation.EXC, FIRST: EnumConcreteLanguage.AIBJCK, SECOND: EnumConcreteLanguage.ANBNCN, RESULT: EnumConcreteLanguage.AIBJCK }
];
		
concreteRules = concreteRules.concat(expandedRules);

var expansion = new LanguageName(EnumOperation.EXP, null, null);
var setEqualityRules = [
    //A = A
    {
        LEFT: expansion,
        RIGHT: expansion
    },
	//A = A UNI A
	{ 
	    LEFT: expansion,
	    RIGHT: new LanguageName(EnumOperation.UNI, expansion, expansion)
	},
	//A = A INT A
    {
        LEFT: expansion,
        RIGHT: new LanguageName(EnumOperation.INT, expansion, expansion)
    },
	//A = co-(co-A)
    {
        LEFT: expansion,
        RIGHT: new LanguageName(EnumOperation.CO, new LanguageName(EnumOperation.CO, expansion, null), null)
    },
	//A = rev-(rev-A)
    {
        LEFT: expansion,
        RIGHT: new LanguageName(EnumOperation.REV, new LanguageName(EnumOperation.REV, expansion, null), null)
    },
	//A* = (A*)*
	{ 
	    LEFT: new LanguageName(EnumOperation.ITER, expansion, null),
	    RIGHT: new LanguageName(EnumOperation.ITER, new LanguageName(EnumOperation.ITER, expansion, null), null)
	},
	//A* = (A*)+
	{
	    LEFT: new LanguageName(EnumOperation.ITER, expansion, null),
	    RIGHT: new LanguageName(EnumOperation.PITER, new LanguageName(EnumOperation.ITER, expansion, null), null)
	},
    //A* = (A+)*
    {
        LEFT: new LanguageName(EnumOperation.ITER, expansion, null),
        RIGHT: new LanguageName(EnumOperation.ITER, new LanguageName(EnumOperation.PITER, expansion, null), null)
    },
	//A+ = (A+)+
	{
	    LEFT: new LanguageName(EnumOperation.PITER, expansion, null),
	    RIGHT: new LanguageName(EnumOperation.PITER, new LanguageName(EnumOperation.PITER, expansion, null), null)
	}
];
						
var closures = [
    //UNI  INT  EXC  CON  CO  ITER  PITER  REV
    [true,true,true,true,false,false,false,true],       //FIN
    [true,true,true,true,true,true,true,true],          //REG
    [false,false,false,false,true,false,false,false],   //DCFL
    [true,false,false,true,false,true,true,true],		//CFL
    [true,true,true,true,true,true,true,true],			//CSL
    [true,true,true,true,true,true,true,true],			//REC
    [true,true,false,true,false,true,true,true],		//RE
	[true,true,true,true,true,true,true,true]			//ALL...everything must be true (bigger set does not exist)
];  		
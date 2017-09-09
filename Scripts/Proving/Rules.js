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

var EnumConcreteLanguage = {EMPTY : 0, EPSILON: 1, ALPHABET: 2, ALL : 3, ANBN: 4, COAB: 5, AMBN: 6, AIBJCK: 7, ANBNCN: 8, WW:9, COWW: 10, PRESS: 11, HALT: 12, COHALT: 13 };

var concreteLanguages = [
    { VIEW: "∅", CLASS: EnumClass.FIN, CONTAINS_EPSILON: false, CONTAINS_ALPHABET: false, COMPLEMENT: EnumConcreteLanguage.ALL },
    { VIEW: "{ε}", CLASS: EnumClass.FIN, CONTAINS_EPSILON: true, CONTAINS_ALPHABET: false },
    { VIEW: "∑", CLASS: EnumClass.FIN, CONTAINS_EPSILON: false, CONTAINS_ALPHABET: true },
    { VIEW: "∑*", CLASS: EnumClass.REG, CONTAINS_EPSILON: true, CONTAINS_ALPHABET: true, COMPLEMENT: EnumConcreteLanguage.EMPTY },
    { VIEW: "{aⁿbⁿ | n≥0}", CLASS: EnumClass.DCFL, CONTAINS_EPSILON: true, CONTAINS_ALPHABET: false, COMPLEMENT: EnumConcreteLanguage.COAB },
    { VIEW: "co-{aⁿbⁿ | n≥0}", CLASS: EnumClass.DCFL, CONTAINS_EPSILON: false, CONTAINS_ALPHABET: true, COMPLEMENT: EnumConcreteLanguage.ANBN },
    { VIEW: "{aᵐbⁿ | m≠n}", CLASS: EnumClass.DCFL, CONTAINS_EPSILON: false, CONTAINS_ALPHABET: true },
    { VIEW: "{aⁱbʲcᵏ | i≠j ∨ j≠k}", CLASS: EnumClass.CFL, CONTAINS_EPSILON: false, CONTAINS_ALPHABET: true },
    { VIEW: "{aⁿbⁿcⁿ | n≥0}", CLASS: EnumClass.CSL, CONTAINS_EPSILON: true, CONTAINS_ALPHABET: false },
    { VIEW: "{ww | w ∈ ∑*}", CLASS: EnumClass.CSL, COMPLEMENT: EnumConcreteLanguage.COWW },
    { VIEW: "co-{ww | w ∈ ∑*}", CLASS: EnumClass.CFL, COMPLEMENT: EnumConcreteLanguage.WW },
    { VIEW: "Pressburg. arit.", CLASS: EnumClass.REC },
    { VIEW: "HALT", CLASS: EnumClass.RE, COMPLEMENT: EnumConcreteLanguage.COHALT },
    { VIEW: "co-HALT", CLASS: EnumClass.ALL, COMPLEMENT: EnumConcreteLanguage.HALT }
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

var expandableRules = [
    //(containsAlphabet)* = ∑*
    {
        OPERATION: EnumOperation.ITER,
        FIRST: { CONTAINS_ALPHABET: true },
        RESULT: { CONCRETE: EnumConcreteLanguage.ALL }
    },
    //(containsAlphabet && containsEpsilon)+ = ∑*
    {
        OPERATION: EnumOperation.PITER,
        FIRST: { CONTAINS_ALPHABET: true, CONTAINS_EPSILON: true },
        RESULT: { CONCRETE: EnumConcreteLanguage.ALL }
    },
    //{ε} UNI (containsEpsilon) = (containsEpsilon)
    {
        OPERATION: EnumOperation.UNI,
        FIRST: { CONCRETE: EnumConcreteLanguage.EPSILON },
        SECOND : {CONTAINS_EPSILON : true},
        RESULT: { SIDE: 1}
    },
    //∑ UNI (containsAlphabet) = (containsAlphabet)
    {
        OPERATION: EnumOperation.UNI,
        FIRST: { CONCRETE: EnumConcreteLanguage.ALPHABET },
        SECOND: { CONTAINS_ALPHABET: true },
        RESULT: { SIDE: 1 }
    },
    //{ε} INT (!containsEpsilon) = {}
    {
        OPERATION: EnumOperation.INT,
        FIRST: { CONCRETE: EnumConcreteLanguage.EPSILON },
        SECOND : {CONTAINS_EPSILON : false},
        RESULT: { CONCRETE: EnumConcreteLanguage.EMPTY}
    },
    //{ε} INT (containsEpsilon) = {ε}
    {
        OPERATION: EnumOperation.INT,
        FIRST: { CONCRETE: EnumConcreteLanguage.EPSILON },
        SECOND: { CONTAINS_EPSILON: true },
        RESULT: { CONCRETE: EnumConcreteLanguage.EPSILON }
    },
    //∑ INT (containsAlphabet) = ∑
    {
        OPERATION: EnumOperation.INT,
        FIRST: { CONCRETE: EnumConcreteLanguage.ALPHABET },
        SECOND: { CONTAINS_ALPHABET: true },
        RESULT: { CONCRETE: EnumConcreteLanguage.ALPHABET }
    },
    //{ε} \ (containsEpsilon) = {}
    {
        OPERATION: EnumOperation.EXC,
        FIRST: { CONCRETE: EnumConcreteLanguage.EPSILON},
        SECOND: { CONTAINS_EPSILON: true },
        RESULT: { CONCRETE: EnumConcreteLanguage.EMPTY }
    },
    //{ε} \ (!containsEpsilon) = {ε}
    {
        OPERATION: EnumOperation.EXC,
        FIRST: { CONCRETE: EnumConcreteLanguage.EPSILON },
        SECOND: { CONTAINS_EPSILON: false },
        RESULT: { CONCRETE: EnumConcreteLanguage.EPSILON }
    },
    //∑* . (containsEpsilon) = ∑*
    {
        OPERATION: EnumOperation.CON,
        FIRST: { CONCRETE: EnumConcreteLanguage.ALL },
        SECOND: { CONTAINS_EPSILON: true },
        RESULT: { CONCRETE: EnumConcreteLanguage.ALL }
    },
    //(containsEpsilon) . ∑* = ∑*
    {
        OPERATION: EnumOperation.CON,
        FIRST: { CONTAINS_EPSILON: true },
        SECOND: { CONCRETE: EnumConcreteLanguage.ALL },
        RESULT: { CONCRETE: EnumConcreteLanguage.ALL }
    },
    //∑ \ (containsAlphabet) = {}
    {
        OPERATION: EnumOperation.EXC,
        FIRST: { CONCRETE: EnumConcreteLanguage.ALPHABET },
        SECOND: { CONTAINS_ALPHABET: true },
        RESULT: { CONCRETE: EnumConcreteLanguage.EMPTY }
    },
    //A UNI co-A = ∑*
    {
        OPERATION: EnumOperation.UNI,
        RESULT: { CONCRETE: EnumConcreteLanguage.ALL },
        COMPLEMENTS: true
    },
    //A INT co-A = {}	
    {
        OPERATION: EnumOperation.INT,
        RESULT: { CONCRETE: EnumConcreteLanguage.EMPTY },
        COMPLEMENTS: true
    },
    //A \ co-A = A
    {
        OPERATION: EnumOperation.EXC,
        RESULT: { SIDE: 0 },
        COMPLEMENTS: true
    },
    //∑* \ A = co-A
    {
        OPERATION: EnumOperation.EXC,
        FIRST: { CONCRETE: EnumConcreteLanguage.ALL },
        RESULT: { SIDE: 1, COMPLEMENT: true}
    }
];


function expandRule(ruleInfo) {
    var arrayOfRules = [];
	for (var i = 0; i < concreteLanguages.length; i++) {
	    if (ruleInfo.FIRST !== undefined &&
	        ((ruleInfo.FIRST.CONTAINS_EPSILON !== undefined &&
	                ruleInfo.FIRST.CONTAINS_EPSILON !== concreteLanguages[i].CONTAINS_EPSILON) ||
	            (ruleInfo.FIRST.CONTAINS_ALPHABET !== undefined &&
	                ruleInfo.FIRST.CONTAINS_ALPHABET !== concreteLanguages[i].CONTAINS_ALPHABET) ||
	            (ruleInfo.FIRST.CONCRETE !== undefined &&
	                ruleInfo.FIRST.CONCRETE !== i))) {
	        continue;
	    }
	    if (isUnary(ruleInfo.OPERATION)) {
	        arrayOfRules.push({
	            OPERATION: ruleInfo.OPERATION,
	            FIRST: i,
	            SECOND: undefined,
	            RESULT: (ruleInfo.RESULT.CONCRETE !== undefined) ? ruleInfo.RESULT.CONCRETE : i
	        });
	    }
	    else if (isBinary(ruleInfo.OPERATION)) {
            for (var j = 0; j < concreteLanguages.length; j++) {
                if (ruleInfo.SECOND !== undefined &&
                ((ruleInfo.SECOND.CONTAINS_EPSILON !== undefined &&
                        ruleInfo.SECOND.CONTAINS_EPSILON !== concreteLanguages[j].CONTAINS_EPSILON) ||
                    (ruleInfo.SECOND.CONTAINS_ALPHABET !== undefined &&
                        ruleInfo.SECOND.CONTAINS_ALPHABET !== concreteLanguages[j].CONTAINS_ALPHABET) ||
                    (ruleInfo.SECOND.CONCRETE !== undefined && ruleInfo.SECOND.CONCRETE !== j)) ||
                    (ruleInfo.COMPLEMENTS !== undefined && ruleInfo.COMPLEMENTS !== (concreteLanguages[i].COMPLEMENT === j))) {
                    continue;
                }
                var rule = {
                    OPERATION: ruleInfo.OPERATION,
                    FIRST: i,
                    SECOND: j,
                    RESULT: (ruleInfo.RESULT.CONCRETE !== undefined)
                        ? ruleInfo.RESULT.CONCRETE
                        : (ruleInfo.RESULT.SIDE === 0
                            ? (ruleInfo.RESULT.COMPLEMENT ? concreteLanguages[i].COMPLEMENT : i)
                            : (ruleInfo.RESULT.COMPLEMENT ? concreteLanguages[j].COMPLEMENT : j))
                };

                if (rule.RESULT !== undefined) {
                    arrayOfRules.push(rule);
                }
            }
        }
	}
	return arrayOfRules;
}

var basicConcreteRules = [	
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
	//other \ ∑* = {}
	{ OPERATION: EnumOperation.EXC, SECOND: EnumConcreteLanguage.ALL, RESULT: EnumConcreteLanguage.EMPTY },
    //(∑*)R = ∑*
	{ OPERATION: EnumOperation.REV, FIRST: EnumConcreteLanguage.ALL, RESULT: EnumConcreteLanguage.ALL },
    //ANBNCN, AIBJCK
	{ OPERATION: EnumOperation.INT, FIRST: EnumConcreteLanguage.ANBNCN, SECOND: EnumConcreteLanguage.AIBJCK, RESULT: EnumConcreteLanguage.EMPTY },
	{ OPERATION: EnumOperation.EXC, FIRST: EnumConcreteLanguage.ANBNCN, SECOND: EnumConcreteLanguage.AIBJCK, RESULT: EnumConcreteLanguage.ANBNCN },
	{ OPERATION: EnumOperation.EXC, FIRST: EnumConcreteLanguage.AIBJCK, SECOND: EnumConcreteLanguage.ANBNCN, RESULT: EnumConcreteLanguage.AIBJCK }
];

concreteRules = [].concat(basicConcreteRules);
for (var i = 0; i < expandableRules.length; i++) {
    concreteRules = concreteRules.concat(expandRule(expandableRules[i]));
}

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
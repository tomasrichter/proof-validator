/**
 * returns if operation is expansion
 * @param operationId   type of operation
 * @returns boolean if operation is expansion 
 */
function isExpansion(operationId) {
    return operationId === EnumOperation.EXP;
}

/**
 * returns if operation is atomic
 * @param operationId   type of operation
 * @returns boolean if operation is atomic 
 */
function isAtomic(operationId) {
    return operationId === EnumOperation.ATOMIC;
}

/**
 * returns if operation is unary
 * @param operationId   type of operation
 * @returns boolean if operation is unary 
 */
function isUnary(operationId) {
    return operationId >= EnumOperation.CO;
}

/**
 * returns if operation is binary
 * @param operationId   type of operation
 * @returns boolean if operation is binary 
 */
function isBinary(operationId) {
    return operationId > EnumOperation.ATOMIC && operationId < EnumOperation.CO;
}

/**
 * returns if operation is prefixed in printing
 * @param operationId   type of operation
 * @returns boolean if operation is prefixed 
 */
function isPrefixed(operationId) {
    return operationId === EnumOperation.CO;
}

/**
 * returns if order of operands is not important
 * @param operationId   type of operation
 * @returns             boolean if operation is commutative
 */
function isCommutative(operationId) {
    return operationId === EnumOperation.UNI || operationId === EnumOperation.INT;
}

/**
 * returns if parenthesis are not important 
 * @param {} operationId    type of operation
 * @returns {}              boolean if operation is associative
 */
function isAssociative(operationId) {
    return operationId === EnumOperation.UNI || operationId === EnumOperation.INT || operationId === EnumOperation.CON;
}

/**
 * returns if operation is printed as upper index
 * @param operationId   type of operation
 * @returns boolean if operation is printed as upper index
 */
function isFriendlySuper(operationId) {
	return operationId === EnumOperation.ITER || operationId === EnumOperation.PITER ||
		operationId === EnumOperation.REV;
}
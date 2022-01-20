
/**
 * @param {string} input
 * @return {number}
 */
var myAtoi = function (input) {
    const stateMachine = new StateMachine();
    let size = input.length;
    for (let i = 0; i < size; i++) {
        stateMachine.transitionState(input.charAt(i));
        if (stateMachine.currentState === stateMachine.state.STAGE_END_SEARCH) {
            break;
        }
    }
    return stateMachine.getInteger();
};

class StateMachine {

    constructor() {
        this.state = {STAGE_WHITESPACE_PLUS_MINUS_DIGIT: 1, STAGE_DIGIT: 2, STAGE_END_SEARCH: 3};
        this.currentState = this.state.STAGE_WHITESPACE_PLUS_MINUS_DIGIT;
        this.min_32bit_integer = -2147483648;
        this.max_32bit_integer = 2147483647;
        this.integer = 0;
        this.ascii_zero = 48;
        this.positive = true;
    }

    getInteger() {
        return (this.positive || this.integer === this.min_32bit_integer) ? this.integer : -this.integer;
    }

    /**
     * @param {character} characterDigit
     */
    appendDigit(characterDigit) {
        let digit = characterDigit.codePointAt(0) - this.ascii_zero;
        if (this.integer < Math.trunc(this.max_32bit_integer / 10) || (this.integer === Math.trunc(this.max_32bit_integer / 10) && digit <= this.max_32bit_integer % 10)) {
            this.integer = this.integer * 10 + digit;
        } else {
            this.integer = this.positive ? this.max_32bit_integer : this.min_32bit_integer;
        }
    }

    /**
     * @param {character} ch
     */
    transitionState(ch) {
        if (this.currentState === this.state.STAGE_WHITESPACE_PLUS_MINUS_DIGIT) {
            if (ch === '+' || ch === '-') {
                this.positive = (ch !== '-');
                this.currentState = this.state.STAGE_DIGIT;
                return;
            }
            if (ch >= '0' && ch <= '9') {
                this.appendDigit(ch);
                this.currentState = this.state.STAGE_DIGIT;
                return;
            }
            if (ch !== ' ') {
                this.currentState = this.state.STAGE_END_SEARCH;
                return;
            }
        }

        if (this.currentState === this.state.STAGE_DIGIT) {
            if (ch < '0' || ch > '9') {
                this.currentState = this.state.STAGE_END_SEARCH;
                return;
            }
            if (this.integer === this.min_32bit_integer || this.integer === this.max_32bit_integer) {
                this.currentState = this.state.STAGE_END_SEARCH;
                return;
            }
            this.appendDigit(ch);
        }
    }
}


public class Solution {

    public int myAtoi(String input) {
        StateMachine stateMachine = new StateMachine();
        int size = input.length();
        for (int i = 0; i < size; i++) {
            stateMachine.transitionState(input.charAt(i));
            if (stateMachine.currentState == StateMachine.State.STAGE_END_SEARCH) {
                break;
            }
        }
        return stateMachine.getInteger();
    }
}

class StateMachine {

    enum State {
        STAGE_WHITESPACE_PLUS_MINUS_DIGIT, STAGE_DIGIT, STAGE_END_SEARCH;
    };

    int integer;
    boolean positive = true;
    State currentState = State.STAGE_WHITESPACE_PLUS_MINUS_DIGIT;

    int getInteger() {
        return (positive || integer == Integer.MIN_VALUE) ? integer : -integer;
    }

    void appendDigit(char characterDigit) {
        int digit = characterDigit - '0';
        if (integer < Integer.MAX_VALUE / 10 || (integer == Integer.MAX_VALUE / 10 && digit <= Integer.MAX_VALUE % 10)) {
            integer = integer * 10 + digit;
        } else {
            integer = positive ? Integer.MAX_VALUE : Integer.MIN_VALUE;
        }
    }

    void transitionState(char ch) {
        if (currentState == State.STAGE_WHITESPACE_PLUS_MINUS_DIGIT) {
            if (ch == '+' || ch == '-') {
                positive = (ch != '-');
                currentState = State.STAGE_DIGIT;
                return;
            }
            if (Character.isDigit(ch)) {
                appendDigit(ch);
                currentState = State.STAGE_DIGIT;
                return;
            }
            if (ch != ' ') {
                currentState = State.STAGE_END_SEARCH;
                return;
            }
        }

        if (currentState == State.STAGE_DIGIT) {
            if (!Character.isDigit(ch)) {
                currentState = State.STAGE_END_SEARCH;
                return;
            }
            if (integer == Integer.MIN_VALUE || integer == Integer.MAX_VALUE) {
                currentState = State.STAGE_END_SEARCH;
                return;
            }
            appendDigit(ch);
        }
    }
}

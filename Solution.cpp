
using namespace std;

class StateMachine {
    
public:
    enum class State {STAGE_WHITESPACE_PLUS_MINUS_DIGIT, STAGE_DIGIT, STAGE_END_SEARCH};
    State currentState = State::STAGE_WHITESPACE_PLUS_MINUS_DIGIT;
    int integer = 0;
    bool positive = true;    

    int getInteger() {
        return (positive || integer == INT_MIN) ? integer : -integer;
    }

    void appendDigit(char characterDigit) {
        int digit = characterDigit - '0';
        if (integer < INT_MAX / 10 || (integer == INT_MAX / 10 && digit <= INT_MAX % 10)) {
            integer = integer * 10 + digit;
        } else {
            integer = positive ? INT_MAX : INT_MIN;
        }
    }

    void transitionState(char ch) {
        if (currentState == State::STAGE_WHITESPACE_PLUS_MINUS_DIGIT) {
            if (ch == '+' || ch == '-') {
                positive = (ch != '-');
                currentState = State::STAGE_DIGIT;
                return;
            }
            if (isdigit(ch)) {
                appendDigit(ch);
                currentState = State::STAGE_DIGIT;
                return;
            }
            if (ch != ' ') {
                currentState = State::STAGE_END_SEARCH;
                return;
            }
        }

        if (currentState == State::STAGE_DIGIT) {
            if (!isdigit(ch)) {
                currentState = State::STAGE_END_SEARCH;
                return;
            }
            if (integer == INT_MIN || integer == INT_MAX) {
                currentState = State::STAGE_END_SEARCH;
                return;
            }
            appendDigit(ch);
        }
    }
};

class Solution {
    
public:
    int myAtoi(string input) {
        StateMachine stateMachine;
        size_t size = input.length();
        for (size_t i = 0; i < size; i++) {
            stateMachine.transitionState(input[i]);
            if (stateMachine.currentState == StateMachine::State::STAGE_END_SEARCH) {
                break;
            }
        }
        return stateMachine.getInteger();
    }
};

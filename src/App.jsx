import { useReducer } from 'react';
import './style.css';
import DigitButton from './DigitButton';
import OperationButton from './OperationButton';


export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate'
}

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwite: false
        }
      }
      if (payload.digit === '0' && state.currentOperand === '0') {
        return state
      }
      if (payload.digit === "." && state.currentOperand?.includes(".")) {
        return state
      }
      return {
        ...state,
        currentOperand: `${state.currentOperand || ''}${payload.digit}`
      }
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) {
        return state
      }
      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation
        }
      }
      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null
        }
      }
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null
      }
    case ACTIONS.EVALUATE:
      if (state.currentOperand == null || state.previousOperand == null || state.operation == null) {
        return {
          ...state
        }
      }
      return {
        ...state,
        overwite: true,
        currentOperand: evaluate(state),
        previousOperand: null,
        operation: null
      }
    case ACTIONS.DELETE_DIGIT:
      if (state.overwite) {
        return {
          ...state,
          overwite: false,
          currentOperand: null
        }
      }
      if (state.currentOperand === null) return state
      if(state.currentOperand === undefined) return state
      if (state.currentOperand && state.currentOperand.length === 1) {
        return { ...state, currentOperand: null }
      }
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0,-1)
      }
    case ACTIONS.CLEAR:
      return {}
  }
}

function evaluate({ currentOperand, previousOperand, operation }) {
  const curr = parseFloat(currentOperand)
  const prev = parseFloat(previousOperand)
  if (isNaN(curr) || isNaN(prev)) return ""
  let computation = ""
  switch (operation) {
    case '+':
      computation = curr + prev
      break
    case '-':
      computation = curr - prev
      break
    case '*':
      computation = curr * prev
      break
    case '/':
      computation = curr / prev
      break
  }
  return computation.toString()
}

function App() {

  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer, {})
  return (
    <>
      <div className='calc-grid'>
        <div className="output">
          <div className="pre-operand">{previousOperand} {operation}</div>
          <div className="current-operand">{currentOperand}</div>
        </div>
        <button className="span-two" onClick={() => dispatch({ type: ACTIONS.CLEAR })}>AC</button>
        <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>
        {/* <button>/</button> */}
        <OperationButton operation="/" dispatch={dispatch} />
        <DigitButton digit="7" dispatch={dispatch} />
        <DigitButton digit="8" dispatch={dispatch} />
        <DigitButton digit="9" dispatch={dispatch} />
        <OperationButton operation="*" dispatch={dispatch} />
        <DigitButton digit="4" dispatch={dispatch} />
        <DigitButton digit="5" dispatch={dispatch} />
        <DigitButton digit="6" dispatch={dispatch} />
        
        <OperationButton operation="+" dispatch={dispatch} />
       
        <DigitButton digit="1" dispatch={dispatch} />
        <DigitButton digit="2" dispatch={dispatch} />
        <DigitButton digit="3" dispatch={dispatch} />
        <OperationButton operation="-" dispatch={dispatch} />
        <DigitButton digit="0" dispatch={dispatch} />
        <DigitButton digit="." dispatch={dispatch} />
        <button className="span-two" onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>=</button>
      </div>
    </>
  );
}

export default App;

import {_Window} from "openfin/_v2/api/window/window";
import actionType from "../types/enums/ChildWindowAction";
import childWindowState from "../types/enums/ChildWindowState";
interface IState {
  state: childWindowState;
  window: _Window | null;
}

interface IAction {
  error?: string;
  payload?: childWindowState | _Window;
  type: actionType;
}

export const initialChildWindowState: IState = {
  state: childWindowState.initial,
  window: null,
};

function isWindow(payload: any): payload is _Window {
  return payload.getWebWindow !== undefined;
}

export default (state: IState, action: IAction): IState => {
  switch (action.type) {
    case actionType.changeState:
      if (action.payload && !isWindow(action.payload)) {
        if (!Object.keys(childWindowState).indexOf(String(action.payload))) {
          throw new Error(`Invalid window state: ${action.payload}.`);
        } else if (action.payload === childWindowState.error) {
          throw new Error(
            `Error occured while window was in this state: ${action.payload}.`,
          );
        }
        return {
          ...state,
          state: action.payload,
        };
      }
      throw new Error("Cannot change state due to missing payload.");
    case actionType.setWindow:
      if (action.payload && isWindow(action.payload)) {
        return { ...state, window: action.payload };
      }
      throw new Error(`Cannot set window: ${action.payload}`);
    case actionType.reset:
      return initialChildWindowState;
    default:
      throw new Error(`Invalid action type: ${action.type}.`);
  }
};

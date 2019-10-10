import { _Window } from "openfin/_v2/api/window/window";
import CHILD_WINDOW_ACTION from "../types/enums/ChildWindowAction";
import CHILD_WINDOW_STATE from "../types/enums/ChildWindowState";
interface IState {
  state: CHILD_WINDOW_STATE;
  windowRef: _Window | null;
}

interface IAction {
  error?: string;
  payload?: CHILD_WINDOW_STATE | _Window;
  type: CHILD_WINDOW_ACTION;
}

export const INITIAL_CHILD_WINDOW_STATE: IState = {
  state: CHILD_WINDOW_STATE.INITIAL,
  windowRef: null,
};

function isWindow(payload: any): payload is _Window {
  return payload.getWebWindow !== undefined;
}

export default (state: IState, action: IAction): IState => {
  switch (action.type) {
    case CHILD_WINDOW_ACTION.CHANGE_STATE:
      if (action.payload && !isWindow(action.payload)) {
        if (!Object.keys(CHILD_WINDOW_STATE).indexOf(String(action.payload))) {
          throw new Error(`Invalid window state: ${action.payload}.`);
        } else if (action.payload === CHILD_WINDOW_STATE.ERROR) {
          throw new Error(
            `Error occured while window was state ${state.state}: ${action.error}`,
          );
        }
        return {
          ...state,
          state: action.payload,
        };
      }
      throw new Error("Cannot change state due to missing payload.");
    case CHILD_WINDOW_ACTION.SET_WINDOW:
      if (action.payload && isWindow(action.payload)) {
        return { ...state, windowRef: action.payload };
      }
      throw new Error(`Cannot set window: ${action.payload}`);
    case CHILD_WINDOW_ACTION.RESET:
      return INITIAL_CHILD_WINDOW_STATE;
    default:
      throw new Error(`Invalid action type: ${action.type}.`);
  }
};

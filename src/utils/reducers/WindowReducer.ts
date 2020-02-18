import { _Window } from "openfin/_v2/api/window/window";
import WINDOW_ACTION from "../types/enums/WindowAction";
import WINDOW_STATE from "../types/enums/WindowState";
import { IChildWindow } from "../types/ChildWindows";
interface IState {
  state: WINDOW_STATE;
  windowRef: IChildWindow | null;
}

interface IAction {
  error?: string;
  payload?: any;
  type: WINDOW_ACTION;
}

export const INITIAL_WINDOW_STATE: IState = {
  state: WINDOW_STATE.INITIAL,
  windowRef: null,
};

function isWindow(payload: any) {
  return payload.getNativeWindow !== undefined || // V1
         payload.getWebWindow !== undefined; // V2
}

export default (state: IState, action: IAction): IState => {
  switch (action.type) {
    case WINDOW_ACTION.CHANGE_STATE:
      if (action.payload && !isWindow(action.payload)) {
        if (!Object.keys(WINDOW_STATE).indexOf(String(action.payload))) {
          throw new Error(`Invalid window state: ${action.payload}.`);
        } else if (action.payload === WINDOW_STATE.ERROR) {
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
    case WINDOW_ACTION.SET_WINDOW:
      if (action.payload && isWindow(action.payload)) {
        return { ...state, windowRef: action.payload };
      }
      throw new Error(`Cannot set window: ${action.payload}`);
    case WINDOW_ACTION.RESET:
      return INITIAL_WINDOW_STATE;
    default:
      throw new Error(`Invalid action type: ${action.type}.`);
  }
};

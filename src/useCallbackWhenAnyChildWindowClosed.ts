import { Application } from "openfin/_v2/api/application/application";
import { _Window } from "openfin/_v2/api/window/window";
import useCallbackBaseHook from "./useCallbackBaseHook";
import ClosingOption from "./utils/types/enums/WindowClosingOptions";

export default (
    callbackFn: (parent: _Window, child: _Window) => void,
    parent: _Window = fin.Window.getCurrentSync(),
    app: Application = fin.Application.getCurrentSync(),
) => {
    useCallbackBaseHook(callbackFn, ClosingOption.AnyChild, parent, app);
};

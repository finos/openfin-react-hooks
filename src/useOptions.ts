import {_Window} from "openfin/_v2/api/window/window";
import {WindowOption} from "openfin/_v2/api/window/windowOption";
import {useEffect, useState} from "react";

export default (win: _Window = fin.Window.getCurrentSync()) => {
    const [options, setOptions] = useState<WindowOption>();

    const updateOptions = () => win.getOptions().then(setOptions);

    useEffect(() => {
        win.addListener("options-changed", updateOptions);

        return () => {
            win.removeListener("options-changed", updateOptions);
        };
    }, [win.identity.uuid, win.identity.name]);

    useEffect(() => {
        updateOptions();
    }, [win.identity.uuid, win.identity.name]);

    return [options, (newOptions: WindowOption) => win.updateOptions(newOptions)];
};

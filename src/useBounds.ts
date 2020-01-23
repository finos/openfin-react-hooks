import Bounds from "openfin/_v2/api/window/bounds";
import {_Window} from "openfin/_v2/api/window/window";
import {useEffect, useState} from "react";

export default (win: _Window = fin.Window.getCurrentSync()) => {
    const [bounds, setBounds] = useState<Bounds>();

    const updateBounds = () => win.getBounds().then(setBounds);

    useEffect(() => {
        win.addListener("bounds-changed", updateBounds);

        return () => {
            win.removeListener("bounds-changed", updateBounds);
        };
    }, [win.identity.uuid, win.identity.name]);

    useEffect(() => {
        updateBounds();
    }, [win.identity.uuid, win.identity.name]);

    return [bounds, (newBounds: Bounds) => win.setBounds(newBounds).then(() => setBounds(newBounds))];
};

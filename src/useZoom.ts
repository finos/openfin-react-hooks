import {_Window} from "openfin/_v2/api/window/window";
import {useEffect, useState} from "react";

export default (win: _Window = fin.Window.getCurrentSync()) => {
    const [zoom, setZoom] = useState<number>();

    useEffect(() => {
        win.getZoomLevel().then(setZoom);
    }, [win.identity.uuid, win.identity.name]);

    return [zoom, (newLevel: number) => win.setZoomLevel(newLevel).then(() => setZoom(newLevel))];
};

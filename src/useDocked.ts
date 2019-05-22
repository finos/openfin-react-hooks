import {snapAndDock} from "openfin-layouts";
import {useEffect, useState} from "react";

const undock = () => snapAndDock.undockWindow();

export default () => {
    const [isDocked, setIsDocked] = useState(false);

    useEffect(() => {
        const setIsDockedTrue = () => setIsDocked(true);
        const setIsDockedFalse = () => setIsDocked(false);

        snapAndDock.addEventListener("window-docked", setIsDockedTrue);
        snapAndDock.addEventListener("window-undocked", setIsDockedFalse);

        return () => {
            snapAndDock.removeEventListener("window-docked", setIsDockedTrue);
            snapAndDock.removeEventListener("window-undocked", setIsDockedFalse);
        };
    }, []);

    return [isDocked, undock];
};

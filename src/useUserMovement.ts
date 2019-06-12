import {_Window} from "openfin/_v2/api/window/window";
import {useEffect, useState} from "react";

export default (win: _Window = fin.Window.getCurrentSync(), initialValue: boolean = true) => {
    const [isUserMovementEnabled, setIsUserMovementEnabled] = useState<boolean>(initialValue);

    const updateUserMovement = (newUserMovement: boolean) =>
        newUserMovement ? win.enableUserMovement() : win.disableUserMovement();

    useEffect(() => {
        const setUserMovementDisabled = () => setIsUserMovementEnabled(false);
        win.addListener("user-movement-disabled", setUserMovementDisabled);

        return () => {
            win.removeListener("user-movement-disabled", setUserMovementDisabled);
        };
    }, [win.identity.uuid, win.identity.name]);

    useEffect(() => {
        const setUserMovementEnabled = () => setIsUserMovementEnabled(true);
        win.addListener("user-movement-enabled", setUserMovementEnabled);

        return () => {
            win.removeListener("user-movement-enabled", setUserMovementEnabled);
        };
    }, [win.identity.uuid, win.identity.name]);

    useEffect(() => {
        updateUserMovement(initialValue);
    }, []);

    return [isUserMovementEnabled, updateUserMovement];
};

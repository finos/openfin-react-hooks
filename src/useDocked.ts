import {useEffect, useState} from "react";

const undock = () => fin.desktop.Window.getCurrent().leaveGroup();

interface IGroupChangeProps {
    reason: string,
    name: string,
}

export default () => {
    const [isDocked, setIsDocked] = useState(false);

    const setIsDockedTrue = () => setIsDocked(true);
    const setIsDockedFalse = () => setIsDocked(false);
    const onGroupChange = ({ reason, name }: IGroupChangeProps) => {
        console.log(name);
        console.log(reason);
        if (reason === "join" || reason === "merge") {
            setIsDockedTrue();
        } else if (reason === "leave" || reason === "disband") {
            setIsDockedFalse();
        }
    }

    useEffect(() => {


        const window = fin.desktop.Window.getCurrent();

        // @ts-ignore:
        window.addEventListener("group-changed", onGroupChange);

        // snapAndDock.addEventListener("window-docked", setIsDockedTrue);
        // snapAndDock.addEventListener("window-undocked", setIsDockedFalse);

        return () => {
            // @ts-ignore:
            window.removeEventListener("group-changed", onGroupChange);
            // snapAndDock.removeEventListener("window-docked", setIsDockedTrue);
            // snapAndDock.removeEventListener("window-undocked", setIsDockedFalse);
        };
    }, []);

    return [isDocked, undock];
};

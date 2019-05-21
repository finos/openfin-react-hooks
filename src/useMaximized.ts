import {useEffect, useState} from "react";

const updateWindow = (shouldMaximize: boolean): Promise<void> =>
    fin.Window.getCurrent()
        .then((win) => shouldMaximize ? win.maximize() : win.restore());

export default (): [boolean, (shouldMaximize: boolean) => Promise<void>] => {
    const [isMaximized, setIsMaximized] = useState(false);

    useEffect(() => {
        const setIsMaximizedTrue = () => setIsMaximized(true);
        const setIsMaximizedFalse = () => setIsMaximized(false);

        const currentWindow = fin.desktop.Window.getCurrent();

        currentWindow.addEventListener("maximized", setIsMaximizedTrue);
        currentWindow.addEventListener("restored", setIsMaximizedFalse);

        return () => {
            currentWindow.removeEventListener("maximized", setIsMaximizedTrue);
            currentWindow.removeEventListener("restored", setIsMaximizedFalse);
        };
    }, []);

    return [isMaximized, updateWindow];
};

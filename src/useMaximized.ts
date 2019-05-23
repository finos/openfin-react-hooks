import {useEffect, useState} from "react";

const updateWindow = (shouldMaximize: boolean): Promise<void> =>
    fin.Window.getCurrent()
        .then((win) => shouldMaximize ? win.maximize() : win.restore());

export default (): [boolean, (shouldMaximize: boolean) => Promise<void>] => {
    const [isMaximized, setIsMaximized] = useState(false);

    useEffect(() => {
        const setIsMaximizedTrue = () => setIsMaximized(true);
        const setIsMaximizedFalse = () => setIsMaximized(false);

        const currentWindow = fin.Window.getCurrentSync();
        currentWindow.addListener("maximized", setIsMaximizedTrue);
        currentWindow.addListener("restored", setIsMaximizedFalse);

        return () => {
            currentWindow.removeListener("maximized", setIsMaximizedTrue);
            currentWindow.removeListener("restored", setIsMaximizedFalse);
        };
    }, []);

    return [isMaximized, updateWindow];
};

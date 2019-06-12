import {_Window} from "openfin/_v2/api/window/window";
import {WindowOption} from "openfin/_v2/api/window/windowOption";
import {useEffect, useState} from "react";
import uuidv4 from "uuid/v4";

export default (initialOptions: WindowOption = {}) => {
    const [options, setOptions] = useState(initialOptions);
    const [win, setWin] = useState();

    useEffect(() => {
        let newWindow: _Window;

        const createWindow = async () => {
            newWindow = await window.fin.Window.create({
                autoShow: true,
                defaultHeight: 200,
                defaultWidth: 500,
                name: uuidv4(),
                url: "about:blank",
                ...options,
            });
            setWin(newWindow);
        };

        createWindow();

        return () => {
            if (newWindow) {
                newWindow.close();
            }
        };
    }, [options]);

    return [win, setOptions];
};

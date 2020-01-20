import { Application } from "openfin/_v2/api/application/application";
import { _Window } from "openfin/_v2/api/window/window";
import { useEffect, useState } from "react";
import usePreviousValue from "./utils/usePreviousValue";

type ChildWindowDetails = Readonly<{
    uuid: string;
    name?: string;
}>;

export default (
    parent: _Window = fin.Window.getCurrentSync(),
    app: Application = fin.Application.getCurrentSync(),
) => {
    const [childWindows, setChildWindows] = useState<ChildWindowDetails[]>([]);
    const [shouldClose, setShouldClose] = useState(false);
    const [childrenCount, setChildrenCount] = useState(0);
    const previousCount = usePreviousValue(childrenCount);

    const getChildWindowsPromise = () =>
        app.getChildWindows()
            .then((windows) =>
                Promise.all(
                    windows.map((window) =>
                        window.getParentWindow()
                            .then((p) => p.identity.name === parent.identity.name ? window : null),
                    ),
                ))
            .then((windows) => windows.filter((w) => w !== null) as _Window[]);

    useEffect(() => {
        getChildWindowsPromise()
            .then((windows) => {
                setChildWindows(windows.map((w) => ({ name: w.identity.name, uuid: w.identity.uuid })));
            });
    }, []);

    useEffect(() => {
        const handleWindowCreated = (e: ChildWindowDetails) => {
            getChildWindowsPromise().then((windows) => {
                if (windows.some((w) => w.identity.name === e.name && w.identity.uuid === e.uuid)) {
                    setChildWindows((current) =>
                        [
                            ...current,
                            {
                                name: e.name,
                                uuid: e.uuid,
                            },
                        ],
                    );
                }
            });
        };

        app.addListener("window-created", handleWindowCreated);

        return () => {
            app.removeListener("window-created", handleWindowCreated);
        };

    }, []);

    useEffect(() => {
        const handleWindowClosed = (e: ChildWindowDetails) => {
            const indexToRemove = childWindows.findIndex((w) => w.name === e.name && w.uuid === e.uuid);
            if (indexToRemove >= 0) {
                setChildWindows(childWindows.filter((_, idx) => idx !== indexToRemove));
            }
        };

        app.addListener("window-closed", handleWindowClosed);

        return () => {
            app.removeListener("window-closed", handleWindowClosed);
        };

    }, [childWindows]);

    useEffect(() => {
        setChildrenCount(childWindows.length);
    }, [childWindows]);

    useEffect(() => {
        setShouldClose(previousCount === 1 && childrenCount === 0);
    }, [childrenCount]);

    useEffect(() => {
        if (shouldClose) {
            app.getWindow().then((window) => window.close());
        }
    }, [shouldClose]);
};

import { Application } from "openfin/_v2/api/application/application";
import { _Window } from "openfin/_v2/api/window/window";
import { useEffect, useState } from "react";
import ClosingOption from "./utils/types/enums/WindowClosingOptions";
import usePreviousValue from "./utils/usePreviousValue";

type ChildWindowDetails = Readonly<{
    uuid: string;
    name?: string;
}>;

export default (
    callbackFn: (parent: _Window) => void,
    closingOption: ClosingOption,
    parent: _Window = fin.Window.getCurrentSync(),
    app: Application = fin.Application.getCurrentSync(),
) => {
    const [childWindows, setChildWindows] = useState<ChildWindowDetails[]>([]);
    const [shouldClose, setShouldClose] = useState(false);
    const [childrenCount, setChildrenCount] = useState(0);
    const previousCount = usePreviousValue(childrenCount);

    const getChildWindowsPromise = async () => {
        const allChildWindows = await app.getChildWindows();

        const projectedChildWindows = await Promise.all(
            allChildWindows.map(
                (window) => window.getParentWindow()
                    .then((p) => p.identity.name === parent.identity.name ? window : null)),
        );

        return projectedChildWindows.filter((w) => w !== null) as _Window[];

    };

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

    const handleWindowClosed = (e: ChildWindowDetails) => {
        const indexToRemove = childWindows.findIndex((w) => w.name === e.name && w.uuid === e.uuid);
        if (indexToRemove >= 0) {
            setChildWindows(childWindows.filter((_, idx) => idx !== indexToRemove));
        }
    };

    useEffect(() => {
        getChildWindowsPromise()
            .then((windows) => {
                setChildWindows(windows.map((w) => ({ name: w.identity.name, uuid: w.identity.uuid })));
            });
    }, []);

    useEffect(() => {
        app.addListener("window-created", handleWindowCreated);

        return () => {
            app.removeListener("window-created", handleWindowCreated);
        };

    }, []);

    useEffect(() => {
        app.addListener("window-closed", handleWindowClosed);

        return () => {
            app.removeListener("window-closed", handleWindowClosed);
        };

    }, [childWindows]);

    useEffect(() => {
        setChildrenCount(childWindows.length);
    }, [childWindows]);

    useEffect(() => {

        switch (closingOption) {
            case ClosingOption.AllChildren:
                setShouldClose(previousCount === 1 && childrenCount === 0);
                break;

            case ClosingOption.AnyChild:
                setShouldClose(previousCount != null && (previousCount > childrenCount));
                break;

            default:
                break;
        }
    }, [childrenCount]);

    useEffect(() => {
        if (shouldClose) {
            callbackFn(parent);
        }
        setShouldClose(false);
    }, [shouldClose]);
};

import {MonitorInfo, Rect} from "openfin/_v2/api/system/monitor";
import Bounds from "openfin/_v2/api/window/bounds";
import {Transition} from "openfin/_v2/api/window/transition";
import {_Window} from "openfin/_v2/api/window/window";
import {useEffect, useState} from "react";
import {ScreenEdge} from "./ScreenEdge";
import WindowBoundsEvent = fin.WindowBoundsEvent;

const ANIMATION_DURATION: number = 250;
let isAnimating = false;

const getLocation = (edge: ScreenEdge, windowBounds: Bounds, screenBounds: Rect): Transition => ({
    position: {
        duration: ANIMATION_DURATION,
        left: edge === ScreenEdge.LEFT ? 0 : edge === ScreenEdge.RIGHT ?
            screenBounds.right - windowBounds.width : windowBounds.left,
        relative: false,
        top: edge === ScreenEdge.TOP ? 0 : windowBounds.top,
    },
    size: {
        duration: ANIMATION_DURATION,
        height: windowBounds.height,
        relative: false,
        width: windowBounds.width,
    },
});

export default (initialEdge = ScreenEdge.NONE, toMove: _Window = fin.Window.getCurrentSync(),
                allowUserToUndock: boolean = true) => {
    const [edge, setEdge] = useState(initialEdge);

    useEffect(() => {
        const handleBoundsChanged = (event: WindowBoundsEvent) => {
            // Don't reset edge if we're the ones moving it or only a resize bound event has occurred
            if (isAnimating || event.changeType === 1) {
                if (isAnimating) {
                    isAnimating = false;
                }
                return;
            }

            setEdge(ScreenEdge.NONE);
        };

        toMove.addListener("bounds-changed", handleBoundsChanged);

        return () => {
            toMove.removeListener("bounds-changed", handleBoundsChanged);
        };
    }, [toMove]);

    useEffect(() => {
        if (!toMove.enableUserMovement || !toMove.disableUserMovement) {
            return; // window not initialised yet
        }

        if (edge === ScreenEdge.NONE) {
            toMove.enableUserMovement();
        } else if (!allowUserToUndock) {
            toMove.disableUserMovement();
        }

        return () => {
            toMove.enableUserMovement();
        };
    }, [edge, toMove, allowUserToUndock]);

    useEffect(() => {
        const doWindowActions = async () => {
            if (edge === ScreenEdge.NONE) {
                return;
            }

            const bounds: Bounds = await toMove.getBounds();
            const monitorInfo: MonitorInfo = await fin.System.getMonitorInfo();

            isAnimating = true; // set flag to prevent bounds listener from resetting edge to NONE
            toMove.animate(getLocation(edge, bounds, monitorInfo.primaryMonitor.availableRect), {interrupt: true});
        };

        doWindowActions();
    }, [edge]);

    return [edge, {
        dockLeft: () => setEdge(ScreenEdge.LEFT),
        dockNone: () => setEdge(ScreenEdge.NONE),
        dockRight: () => setEdge(ScreenEdge.RIGHT),
        dockTop: () => setEdge(ScreenEdge.TOP),
    }];
};

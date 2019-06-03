import {MonitorDetails, MonitorInfo, Rect} from "openfin/_v2/api/system/monitor";
import Bounds from "openfin/_v2/api/window/bounds";
import {Transition} from "openfin/_v2/api/window/transition";
import {_Window} from "openfin/_v2/api/window/window";
import {useEffect, useState} from "react";

import {IDimensions} from "../index";
import {ScreenEdge} from "./ScreenEdge";
import transitions from "./useDockWindow.transitions";
import usePreviousValue from "./utils/usePreviousValue";

let isAnimating = false;

const getMonitorRect = async (bounds: Bounds): Promise<Rect> => {
    const monitorInfo: MonitorInfo = await fin.System.getMonitorInfo();
    return monitorInfo.nonPrimaryMonitors
            .concat(monitorInfo.primaryMonitor)
            .map((info: MonitorDetails) => info.availableRect)
            .find((rect) => bounds.left >= rect.left && (bounds.left + bounds.width) <= rect.right &&
                bounds.top >= rect.top && (bounds.top + bounds.height) <= rect.bottom)
        || monitorInfo.primaryMonitor.availableRect;
};

export default (initialEdge = ScreenEdge.NONE, toMove: _Window = fin.Window.getCurrentSync(),
                allowUserToUndock: boolean = true, stretchToFit?: IDimensions) => {
    const [edge, setEdge] = useState(initialEdge);
    const [isUndocking, setIsUndocking] = useState(false);
    const previousEdge = usePreviousValue<ScreenEdge>(edge);

    useEffect(() => {
        const handleBoundsChanged = (event: fin.WindowBoundsEvent) => {
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
            if (toMove.enableUserMovement) {
                toMove.enableUserMovement();
            }
        };
    }, [edge, toMove, allowUserToUndock]);

    useEffect(() => {
        const performDockTransition = async () => {
            isAnimating = true; // set flag to prevent bounds listener from resetting edge to NONE

            const bounds: Bounds = await toMove.getBounds();
            const monitorRect: Rect = await getMonitorRect(bounds);
            const transition: Transition = stretchToFit ?
                transitions.stretchedDock(edge, monitorRect, stretchToFit) :
                transitions.dock(edge, monitorRect, bounds);

            await toMove.animate(transition, { interrupt: true });
        };

        if (edge !== ScreenEdge.NONE) {
            performDockTransition();
        }
    }, [edge, stretchToFit, toMove]);

    useEffect(() => {
        const performUndockTransition = async () => {
            const bounds: Bounds = await toMove.getBounds();
            const monitorRect: Rect = await getMonitorRect(bounds);
            const transition: Transition = stretchToFit ?
                transitions.stretchedUndock(previousEdge!, monitorRect, stretchToFit) :
                transitions.undock(previousEdge!, bounds);

            await toMove.animate(transition, { interrupt: true });
            setIsUndocking(false);
        };

        if (isUndocking) {
            performUndockTransition();
        }
    }, [isUndocking, stretchToFit, toMove]);

    return [edge, {
        dockBottom: () => setEdge(ScreenEdge.BOTTOM),
        dockLeft: () => setEdge(ScreenEdge.LEFT),
        dockNone: () => {
            setIsUndocking(true);
            setEdge(ScreenEdge.NONE);
        },
        dockRight: () => setEdge(ScreenEdge.RIGHT),
        dockTop: () => setEdge(ScreenEdge.TOP),
    }];
};

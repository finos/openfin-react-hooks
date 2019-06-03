import {MonitorDetails, MonitorInfo, Rect} from "openfin/_v2/api/system/monitor";
import Bounds from "openfin/_v2/api/window/bounds";
import {Transition} from "openfin/_v2/api/window/transition";
import {_Window} from "openfin/_v2/api/window/window";
import {useEffect, useState} from "react";

import {IDimensions} from "../index";
import {ScreenEdge} from "./ScreenEdge";
import usePreviousValue from "./utils/usePreviousValue";

const ANIMATION_DURATION: number = 250;
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

const getStretchedUndockTransition = (previousEdge: ScreenEdge, monitorBounds: Rect,
                                      stretchToFit: IDimensions): Transition => ({
    position: {
        duration: ANIMATION_DURATION,
        left: previousEdge !== ScreenEdge.RIGHT ?
            25 : monitorBounds.right - stretchToFit.dockedWidth - 25,
        relative: false,
        top: previousEdge !== ScreenEdge.BOTTOM ? 25 : monitorBounds.bottom - stretchToFit.dockedHeight - 25,
    },
    size: {
        duration: ANIMATION_DURATION,
        height: previousEdge === ScreenEdge.LEFT || previousEdge === ScreenEdge.RIGHT ?
            monitorBounds.bottom - monitorBounds.top - 50 : stretchToFit.dockedHeight,
        relative: false,
        width: previousEdge === ScreenEdge.TOP || previousEdge === ScreenEdge.BOTTOM ?
            monitorBounds.right - monitorBounds.left - 50 : stretchToFit.dockedWidth,
    },
});

const getUndockTransition = (previousEdge: ScreenEdge, windowBounds: Bounds): Transition => ({
    position: {
        duration: ANIMATION_DURATION,
        left: previousEdge === ScreenEdge.LEFT ? 25 : previousEdge === ScreenEdge.RIGHT ?
            windowBounds.left - 25 : windowBounds.left,
        relative: false,
        top: previousEdge === ScreenEdge.TOP ? 25 : previousEdge === ScreenEdge.BOTTOM ?
            windowBounds.top - 25 : windowBounds.top,
    },
});

const getStretchedDockTransition = (edge: ScreenEdge, monitorBounds: Rect, stretchToFit: IDimensions): Transition => ({
    position: {
        duration: ANIMATION_DURATION,
        left: edge !== ScreenEdge.RIGHT ? monitorBounds.left : monitorBounds.right - stretchToFit.dockedWidth,
        relative: false,
        top: edge !== ScreenEdge.BOTTOM ? monitorBounds.top : monitorBounds.bottom - stretchToFit.dockedHeight,
    },
    size: {
        duration: ANIMATION_DURATION,
        height: edge === ScreenEdge.TOP || edge === ScreenEdge.BOTTOM ?
            stretchToFit.dockedHeight : monitorBounds.bottom - monitorBounds.top,
        relative: false,
        width: edge === ScreenEdge.TOP || edge === ScreenEdge.BOTTOM ?
            monitorBounds.right - monitorBounds.left : stretchToFit.dockedWidth,
    },
});

const getDockTransition = (edge: ScreenEdge, screenBounds: Rect, windowBounds: Bounds): Transition => ({
    position: {
        duration: ANIMATION_DURATION,
        left: edge === ScreenEdge.LEFT ? screenBounds.left : edge === ScreenEdge.RIGHT ?
            screenBounds.right - windowBounds.width : windowBounds.left,
        relative: false,
        top: edge === ScreenEdge.TOP ? screenBounds.top : edge === ScreenEdge.BOTTOM ?
            screenBounds.bottom - windowBounds.height : windowBounds.top,
    },
    size: {
        duration: ANIMATION_DURATION,
        height: windowBounds.height,
        relative: false,
        width: windowBounds.width,
    },
});

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
        const doWindowActions = async () => {
            isAnimating = true; // set flag to prevent bounds listener from resetting edge to NONE

            const bounds: Bounds = await toMove.getBounds();
            const monitorRect: Rect = await getMonitorRect(bounds);

            if (stretchToFit) {
                await toMove.animate(getStretchedDockTransition(edge, monitorRect, stretchToFit),
                    {interrupt: true});
            } else {
                await toMove.animate(getDockTransition(edge, monitorRect, bounds), {interrupt: true});
            }
        };

        if (edge !== ScreenEdge.NONE) {
            doWindowActions();
        }
    }, [edge, stretchToFit, toMove]);

    useEffect(() => {
        const performUndockTransition = async () => {
            const bounds: Bounds = await toMove.getBounds();
            const monitorRect: Rect = await getMonitorRect(bounds);

            if (stretchToFit) {
                await toMove.animate(getStretchedUndockTransition(previousEdge!, monitorRect, stretchToFit),
                    {interrupt: true});
            } else {
                await toMove.animate(getUndockTransition(previousEdge!, bounds), {interrupt: true});
            }

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

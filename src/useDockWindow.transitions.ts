import {Rect} from "openfin/_v2/api/system/monitor";
import Bounds from "openfin/_v2/api/window/bounds";
import {Transition} from "openfin/_v2/api/window/transition";

import {IDimensions} from "../index";
import {ScreenEdge} from "./ScreenEdge";

const ANIMATION_DURATION: number = 250;

const stretchedUndock = (previous: ScreenEdge, monitorBounds: Rect, stretchToFit: IDimensions): Transition => ({
    position: {
        duration: ANIMATION_DURATION,
        left: previous !== ScreenEdge.RIGHT ?
            25 : monitorBounds.right - stretchToFit.dockedWidth - 25,
        relative: false,
        top: previous !== ScreenEdge.BOTTOM ? 25 : monitorBounds.bottom - stretchToFit.dockedHeight - 25,
    },
    size: {
        duration: ANIMATION_DURATION,
        height: previous === ScreenEdge.LEFT || previous === ScreenEdge.RIGHT ?
            monitorBounds.bottom - monitorBounds.top - 50 : stretchToFit.dockedHeight,
        relative: false,
        width: previous === ScreenEdge.TOP || previous === ScreenEdge.BOTTOM ?
            monitorBounds.right - monitorBounds.left - 50 : stretchToFit.dockedWidth,
    },
});

const undock = (previous: ScreenEdge, windowBounds: Bounds): Transition => ({
    position: {
        duration: ANIMATION_DURATION,
        left: previous === ScreenEdge.LEFT ? 25 : previous === ScreenEdge.RIGHT ?
            windowBounds.left - 25 : windowBounds.left,
        relative: false,
        top: previous === ScreenEdge.TOP ? 25 : previous === ScreenEdge.BOTTOM ?
            windowBounds.top - 25 : windowBounds.top,
    },
});

const stretchedDock = (current: ScreenEdge, monitorBounds: Rect, stretchToFit: IDimensions): Transition => ({
    position: {
        duration: ANIMATION_DURATION,
        left: current !== ScreenEdge.RIGHT ? monitorBounds.left : monitorBounds.right - stretchToFit.dockedWidth,
        relative: false,
        top: current !== ScreenEdge.BOTTOM ? monitorBounds.top : monitorBounds.bottom - stretchToFit.dockedHeight,
    },
    size: {
        duration: ANIMATION_DURATION,
        height: current === ScreenEdge.TOP || current === ScreenEdge.BOTTOM ?
            stretchToFit.dockedHeight : monitorBounds.bottom - monitorBounds.top,
        relative: false,
        width: current === ScreenEdge.TOP || current === ScreenEdge.BOTTOM ?
            monitorBounds.right - monitorBounds.left : stretchToFit.dockedWidth,
    },
});

const dock = (current: ScreenEdge, monitorBounds: Rect, windowBounds: Bounds): Transition => ({
    position: {
        duration: ANIMATION_DURATION,
        left: current === ScreenEdge.LEFT ? monitorBounds.left : current === ScreenEdge.RIGHT ?
            monitorBounds.right - windowBounds.width : windowBounds.left,
        relative: false,
        top: current === ScreenEdge.TOP ? monitorBounds.top : current === ScreenEdge.BOTTOM ?
            monitorBounds.bottom - windowBounds.height : windowBounds.top,
    },
    size: {
        duration: ANIMATION_DURATION,
        height: windowBounds.height,
        relative: false,
        width: windowBounds.width,
    },
});

export default {
    dock,
    stretchedDock,
    stretchedUndock,
    undock,
};

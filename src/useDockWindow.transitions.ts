import {Rect} from "openfin/_v2/api/system/monitor";
import Bounds from "openfin/_v2/api/window/bounds";
import {Transition} from "openfin/_v2/api/window/transition";

import {IDimensions} from "../index";
import {ScreenEdge} from "./ScreenEdge";

const ANIMATION_DURATION: number = 250;
const UNDOCK_MARGIN: number = 25;

const stretchedUndock = (previous: ScreenEdge, monitorBounds: Rect, stretchToFit: IDimensions): Transition => ({
    position: {
        duration: ANIMATION_DURATION,
        left: previous !== ScreenEdge.RIGHT ?
            monitorBounds.left + UNDOCK_MARGIN : monitorBounds.right - stretchToFit.dockedWidth - UNDOCK_MARGIN,
        relative: false,
        top: previous !== ScreenEdge.BOTTOM ? monitorBounds.top + UNDOCK_MARGIN :
            monitorBounds.bottom - stretchToFit.dockedHeight - UNDOCK_MARGIN,
    },
    size: {
        duration: ANIMATION_DURATION,
        height: previous === ScreenEdge.LEFT || previous === ScreenEdge.RIGHT ?
            monitorBounds.bottom - monitorBounds.top - (UNDOCK_MARGIN * 2) : stretchToFit.dockedHeight,
        relative: false,
        width: previous === ScreenEdge.TOP || previous === ScreenEdge.BOTTOM ?
            monitorBounds.right - monitorBounds.left - (UNDOCK_MARGIN * 2) : stretchToFit.dockedWidth,
    },
});

const undock = (previous: ScreenEdge, windowBounds: Bounds): Transition => ({
    position: {
        duration: ANIMATION_DURATION,
        left: previous === ScreenEdge.LEFT ? windowBounds.left + UNDOCK_MARGIN : previous === ScreenEdge.RIGHT ?
            windowBounds.left - UNDOCK_MARGIN : windowBounds.left,
        relative: false,
        top: previous === ScreenEdge.TOP ? windowBounds.top + UNDOCK_MARGIN : previous === ScreenEdge.BOTTOM ?
            windowBounds.top - UNDOCK_MARGIN : windowBounds.top,
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

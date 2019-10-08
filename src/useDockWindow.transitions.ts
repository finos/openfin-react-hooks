import {Rect} from "openfin/_v2/api/system/monitor";
import Bounds from "openfin/_v2/api/window/bounds";
import {Transition} from "openfin/_v2/api/window/transition";

import {IDimensions, IUseDockWindowOptions} from "../index";
import {ScreenEdge} from "./ScreenEdge";

const ANIMATION_DURATION: number = 250;
const UNDOCK_MARGIN: number = 25;

const stretchedUndock = (previous: ScreenEdge, monitorBounds: Rect, stretchToFit: IDimensions,
                         options?: IUseDockWindowOptions): Transition => {
    const width = options && options.undockSize
        ? options.undockSize.width
        : (
            previous === ScreenEdge.TOP || previous === ScreenEdge.BOTTOM
                ? monitorBounds.right - monitorBounds.left - (UNDOCK_MARGIN * 2)
                : stretchToFit.dockedWidth
        );
    const height = options && options.undockSize
        ? options.undockSize.height
        : (
            previous === ScreenEdge.LEFT || previous === ScreenEdge.RIGHT
                ? monitorBounds.bottom - monitorBounds.top - (UNDOCK_MARGIN * 2)
                : stretchToFit.dockedHeight
        );
    const top = options && options.undockPosition
        ? options.undockPosition.top
        : (
            previous !== ScreenEdge.BOTTOM
                ? monitorBounds.top + UNDOCK_MARGIN
                : monitorBounds.bottom - height - UNDOCK_MARGIN
        );
    const left = options && options.undockPosition
        ? options.undockPosition.left
        : (
            previous !== ScreenEdge.RIGHT ?
                monitorBounds.left + UNDOCK_MARGIN :
                monitorBounds.right - width - UNDOCK_MARGIN
        );

    return {
        position: {
            duration: ANIMATION_DURATION,
            left,
            relative: false,
            top,
        },
        size: {
            duration: ANIMATION_DURATION,
            height,
            relative: false,
            width,
        },
    };
};

const undock = (previous: ScreenEdge, windowBounds: Bounds, options?: IUseDockWindowOptions): Transition => {
    const width = options && options.undockSize ? options.undockSize.width : windowBounds.width;
    const height = options && options.undockSize ? options.undockSize.height : windowBounds.height;
    const top = options && options.undockPosition
        ? options.undockPosition.top
        : (
            previous === ScreenEdge.TOP
                ? windowBounds.top + UNDOCK_MARGIN
                : previous === ScreenEdge.BOTTOM
                    ? windowBounds.top - UNDOCK_MARGIN
                    : windowBounds.top
        );
    const left = options && options.undockPosition
        ? options.undockPosition.left
        : (
            previous === ScreenEdge.LEFT
                ? windowBounds.left + UNDOCK_MARGIN
                : previous === ScreenEdge.RIGHT
                    ? windowBounds.left - UNDOCK_MARGIN
                    : windowBounds.left
        );

    return {
        position: {
            duration: ANIMATION_DURATION,
            left,
            relative: false,
            top,
        },
        size: {
            duration: ANIMATION_DURATION,
            height,
            relative: false,
            width,
        },
    };
};

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

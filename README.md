# Openfin React Hooks : useOpenFin()

A collection of react hooks built on top of the Openfin API.

## Motive

Wrapping up the OpenFin API in a higher level hooks abstraction allows developers to share common functionality across React-based OpenFin applications.

Even the simpler hooks bridge across various versions of the OpenFin API, providing a consistent interface around OpenFin regardless of what environment the application resides within.

More complex hooks (e.g. useDockWindow) provide functionality that could save hours of development work if the same functionality was written from scratch.

## Hooks

Currently, the collection of hooks consists of the following:

| Name  | Description |
| ------------- | ------------- |
| useBounds  | Subscribe to the bounds of a window changing  |
| useDocked  | Detects if the current window is docked |
| useDockWindow  | Dock a window to the edges of a screen  |
| useFocus | Listen to and affect focus of a window |
| useInterApplicationBusSend  | Auto-magically send properties on the InterApplicationBus whenever they change |
| useInterApplicationBusPublish  | Auto-magically publish properties on the InterApplicationBus whenever they change |
| useInterApplicationBusSubscribe | Subscribe to a topic on the InterApplicationBus |
| useMaximized  | Detects if the current window is maximized |
| useOptions | Listen to and update window options |
| useUserMovement | Listen to and update whether user movement is enabled / disabled for a window |
| useZoom | Listen to and update window zoom level |

## Demo

If you'd like a demo of the current collection of hooks, you can do so by:

* Cloning the repository (e.g. `git clone https://github.com/ScottLogic/openfin-react-hooks.git`)
* Checkout the repository in your command line of choice (e.g. `cd c:/dev/openfin-react-hooks`)
* Run `npm install` and `npm run build` within the root of the project directory
* Checkout the `demo` directory (e.g. `cd demo`)
* Run `npm install` and `npm run start` within the demo directory
* Once that's finished, execute `npm run launch` to see the demo application in all its glory

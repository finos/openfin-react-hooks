# Openfin React Hooks : useOpenFin()

A collection of [React Hooks](https://reactjs.org/docs/hooks-intro.html) built on top of the [Openfin API](https://developers.openfin.co/docs/javascript-api), brought to you by [Scott Logic](https://www.scottlogic.com/).

![screenshot](https://user-images.githubusercontent.com/3110057/69252989-cb849b80-0bab-11ea-9665-ca58657fb423.PNG)

## Installing the Demo

In order to install the Openfin React Hooks demo application, download the installer [here](https://install.openfin.co/download/?os=win&config=https%3A%2F%2Fstockflux.scottlogic.com%2Fartifacts%2Fopenfin-react-hooks%2Fapp.json&fileName=Openfin-react-hooks&unzipped=true) and run the executable. If you haven't already installed an OpenFin application, this will install the required runtime. It'll also add the shortcut to Openfin React Hooks Demo to your desktop and start menu.

The project is deployed and hosted by AWS, so with each time the application is ran the latest released version will be used. This means no further installations will be needed to keep the installed project up to date.

## Getting Started

1. `npm install --save openfin-react-hooks`
2. `import { useDockWindow } from "openfin-react-hooks";`
3. Enjoy!

## Motive

Wrapping up the OpenFin API in a higher level hooks abstraction allows developers to share common functionality across React-based OpenFin applications.

Even the simpler hooks bridge across various versions of the OpenFin API, providing a consistent interface around OpenFin regardless of what environment the application resides within.

More complex hooks (e.g. `useDockWindow`) provide functionality that could save hours of development work if the same functionality was written from scratch.

## Hooks

Currently, the collection of hooks consists of the following:

| Name                              | Description                                                                         |
| --------------------------------- | ----------------------------------------------------------------------------------- |
| `useBounds`                       | Subscribe to the bounds of a window changing                                        |
| `useChannels`                     | Use the Channels API to send/receive messages between windows or applications       |
| `useChildWindow`                  | Create and manage a single child window                                             |
| `useDocked`                       | Detects if the current window is docked                                             |
| `useDockWindow`                   | Dock a window to the edges of a screen                                              |
| `useFocus`                        | Listen to and affect focus of a window                                              |
| `useInterApplicationBusSend`      | Auto-magically send properties on the `InterApplicationBus` whenever they change    |
| `useInterApplicationBusPublish`   | Auto-magically publish properties on the `InterApplicationBus` whenever they change |
| `useInterApplicationBusSubscribe` | Subscribe to a topic on the `InterApplicationBus`                                   |
| `useMaximized`                    | Detects if the current window is maximized                                          |
| `useNotification`                 | Launch notification and manage it's content                                         |
| `useOptions`                      | Listen to and update window options                                                 |
| `useUserMovement`                 | Listen to and update whether user movement is enabled / disabled for a window       |
| `useZoom`                         | Listen to and update window zoom level                                              |

## Example

The following example demonstrates the usage of the `useInterApplicationBusSubscribe` and `useInterApplicationBusSend` hooks in order to subscribe to the OpenFin [InterApplicationBus](https://cdn.openfin.co/jsdocs/stable/fin.desktop.module_InterApplicationBus.html) and send a message:

```tsx
import {
    useInterApplicationBusSend,
    useInterApplicationBusSubscribe
} from "openfin-react-hooks";

const IDENTITY = window.fin.Window.me;
const TOPIC = "demo-topic";

const Component = () => {
    const [name, setName] = useState("John Smith");
    const { data } = useInterApplicationBusSubscribe(IDENTITY, TOPIC);
    useInterApplicationBusSend(IDENTITY, TOPIC, name);

    return (
        <div>
            <input onChange={e => setName(e.target.value)} value={name} type="text" />
            <strong>Received Message: { data ? data.message : "None" }</strong>
        </div>
    )
}
```

Usage examples for all of the hooks can be found in the interactive demo, as detailed below.

## Demo

If you'd like a demo of the current collection of hooks, you can do so by:

- Cloning the repository (e.g. `git clone https://github.com/ScottLogic/openfin-react-hooks.git`)
- Checkout the repository in your command line of choice (e.g. `cd c:/dev/openfin-react-hooks`)
- Run `npm install` and `npm run compile` within the root of the project directory
- Checkout the `demo` directory (e.g. `cd demo`)
- Run `npm install` and `npm run start` within the demo directory
- Once that's finished, execute `npm run launch` in a new console window to see the demo application in all its glory

## Testing Local Changes

If you are adding or editing any hooks, then they should be tested manually by exposing them through the demo app. The demo app
references a local version of the openfin-react-hooks library through the package.json file like this:

```javascript
  "dependencies": {
    // other dependencies
    "openfin-react-hooks": "file:../",
  }
```
NPM automatically creates a link between the two when `npm install` is run against the demo app. To update the version of 
openfin-react-hooks referenced by the demo app, simply run `npm run compile` from the openfin-react-hooks directory.

### Logging
To see console logs, go to http://localhost:9090/ in a browser, click on the demo, and go to the console.

## Contributing

Feel free to contribute to this project by opening issues or pull request:
 - Please open an issue if you experience a bug, or if you want to discuss new features and ideas. All feedback is gratefully received.
 - If you want to contribute code, please raise a pull request. If you unsure of the process, please look at the [GitHub Guides](https://guides.github.com/).

_NOTE:_ Commits and pull requests to FINOS repositories will only be accepted from those contributors with an active, executed Individual Contributor License Agreement (ICLA) with FINOS OR who are covered under an existing and active Corporate Contribution License Agreement (CCLA) executed with FINOS. Commits from individuals not covered under an ICLA or CCLA will be flagged and blocked by the FINOS Clabot tool. Please note that some CCLAs require individuals/employees to be explicitly named on the CCLA.

*Need an ICLA? Unsure if you are covered under an existing CCLA? Email [help@finos.org](mailto:help@finos.org)*


## License

Copyright 2019 Scott Logic

Distributed under the [Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0).

SPDX-License-Identifier: [Apache-2.0](https://spdx.org/licenses/Apache-2.0)

import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter as Router} from "react-router-dom";

import App from "./App";

import "prismjs/components/prism-jsx.min";
import "prismjs/themes/prism.css";
import "./index.css";

const mountApp = () => {
    ReactDOM.render(<Router><App/></Router>, document.getElementById("root"));
};

if ("fin" in window) {
    window.fin.desktop.main(mountApp);
} else {
    throw new Error("This application can only be run in an OpenFin container");
}

import {Fin} from "openfin/_v2/main";

declare global {
    // tslint:disable-next-line:interface-name
    export interface Window {
        fin: Fin;
    }
}

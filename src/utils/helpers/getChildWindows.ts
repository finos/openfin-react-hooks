import { _Window } from "openfin/_v2/api/window/window";

const getChildWindowsV1 = (): Promise<fin.OpenFinWindow[]> =>
    new Promise((resolve, reject) => {
        const application = fin.desktop.Application.getCurrent();
        application.getChildWindows(resolve, reject);
    });

const getChildWindowsV2 = (): Promise<_Window[]> =>
    new Promise((resolve, reject) => {
        fin.Application.getCurrent().then(async (application) => {
            const childWindows = await application.getChildWindows();
            resolve(childWindows);
        }).catch(reject);
    });

export default (version: OpenFinJavaScriptAPIVersion): Promise<fin.OpenFinWindow[] | _Window[]> =>
    version === OpenFinJavaScriptAPIVersion.ONE ?
        getChildWindowsV1() :
        getChildWindowsV2();

import { _Window } from "openfin/_v2/api/window/window";

const getNotificationWindowV1 = (name: string): Promise<any> =>
    new Promise((resolve, reject) => {
        const application = fin.desktop.Application.getCurrent();
        application.getChildWindows((childWindows) => {
            childWindows
                // A "queueCounter" window needs to be filtered out (it has the same name/uuid):
                .filter((win: any) => win.nativeWindow)
                .map((win: any) => {
                    if (win.uuid && win.uuid === name) {
                        resolve(win);
                    }
                });
        }, reject);
    });

const getNotificationWindowV2 = (name: string): Promise<_Window> =>
    new Promise((resolve, reject) => {
        fin.Application.getCurrent().then(async (application) => {
            const childWindows = await application.getChildWindows();
            childWindows.map((win) => {
                if (win.identity.name && win.identity.name === name) {
                    resolve(win);
                }
            });
            reject("No notification windows opened.");
        }).catch(reject);
    });

export default (version: OpenFinJavaScriptAPIVersion, name: string): Promise<fin.OpenFinWindow | _Window> =>
    version === OpenFinJavaScriptAPIVersion.ONE ?
        getNotificationWindowV1(name) :
        getNotificationWindowV2(name);

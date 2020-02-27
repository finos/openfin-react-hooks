import { _Window } from "openfin/_v2/api/window/window";
import { WindowOption } from "openfin/_v2/api/window/windowOption";

const getNotificationWindowV1 = (windowOptions: WindowOption): Promise<any> =>
    new Promise((resolve, reject) => {
        const application = fin.desktop.Application.getCurrent();
        application.getChildWindows((childWindows) => {
            childWindows
                // A "queueCounter" window needs to be filtered out (it has the same name/uuid):
                .filter((win: any) => win.nativeWindow)
                .map((win: any) => {
                    if (win.uuid && win.uuid === windowOptions.uuid) {
                        resolve(win);
                    }
                });
        }, reject);
    });

const getNotificationWindowV2 = (windowOptions: WindowOption): Promise<_Window> =>
    new Promise((resolve, reject) => {
        fin.Application.getCurrent().then(async (application) => {
            const childWindows = await application.getChildWindows();
            childWindows.map((win) => {
                if (win.identity.name && win.identity.name === windowOptions.name) {
                    resolve(win);
                }
            });
            reject("No notification windows opened.");
        }).catch(reject);
    });

export default (
    version: OpenFinJavaScriptAPIVersion,
    windowOptions: WindowOption,
): Promise<fin.OpenFinWindow | _Window> =>
    version === OpenFinJavaScriptAPIVersion.ONE ?
        getNotificationWindowV1(windowOptions) :
        getNotificationWindowV2(windowOptions);

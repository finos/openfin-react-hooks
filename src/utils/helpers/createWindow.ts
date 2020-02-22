import { _Window } from "openfin/_v2/api/window/window";
import { WindowOption } from "openfin/_v2/api/window/windowOption";

const createWindowV1 = (options: WindowOption): Promise<fin.OpenFinWindow> =>
    new Promise((resolve, reject) => {
        const newWindow = new fin.desktop.Window({ ...options, autoShow: true }, () => {
            resolve(newWindow);
        }, reject);
    });

const createWindowV2 = (options: WindowOption): Promise<_Window> => fin.Window.create(options);

export default (versionNum: number, options: WindowOption): Promise<fin.OpenFinWindow | _Window> =>
    versionNum === 1 ?
        createWindowV1(options) :
        createWindowV2(options);

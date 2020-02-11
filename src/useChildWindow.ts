import { _Window } from "openfin/_v2/api/window/window";
import { IUseChildWindowOptions } from "../index";
import useChildWindowV1 from "./useChildWindowV1";
import useChildWindowV2 from "./useChildWindowV2";

export default async (childWindowOptions: IUseChildWindowOptions) => {
    const fourPartVersion = await fin.System.getVersion();
    const allVersions = fourPartVersion.split(".");
    const jsFullVersion = allVersions[2];
    const jsShortVersion = parseInt(jsFullVersion, 10) < 39 ? 1 : 2;
    if (jsShortVersion === 1) {
        return useChildWindowV1(childWindowOptions);
    } else {
        return useChildWindowV2(childWindowOptions);
    }
};

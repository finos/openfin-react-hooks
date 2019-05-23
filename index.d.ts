import {Identity} from "openfin/_v2/identity";

export const useDocked: () => [boolean, () => Promise<void>];

export const useInterApplicationBusSubscribe: <T>(identity: Identity, topic: string) => {
    data: {
        message: T;
        name: string;
        uuid: string;
    };
    subscribeError: unknown;
    isSubscribed: boolean;
};

export const useMaximized: () => [boolean, (shouldMaximize: boolean) => Promise<void>];

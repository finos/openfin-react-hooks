import {useMemo} from "react";

export default <T>(topic: string) => {
    return useMemo(() => {
        const publishMessage = (message: T) => {
            const fin = window.fin;
            if (!fin || !fin.InterApplicationBus) {
                throw new Error(`fin is undefined. This hook can only be run in an OpenFin container.`);
            }

            return fin.InterApplicationBus.publish(topic, message);
        };

        return publishMessage;
    }, [topic]);
};

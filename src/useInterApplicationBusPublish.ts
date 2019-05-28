import {useEffect, useState} from "react";

export default <T>(topic: string, message: T) => {
    const [success, setSuccess] = useState<boolean | null>(null);
    const [error, setError] = useState<Error | null>(null);

    const onSuccess = () => setSuccess(true);
    const onFail = (e: Error) => {
        setError(e);
        setSuccess(false);
    };

    useEffect(() => {
        fin.InterApplicationBus.publish(topic, message)
            .then(onSuccess)
            .catch(onFail);
    }, [topic, message]);

    return {success, error};
};

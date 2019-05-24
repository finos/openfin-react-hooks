import {Identity} from "openfin/_v2/identity";
import {useEffect, useState} from "react";

export default <T>(destination: Identity, topic: string, message: T) => {
    const [success, setSuccess] = useState<boolean | null>(null);
    const [error, setError] = useState<Error | null>(null);

    const onSuccess = () => setSuccess(true);
    const onFail = (e: Error) => {
        setError(e);
        setSuccess(false);
    };

    useEffect(() => {
        fin.InterApplicationBus.send(destination, topic, message)
            .then(onSuccess)
            .catch(onFail);
    }, [destination, topic, message]);

    return {success, error};
};

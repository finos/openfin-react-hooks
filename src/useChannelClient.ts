import { ChannelClient } from "openfin/_v2/api/interappbus/channel/client";
import { useEffect, useState } from "react";

export default (channelName: string) => {
  const [client, setClient] = useState<ChannelClient | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const createClient = async () => {
      try {
        const channelClient = await fin.InterApplicationBus.Channel.connect(channelName);
        setClient(channelClient);
      } catch (e) {
        setError(e);
      }
    };
    createClient();
  }, []);

  return { client, error };
};

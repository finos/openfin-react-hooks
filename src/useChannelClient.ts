import { ChannelClient } from "openfin/_v2/api/interappbus/channel/client";
import { useEffect, useState } from "react";
import { ChannelAction } from "./types/ChannelAction";

export default (channelName: string, pushActions?: ChannelAction[]) => {
  const [client, setClient] = useState<ChannelClient | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const createClient = async () => {
      try {
        const channelClient = await fin.InterApplicationBus.Channel.connect(channelName);

        if (pushActions) {
          for (const channelAction of pushActions) {
            channelClient.register(channelAction.topic, channelAction.action);
          }
        }

        setClient(channelClient);
      } catch (e) {
        setError(e);
      }
    };
    createClient();
  }, []);

  return { client, error };
};

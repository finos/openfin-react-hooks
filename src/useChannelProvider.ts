import { ChannelProvider } from "openfin/_v2/api/interappbus/channel/provider";
import { useEffect, useState } from "react";
import { ChannelAction } from "..";

export default (channelName: string, channelActions: ChannelAction[]) => {
  const [provider, setProvider] = useState<ChannelProvider | null>(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const createChannel = async () => {
      try {
        const channelProvider = await fin.InterApplicationBus.Channel.create(channelName);

        for (const channelAction of channelActions) {
          channelProvider.register(channelAction.topic, channelAction.action);
        }

        setProvider(channelProvider);
      } catch (e) {
        setError(e);
      }
    };
    createChannel();
  }, []);

  return { provider, error };
};

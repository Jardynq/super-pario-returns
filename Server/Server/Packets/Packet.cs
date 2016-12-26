using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebSocketSharp.Server;

namespace Server.Packets
{
    public class Packet
    {
        [JsonIgnore]
        public string PacketType;

        public virtual void Handle (GameService session)
        {

        }

        public virtual void Send()
        {
            Program.Broadcast(PacketType, JsonConvert.SerializeObject(this));
        }

        public virtual void Send(Player receiver)
        {
            Program.Send(receiver.ID, PacketType, JsonConvert.SerializeObject(this));
        }
    }
}

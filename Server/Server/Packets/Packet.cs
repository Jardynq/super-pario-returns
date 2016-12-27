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
        public PACKET_TYPE PacketType;

        public virtual void Handle (GameService session)
        {

        }

        public virtual byte[] Serialize() {
            return new byte[0];
        }

        public virtual void Send()
        {
            byte[] data = this.Serialize();
            byte[] output = new byte[data.Length + 1];

            data.CopyTo(output, 1);
            output[0] = (byte)PacketType;

            Program.Broadcast(output);
        }

        public virtual void Send(Player receiver)
        {
            byte[] data = this.Serialize();
            byte[] output = new byte[data.Length + 1];

            data.CopyTo(output, 1);
            output[0] = (byte)PacketType;

            Program.Send(receiver.ID, output);
        }
    }

    public enum PACKET_TYPE : byte {
        MAP,
        JOIN,
        PLAYER_ACTION,
        ENTITY,
        PING
    }
}

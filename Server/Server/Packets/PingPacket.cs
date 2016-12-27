using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.Packets
{
    class PingPacket : Packet
    {
        public PingPacket () {
            PacketType = PACKET_TYPE.PING;
                new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            ).TotalMilliseconds;
        }

        public override byte[] Serialize()
        {
        }

        public static PingPacket Parse (System.IO.BinaryReader reader) {
            var packet = new PingPacket();
            return packet;
        }

        public override void Handle(GameService session)
        {
            double newTimeStamp = DateTime.UtcNow.ToUniversalTime().Subtract(
                new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            ).TotalMilliseconds;
            base.Handle(session);
        }
    }
}

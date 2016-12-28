using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.Packets
{
    class PingPacket : Packet
    {
        public double Timestamp;
        public PingPacket () {
            PacketType = PacketType.Ping;
            Timestamp = DateTime.UtcNow.ToUniversalTime().Subtract(
                new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            ).TotalMilliseconds;
        }

        public override byte[] Serialize()
        {
            return BitConverter.GetBytes(Timestamp);
        }

        public static PingPacket Parse (System.IO.BinaryReader reader) {
            var packet = new PingPacket();
            packet.Timestamp = reader.ReadDouble();
            return packet;
        }

        public override void Handle(GameService session)
        {
            double newTimeStamp = DateTime.UtcNow.ToUniversalTime().Subtract(
                new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            ).TotalMilliseconds;
            session.Room.Players[session.Id].Ping = (int)(newTimeStamp - Timestamp);
            base.Handle(session);
        }
    }
}

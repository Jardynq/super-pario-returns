using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;
using Server.Entities;

namespace Server.Packets
{
    public class JoinPacket : Packet
    {
        public Player Player;

        public int PlayerEntityID
        {
            get
            {
                return Player.entity.ID;
            }
        }

        public JoinPacket (Player player)
        {
            PacketType = PACKET_TYPE.JOIN;
            Player = player;
        }

        public override byte[] Serialize()
        {
            using (MemoryStream stream = new MemoryStream())
            using (BinaryWriter writer = new BinaryWriter(stream)) {
                writer.Write((float)Entity.GRAVITY);
                writer.Write((float)Entity.MAX_SPEED);
                writer.Write(Player.entity.Serialize());

                return stream.ToArray();
            }
        }
    }
}

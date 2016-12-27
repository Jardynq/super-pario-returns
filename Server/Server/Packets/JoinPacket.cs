using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;

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
            return Player.entity.Serialize();
        }
    }
}

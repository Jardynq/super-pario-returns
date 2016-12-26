using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.Packets
{
    public class JoinPacket : Packet
    {
        [JsonIgnore]
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
            PacketType = "join";
            Player = player;
        }
    }
}

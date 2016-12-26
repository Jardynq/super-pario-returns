using Server.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace Server.Packets
{
    public class EntityPacket : Packet
    {

        public Dictionary<int, Entity> Entities;

        public EntityPacket (GameRoom room)
        {
            Entities = room.Entities.ToDictionary(entry => entry.Key, entry => entry.Value);
            PacketType = "entity";
        }
    }
}

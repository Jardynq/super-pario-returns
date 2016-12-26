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

        private Dictionary<int, Entity> _entities;

        public EntityPacket (GameRoom room)
        {
            _entities = room.Entities;
            PacketType = "entity";
        }

        public override void Send()
        {
            var entitiesCloned = _entities.ToDictionary(entry => entry.Key, entry => entry.Value);
            Program.Broadcast(PacketType, JsonConvert.SerializeObject(entitiesCloned));
            base.Send();
        }

        public override void Send(Player receiver)
        {
            var entitiesCloned = _entities.ToDictionary(entry => entry.Key, entry => entry.Value);
            Program.Send(receiver.ID, PacketType, JsonConvert.SerializeObject(entitiesCloned));
            base.Send();
        }
    }
}

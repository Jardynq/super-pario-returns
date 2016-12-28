using Server.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.IO;

namespace Server.Packets
{
    public class EntityPacket : Packet
    {

        public Dictionary<ushort, Entity> Entities;
        public bool ContainsAllEntities;

        public EntityPacket (Dictionary<ushort, Entity> entities, bool containsAllEntities)
        {
            Entities = entities.ToDictionary(entry => entry.Key, entry => entry.Value);
            PacketType = PacketType.Entity;
            ContainsAllEntities = containsAllEntities;
        }

        public override byte[] Serialize()
        {
            using (MemoryStream stream = new MemoryStream())
            using (BinaryWriter writer = new BinaryWriter(stream)) {
                writer.Write((ushort)Entities.Count);
                writer.Write(ContainsAllEntities);
                foreach (ushort id in Entities.Keys) {
                    byte[] entityData = Entities[id].Serialize();
                    writer.Write((byte)entityData.Length);
                    writer.Write(entityData);
                }

                return stream.ToArray();
            }
        }
    }
}

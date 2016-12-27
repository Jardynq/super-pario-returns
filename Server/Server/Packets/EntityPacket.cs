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

        public EntityPacket (Dictionary<ushort, Entity> entities)
        {
            Entities = entities.ToDictionary(entry => entry.Key, entry => entry.Value);
            PacketType = PACKET_TYPE.ENTITY;
        }

        public override byte[] Serialize()
        {
            using (MemoryStream stream = new MemoryStream())
            using (BinaryWriter writer = new BinaryWriter(stream)) {
                // Write a timestamp
                double timestamp = DateTime.UtcNow.ToUniversalTime().Subtract(
                    new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                ).TotalMilliseconds;
                writer.Write(timestamp);

                writer.Write((ushort)Entities.Count);
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

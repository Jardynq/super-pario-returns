using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.Packets
{
    public class PlayerActionPacket : Packet
    {
        public int XSpeed;
        public int YSpeed;

        public PlayerActionPacket () {
            PacketType = PACKET_TYPE.PLAYER_ACTION;
        }

        public override void Handle(GameService session)
        {
            Player player = session.Room.Players[session.Id];

            // Move the player forward before resetting their speed
            player.entity.Room.Step();

            player.entity.XSpeed = XSpeed;
            player.entity.YSpeed = YSpeed;

            // Send an entity update packet containing only this entity
            var entities = new Dictionary<ushort, Entities.Entity>();
            entities[player.entity.ID] = player.entity;
            new EntityPacket(entities).Send();

            base.Handle(session);
        }

        public static PlayerActionPacket Parse (BinaryReader reader) {
            PlayerActionPacket packet = new PlayerActionPacket();
            packet.XSpeed = reader.ReadInt16();
            packet.YSpeed = reader.ReadInt16();

            return packet;
        }
    }
}

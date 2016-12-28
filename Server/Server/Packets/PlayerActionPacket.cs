using Server.Entities;
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
        public PlayerActionType Type;

        public PlayerActionPacket () {
            PacketType = PacketType.PlayerAction;
        }

        public override void Handle(GameService session)
        {
            Player player = session.Room.Players[session.Id];

            // Move the player forward before resetting their speed
            player.entity.Room.Step();

            if (Type == PlayerActionType.MoveLeft) {
                player.entity.XSpeed = -PlayerEntity.MOVE_SPEED;
            } else if (Type == PlayerActionType.MoveRight) {
                player.entity.XSpeed = PlayerEntity.MOVE_SPEED;
            } else if (Type == PlayerActionType.StopMove) {
                player.entity.XSpeed = 0;
            }

            if (Type == PlayerActionType.Jump) {
                player.entity.YSpeed = -PlayerEntity.JUMP_FORCE;
            }

            // Send an entity update packet containing only this entity
            var entities = new Dictionary<ushort, Entities.Entity>();
            entities[player.entity.ID] = player.entity;
            new EntityPacket(entities).Send();

            base.Handle(session);
        }

        public static PlayerActionPacket Parse (BinaryReader reader) {
            PlayerActionPacket packet = new PlayerActionPacket();
            packet.Type = (PlayerActionType)reader.ReadByte();

            return packet;
        }
    }

    public enum PlayerActionType : byte {
        MoveLeft,
        MoveRight,
        StopMove,
        Jump
    }
}

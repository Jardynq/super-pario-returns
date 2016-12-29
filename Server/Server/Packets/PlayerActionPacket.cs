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

            if (Type == PlayerActionType.MoveLeft) {
                player.Entity.XSpeed = -PlayerEntity.MOVE_SPEED;
            } else if (Type == PlayerActionType.MoveRight) {
                player.Entity.XSpeed = PlayerEntity.MOVE_SPEED;
            } else if (Type == PlayerActionType.StopMove) {
                player.Entity.XSpeed = 0;
            }

            if (Type == PlayerActionType.Jump) {
                player.Entity.YSpeed = -PlayerEntity.JUMP_FORCE;
            }

            // Send an entity update packet containing only this entity
            new EntityPacket(player.Entity).Send();

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

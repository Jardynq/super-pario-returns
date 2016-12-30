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

        public PlayerActionPacket() {
            PacketType = PacketType.PlayerAction;
        }

        public override void Handle(GameService session)
        {
            Player player = session.Room.Players[session.Id];

            //player.ReverseTo((long)(Program.Timer.ElapsedMilliseconds - player.Ping * 0.5));
            player.States.Add(new PlayerState(player));
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
            //player.SimulateFrom((long)(Program.Timer.ElapsedMilliseconds - player.Ping * 0.5));

            // Send an entity update packet containing only this entity
            new EntityPacket(player.Entity).Send();

            base.Handle(session);
        }

        public static PlayerActionPacket Parse(BinaryReader reader) {
            PlayerActionPacket packet = new PlayerActionPacket();
            packet.Type = (PlayerActionType)reader.ReadByte();

            return packet;
        }
    }

    public class PlayerState {
        public long Timestamp;
        public double XSpeed;
        public double YSpeed;
        public PlayerState (Player player) {
            Timestamp = Program.Timer.ElapsedMilliseconds;
            XSpeed = player.Entity.XSpeed;
            YSpeed = player.Entity.YSpeed;
        }
    }

    public enum PlayerActionType : byte {
        MoveLeft,
        MoveRight,
        StopMove,
        Jump
    }
}

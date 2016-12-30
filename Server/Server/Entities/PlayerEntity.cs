using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Drawing;
using System.IO;

namespace Server.Entities
{
    public class PlayerEntity : Entity
    {
        public const short MOVE_SPEED = 500;
        public const short JUMP_FORCE = 1000;

        public Player Player;

        public PlayerEntity (Player player, GameRoom room) : base(room)
        {
            Height = 60;
            Width = 30;
            HasGravity = true;
            Player = player;

            Teleport(300, 300);

            Type = EntityType.Player;
        }

        public override BinaryWriter WriteToBinary(BinaryWriter writer = null)
        {
            base.WriteToBinary(writer);
            writer.Write((ushort)Player.Ping);
            return writer;
        }
    }
}

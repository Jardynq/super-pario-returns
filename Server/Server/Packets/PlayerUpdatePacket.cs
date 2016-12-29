using Server.Entities;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.Packets
{
    public class PlayerUpdatePacket : Packet
    {
        public Player Player;

        public short X;
        public short Y;

        public PlayerUpdatePacket(Player player)
        {
            Player = player;
            X = (short)player.Entity.X;
            Y = (short)player.Entity.Y;
            PacketType = PacketType.PlayerUpdate;
        }

        public override byte[] Serialize()
        {
            return Player.Entity.Serialize();
        }

        public override void Send()
        {
            throw new Exception("A player update packet cannot be broadcasted");
        }

        public static PlayerUpdatePacket Parse(BinaryReader reader, GameService session) {
            PlayerUpdatePacket packet = new PlayerUpdatePacket(Program.Room.Players[session.Id]);
            packet.X = reader.ReadInt16();
            packet.Y = reader.ReadInt16();

            return packet;
        }

        public override void Handle(GameService session)
        {
            // TODO: Make a property for desync threshold
            int DesyncThreshold = 40;
            PlayerEntity p = Player.Entity;
            double posDif = (X - p.X) * (X - p.X) + (Y - p.Y) * (Y - p.Y);
            //double speedDif = (XSpeed - p.XSpeed) * (XSpeed - p.XSpeed) + (YSpeed - p.YSpeed) * (YSpeed - p.YSpeed);
            if (posDif > DesyncThreshold * DesyncThreshold)
            {
                Send(Player);
                Console.WriteLine("Desync " + Math.Sqrt(posDif));
            }
            else
            {
                // Don't allow the player to glitch himself through blocks
                p.X = X;
                p.HandleCollision(true);
                p.Y = Y;
                p.HandleCollision(false);
            }
        }
    }
}

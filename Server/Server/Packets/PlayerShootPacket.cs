using Server.Entities;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.Packets
{
    public class PlayerShootPacket : Packet
    {
        public float Angle = 0;

        public override void Handle(GameService session)
        {
            BulletEntity bullet = new BulletEntity(session.Room, Angle, session.Room.Players[session.Id]);
            bullet.Teleport(session.Room.Players[session.Id].Entity.X, session.Room.Players[session.Id].Entity.Y);
            new EntityPacket(bullet);

            base.Handle(session);
        }

        public static PlayerShootPacket Parse(BinaryReader reader)
        {
            PlayerShootPacket packet = new PlayerShootPacket();

            packet.Angle = reader.ReadSingle();

            return packet;
        }
    }
}

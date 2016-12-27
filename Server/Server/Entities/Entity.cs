using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Drawing;
using System.IO;

namespace Server.Entities
{
    public class Entity
    {
        public float X = 0;
        public float Y = 0;

        public int Width = 0;
        public int Height = 0;

        public float XSpeed = 0;
        public float YSpeed = 0;

        public ushort ID = 0;
        public ENTITY_TYPE Type;

        public GameRoom Room;

        public Entity (GameRoom room)
        {
            Room = room;
            Room.AddEntity(this);
        }

        public void Step (float timeScale)
        {
            X += XSpeed * timeScale;
            Y += YSpeed * timeScale;
        }

        public virtual byte[] Serialize (MemoryStream stream = null) {
            if (stream == null) {
                stream = new MemoryStream();
            }

            using (BinaryWriter writer = new BinaryWriter(stream))
            {
                writer.Write(ID);
                writer.Write((byte)Type);
                writer.Write((short)X);
                writer.Write((short)Y);
                writer.Write((short)XSpeed);
                writer.Write((short)YSpeed);
            }

            byte[] output = stream.ToArray();

            stream.Dispose();
            return output;
        }
    }

    public enum ENTITY_TYPE : byte
    {
        PLAYER
    }
}

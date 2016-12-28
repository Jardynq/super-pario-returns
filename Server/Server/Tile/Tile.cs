using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.Tile
{
    public class Tile
    {
        public bool HasCollision;
        public byte Type;

        public int X;
        public int Y;

        public Tile (byte type, int x, int y, bool hasCollision) {
            Type = type;
            X = x;
            Y = y;
            HasCollision = hasCollision;
        }
    }
}

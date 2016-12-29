using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Server.Tile;

namespace Server.Entities
{
    public class BulletEntity : Entity
    {
        public BulletEntity (GameRoom room, float angle) : base(room)
        {
            int bulletSpeed = 800;
            Width = 10;
            Height = 10;
            XSpeed = Math.Cos(Math.Max(Math.Min(angle, 1000), -1000)) * bulletSpeed;
            YSpeed = Math.Sin(Math.Max(Math.Min(angle, 1000), -1000)) * bulletSpeed;
            Type = EntityType.Bullet;
            HasGravity = true;
        }

        internal override void CollidedWithTile(Tile.Tile tile)
        {
            Dispose();
            base.CollidedWithTile(tile);
        }
    }
}

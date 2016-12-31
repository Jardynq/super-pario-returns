using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Server.Tile;
using Server.Packets;

namespace Server.Entities
{
    public class BulletEntity : Entity
    {
        Player Owner;
        public BulletEntity (GameRoom room, float angle, Player owner) : base(room)
        {
            int bulletSpeed = 800;
            Width = 5;
            Height = 5;
            XSpeed = Math.Cos(Math.Max(Math.Min(angle, 1000), -1000)) * bulletSpeed;
            YSpeed = Math.Sin(Math.Max(Math.Min(angle, 1000), -1000)) * bulletSpeed;
            Type = EntityType.Bullet;
            Owner = owner;
        }

        internal override void CollidedWithTile(Tile.Tile tile)
        {
            Dispose();
            base.CollidedWithTile(tile);
        }

        public override void Step(float timeScale)
        {
            if (X < 0 || X > Room.TileMap.Tiles.GetLength(0) * TileMap.TILE_SIZE
              || Y < 0 ||Y > Room.TileMap.Tiles.GetLength(1) * TileMap.TILE_SIZE) {
                Dispose();
            }
            base.Step(timeScale);

            // TODO: Implement proper raycasting collision detection
            foreach (var player in Room.Players.Values) {
                if (player.ID == Owner.ID) {
                    continue;
                }

                if (X + Width > player.Entity.X - player.Entity.Width * 0.5
                  && X - Width < player.Entity.X + player.Entity.Width * 0.5
                  && Y + Height > player.Entity.Y - player.Entity.Height * 0.5
                  && Y - Height < player.Entity.Y + player.Entity.Height * 0.5) {
                    Dispose();
                    player.Entity.Teleport(200, 200);
                    new EntityPacket(player.Entity).Send();
                }
            }
        }

        public override BinaryWriter WriteToBinary(BinaryWriter writer)
        {
            base.WriteToBinary(writer);
            writer.Write((ushort)Owner.Entity.ID);
            return writer;
        }
    }
}

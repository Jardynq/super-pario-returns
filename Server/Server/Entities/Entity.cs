using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Drawing;
using System.IO;

namespace Server.Entities
{
    public class Entity : IDisposable
    {
        public const float GRAVITY = 2000;
        public const float MAX_SPEED = 3000;

        private double _x = 0;
        public double X {
            get { return _x; }
            set {
                UpdatePosition(true, value);
            }
        }

        private double _y = 0;
        public double Y {
            get { return _y; }
            set {
                UpdatePosition(false, value);
            }
        }

        public int Width = 0;
        public int Height = 0;

        public double XSpeed = 0;
        public double YSpeed = 0;

        public ushort ID = 0;
        public EntityType Type;

        public bool HasGravity = false;

        public GameRoom Room;

        public Entity (GameRoom room)
        {
            Room = room;
            Room.AddEntity(this);
        }

        public virtual void Step (float timeScale)
        {
            if (HasGravity) {
                YSpeed = Math.Min(YSpeed + GRAVITY * timeScale, MAX_SPEED);
            }

            X += XSpeed * timeScale;
            Y += YSpeed * timeScale;
        }

        private void UpdatePosition(bool isXPosition, double newValue)
        {
            // Move in increments of tilesize to prevent moving through blocks
            double oldValue = isXPosition ? _x : _y;
            // Can be 1 for positive or -1 for negative direction
            int direction = newValue - oldValue > 0 ? 1 : -1;
            while (oldValue * direction < newValue * direction)
            {
                oldValue += TileMap.TILE_SIZE * direction;
                if (oldValue * direction > newValue * direction) oldValue = newValue;
                if (isXPosition) {
                    _x = oldValue;
                } else {
                    _y = oldValue;
                }

                List<Tile.Tile> collisionTiles = new List<Tile.Tile>();

                collisionTiles.Add(Room.TileMap.GetTile((float)(X - Width * 0.5 + 0.3), (float)(Y - Height * 0.5 + 0.3)));
                collisionTiles.Add(Room.TileMap.GetTile((float)(X + Width * 0.5 - 0.3), (float)(Y - Height * 0.5 + 0.3)));
                collisionTiles.Add(Room.TileMap.GetTile((float)(X - Width * 0.5 + 0.3), (float)(Y + Height * 0.5 - 0.3)));
                collisionTiles.Add(Room.TileMap.GetTile((float)(X + Width * 0.5 - 0.3), (float)(Y + Height * 0.5 - 0.3)));
                collisionTiles.Add(Room.TileMap.GetTile((float)(X - Width * 0.5 + 0.3), (float)(Y)));
                collisionTiles.Add(Room.TileMap.GetTile((float)(X + Width * 0.5 - 0.3), (float)(Y)));

                foreach (Tile.Tile tile in collisionTiles)
                {
                    if (tile != null && tile.HasCollision)
                    {
                        if (isXPosition)
                        {
                            if (direction > 0)
                            {
                                _x = newValue = tile.X * TileMap.TILE_SIZE - Width * 0.5;
                            }
                            else if (direction < 0)
                            {
                                _x = newValue = tile.X * TileMap.TILE_SIZE + TileMap.TILE_SIZE + Width * 0.5;
                            }
                            XSpeed = 0;
                            CollidedWithTile(tile);
                        }
                        else
                        {
                            if (direction > 0)
                            {
                                _y = newValue = tile.Y * TileMap.TILE_SIZE - Height * 0.5;
                            }
                            else if (direction < 0)
                            {
                                _y = newValue = tile.Y * TileMap.TILE_SIZE + TileMap.TILE_SIZE + Height * 0.5;
                            }
                            YSpeed = 0;
                            CollidedWithTile(tile);
                        }
                    }
                }
            }
        }

        public virtual BinaryWriter WriteToBinary (BinaryWriter writer) {
            writer.Write(ID);
            writer.Write((byte)Type);
            writer.Write((short)X);
            writer.Write((short)Y);
            writer.Write((float)XSpeed);
            writer.Write((float)YSpeed);
            
            return writer;
        }

        public byte[] Serialize () {
            using (MemoryStream stream = new MemoryStream())
            using (BinaryWriter writer = new BinaryWriter(stream)) {
                WriteToBinary(writer);
                return stream.ToArray();
            }
        }

        /// <summary>
        /// Moves to the specified point without checking collision along the way
        /// </summary>
        public void Teleport (double newX, double newY) {
            _x = newX;
            _y = newY;
        }

        public virtual void Dispose () {
            Room.RemoveEntity(this);
        }

        internal virtual void CollidedWithTile (Tile.Tile tile)
        {

        }
    }

    public enum EntityType : byte
    {
        Player,
        Bullet
    }
}

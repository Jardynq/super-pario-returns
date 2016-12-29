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

        public void Step (float timeScale)
        {
            if (HasGravity) {
                YSpeed = Math.Min(YSpeed + GRAVITY * timeScale, MAX_SPEED);
            }

            X += XSpeed * timeScale;
            Y += YSpeed * timeScale;
        }

        public void UpdatePosition (bool isXPosition, double newValue) {
            double difference = isXPosition ? newValue - X : newValue - Y;
            if (isXPosition) {
                _x = newValue;
            } else {
                _y = newValue;
            }

            List<Tile.Tile> collisionTiles = new List<Tile.Tile>();

            collisionTiles.Add(Room.TileMap.GetTile((float)(X - Width * 0.5 + 0.3), (float)(Y - Height * 0.5 + 0.3)));
            collisionTiles.Add(Room.TileMap.GetTile((float)(X + Width * 0.5 - 0.3), (float)(Y - Height * 0.5 + 0.3)));
            collisionTiles.Add(Room.TileMap.GetTile((float)(X - Width * 0.5 + 0.3), (float)(Y + Height * 0.5 - 0.3)));
            collisionTiles.Add(Room.TileMap.GetTile((float)(X + Width * 0.5 - 0.3), (float)(Y + Height * 0.5 - 0.3)));
            collisionTiles.Add(Room.TileMap.GetTile((float)(X - Width * 0.5 + 0.3), (float)(Y)));
            collisionTiles.Add(Room.TileMap.GetTile((float)(X + Width * 0.5 - 0.3), (float)(Y)));

            foreach (Tile.Tile tile in collisionTiles) {
                if (tile != null && tile.HasCollision) {
                    if (isXPosition) {
                        if (difference > 0) {
                            _x = tile.X * TileMap.TILE_SIZE - Width * 0.5;
                        } else if (difference < 0) {
                            _x = tile.X * TileMap.TILE_SIZE + TileMap.TILE_SIZE + Width * 0.5 ;
                        }
                        XSpeed = 0;
                    } else {
                        if (difference > 0)
                        {
                            _y = tile.Y * TileMap.TILE_SIZE - Height * 0.5;
                        }
                        else if (difference < 0)
                        {
                            _y = tile.Y * TileMap.TILE_SIZE + TileMap.TILE_SIZE + Height * 0.5;
                        }
                        YSpeed = 0;
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
            
        }
    }

    public enum EntityType : byte
    {
        Player
    }
}

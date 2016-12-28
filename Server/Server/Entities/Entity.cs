﻿using System;
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
        const float GRAVITY = 60;
        const float MAX_SPEED = 3000;

        public double X = 0;
        public double Y = 0;

        public int Width = 0;
        public int Height = 0;

        public double XSpeed = 0;
        public double YSpeed = 0;

        public ushort ID = 0;
        public ENTITY_TYPE Type;

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
            HandleCollision(true);
            Y += YSpeed * timeScale;
            HandleCollision(false);
        }

        private void HandleCollision (bool x) {
            double speed = x ? XSpeed : YSpeed;

            List<Tile.Tile> collisionTiles = new List<Tile.Tile>();

            collisionTiles.Add(Room.TileMap.GetTile((float)(X - Width * 0.5), (float)(Y - Height * 0.5)));
            collisionTiles.Add(Room.TileMap.GetTile((float)(X + Width * 0.5), (float)(Y - Height * 0.5)));
            collisionTiles.Add(Room.TileMap.GetTile((float)(X - Width * 0.5), (float)(Y + Height * 0.5)));
            collisionTiles.Add(Room.TileMap.GetTile((float)(X + Width * 0.5), (float)(Y + Height * 0.5)));

            foreach (Tile.Tile tile in collisionTiles) {
                if (tile != null && tile.HasCollision) {
                    if (x) {
                        if (speed > 0) {
                            X = tile.X * TileMap.TILE_SIZE - Width * 0.5 - 1;
                        } else if (speed < 0) {
                            X = tile.X * TileMap.TILE_SIZE + TileMap.TILE_SIZE + Width * 0.5 + 1;
                        }
                        XSpeed = 0;
                    } else {
                        if (speed > 0)
                        {
                            Y = tile.Y * TileMap.TILE_SIZE - Height * 0.5 - 1;
                        }
                        else if (speed < 0)
                        {
                            Y = tile.Y * TileMap.TILE_SIZE + TileMap.TILE_SIZE + Height * 0.5 + 1;
                        }
                        YSpeed = 0;
                    }
                }   
            }
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
                writer.Write((float)XSpeed);
                writer.Write((float)YSpeed);
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

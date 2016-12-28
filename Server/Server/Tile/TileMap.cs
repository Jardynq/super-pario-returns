using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server
{
    public class TileMap
    {
        public const int TILE_SIZE = 50;

        public Tile.Tile[,] Tiles;

        public void LoadMap (string path)
        {
            List<List<byte>> tileIndices = new List<List<byte>>();
            using (var reader = new StreamReader(path))
            {
                while (!reader.EndOfStream)
                {
                    string line = reader.ReadLine();
                    string[] lineData = line.Split(',');
                    List<byte> row = new List<byte>();
                    tileIndices.Add(row);

                    for (var i = 0; i < lineData.Length; i++)
                    {
                        row.Add(byte.Parse(lineData[i]));
                    }
                }
            }

            this.Tiles = new Tile.Tile[tileIndices[0].Count, tileIndices.Count];

            for (int y = 0; y < tileIndices.Count; y++)
            {
                for (int x = 0; x < tileIndices[y].Count; x++)
                {
                    var tileType = tileIndices[y][x];
                    var tile = new Tile.Tile(tileType, x, y, tileType == 1);
                    this.Tiles[x, y] = tile;
                }
            }
        }

        public Tile.Tile GetTile (float x, float y) {
            int tileX = (int)Math.Floor(x / TILE_SIZE);
            int tileY = (int)Math.Floor(y / TILE_SIZE);

            if (tileX < 0 || tileX >= Tiles.GetLength(0)) {
                return null;
            }
            if (tileY < 0 || tileY >= Tiles.GetLength(1))
            {
                return null;
            }

            return Tiles[tileX, tileY];
        }
    }
}

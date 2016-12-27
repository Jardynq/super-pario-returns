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
        public byte[,] Tiles;

        public void LoadMap (string path)
        {
            List<List<int>> tileIndices = new List<List<int>>();
            using (var reader = new StreamReader(path))
            {
                while (!reader.EndOfStream)
                {
                    string line = reader.ReadLine();
                    string[] lineData = line.Split(',');
                    List<int> row = new List<int>();
                    tileIndices.Add(row);

                    for (var i = 0; i < lineData.Length; i++)
                    {
                        row.Add(int.Parse(lineData[i]));
                    }
                }
            }

            this.Tiles = new byte[tileIndices[0].Count, tileIndices.Count];

            for (int y = 0; y < tileIndices.Count; y++)
            {
                for (int x = 0; x < tileIndices[y].Count; x++)
                {
                    var tile = tileIndices[y][x];
                    this.Tiles[x, y] = (byte)tile;
                }
            }
        }
    }
}

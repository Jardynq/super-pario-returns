using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebSocketSharp.Server;

namespace Server.Packets
{
    public class MapPacket : Packet
    {
        public TileMap Map;

        public MapPacket (TileMap map) {
            PacketType = PacketType.Map;
            Map = map;
        }

        public override byte[] Serialize()
        {
            var output = new byte[Map.Tiles.GetLength(0) * Map.Tiles.GetLength(1) + 2];
            byte[] widthBytes = BitConverter.GetBytes((ushort) Map.Tiles.GetLength(0));
            output[0] = widthBytes[0];
            output[1] = widthBytes[1];

            for (int y = 0; y < Map.Tiles.GetLength(1); y++)
            {
                for (int x = 0; x < Map.Tiles.GetLength(0); x++)
                {
                    byte tile = Map.Tiles[x, y].Type;
                    output[y * Map.Tiles.GetLength(0) + x + 2] = tile;
                }
            }

            return output;
        }
    }
}

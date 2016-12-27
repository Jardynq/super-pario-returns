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
        [JsonIgnore]
        public TileMap Map;

        public MapPacket (TileMap map) {
            PacketType = "map";
            Map = map;
        }

        private string GenerateMapString () {
            string response = "";

            for (int y = 0; y < Map.Tiles.GetLength(1); y++)
            {
                for (int x = 0; x < Map.Tiles.GetLength(0); x++)
                {
                    int tile = Map.Tiles[x, y];

                    response += tile + ",";
                }
                response = response.Substring(0, response.Length - 1) + "|";
            }
            response = response.Substring(0, response.Length - 1);

            return response;
        }

        public override void Send()
        {
            Program.Broadcast(PacketType, GenerateMapString());
        }

        public override void Send(Player receiver)
        {
            Program.Send(receiver.ID, PacketType, GenerateMapString());
        }
    }
}

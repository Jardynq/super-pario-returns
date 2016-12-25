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
        public override void Handle (GameService session)
        {
            string response = "";
            TileMap map = Program.Room.TileMap;

            for (int y = 0; y < map.Tiles.GetLength(1); y++)
            {
                for (int x = 0; x < map.Tiles.GetLength(0); x++)
                {
                    int tile = map.Tiles[x, y];

                    response += tile + ",";
                }
                response = response.Substring(0, response.Length - 1) + ",|,";
            }
            response = response.Substring(0, response.Length - 3);

            session.SendPacket("map", response);

            base.Handle(session);
        }
    }
}

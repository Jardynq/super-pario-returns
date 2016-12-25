using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server
{
    class GameRoom
    {
        public Dictionary<string, Player> Players = new Dictionary<string, Player>();
        public TileMap TileMap;

        public GameRoom (TileMap map)
        {
            TileMap = map;
        }

        public void AddPlayer (string id)
        {
            Player player = new Player(id);
            Players[id] = player;
        }

        public void RemovePlayer(string id)
        {
            Players.Remove(id);
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Server.Entities;

namespace Server
{
    public class Player
    {
        public readonly string ID;
        public PlayerEntity entity;
        public int Ping = 0;

        public Player (string id, GameRoom room)
        {
            ID = id;
            entity = new PlayerEntity(this, room);
        }
    }
}

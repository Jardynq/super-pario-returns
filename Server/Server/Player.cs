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
        public PlayerEntity Entity;
        public int Ping = 0;
        public GameRoom Room;

        public Player (string id, GameRoom room)
        {
            Room = room;
            ID = id;
            Entity = new PlayerEntity(this, room);
        }

        public void Remove () {
            Room.Players.Remove(ID);
            Room.RemoveEntity(Entity);
        } 
    }
}

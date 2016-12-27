using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Server.Entities;
using Server.Packets;
using System.Threading;

namespace Server
{
    public class GameRoom
    {
        public Dictionary<string, Player> Players = new Dictionary<string, Player>();
        public TileMap TileMap;

        public Dictionary<int, Entity> Entities = new Dictionary<int, Entity>();
        private int _lastEntityID = 0;

        // Related to main loop
        private int _lastTickCount = 0;

        public GameRoom (TileMap map)
        {
            TileMap = map;
            new Thread(new ThreadStart(Step)).Start();
        }

        public void AddPlayer (string id)
        {
            Player player = new Player(id, this);
            Players[id] = player;

            new MapPacket(TileMap).Send(player);
            new EntityPacket(this).Send(player);
            new JoinPacket(player).Send(player);
        }

        public void RemovePlayer(string id)
        {
            Players.Remove(id);
        }

        public void AddEntity (Entity entity)
        {
            _lastEntityID++;
            entity.ID = _lastEntityID;
            Entities[entity.ID] = entity;
        }

        public void Step ()
        {
            _lastTickCount = Environment.TickCount;
            while (true)
            {
                int tickCount = Environment.TickCount;
                int targetFrameLength = (int)(1000f / Program.TARGET_FRAMERATE);
                int elapsedMilliseconds = tickCount - _lastTickCount;

                if (elapsedMilliseconds < targetFrameLength)
                {
                    Thread.Sleep(targetFrameLength - elapsedMilliseconds);
                    elapsedMilliseconds = Environment.TickCount - _lastTickCount;
                }
                _lastTickCount = Environment.TickCount;
                float timeScale = elapsedMilliseconds / 1000f;

                // Frame loop
                foreach (int id in Entities.Keys.ToList<int>())
                {
                    Entities[id].Step(timeScale);
                }
                new EntityPacket(this).Send();
            }
        }
    }
}

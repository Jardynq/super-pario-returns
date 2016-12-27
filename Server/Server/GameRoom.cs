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

        public Dictionary<ushort, Entity> Entities = new Dictionary<ushort, Entity>();
        private ushort _lastEntityID = 0;

        // Related to frame loop
        private int _framesPassed = 0;
        private int _lastTickCount = 0;

        public GameRoom (TileMap map)
        {
            TileMap = map;
            new Thread(new ThreadStart(FrameLoop)).Start();
        }

        public void AddPlayer (string id)
        {
            Player player = new Player(id, this);
            Players[id] = player;

            new MapPacket(TileMap).Send(player);
            new EntityPacket(Entities).Send(player);
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

        private void FrameLoop()
        {
            while (true)
            {
                int tickCount = Environment.TickCount;
                int targetFrameLength = (int)(1000f / Program.TARGET_FRAMERATE);
                int elapsedMilliseconds = tickCount - _lastTickCount;

                if (elapsedMilliseconds < targetFrameLength)
                {
                    Thread.Sleep(targetFrameLength - elapsedMilliseconds);   
                }
                Step();
            }
        }

        public void Step ()
        {
            int elapsedMilliseconds = Environment.TickCount - _lastTickCount;
            _lastTickCount = Environment.TickCount;

            float timeScale = elapsedMilliseconds / 1000f;

            // Frame loop
            foreach (ushort id in Entities.Keys.ToList<ushort>())
            {
                Entities[id].Step(timeScale);
            }

            if (++_framesPassed > Program.TARGET_FRAMERATE / Program.TARGET_UPDATE_RATE) {
                new EntityPacket(Entities).Send();
                _framesPassed = 0;
            }
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Server.Entities;
using Server.Packets;
using System.Threading;
using System.Collections.Concurrent;

namespace Server
{
    public class GameRoom
    {
        public ConcurrentDictionary<string, Player> Players = new ConcurrentDictionary<string, Player>();
        public TileMap TileMap;

        public ConcurrentDictionary<ushort, Entity> Entities = new ConcurrentDictionary<ushort, Entity>();
        private ushort _lastEntityID = 0;

        // Related to frame loop
        private long _lastUpdate = 0;
        private long _lastPing = 0;
        private long _lastTickCount = 0;
        // Number of frames per second in the simulation
        public const int TARGET_FRAMERATE = 60;
        // Number of entity update packets per second
        public const int TARGET_UPDATE_RATE = 5;
        public const int TARGET_PING_RATE = 1;

        public GameRoom (TileMap map)
        {
            TileMap = map;
            Thread loop = new Thread(new ThreadStart(FrameLoop));
            loop.Priority = ThreadPriority.Highest;
            loop.Start();
        }

        public void AddPlayer (string id)
        {
            Player player = new Player(id, this);
            Players[id] = player;

            new MapPacket(TileMap).Send(player);
            new EntityPacket(Entities, true).Send(player);
            new JoinPacket(player).Send(player);
        }

        public void RemovePlayer(string id)
        {
            Players[id].Remove();
        }

        public void AddEntity (Entity entity)
        {
            _lastEntityID++;
            entity.ID = _lastEntityID;
            Entities[entity.ID] = entity;
        }

        public void RemoveEntity (Entity entity) {
            Entity ent;
            Entities.TryRemove(entity.ID, out ent);
            new EntityPacket(Entities, true);
        }

        private void FrameLoop()
        {
            while (true)
            {
                long tickCount = Program.Timer.ElapsedMilliseconds;
                int targetFrameLength = (int)(1000f / TARGET_FRAMERATE);
                int elapsedMilliseconds = (int)(tickCount - _lastTickCount);

                if (elapsedMilliseconds < targetFrameLength)
                {
                    Thread.Sleep(targetFrameLength - elapsedMilliseconds);   
                }
                Step();
            }
        }

        public void Step ()
        {
            int elapsedMilliseconds = (int)(Program.Timer.ElapsedMilliseconds - _lastTickCount);
            _lastTickCount = Program.Timer.ElapsedMilliseconds;
            int framerate = (int)(1000f / elapsedMilliseconds);
            if (framerate > 0 && framerate < TARGET_FRAMERATE - 5) {
                Console.WriteLine("FRAMERATE DROP: {0} FPS", framerate);
            }

            float timeScale = elapsedMilliseconds / 1000f;

            // Frame loop
            foreach (ushort id in Entities.Keys.ToList<ushort>())
            {
                Entities[id].Step(timeScale);
            }

            if (Program.Timer.ElapsedMilliseconds - _lastUpdate > 1000f / TARGET_UPDATE_RATE) {
                new EntityPacket(Entities, true).Send();
                _lastUpdate = Program.Timer.ElapsedMilliseconds;
            }
            if (Program.Timer.ElapsedMilliseconds - _lastPing > 1000f / TARGET_PING_RATE)
            {
                new PingPacket().Send();
                _lastPing = Program.Timer.ElapsedMilliseconds;
            }
        }
    }
}

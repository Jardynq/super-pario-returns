using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebSocketSharp;
using WebSocketSharp.Server;
using Newtonsoft.Json;
using Server.Packets;
using System.Reflection;
using System.Diagnostics;
using System.Net;
using System.Threading;

namespace Server
{
    class Program
    {
        public static GameRoom Room;
        public static Random rnd = new Random();
        private static WebSocketServer server;

        public static Stopwatch Timer = new Stopwatch();

        static void Main(string[] args)
        {
            // Load the map
            var map = new TileMap();
            map.LoadMap(System.IO.Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location) + "/../../../../Map.txt");
            Room = new GameRoom(map);
            Timer.Start();

            server = new WebSocketServer(IPAddress.Any, 1337);
            server.AddWebSocketService<GameService>("/");
            server.Start();
            while (true) {
                Console.ReadKey(true);
                foreach (var player in Room.Players.Values)
                {
                    long time = Timer.ElapsedMilliseconds;
                    for (var i = 0; i < 1000; i += 200) {
                        player.ReverseTo((long)(time - i));
                        new PlayerUpdatePacket(player).Send(player);
                        Console.WriteLine("Reversing");
                        Thread.Sleep(200);
                    }
                    Console.WriteLine("Reversed");
                }
            }
            Console.ReadLine();
            server.Stop();
            Console.WriteLine("SERVER STOPPED");
        }

        public static void Send(string id, byte[] data)
        {
            if (server.WebSocketServices.Paths.Contains("/")
             && server.WebSocketServices["/"].Sessions.Ds.Contains(id)
             && server.WebSocketServices["/"].Sessions != null)
            {
                server.WebSocketServices["/"].Sessions[id].Context.WebSocket.Send(data);
            }
        }
        public static void Broadcast(byte[] data)
        {
            if (server.WebSocketServices.Paths.Contains("/")
             && server.WebSocketServices["/"].Sessions != null)
            {
                server.WebSocketServices["/"].Sessions.Broadcast(data);
            }
        }
    }

    public class GameService : WebSocketBehavior
    {
        public GameRoom Room;
        public GameService ()
        {
            Room = Program.Room;
        }

        protected override Task OnMessage(MessageEventArgs e)
        {
            using (System.IO.MemoryStream memStream = new System.IO.MemoryStream())
            using (System.IO.BinaryReader reader = new System.IO.BinaryReader(memStream))
            {
                e.Data.CopyTo(memStream);
                memStream.Position = 0;

                PacketType packetType = (PacketType)reader.ReadByte();
                Packet packet;

                switch (packetType)
                {
                    case PacketType.PlayerAction:
                        packet = PlayerActionPacket.Parse(reader);
                        break;
                    case PacketType.Ping:
                        packet = PingPacket.Parse(reader);
                        break;
                    case PacketType.PlayerUpdate:
                        packet = PlayerUpdatePacket.Parse(reader, this);
                        break;
                    case PacketType.PlayerShoot:
                        packet = PlayerShootPacket.Parse(reader);
                        break;
                    default:
                        return base.OnMessage(e); // Packet not recognized. Ignore it.
                }

                packet.PacketType = packetType;
                packet.Handle(this);

                return base.OnMessage(e);
            }
        }

        protected override Task OnOpen()
        {
            // Opret en ny player
            Program.Room.AddPlayer(Id);

            return base.OnOpen();
        }

        protected override Task OnError(ErrorEventArgs e)
        {
            return base.OnError(e);
        }

        protected override Task OnClose(CloseEventArgs e)
        {
            Program.Room.RemovePlayer(Id);

            return base.OnClose(e);
        }
    }
}

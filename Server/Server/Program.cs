using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebSocketSharp;
using WebSocketSharp.Server;
using Newtonsoft.Json;
using Server.Packets;

namespace Server
{
    class Program
    {
        public static GameRoom Room;
        public static Random rnd = new Random();
        private static WebSocketServer server;

        public const int TARGET_FRAMERATE = 60;

        static void Main(string[] args)
        {
            // Load the map
            var map = new TileMap();
            map.LoadMap(@"C:\Users\svorr\Documents\GitHub\super-pario-returns\Map.txt");
            Room = new GameRoom(map);

            server = new WebSocketServer();
            server.AddWebSocketService<GameService>("/");
            server.Start();
            Console.ReadKey(true);
            server.Stop();
        }

        public static void Send(string id, string type, string data)
        {
            server.WebSocketServices["/"].Sessions[id].Context.WebSocket.Send(type + new String(' ', 10 - type.Length) + data);
        }
        public static void Broadcast(string type, string data)
        {
            server.WebSocketServices["/"].Sessions.Broadcast(type + new String(' ', 10 - type.Length) + data);
        }
    }

    public class GameService : WebSocketBehavior
    {
        protected override Task OnMessage(MessageEventArgs e)
        {
            string request = e.Text.ReadToEnd();
            string packetType = request.Substring(0, 10).Trim();
            Packet packet;

            switch (packetType) {
                case "map":
                    packet = (Packet)JsonConvert.DeserializeObject<MapPacket>(request.Substring(10));
                    break;
                default:
                    return base.OnMessage(e); // Packet not recognized. Ignore it.
            }

            packet.PacketType = packetType;
            packet.Handle(this);

            return base.OnMessage(e);
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

        public void SendPacket (string type, string data)
        {
            Send(type + new String(' ', 10 - type.Length) + data);
        }
    }
}

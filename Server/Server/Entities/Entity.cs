using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Drawing;
using Newtonsoft.Json;

namespace Server.Entities
{
    public class Entity
    {
        public float X = 0;
        public float Y = 0;

        public int Width = 0;
        public int Height = 0;

        public float XSpeed = 0;
        public float YSpeed = 0;

        public int ID = 0;

        [JsonIgnore]
        public GameRoom Room;

        [JsonIgnore]
        public Color Color = Color.AliceBlue;
        public string Hex
        {
            get
            {
                return "#" + Color.R.ToString("X2") + Color.G.ToString("X2") + Color.B.ToString("X2");
            }
        }

        public Entity (GameRoom room)
        {
            Room = room;
            Room.AddEntity(this);
        }

        public void Step (float timeScale)
        {
            X += XSpeed * timeScale;
            Y += YSpeed * timeScale;
        }
    }
}

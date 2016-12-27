using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Drawing;

namespace Server.Entities
{
    public class PlayerEntity : Entity
    {
        public PlayerEntity (GameRoom room) : base(room)
        {
            Height = 60;
            Width = 30;

            X = Program.rnd.Next(500);
            Y = Program.rnd.Next(500);

            Type = ENTITY_TYPE.PLAYER;
        }
    }
}

using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.Packets
{
    public class PlayerActionPacket : Packet
    {
        [JsonProperty("xSpeed")]
        public int XSpeed;
        [JsonProperty("ySpeed")]
        public int YSpeed;

        public override void Handle(GameService session)
        {
            Player player = session.Room.Players[session.Id];

            player.entity.XSpeed = XSpeed;
            player.entity.YSpeed = YSpeed;

            base.Handle(session);
        }
    }
}

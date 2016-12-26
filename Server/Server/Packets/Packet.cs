using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebSocketSharp.Server;

namespace Server.Packets
{
    public class Packet
    {
        public string PacketType;
        
        public virtual void Handle (GameService session)
        {

        }

        public virtual void Send ()
        {

        }

        public virtual void Send (Player receiver)
        {
            
        }
    }
}

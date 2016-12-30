using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Server.Entities;
using System.Threading;
using Server.Packets;

namespace Server
{
    public class Player
    {
        public readonly string ID;
        public PlayerEntity Entity;
        public int Ping = 0;
        public GameRoom Room;

        public List<PlayerState> States = new List<PlayerState>();

        public Player (string id, GameRoom room)
        {
            Room = room;
            ID = id;
            Entity = new PlayerEntity(this, room);
            States.Add(new PlayerState(this));
        }

        public void Remove () {
            Player player;
            Room.Players.TryRemove(ID, out player);
            Entity.Dispose();
        }

        /// <summary>
        /// Simulates from this timestamp up until the current time and applies all actions again
        /// </summary>
        public void SimulateFrom (long timestamp) {
            // Guess the time when the packet was sent
            long simulatedTo = timestamp;
            // Find the first action after the update packet was sent
            for (var i = States.Count - 1; i >= 0; i--)
            {
                if (States[i].Timestamp <= simulatedTo)
                {
                    // Simulate forward from when the packet is throught to have been sent
                    for (var j = i + 1; j < States.Count; j++)
                    {
                        PlayerState action = States[j];
                        // Simulate up to the action
                        Entity.Step((action.Timestamp - simulatedTo) / 1000f);
                        simulatedTo = action.Timestamp;
                        // Apply the action
                        Entity.XSpeed = action.XSpeed;
                        Entity.YSpeed = action.YSpeed;
                    }
                    // Remove actions up to this one to minimize memory usage
                    //this.actions.slice(0, i);
                    break;
                }
            }

            Entity.Step((Program.Timer.ElapsedMilliseconds - simulatedTo) / 1000f);
        }

        public void ReverseTo (long timestamp) {
            long simulatedTo = Program.Timer.ElapsedMilliseconds;
            for (int i = States.Count - 1; i >= 1; i--) {
                var action = States[i];
                // Simulate backwards an apply the action
                if (action.Timestamp > timestamp) {
                    Entity.Step((action.Timestamp - simulatedTo) / 1000f);
                    simulatedTo = action.Timestamp;

                    // Apply the previous action for the next segment, since actions are applied forward
                    Entity.XSpeed = States[i - 1].XSpeed;
                    Entity.YSpeed = States[i - 1].YSpeed;
                }
            }
            // Simulate the last step bawards
            Entity.Step((timestamp - simulatedTo) / 1000f);
        }
    }
}

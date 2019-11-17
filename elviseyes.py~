#!/usr/bin/env python3
"""
elviseyes.py

Connect to a websocket server and await JSON commands
to blinken die Augen.

Configuring an ELVIS session takes ~5-10 seconds so we must
do this once, and keep it open while waiting for commands from the websocket.
"""

import time
from nielvis import DigitalInputOutput, Bank, DIOChannel
import asyncio
import websockets

# specify the bank
bank = Bank.A
# specify the DIO channels
left = DIOChannel.DIO1
right = DIOChannel.DIO0
bottom = DIOChannel.DIO2
duration = 0.2 #blink duration
lights = [left,right,bottom]

   
#!/usr/bin/env python
async def listen(DIO):
    uri = "ws://localhost:8888/ws/elvis"
    async with websockets.connect(uri) as websocket:
        while True:
            try:
                ok = False
                msg = ""
                message = await websocket.recv()
                command = json.loads(message)
                
                if 'duration' in command:
                    duration = float(command[duration])
                    ok = True
                    msg = "duration received"
                    if duration < 0.1:
                        ok = False
                        msg = "error: duration less than 0.1"
                        duration = 0.1
                    if duration > 1.0:
                        ok = False
                        msg = "error: duration greater than 1.0"
                        duration = 1.0
                    
                if 'which' in commmand:
                    
                    lights = []
                    if 'left' in command['which']:
                        lights.append(left)
                        ok = True
                        msg += "(Left)"
                    if 'right' in command['which']:
                        lights.append(right)
                        ok = True
                        msg += "(Right)"
                    if 'bottom' in command['which']:
                        lights.append(bottom)
                        ok = True
                        msg += "(Bottom)"
                        
                DIO.write(True, lights)
                time.sleep(duration)
                DIO.write(False,[left,right,bottom])
                reply = {"result":ok, "message": msg}
                await websocket.send(json.dumps(reply))
            except Exception as e:
                print(e)
                
if __name__ == "__main__":
    # configure a DIO session
    with DigitalInputOutput(bank, [left, right, bottom]) as DIO:
        asyncio.get_event_loop().run_until_complete(listen(DIO))

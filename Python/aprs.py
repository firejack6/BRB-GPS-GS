import asyncio
from rtlsdr import RtlSdr
from aprspy import APRS # https://aprspy.readthedocs.io/en/latest/aprspy.html
import json
from pyserver import *

async def streaming():
    sdr = RtlSdr()
    sdr.sample_rate = 22050
    sdr.center_freq=144390000
    sdr.freq_correction=30
    sdr.gain='auto'

    async for samples in sdr.stream():
        # print(samples)
        handleSamples(samples)
        
    await sdr.stop()

    sdr.close()

def handleSamples(sample):
    packet=APRS.parse(sample)
    callsign = packet.source
    latitude = packet.latitude
    longitude = packet.longitude
    timestamp = packet.timestamp
    if (latitude): # only want location packets
        packetToDict(callsign, latitude, longitude, timestamp)

def packetToDict(callsign, latitude, longitude, timestamp):
    packetDict = {
        "latitude": latitude,
        "longitude": longitude,
        "timestamp": str(timestamp)
    }
    inst = callsignInstance(callsign)
    if (inst == 0):
        loadedJSON[callsign] = [packetDict]
    else:
        loadedJSON[callsign] += [packetDict]
    writeToJSON(loadedJSON)
    sendJSON(callsign, packetDict)

global loadedJSON
loadedJSON={}
def openJSON():
    global loadedJSON
    with open('aprs.json', 'r') as json_file:
        loadedJSON = json.load(json_file)
        
def writeToJSON(packet):
    with open('aprs.json', 'w') as json_file:
        json.dump(packet, json_file, indent=2)

def callsignInstance(callsign):
    try:
        instance = len(loadedJSON[callsign])
    except:
        instance = 0
    return instance

try:
    openJSON()
    startServer()
    loop = asyncio.get_event_loop()
    loop.run_until_complete(streaming())
except:
    print("Failed to open device")

testpacket = 'KE8VYZ>APWW11,WIDE1-1,WIDE2-1,qAR,WW8TF-15:@052118h4102.87N/08143.73Wl349/015/A=001264APRS-IS for Win32'
handleSamples(testpacket)
import asyncio
from aprspy import APRS # https://aprspy.readthedocs.io/en/latest/aprspy.html
import json
from pyserver import *
import threading
from time import sleep
import sys
from subprocess import PIPE,Popen
from datetime import datetime

def handleSamples(pkt):
    try:
        bktStart = pkt.index("[",0,3)
        bktEnd = pkt.index("]",0,6)+2
        pkt=pkt[bktEnd:-1]
    except:
        # print(pkt)
        pass
    try:
        packet=APRS.parse(pkt)
        print(packet)
        callsign = packet.source
        latitude = packet.latitude
        longitude = packet.longitude
        timestamp = packet.timestamp
        if(timestamp == None):
            t=datetime.now()
            timestamp=t.strftime("%Y-%m-%d %H:%M:%S")
            print(timestamp)
        if (latitude): # only want location packets
            packetToDict(callsign, latitude, longitude, timestamp)
    except:
        pass

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

global loadedJSON
loadedJSON={}
def openJSON():
    global loadedJSON
    try:
        with open('aprs.json', 'r') as json_file:
            loadedJSON = json.load(json_file)
    except:
        pass
        
def writeToJSON(packet):
    with open('aprs.json', 'w') as json_file:
        json.dump(packet, json_file, indent=2)

def callsignInstance(callsign):
    try:
        instance = len(loadedJSON[callsign])
    except:
        instance = 0
    return instance

openJSON()
server = threading.Thread(target=startServer) 
server.start()
global callsign

def printCall():
    global callsign
    callsign = updateCallsign()
    # print(callsign)
    if(callsign != "N0CALL"):
        return
    else:
        sleep(5)
        printCall()
    
timer = threading.Thread(target=printCall)
timer.start()


testpacket = 'KE8VYZ>APWW11,WIDE1-1,WIDE2-1,qAR,WW8TF-15:@052118h4102.87N/08143.73Wl349/015/A=001264APRS-IS for Win32'
# handleSamples(testpacket)


# turn on radio receiver
# Popen("echo 'blacklist dvb_usb_rtl28xxu' | sudo tee --append /etc/modprobe.d/blacklist-dvb_usb_rtl28xxu.conf",shell=True)
proc = Popen('rtl_fm -f 144.39M - | direwolf -c sdr.conf -r 24000 -t 0 -D 1 -', stdout=PIPE, shell=True)

def debugRadio(raw):
    # print(raw)
    f=open("testin.txt","a")
    f.write(raw+"\n")

while True:
    line = proc.stdout.readline()
    if line != '':
        packet = str(line.rstrip())
        if packet != "b''":
            packet = packet[1:-1]
            packet = packet[1:]
            # debugRadio(packet)
            handleSamples(packet)
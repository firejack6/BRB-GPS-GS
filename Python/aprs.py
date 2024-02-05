import json
import threading
from datetime import datetime
from subprocess import PIPE, Popen
from aprspy import APRS # https://aprspy.readthedocs.io/en/latest/aprspy.html

proc = Popen('rtl_fm -f 433.92M - | direwolf -c sdr.conf -r 24000 -t 0 -D 1 -', stdout=PIPE, shell=True)

initJSON = open("/home/ubuntu/BRB-GPS-GS/Python/data.json", 'r')
try:
    dataDict = json.load(initJSON)
    initJSON.close()
except:
    initJSON.close()
    dFile = open("/home/ubuntu/BRB-GPS-GS/Python/data.json",'w')
    json.dump({"N0CALL" : [{"latitude": 0,"longitude": 0,"timestamp": 0,"altitude": 0}]}, dFile, indent=2)
    dFile.close()
    initJSON = open('/home/ubuntu/BRB-GPS-GS/Python/data.json', 'r')
    dataDict = json.load(initJSON)
    initJSON.close()

def packetToDict(callsign, latitude, longitude, timestamp, altitude):
    packetDict = {
        "latitude": latitude,
        "longitude": longitude,
        "altitude": altitude,
        "timestamp": str(timestamp)
    }


    if callsign in dataDict:
        dataDict[callsign].append(packetDict)
    else:
        dataDict[callsign] = []
        dataDict[callsign].append(packetDict)

    print(dataDict[callsign])
    dFile = open('/home/ubuntu/BRB-GPS-GS/Python/data.json','w')
    dFile.write(json.dumps(dataDict, indent=2))
    dFile.close()


def handleSamples(pkt):
    try:
        bktEnd = pkt.index("]",0,6)+2
        pkt=pkt[bktEnd:-1]
        print(pkt)
    except Exception as e:
        # print(e)
        return

    try:
        processedPkt = APRS.parse(pkt)
        print("PP: ",processedPkt)
    except Exception as e:
        print(e)
        return
    
    lat = processedPkt.latitude
    long = processedPkt.longitude
    callsign = processedPkt.source
    timestamp = processedPkt.timestamp
    altitude = processedPkt.altitude
    if timestamp == None:
        t=datetime.now()
        timestamp=t.strftime("%Y-%m-%d %H:%M:%S")
    if not altitude:
        altitude = -1
    packetToDict(callsign,lat,long,timestamp,altitude)
    





while True:
    raw=proc.stdout.readline()
    if raw:
        packet = str(raw.rstrip())[1:-1][1:]
        handleSamples(packet)
        








# global proc
# def startRTL():
#     global proc
#     try:
#         proc = Popen('rtl_fm -f 433.92M - | direwolf -c sdr.conf -r 24000 -t 0 -D 1 -', stdout=PIPE, shell=True)
#     except:
#         print("Radio not connected")
# rtlThread = threading.Thread(target=startRTL)
# rtlThread.start()

# def readPipe():
#     global proc
#     while True:
#         line=proc.stdout.readline()
#         lineDec = line.decode('utf-8')

#         if lineDec:
#             print(lineDec)

# readPipe()
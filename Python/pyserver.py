from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
from time import sleep
import json


def setDefaultCallsign():
    with open("defaults.json", "r") as json_file:
        defaults = json.load(json_file)
        callsign = defaults["callsign"]
    return callsign
global callsignStorage
callsignStorage = setDefaultCallsign()

app=Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
@app.route('/')
@cross_origin()
def index():
    return jsonify({'name': 'Clown',
                    'email': 'clown@clowns.com'})
    
@app.route('/', methods=['POST'])
def receiveCallsign():
    global callsignStorage
    name = request.json
    callsignStorage = name['callsign']
    return jsonify(callsignStorage)
    
@app.route('/init', methods=['GET'])
def initData():
    global savedJSON
    try:
        with open('aprs.json', 'r') as json_file:
            savedJSON = json.load(json_file)
            return jsonify(savedJSON)
    except:
        pass
    
@app.route('/update', methods=['GET'])
def sendData():
    try:
        with open('aprs.json', 'r') as json_file:
            fulljson = json.load(json_file)
            print(callsignStorage)
            try:
                latest = {callsignStorage:fulljson[callsignStorage][len(fulljson[callsignStorage])-1]}
                return jsonify(latest)
            except:
                return jsonify({"N0CALL":fulljson["N0CALL"][0]})
    except:
        pass
    
@app.route("/clear", methods=['POST'])
@cross_origin()
def clearJSON():
    with open('aprs.json', 'w') as json_file:
        json.dump({
            "N0CALL": [
                {
                    "latitude": 0,
                    "longitude": 0,
                    "timestamp": "2023-09-09 05:21:18"
                }
            ]
            }, json_file, indent=2)
    return "JSON cleared"
    
    
def startServer():
    print("Starting server")
    app.run()
    sleep(0)
    
def updateCallsign():
    return callsignStorage
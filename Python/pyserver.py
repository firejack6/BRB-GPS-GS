from http.server import BaseHTTPRequestHandler, HTTPServer

hostname="127.0.0.1"
port=8002

def startServer():
    myServer = HTTPServer(hostname, port)
    myServer.handle_request()
    

def sendJSON(callsign, packet):
    print(callsign,packet)
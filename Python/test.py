from aprspy import APRS
pkt = "[0.2] KE8VYZ>APAT81-1,WIDE3-3:!3412.73N/10850.00E&170/000/A=000000APRSCN WIFI 4.3"
try:
    bktStart = pkt.index("[",0,3)
    bktEnd = pkt.index("]",0,6)+1
    pkt=pkt[bktEnd+1:-1]
except:
    pass
print(pkt)
print(APRS.parse(pkt))
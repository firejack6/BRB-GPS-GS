# BRB-GPS-GS

(VERY MUCH A WORK IN PROGRESS)

Uses a Raspberry Pi (or similar) and an RTL-SDR to receive APRS packets, which contain GPS location

These instructions assume a [Le Potato single board computer](https://www.amazon.com/Libre-Computer-AML-S905X-CC-Potato-64-bit/dp/B074P6BNGZ?th=1) is being used 

[Pre-Built Images](https://jacksonsserver.com/nextcloud/s/tQBpRGYzET7wtkd)



PreRequisites:
1. [Ubuntu 22.04 Server](http://distro.libre.computer/ci/ubuntu/22.04/ubuntu-22.04.2-preinstalled-server-arm64%2Baml-s905x-cc.img.xz)
2. [RTL-SDR v3](https://www.rtl-sdr.com/buy-rtl-sdr-dvb-t-dongles/)
3. A compatable antenna. I'm using the dipole kit that I ordered with the RTL-SDR.
4. Wi-Fi adapter with AP mode. [TP-Link AC600](https://www.amazon.com/gp/product/B07P5PRK7J/ref=ppx_yo_dt_b_asin_title_o01_s00?ie=UTF8&th=1) and [Driver](https://github.com/morrownr/8821au-20210708)
6. Make a Wi-Fi hotspot [Guide](https://computingforgeeks.com/create-wi-fi-hotspot-on-linux/)
7. Static IP [Guide](https://askubuntu.com/questions/246077/how-to-setup-a-static-ip-for-network-manager-in-virtual-box-on-ubuntu-server)
8. DHCP server [Guide 1](https://www.linuxfordevices.com/tutorials/ubuntu/dhcp-server-on-ubuntu), [Guide 2](https://www.freecodecamp.org/news/setting-a-static-ip-in-ubuntu-linux-ip-address-tutorial/)
9. DNS server (optional, if you don't want to type an IP address into your browser) [Guide](https://ubuntu.com/server/docs/service-domain-name-service-dns)


Installation Scripts

1. Connect to internet by editing /etc/netplan/*
2. cd ~/
3. git clone https://github.com/firejack6/BRB-GPS-GS.git
4. cd ~/BRB-GPS-GS/Installation
5. ./wifiDriver.sh (device will reboot)
6. cd ~/BRB-GPS-GS/Installation
7. ./install.sh (device will reboot)
8. connect to aprspy wifi. Default password is "bigredbee"
9. go to https://192.168.0.1/browser

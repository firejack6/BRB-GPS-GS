#!/bin/sh
IFNAME="wlx6c5ab0386fb8"
CON_NAME="aprspy"
sudo nmcli dev wifi $CON_NAME ifname $IFNAME ssid aprspy password "bigredbee"
sudo nmcli con modify $CON_NAME 802-11-wireless.mode ap 802-11-wireless.band bg ipv4.method shared autoconnect "yes"
sudo nmcli con modify $CON_NAME ipv4.addresses "192.168.0.1/24"
nmcli con up $CON_NAME
sudo apt install isc-dhcp-server -y
sudo cp dhcpd.conf /etc/dhcp/dhcpd.conf
sudo systemctl restart isc-dhcp-server
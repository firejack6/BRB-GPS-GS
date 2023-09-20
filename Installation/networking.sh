#!/bin/sh
IFNAME="wlx6c5ab0386fb8"
CON_NAME="aprspy"
sudo nmcli c add type wifi ifname $IFNAME con-name $CON_NAME autoconnect yes ssid $CON_NAME
sudo nmcli connection modify $CON_NAME 802-11-wireless.mode ap 802-11-wireless.band bg ipv4.method shared
sudo nmcli connection modify $CON_NAME wifi-sec.key-mgmt wpa-psk
sudo nmcli connection modify $CON_NAME wifi-sec.psk "bigredbee"
sudo nmcli connection modify $CON_NAME ipv4.address "192.168.0.1/24"
sudo nmcli connection up $CON_NAME
sudo apt install isc-dhcp-server
sudo cp dhcpd.conf /etc/dhcp/dhcpd.conf
sudo systemctl restart isc-dhcp-server

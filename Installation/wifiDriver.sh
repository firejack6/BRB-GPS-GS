#!/bin/sh
sudo apt update 
cd ~/
sudo apt install git network-manager
sudo apt install build-essential libelf-dev linux-headers-$(uname -r)
git clone https://github.com/morrownr/8812au-20210629
cd rtl88*
sudo sudo sh install-driver.sh
sudo reboot
#!/bin/sh
cd ~/
sudo apt install dkms git
sudo apt install build-essential libelf-dev linux-headers-$(uname -r)
git clone https://github.com/aircrack-ng/rtl8812au.git
cd rtl88*
sudo make dkms_install
sudo reboot
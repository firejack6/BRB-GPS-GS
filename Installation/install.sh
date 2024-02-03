#!/bin/sh
sudo apt update
sudo apt upgrade -y
sudo apt install -y git python3-pip cmake build-essential pkg-config libusb-1.0-0 libusb-1.0-0-dev gcc g++ make libasound2-dev libudev-dev isc-dhcp-server network-manager
./networking.sh
cd ~
git clone https://gitea.osmocom.org/sdr/rtl-sdr.git
cd rtl-sdr/
mkdir build
cd build
cmake ../ -DINSTALL_UDEV_RULES=ON
make
sudo make install
sudo ldconfig
sudo cp ../rtl-sdr.rules /etc/udev/rules.d/
echo "blacklist dvb_usb_rtl28xxu" | sudo tee -a /etc/modprobe.d/blacklist.conf"
cd ~
git clone https://www.github.com/wb2osz/direwolf
cd direwolf
git checkout dev
mkdir build && cd build
cmake ..
make -j4
sudo make install
make install-conf
cd ~/BRB-GPS-GS/Installation/
sh pythonDependencies.sh
mkdir BRB-GPS-GS/Python/secret
cd BRB-GPS-GS/Python/secret
openssl req -x509 -newkey rsa:4096 -keyout key.env -out cert.env -sha256 -days 365 -nodes -subj "/C=US/ST=Ohio/L=Akron/O=Akronauts/OU=Org/CN=192.168.0.*"
sudo sudo usermod -a -G www-data ubuntu
sudo chown ~/ -R ubuntu:www-data
ln -s ~/BRB-GPS-GS/Browser /var/www/html/browser
sudo cp ~/BRB-GPS-GS/Installation/map.conf /etc/apache2/sites-available/
sudo cp ~/BRB-GPS-GS/Installation/apache2.conf /etc/apache2
sudo systemctl reload apache2
sudo a2ensite map.conf
sudo cp ~/BRB-GPS-GS/Installation/aprspy.service /etc/systemd/system/aprspy.service
sudo systemctl daemon-reload
sudo systemctl enable aprspy.service
sudo reboot

import network
# f = open('boot.py', 'w')
# f.write()

wlan = network.WLAN(network.STA_IF) # create station interface
wlan.active(True)       # activate the interface
wlan.scan()             # scan for access points
wlan.isconnected()      # check if the station is connected to an AP
wlan.connect('essid', 'password') # connect to an AP
wlan.config('mac')      # get the interface's MAC adddress
wlan.ifconfig()         # get the interface's IP/netmask/gw/DNS addresses

ap = network.WLAN(network.AP_IF) # create access-point interface
ap.active(True)         # activate the interface
ap.config(essid='ESP-AP') # set the ESSID of the access point

import network
ssid = "myfire_WiFi-Box_eeff"
password = "MYFIREPLACE"
wlan = network.WLAN(network.STA_IF)
wlan.connect(ssid, password)
print(wlan.config('essid'))
print(wlan.config('channel'))
# Extended status information also available this way
print(wlan.config('rssi'))
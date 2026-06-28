---
title:
  How to use Mullvad AND have access to your private services with Wireguard on
  Android
tags: ["android", "vpn", "mullvad", "wireguard"]
---

I've been a long time user of [Mullvad VPN](https://mullvad.net/en/vpn) (not
sponsored). Like many others, I am not okay with corporations harvesting my data
for all the reasons you've already heard. I appreciate Mullvad's privacy first
philosophy, not even requiring an email to sign up for their service. Very nice!

In that same vein, I also like to host my own services where I can. Services
like Netflix, Google, their Photos app, and ChatGPT
[can](https://github.com/jellyfin/jellyfin)
[all](https://github.com/searxng/searxng)
[be](https://github.com/immich-app/immich)
[replaced](https://github.com/open-webui/open-webui) and I intend to take full
advantage of that. And, if you're like me, the thought process goes a little bit
like this:

- Nice, I'm a de-Googler
- Time to be super slick and expose a port so I can access from anywhere
- Oh no, that's dangerous
- fuck.

But hey! You're a smart person. You know the tech lingo. You know that a
handy-dandy VPN will let you access a machine remotely. All you gotta do is:

- Install Wireguard on your server
- Install the Wireguard app on your phone
- Configure it, turn it on, and
- _fuck!_

You have Mullvad app installed already and due to a quirk of the Android OS, you
can only have one VPN app running at a time. No Mullvad app + Wireguard app is
possible. I'm actually not sure if iOS has the same limitation, but either way,
you should be able to follow along with Apple devices as well.

Lucky for us, there is a workaround, with some trade-offs that I'll go over.
Here's a step-by-step for Whateverbian, but configuration for any distro will be
similar:

## Router

- Forward the port you want to use on your router to the local IP of your
  machine. Default for Wireguard is 51820. Every router is different, so look up
  how to do it for yours if unfamiliar.

### Server

- Install Wireguard on the machine you'd like to have access to.

```
apt update && apt install -y wireguard
```

- Generate the server keys. You need a public one and a private one.

```
wg genkey > /etc/wireguard/server.key
cat /etc/wireguard/server.key | wg pubkey > /etc/wireguard/server.pub
```

- Create a Wireguard configuration.

```
nano /etc/wireguard/wg0.conf
```

- Put something like this in there.

```
[Interface]
# The subnet you want for your Wireguard network
Address = 10.10.0.1/24 # Or whatever

# The port the server should listen on
ListenPort = 51820 # Or whatever

PrivateKey = <YOUR_PRIVATE_KEY>

# In the client configuration, the Mullvad IPs will be listed first since general traffic goes through there. Becuse of this, the server will try to respond back to that Mullvad IP, which won't work. This routes traffic from that source to wg0.
PostUp = ip route add <MULLVAD_IPv4>/32 dev wg0 || true
PreDown = ip route del <MULLVAD_IPv4>/32 dev wg0 || true

[Peer]
# Your phone!
PublicKey = <YOUR_PHONE_PUBLIC KEY> # We'll make this below
AllowedIPs = 10.10.0.2/32, <MULLVAD_IPv4>/32 # Or whatever for the first IP. Choose something on the subnet you created in the Address field. Mask with /32

# Add as many [Peer] sections as you want for other devices.
```

### Phone

- Install the Wireguard app.
- Add a new configuration from scratch
- You'll be greeted with a user input friendly version of the configuration
  file. Make it match something similar to this:

```
[Interface]
PrivateKey = <MULLVAD_REGISTERED_PRIVATE_KEY>
Address = <MULLVAD_IPv4>/32, <MULLVAD_IPv6>/128, 10.10.0.2/24
DNS = 10.64.0.1 # or any other Mullvad DNS server

[Peer]
# Your server!
PublicKey = <SERVER_PUB_KEY>
AllowedIPs = 10.10.0.0/24
Endpoint = <HOME_PUBLIC_IP>:51820
PersistentKeepalive = 25

[Peer]
# Mullvad — all other internet traffic
PublicKey = <MULLVAD_PEER_PUB_KEY>
AllowedIPs = 0.0.0.0/0, ::/0
Endpoint = <MULLVAD_SERVER>:51820
```

- Now go back to your server and up Wireguard with

```
wg-quick up wg0
```

You can get the Mullvad keys and IPs from their
[configuration generator](https://mullvad.net/en/account/wireguard-config).

### Trade-offs

With the fancy Mullvad app comes some fancy functionality, like being able to
quickly switch between servers, DAITA, Multihop, and others. The Wireguard app
is very WYSIWYG, so be prepared for that if you go down this path.

Anyhow, that's it! Hope you enjoyed. If this didn't work for you or you noticed
a mistake, please let me know.

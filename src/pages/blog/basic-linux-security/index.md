# Basic Linux Security.

July 29, 2022 (2022-07-29)

7 minute read time

{{anchor "intro"}}

This post outlines the steps I take with a new server. I have chosen Ubuntu 22.04 for simplicity, but the same concepts apply to a large cross-section of distros. While the ideas I discuss in this post are generally accepted good practices, they are not meant to be definitive. This is just a starting point. With that said, let's dig in!

First, log in to the root user via ssh.

```bash
ssh <root or other>@<domain or ip>

# Example:
ssh root@192.168.0.1
```

If only a regular sudo user is available, then you need to prefix many of these commands with sudo.

Of course, we always run the obligatory update and upgrade:

```bash
apt update && apt upgrade -y
```

{{anchor "new-user"}}

## Add a New User

```bash
adduser <userNameHere>
adduser <userNameHere> sudo

# Example:
adduser zach
adduser zach sudo
```

The steps for adding users to your distro may be different. The above is tested to work on Ubuntu/Debian.

{{anchor "gen-keys"}}

### Create an ssh key and copy the public key to the server

Once you have a regular user with sudo privileges, we can begin generating ssh keys. Generating ssh keys should be done on your local machine and not on the server we are setting up. It can be done if needed, but it is essential to delete the private keys from the server once the setup is complete. **_This is important!_** If your machine becomes compromised through some application that grants read access to the file system, where your private keys are stored, then your private key can be downloaded and used to access your machine. No bueno!

```bash
ssh-keygen

# You will be prompted to name the file and optionally
# to enter a passphrase.  Remember that adding a passphrase
# will require you to enter that passphrase to login
# every time.  This is more secure but less convenient.
# The choice is up to you.

# You should see output like this
Generating public/private rsa key pair.
Enter file in which to save the key (C:\Users\zachl/.ssh/id_rsa): test
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in test.
Your public key has been saved in test.pub.
The key fingerprint is:
SHA256:mEfsOcmO2ZFSODzyKo8TYvk5SkT8UUGT9IKaehsC02s user@DESKTOP-XXXXXX
The key's randomart image is:
+---[RSA 3072]----+
|    o*o          |
|.   oooo         |
| o o..=.+        |
|..+ .o.X +       |
|o+o.  = S        |
|=+.. . B o       |
|+oE.o o o        |
|.+.X             |
| .+.o            |
+----[SHA256]-----+
```

Once that is done, we can copy the public key to our server:

```bash
# Linux (or Linux on Windows via WSL) recommended
ssh-copy-id -i <pubkeyfile>.pub <userNameHere>@<domain or ip>

# Example:
ssh-copy-id -i test.pub zach@192.168.0.1

# For Windows PowerShell Users, you will need to run something like this:
type $env:USERPROFILE\.ssh\<pubkeyfile>.pub | ssh <domain or ip> "cat >> .ssh/authorized_keys"

# Credit: https://www.chrisjhart.com/Windows-10-ssh-copy-id/
```

You may be prompted to add the servers `key fingerprint` to known hosts. Go ahead and say yes. There should also be a prompt to enter the password for your user.

After copying the public id to the new server, make sure you can log in using the ssh key identity file.

```bash
ssh <userNameHere>@<domain or ip>
# or
ssh <userNameHere>@<domain or ip> -i ~/.ssh/yourPrivateKey

Example:
ssh zach@192.168.0.1
# or
ssh zach@192.168.0.1 -i path/to/your/privateKey
```

**_Make sure to store your private keys securely! And don't forget to back them up!_**

{{anchor "dont-use-root"}}

# Why not use the root user?

There are a lot of good reasons not to use the root user. Chief among them is privilege. The root user can do a lot of damage to a system. This can be intentional through a malicious user or accidental through an inexperienced user. It is easy to mistype `rm -rf ./whatever` into deleting something you did not want to have deleted. While it sucks if you do this as a regular user to your files, it's much worse when done as root to system files.

However, from a security standpoint, you want to reduce your attack surface. The root user is ubiquitous on all Linux machines. It is the primary brute force attack vector being run by bots all over the internet looking for systems with weak or default passwords.

You can argue that this is not a concern as long as you have a secure password. You can also take this further and use ssh keys to secure your root user account. However, private keys can also be compromised. If that happens, the attacker has full root privileges to your system.

By now, you can see that adding a non-standard user name to a Linux system is an added layer of security. That is why it is not just common practice but good practice. Suppose the private key for your non-standard user gets compromised. In that case, the attacker still has to figure out that user's password once they log in to do anything with sudo. This is why sudo always asks for a password first and why tools such as `passwd` make you enter your current password.

In summary, here is what a compromised private key for a root user attack looks like:

```bash
ssh root@10.10.10.10 -i compromisedPrivateKey

# done --- full access, game over
```

In contrast, if your non-standard user private key gets compromised, it's at least a little more complicated:

```bash

# first, the attacker has to guess the user name that the private key
# belongs to (read: don't name your private keys like: zachsPrivateKey)

# but let's see what happens when the attacker finds the right name:
ssh zach@10.10.10.10 -i zachsPrivateKey

sudo su
[sudo] password for zach:  # attacker needs to guess password

# or
passwd
Changing password for zach.
Current password:  # same as above
```

And if this doesn't make it obvious, let me clarify: **_this is also why ssh keys are not a replacement for strong passwords!_** If your private key is compromised, the last thing between an attacker and full root privileges is your password, so please practice good password hygiene!

Ok, Paranoid yet? Good, want to know how we can make your ssh even more secure? Let's Disable the root user login altogether!

{{anchor "disable-root"}}

# Disable Root Login

Now that you have that all setup and successfully logged into your server using your key, we can perform some additional SSH hardening. Primarily, we want to disable the root login and disable password authentication. Optionally, we can change the port for ssh.

```bash

sudo nano /etc/ssh/sshd_config

# find these lines and make sure they are set like so

# If you change the port, pick a random one that you can remember
Port 9999

PermitRootLogin no

PasswordAuthentication no
```

After making your changes and saving the file, you will need to restart the ssh server:

```bash
systemctl restart sshd
```

### Important!

Don't log out of your current session just yet! Open another terminal window and make sure you can still ssh in. **_If an error occurred when making changes to the ssh configuration, you could lock yourself out!_** By staying logged in in the first terminal window, you have an opportunity to correct any problems!

{{anchor "install-lynis"}}

# Installing Optional Tools

We are off to a great start, but let's look at some tools that can scan our system and give us more information on ways to improve security.

One such tool is Lynis, which is easy to use. These instructions come directly from the Lynis Docs.

```bash
# It helps to be the root user for the system scan
sudo su

cd /usr/local
git clone https://github.com/CISOfy/lynis
cd lynis
./lynis audit system
```

Running this scan will take a few minutes, depending on your hardware, but once it is complete, you should see a summary like so:

```bash
==================================================

  Lynis security scan details:

  Hardening index : 64 [############        ]
  Tests performed : 267
  Plugins enabled : 2

  Components:
  - Firewall               [V]
  - Malware scanner        [X]

  Scan mode:
  Normal [V]  Forensics [ ]  Integration [ ]  Pentest [ ]

  Lynis modules:
  - Compliance status      [?]
  - Security audit         [V]
  - Vulnerability scan     [V]

  Files:
  - Test and debug information      : /var/log/lynis.log
  - Report data                     : /var/log/lynis-report.dat

===================================================
```

Great! But what can we do to improve our score? You will need to scroll up through the output to find this, but there should also be a lot of suggestions like these:

```bash
* Consider hardening SSH configuration [SSH-7408]
    - Details  : AllowTcpForwarding (set YES to NO)
      https://cisofy.com/lynis/controls/SSH-7408/

  * Consider hardening SSH configuration [SSH-7408]
    - Details  : ClientAliveCountMax (set 3 to 2)
      https://cisofy.com/lynis/controls/SSH-7408/

  * Consider hardening SSH configuration [SSH-7408]
    - Details  : Compression (set YES to NO)
      https://cisofy.com/lynis/controls/SSH-7408/

  * Consider hardening SSH configuration [SSH-7408]
    - Details  : LogLevel (set INFO to VERBOSE)
      https://cisofy.com/lynis/controls/SSH-7408/

  * Consider hardening SSH configuration [SSH-7408]
    - Details  : MaxAuthTries (set 6 to 3)
      https://cisofy.com/lynis/controls/SSH-7408/
```

These suggestions are the meat of the tool and help guide you to hardening your system. You can follow the links to get more detailed information and take steps on your own to remedy the issue. One of the more notable tips would be installing a malware scanner.

{{anchor "install-lmd"}}

### Installing a malware scanner, like Linux Malware Detect (LMD)

```bash
wget http://www.rfxn.com/downloads/maldetect-current.tar.gz
tar -xvf maldetect-current.tar.gz
cd maldetect-1.6.4/
./install.sh

# To scan the entire system, you can run:
maldet --scan-all /
```

Running a scan on the entire system is probably not necessary and slow but let's have some fun! After a few minutes, the scanner should produce an output similar to the one below.

```bash
Linux Malware Detect v1.6.4
            (C) 2002-2019, R-fx Networks <proj@rfxn.com>
            (C) 2019, Ryan MacDonald <ryan@rfxn.com>
This program may be freely redistributed under the terms of the GNU GPL v2

maldet(51058): {scan} signatures loaded: 17273 (14451 MD5 | 2039 HEX | 783 YARA | 0 USER)
maldet(51058): {scan} building file list for /, this might take awhile...
maldet(51058): {scan} setting nice scheduler priorities for all operations: cpunice 19 , ionice 6
maldet(51058): {scan} file list completed in 14s, found 2245 files...
maldet(51058): {scan} scan of / (2245 files) in progress...
maldet(51058): {scan} 2245/2245 files scanned: 0 hits 0 cleaned

maldet(51058): {scan} scan completed on /: files 2245, malware hits 0, cleaned hits 0, time 383s
maldet(51058): {scan} scan report saved, to view run: maldet --report 220729-1244.51058
```

So there you have it! A quick guide on some basic hardening of your freshly installed Linux system! Further improvements can be made by configuring regular automated scanning and reporting, but is out of scope of this quick start. To learn more visit the docs for these tools:

Lynis Docs:
[https://cisofy.com/documentation/lynis/](https://cisofy.com/documentation/lynis/)

Linux Malware Detect Docs:
[https://github.com/rfxn/linux-malware-detect](https://github.com/rfxn/linux-malware-detect)

This post is not meant to be an authoritative guide on server security. Still, I hope it helps new people and highlights the importance of securing and hardening your systems. Security is an extensive and complex topic. People spend years becoming experts; even then, the black hats never rest. They continue to find new and innovative ways to gain footholds on our machines. Tools such as Lynis can be beneficial in teaching/informing about such things. It is also vital to run tools like Lynis periodically or after significant system changes. Installing databases or server applications has rather substantial implications from a security standpoint. These applications increase the attack surface by opening ports that may be exposed to the public internet. So, in conclusion, stay sharp!

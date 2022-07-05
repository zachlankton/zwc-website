# My First NFT - On Chia Network

July 1st, 2022 <br>
2 Minute Read

His name is Tech Sam, which is short for Technological SamSquanch.

He loves Chia because it helps protect his home in the forest.

For this reason, Tech Sam chose to be minted using Chia's NFT1 Standard.

![TechSam](/imgs/techSamLoRes.png)

I've wanted to dip my toe into NFTs for a while but have held off for many reasons.
The biggest reason would be that I have been mostly waiting for Chia to release their NFT standard on mainnet. As of this week, that has launched! So no more excuses, time to get my hands dirty or toes wet, rather.

A quick intro on Chia for those who might be new: <br>
[https://www.chia.net/technology/](https://www.chia.net/technology/)

A bit of chia command line foolery later, and I had created my first NFT ever!!

[Check it out on spacescan.io](https://www.spacescan.io/xch/nft/nft1rpfce33nmz9thcrscr7k83pnnrmpwwty649kpde37jdksq3xc9xssqg9sw)

---

## More Detail

Ok, for those interested in the exact steps taken, here you are.

For my first NFT, I decided to mint without using a DID wallet as the process was more straightforward. I also decided to not include the options for metadata, licensing, and royalties to keep it simple. Metadata and license uri's can be added after minting, but royalties cannot. If you want to setup royalties, it needs to be performed at mint time.

First, I created an image using my favorite image creator/editor. In this case, it was Krita.
I then exported the picture as a PNG. (Jpegs and other formats work as well).
I included this image in my GitHub website repo for this blog post, which gets stored on GitHub and Cloudflare.

I then opened up my terminal and entered the following commands to get the hash of my image:

```bash

curl -s https://raw.githubusercontent.com/zachlankton/zwc-website/main/assets/imgs/techSamLoRes.png | sha256sum
0d5a434cf6b859cba564e59426344dfc7ef88c25e5113204777500e6126a0f96  -

curl -s https://zachwritescode.com/imgs/techSamLoRes.png | sha256sum
0d5a434cf6b859cba564e59426344dfc7ef88c25e5113204777500e6126a0f96  -

```

Running both `curl` commands was not strictly necessary; I just did it to confirm that the hash was the same for both URI's

Once I had the hash, I needed an NFT wallet to mint this image.

```bash
chia wallet nft create
```

This command created a new NFT wallet that can be found by running

```bash
chia wallet show


...Other Wallets...

NFT Wallet:
   -Total Balance:         0.0
   -Pending Total Balance: 0.0
   -Spendable:             0.0
   -Type:                  NFT
   -Wallet ID:             5

...Other Wallets etc...

```

With that, I just needed to construct the command to mint the NFT, like so...

```bash
chia wallet nft mint -i 5 -u https://raw.githubusercontent.com/zachlankton/zwc-website/main/assets/imgs/techSamLoRes.png,https://zachwritescode.com/imgs/techSamLoRes.png -nh 0d5a434cf6b859cba564e59426344dfc7ef88c25e5113204777500e6126a0f96 -m 0.000265
```

Let's break that down a bit, so it's easier to understand.

```bash
chia wallet nft mint \
    -i 5            # This is the wallet id number \
    -u url1,url2    # This is a comma-separated list of URLs that host the image \
    -nh hash        # This is the hash of the image obtained from our curl command \
    -m 0.000265     # The fee for minting this NFT
```

That's it! I waited for a few minutes for the blockchain to confirm the NFT, and without any further magic or effort, it popped up in [spacescan.io/nfts](https://www.spacescan.io/nfts)

---

# More Info

The Official Chia NFT Documentation <br>
[https://devs.chia.net/guides/nft-developer-guide](https://devs.chia.net/guides/nft-developer-guide)

Offical Chia Website <br>
[https://www.chia.net/](https://www.chia.net/)

---

<iframe src="https://docs.google.com/forms/d/e/1FAIpQLSd70NgEPG9N-Dvm4EwfQs2HDmuOhUKuqGuVx3xmzfYef8J9VA/viewform?embedded=true" width="100%" height="900" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>

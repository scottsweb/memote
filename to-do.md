This is a fork of an existing project to bring proper media remote support to many streaming websites. It means I can use standard keys (up, down, left, right, enter and escape) to fully navigate each site. We will try to minimise hacks (via custom JS and CSS) but also implement them if it improves the user experience.

Here are some of the things we need to do:

3. Make sure the browser extension works in both Firefox and Chrome
4. Restrict to specific streaming sites only. We will start with UK specific ones like the iPlayer, ITVx, Channel 4 and Channel 5
   - https://www.bbc.co.uk/iplayer
   - https://www.itv.com
   - https://www.channel4.com
   - https://www.channel5.com

5. We might want specific hacks for each site. For example hitting enter on the video element of thie iPlayer doesn't focus it properly. It's easy to get stuck.
6. When hitting play we want to make sure the video play is focused and put into full screen
7. Zoom UI by 15%

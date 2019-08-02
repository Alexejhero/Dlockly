## Hosting the bot

Dlockly works fine by its self using its [website](https://dlockly.glitch.me).

### Making a bot profile
Before you can host your bot, you need to have a bot.

You can do that by going to the [discord developer panel](https://discordapp.com/developers/applications/).

If promted sign in to __your__ discord account, and then you should be greeted with this page: ![dev panel](https://cdn.discordapp.com/attachments/606876870063030273/606876892078932016/unknown.png)
From here you want to click the "New Application" button. This popup will appear: ![create applicaion](https://cdn.discordapp.com/attachments/606876870063030273/606877373014736896/unknown.png)
Now you want to type in the name for your bot and hit "Create"

You will get this page: ![new application](https://cdn.discordapp.com/attachments/606876870063030273/606878414477066245/unknown.png) 
If you want you can change the description of the bot and add an icon.

Next you want to go to the "Bot" setion on the side and this tab will open: ![create bot](https://cdn.discordapp.com/attachments/606876870063030273/606879322363658260/unknown.png)
This will popup: ![confirm create](https://cdn.discordapp.com/attachments/606876870063030273/606880123064549387/unknown.png)
Choose "Yes, do it!" and then this page will pop up: ![a wild bot appeard](https://cdn.discordapp.com/attachments/606876870063030273/606884324427563009/unknown.png)
Leave this tab open for later

### Setting up the project:
Dlockly is hosted on [glitch](https://glitch.com) and thats what we will be hosting for this tutorial.
go to [glitch](https://glitch.com) and create an account by hitting sign in and choosing the method of your choosing: ![sign in](https://cdn.discordapp.com/attachments/606876870063030273/606886083136978975/unknown.png)
then you want to click New Project and Clone from Git Repo. This will prompt you to enter a url and then you put in `https://github.com/AlexejheroYTB/Dlockly`, or if you want you just can click [this link](https://glitch.com/edit/#!/import/git?url=https://github.com/AlexejheroYTB/Dlockly).
![clone from git repo](https://cdn.discordapp.com/attachments/606876870063030273/606886831413395492/unknown.png)
Now you should be presented with this screen if everything went well: ![editor](https://cdn.discordapp.com/attachments/606876870063030273/606888668493512708/unknown.png)
Now you want to click the name on the top left (it will be something like `alexejheroytb-dlockly-#`). Click the name in the new box that appears and change it to what you want (not: it will be the url so if you name it `mycoolbot` than your site will be `mycoolbot.glitch.me`) ![name](https://cdn.discordapp.com/attachments/606876870063030273/606889477541199879/unknown.png)
After this you want to click New File on the top left and name it `.env` and then paste this in: 
```env
DISCORD_TOKEN=
DISCORD_CLIENT_SECRET=
DISCORD_GUILD_ID=
DISCORD_ROLE_ID=
```
Now you need to get these values

### Values:
Remeber the bot page I told you about earlier? Go back there. Click the Copy button under token. 

***__NEVER SHARE YOUR TOKEN WITH ANYONE!!!__*** 

![token](https://cdn.discordapp.com/attachments/606876870063030273/606894021448826950/unknown.png)

once done paste your token in your .env file under `DISCORD_TOKEN`

Now go back to the discord bot page and click the copy button under client secret

![secret](https://cdn.discordapp.com/attachments/606876870063030273/606894839283318833/unknown.png)
Everything v is leftovers from other stuff
### You can configure the bot [here](https://dlockly.glitch.me).

#### Having troubles? Join our [support guild](https://discord.gg/cnTZNUF)!

<img src="https://cdn.glitch.com/43f72134-88ea-4e7b-ace8-4a444b9aab78%2FIcon1.png?v=1561542756208" width="100px" height="100px"> 

##### _Discord Hack Week 2019 Winner (Productivity)_

---

###### _Special thanks to [@KhooHaoYit](https://github.com/khoohaoyit), [@Chicken-E](https://github.com/chicken-e) and [@WilsonTheWolf](https://github.com/wilsonthewolf) for their contributions!_

###### Looking to make your own bot using Blockly? Check out [7coil/discord-blocks](https://github.com/7coil/discord-blocks) or [camden7306/Discord-Blocks](https://github.com/camden7306/Discord-Blocks)

_© 2019 AlexejheroYTB_


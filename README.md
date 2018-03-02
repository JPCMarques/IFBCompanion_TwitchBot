# Insane Final Bot
Twitch bot for https://jpcmarques.github.io/IFBCompanion/ 

The bot allows you to run a series of commands allowing you to go for IFB and interact with your stream with a wide array of commands - and you don't need to sign up for the bot to work, just a pm will suffice!

All commands are case-insensitive and some have easter eggs - not included in this documentation.

The bot is, for the most part, silent - command feedback is generally whispered to the caller - so you don't have to worry about spam.

Quick start:
- [Join](#join)
- [Leave](#leave)
- [Mod control](#mod-control)

## Chat commands 

### Boss Vote

This command allows you to start/stop boss votes (no shit). Only 1 vote per person. Votes on preferred bosses count as 2.

- **Aliases**: `!bv`, `!bossvote`, `!bvote`

- **Arguments**:

  - `start`
  
    Starts a boss vote. <sup>[M](#ModInfo)</sup>

  - `stop`

    Stops a boss vote and outputs result to chat. <sup>[M](#ModInfo)</sup>

  - `<boss name>`

    Votes on a boss. Aliases/nicknames - like rax or spooder for Araxxor - work (with some easter eggs ;))

## Whisper commands

### Join

Makes the bot join your channel.

- **Aliases**: `!join`, `!joinme`

- **Arguments**: none

### Leave

Makes the bot leave your channel.

- **Aliases**: `!leave`, `!leaveme`

- **Arguments**: none

### Export

Exports ban/prefer list to be used with my other app (a GUI for banning/preferring bosses) - [IFBCompanion](https://jpcmarques.github.io/IFBCompanion/)

- **Aliases**: `!export`, `!e`

- **Arguments**: none

### Import

Imports ban/prefer list from my other other app (a GUI for banning/preferring bosses) - [IFBCompanion](https://jpcmarques.github.io/IFBCompanion/). 

Note: should not be used directly (unless you know what you're doing) - the app exports the full command directly. Any gibberish is ignored, so worst case scenario you end up with all bosses in the normal list.

- **Aliases**: `!import`, `!i`

- **Arguments**: JSON object containing boss data.

## Whisper & chat commands

### Mod control

Manages mod access to commands and arguments marked with <sup>[M](#ModInfo)</sup>. Only the channel owner can do this.

- **Aliases**: `!modcontrol`, `!mc`

- **Arguments**: 

  - `enable`: Enables mod access
  - `disable`: Disables mod access
  - `toggle`: Toggles mod access
  

### Ban boss <sup>[M](#ModInfo)</sup>

Adds a boss to the ban list.

- **Aliases**: `!banboss`, `!bb`

- **Whisper-only aliases**: `!ban` 

- **Arguments**: boss (nick)name.

### Prefer boss <sup>[M](#ModInfo)</sup>

Adds a boss to the prefer list.

- **Aliases**: `!preferboss`, `!prefer`, `!pb`, `pref`

- **Arguments**: boss (nick)name.

### Reset boss <sup>[M](#ModInfo)</sup>

Resets a boss to the normal list.´

- **Aliases**: `!resetboss`, `!rb`

- **Whisper-only aliases**: `!reset`

- **Arguments**: boss (nick)name.

### Reset all bosses <sup>[M](#ModInfo)</sup>

Resets all bosses to the normal list.

- **Aliases**: `!resetall`

- **Arguments**: none

<hr>
<a name="ModInfo"><strong>M</strong></a>: Only channel owner and mods can do this
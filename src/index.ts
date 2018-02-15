import * as tmi from 'tmi.js'
import { FirebaseHandler } from './shared/firebaseHandler';
import { CommandManager } from './commands/commandManager';
import { ICommandResponse } from './shared/dataStore';

var options = {
    options: {
        debug: true
    },
    connection: {
        cluster: 'aws',
        reconnect: true
    },
    identity: {
        username: 'IFBCompanion',
        password: "oauth:j3klg383s1s8qeyfai6qjbzt8rop9n"
    },
    channels: []
}

const firebaseHandler = new FirebaseHandler();
firebaseHandler.init().then((dataStore) => {
    const commandManager = new CommandManager();
    options.channels = dataStore.channelList;
    const client = new tmi.client(options);
    client.connect();
    
    client.on('message', (channel: string, userState: Object, message: string, self: boolean) => {
        // if(message === '!random'){
        //     let randomMonster = dataStore.monsterList[Math.floor(Math.random() * dataStore.monsterList.length)];
        //     client.say(channel, "@" + userState["display-name"] + "! The murder hat commands you to slaughter! Your task is: " + 
        //      ( randomMonster === 'Giant Mole' ? 'Giant Hole! Uh... I mean Giant Mole! Yeah, Giant Mole.' : randomMonster))
        // }

        if(self) return;

        switch(userState['message-type']){
            case 'whisper':
                if(message.toLowerCase().startsWith('!joinme')){
                    client.join(channel);
                    firebaseHandler.joinChannel(channel);
                    client.whisper(userState['username'], "Bot successfully joined your channel.")
                }
                else if (message.toLowerCase().startsWith('!leaveme')){
                    client.part(channel);
                    firebaseHandler.leaveChannel(channel);
                    client.whisper(userState['username'], "Bot successfully left your channel.")
                }
                else {
                    client.whisper(userState['username'], "Invalid command. Valid whisper commands:\n!joinme - joins your channel\n!leaveme - leaves your channel\n!help - who knows what this does??")
                }
                break;
            case 'chat':
                commandManager.parseMessage(channel, userState, message)
                    .then((commandResponse: ICommandResponse) => {
                        if (commandResponse.whisper) client.whisper(userState['username'], commandResponse.result);
                        else client.say(channel, `@${userState['display-name']} ${commandResponse.result}`);
                    }).catch((err) => {
                        console.log(err);
                    })
                break;
        }


    })
})

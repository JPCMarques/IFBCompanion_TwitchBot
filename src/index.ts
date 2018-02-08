import * as tmi from 'tmi.js'
import { FirebaseHandler } from './shared/firebaseHandler';
import { ChatPluginManager, IPluginResponse } from './plugins/chatPlugin';

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
        password: "oauth:vxflx8lxf825meh107s6qlhybc5eri"
    },
    channels: []
}

var firebaseHandler = new FirebaseHandler();
firebaseHandler.init().then((dataStore) => {
    let pluginManager = new ChatPluginManager(dataStore);
    options.channels = dataStore.channelList;
    var client = new tmi.client(options);
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
                pluginManager.parseChat(channel, userState, message)
                .then((response: IPluginResponse) => {
                    if(response.isReply){
                        client.whisper(userState['username'], response.data);
                    } else {
                        client.say(channel, '@' + userState['display-name'] + ' ' + response.data);
                    }
                })
                break;
        }


    })
})

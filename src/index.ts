import * as tmi from 'tmi.js'
import { FirebaseHandler } from './shared/firebaseHandler';

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
                if(message.startsWith('!joinme')){
                    client.join(channel);
                    firebaseHandler.joinChannel(channel);
                }
                else if (message.startsWith('!leaveme')){
                    client.part(channel);
                    firebaseHandler.leaveChannel(channel);
                }
                break;
        }
    })
})

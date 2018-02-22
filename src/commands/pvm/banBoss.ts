import { ICustomCommand, IDataStore, ICommandResponse } from "../../util/dataStore";
import { isUserAllowed } from "../../util/permissions";
import { replaceMessageData } from "../../util/utils";
import { CommandMessages, CommandConstants } from "../../util/staticData/commands";
import { isNullOrUndefined, isNull } from "util";
import { ensureChannelDataLists } from "../util";
import { FirebaseConstants } from "../../util/staticData/firebase";
import { RemoteReference, RemoteReferenceHandler } from "../../util/firebaseHandler";

export class BanBoss implements ICustomCommand {
    isWhisper = true;
    aliases = ['!banboss', '!bb', '!onebannyboy'];
    extraWhisperAliases = ['!ban'];

    constructor(private dataStore: IDataStore){}

    async execute(channel: string, userState: Object, message: string): Promise<ICommandResponse> {
        await isUserAllowed(channel, userState, this.dataStore).catch((err) => {
            return Promise.resolve({
                result: err,
                whisper: true
            });
        });
        
        if (message.indexOf(' ') === -1) {
            return Promise.resolve({
                result: replaceMessageData(CommandMessages.COMMAND_NO_ARGS, CommandConstants.BAN_BOSS_DISPLAY, CommandConstants.BOSS_EXPECTED_ARG),
                 whisper: true
            });
        }
        message = message.substring(message.indexOf(' ') + 1);
        
        const username = userState['username'];
        const channelOwner = channel.replace('#', '');
        const channelData = this.dataStore.channelData[channelOwner];
        ensureChannelDataLists(channelData);

        for(var i = 0; i < channelData.banList.length; i++) {
            const monsterData = channelData.banList[i];
            for (var ii = 0; ii < monsterData.aliases.length; ii++){
                const alias = monsterData.aliases[ii];
                if (alias === message){
                    return Promise.resolve({
                        result: replaceMessageData(CommandMessages.BAN_BOSS_DUP, monsterData.displayName),
                        whisper: true
                    });
                }
            }
        }

        for(var i = 0; i < channelData.normalList.length; i++) {
            const monsterData = channelData.normalList[i];
            for (var ii = 0; ii < monsterData.aliases.length; ii++){
                const alias = monsterData.aliases[ii];
                if (alias === message){
                    channelData.banList.push(monsterData);
                    channelData.normalList.splice(i, 1);
                    
                    const banListRef = new RemoteReference(FirebaseConstants.CHANNEL_DATA_PATH + '/' + username + '/banList');
                    const normalListRef = new RemoteReference(FirebaseConstants.CHANNEL_DATA_PATH + '/' + username + '/normalList');
                    RemoteReferenceHandler.SetData(banListRef, this.dataStore.channelData[username].banList);
                    RemoteReferenceHandler.SetData(normalListRef, this.dataStore.channelData[username].normalList);

                    return Promise.resolve({
                        result: replaceMessageData(CommandMessages.BAN_BOSS_SUCCESS, monsterData.displayName),
                        whisper: true
                    });
                } 
            }
        }

        for(var i = 0; i < channelData.preferList.length; i++) {
            const monsterData = channelData.preferList[i];
            for (var ii = 0; ii < monsterData.aliases.length; ii++){
                const alias = monsterData.aliases[ii];
                if (alias === message){
                    channelData.banList.push(monsterData);
                    channelData.preferList.splice(i, 1);

                    const banListRef = new RemoteReference(FirebaseConstants.CHANNEL_DATA_PATH + '/' + username + '/banList');
                    const preferListRef = new RemoteReference(FirebaseConstants.CHANNEL_DATA_PATH + '/' + username + '/preferList');
                    RemoteReferenceHandler.SetData(banListRef, this.dataStore.channelData[username].banList);
                    RemoteReferenceHandler.SetData(preferListRef, this.dataStore.channelData[username].preferList);

                    return Promise.resolve({
                        result: replaceMessageData(CommandMessages.BAN_BOSS_SUCCESS, monsterData.displayName),
                        whisper: true
                    });
                }
            }
        }

        return Promise.resolve({
            result: replaceMessageData(CommandMessages.MISSING_BOSS, message),
            whisper: true
        });
    }
}
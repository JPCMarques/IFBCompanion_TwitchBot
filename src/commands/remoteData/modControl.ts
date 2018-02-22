import { ICustomCommand, ICommandResponse, IDataStore } from "../../util/dataStore";
import { isChannelOwner } from "../util";
import { FirebaseHandler, RemoteReference, RemoteReferenceHandler } from "../../util/firebaseHandler";
import { replaceMessageData } from "../../util/utils";
import { CommandMessages, CommandConstants } from "../../util/staticData/commands";
import { FirebaseConstants } from "../../util/staticData/firebase";

export class ModControl implements ICustomCommand {
    isWhisper = true;
    aliases = ['!modcontrol', '!mc'];

    constructor(private dataStore: IDataStore) {}

    async execute(channel: string, userState: Object, message: string): Promise<ICommandResponse> {
        message = message.substring(message.indexOf(' ') + 1);
        if (isChannelOwner(channel, userState)) {
            const username = userState['username'];
            let dataStatus: boolean;
            if (message === 'enable') {
                dataStatus = (this.dataStore.channelData[username].modsEnabled = true);
            } else if (message === 'disable') {
                dataStatus = (this.dataStore.channelData[username].modsEnabled = false);
            } else if (message === 'toggle') {
                dataStatus = (this.dataStore.channelData[username].modsEnabled = !this.dataStore.channelData[username].modsEnabled);
            } else {
                return Promise.resolve({
                    result: replaceMessageData(CommandMessages.UNRECOGNIZED_ARG, message),
                    whisper: true
                })
            }
            
            const remoteRef = new RemoteReference(FirebaseConstants.CHANNEL_DATA_PATH + '/' + username + '/modsEnabled');
            RemoteReferenceHandler.SetData(remoteRef, this.dataStore.channelData[username].modsEnabled);
            return Promise.resolve({
                result: replaceMessageData(CommandMessages.MOD_CONTROL_SUCCESS, (dataStatus ? 'enabled' : 'disabled')) ,
                whisper: true
            });
        } else {
            return Promise.resolve({
                result: CommandConstants.MOD_CONTROL_NOT_OWNER,
                whisper: true
            })
        }
    }
}
import { ICustomCommand, IDataStore, ICommandResponse, IChannelDataStore } from "../../util/dataStore";
import { RemoteReferenceHandler, ChannelListRemoteReference, ChannelDataRemoteReference } from "../../util/firebaseHandler";
import { CommandConstants } from "../../util/staticData/commands";

export class Leave implements ICustomCommand {
    isWhisper = true;
    aliases = ['!leaveme', '!leave'];

    constructor(private dataStore: IDataStore) {}
 
    async execute(channel: string, userState: Object, message: string): Promise<ICommandResponse> {
        const username = userState['username'];
        let index = this.dataStore.channelList.indexOf(channel);
        if(index === -1) return Promise.resolve({
            result: CommandConstants.LEAVE_FAIL + (Math.random() > 0.99 ? CommandConstants.LEAVE_MEME : ''),
            whisper: true
        });

        delete this.dataStore.channelData[username];
        this.dataStore.channelList.splice(index, 1);
        
        RemoteReferenceHandler.SetData<string[]>(ChannelListRemoteReference, this.dataStore.channelList);
        RemoteReferenceHandler.SetData<IChannelDataStore>(ChannelDataRemoteReference, this.dataStore.channelData);
    
        const response: ICommandResponse = {
            whisper: false,
            result: CommandConstants.LEAVE_SUCCESS
        }
        
        return Promise.resolve(response);
    }
}
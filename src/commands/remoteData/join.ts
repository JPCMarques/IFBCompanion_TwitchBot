import { ICustomCommand, IDataStore, ICommandResponse, MonsterList, IChannelDataStore } from "../../util/dataStore";
import { isNullOrUndefined } from "util";
import { ChannelDataRemoteReference, ChannelListRemoteReference, RemoteReferenceHandler } from "../../util/firebaseHandler";
import { CommandConstants } from "../../util/staticData/commands";

export class Join implements ICustomCommand {
    isWhisper = true;
    aliases = ['!joinme', '!join'];
    
    constructor(private dataStore: IDataStore){}

    async execute(channel: string, userState: Object, message: string): Promise<ICommandResponse> {
        if (isNullOrUndefined(this.dataStore.channelList)) this.dataStore.channelList = [];
        if (isNullOrUndefined(this.dataStore.channelData)) this.dataStore.channelData = {};
        const username = userState['username'];

        if(this.dataStore.channelList.indexOf(channel) !== -1) return Promise.resolve({result: CommandConstants.JOIN_FAIL + (Math.random() > 0.99 ? CommandConstants.JOIN_MEME: ''), whisper: true})

        this.dataStore.channelList.push(channel);
        this.dataStore.channelData[username] = {
            modsEnabled: false,
            banList: [],
            normalList: MonsterList,
            preferList: []
        }

        RemoteReferenceHandler.SetData<string[]>(ChannelListRemoteReference, this.dataStore.channelList),
        RemoteReferenceHandler.SetData<IChannelDataStore>(ChannelDataRemoteReference, this.dataStore.channelData)
        
        const response: ICommandResponse = {
            result: CommandConstants.JOIN_SUCCESS,
            whisper: true,
        }

        return Promise.resolve(response);
    }
}
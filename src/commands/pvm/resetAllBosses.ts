import { ICustomCommand, IDataStore, ICommandResponse, MonsterList } from "../../util/dataStore";
import { isUserAllowed } from "../../util/permissions";
import { RemoteReference, RemoteReferenceHandler } from "../../util/firebaseHandler";
import { FirebaseConstants } from "../../util/staticData/firebase";
import { CommandConstants } from "../../util/staticData/commands";

export class ResetAllBosses implements ICustomCommand {
    isWhisper = true;
    aliases = ['!resetall']

    constructor(private dataStore: IDataStore) {}

    async execute(channel: string, userState: Object, message: string): Promise<ICommandResponse> {
        isUserAllowed(channel, userState, this.dataStore).catch((err) => {
            return Promise.resolve({
                result: err,
                whisper: true
            })
        });

        const channelOwner = channel.replace('#', '');
        const channelData = this.dataStore.channelData[channelOwner];

        channelData.normalList = MonsterList;
        channelData.preferList = [];
        channelData.banList = [];

        const remoteRef = new RemoteReference(FirebaseConstants.CHANNEL_DATA_PATH + '/' + channelOwner);
        RemoteReferenceHandler.SetData(remoteRef, channelData);

        return Promise.resolve({
            result: CommandConstants.RESET_ALL_SUCCESS,
            whisper: true
        })
    }
}
import { ICustomCommand, ICommandResponse, IDataStore } from "../../util/dataStore";
import { isUserAllowed } from "../../util/permissions";
import { IImportData } from "./import";
import { ensureChannelDataLists } from "../util";

export class Export implements ICustomCommand {
    isWhisper = true;
    aliases = ['!e', '!export'];

    constructor(private dataStore: IDataStore) {}

    async execute(channel: string, userState: Object, message: string): Promise<ICommandResponse> {
        isUserAllowed(channel, userState, this.dataStore).catch((err) => {
            return Promise.resolve({
                result: err,
                whisper: true
            });
        });

        const channelOwner = userState['username'];
        const channelData = this.dataStore.channelData[channelOwner];
        const exportData: IExportData = {
            p: [],
            b: [],
            n: []
        }

        ensureChannelDataLists(channelData);
        for (var i = 0; i < channelData.banList.length; i++) {
            exportData.b.push(channelData.banList[i].displayName);
        }
        for (var i = 0; i < channelData.preferList.length; i++) {
            exportData.p.push(channelData.preferList[i].displayName);
        }
        for (var i = 0; i < channelData.normalList.length; i++) {
            exportData.n.push(channelData.normalList[i].displayName);
        }

        return Promise.resolve({
            result: JSON.stringify(exportData),
            whisper: this.isWhisper
        })
    }


}

export interface IExportData extends IImportData {
    n?: string[];
}
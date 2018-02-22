import { IDataStore, IChannelData } from "../util/dataStore";
import { isNullOrUndefined } from "util";


export function isChannelMod (channel: string, userState: Object, dataStore: IDataStore): boolean {
    return userState['user-type'] === 'mod' && dataStore.channelData[channel.replace('#', '')].modsEnabled;
}

export function isChannelOwner (channel:string, userState: Object): boolean {
    return '#' + userState['username'] === channel;
}

export function ensureChannelDataLists (channelData: IChannelData): void {
    if (isNullOrUndefined(channelData.normalList)) channelData.normalList = [];
    if (isNullOrUndefined(channelData.banList)) channelData.banList = [];
    if (isNullOrUndefined(channelData.preferList)) channelData.preferList = [];
}
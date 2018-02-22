import { IDataStore } from "../util/dataStore";


export function isChannelMod (channel: string, userState: Object, dataStore: IDataStore): boolean {
    return userState['user-type'] === 'mod' && dataStore.channelData[channel.replace('#', '')].modsEnabled;
}

export function isChannelOwner (channel:string, userState: Object): boolean {
    return '#' + userState['username'] === channel;
}
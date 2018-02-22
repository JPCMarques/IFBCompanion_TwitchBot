import { IDataStore } from "./dataStore";
import { isUndefined, isNullOrUndefined } from "util";
import { PermissionsConstants } from "./staticData/permissions";

export async function isUserAllowed(channel: string, userState: Object, dataStore: IDataStore): Promise<any> {
    const username = userState['username'];
    const channelOwner = channel.replace('#', '');

    if (channelOwner === username) return Promise.resolve();

    if (userState['user-type'] !== 'mod') return Promise.reject(PermissionsConstants.PERMISSION_DENIED); 

    const channelData = dataStore.channelData[channelOwner];
    if (isNullOrUndefined(channelData) || !channelData.modsEnabled) return Promise.reject(PermissionsConstants.PERMISSIONS_DISABLED);

    return Promise.resolve();
}
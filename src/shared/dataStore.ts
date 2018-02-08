export interface IDataStore {
    monsterList?: string[];
    channelList?: string[];
    commands?: {
        whisperCommands?: {
            [index: string] : string
        }
        chatCommands?: {
            [index: string] : string
        }
    }
}
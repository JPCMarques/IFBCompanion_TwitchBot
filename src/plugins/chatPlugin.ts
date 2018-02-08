import { BossVote } from "./pvm/bossVoting";
import { IDataStore } from "../shared/dataStore";

export interface IChatPlugin {
    trigger: string;
    aliases?: string[];
    isReply?: boolean;

    execute(channel: string, userState: Object, message: string): string;
}

export interface IPluginResponse {
    isReply: boolean;
    data: string;
}

export class ChatPluginManager {
    private pluginDirectory = new Map<string, IChatPlugin>();

    constructor(private dataStore: IDataStore) {
        this.registerPlugin(new BossVote(dataStore));
        const chatCommands = dataStore.commands.chatCommands;
        const whisperCommands = dataStore.commands.whisperCommands;

        Object.keys(chatCommands).forEach(key => {
            if(key.startsWith('!')) this.registerPlugin(new GenericResponsePlugin(key, chatCommands[key]));
        });

        Object.keys(whisperCommands).forEach(key => {
            if(key.startsWith('!')) this.registerPlugin(new GenericResponsePlugin(key, whisperCommands[key], [], true))
        })
    }

    registerPlugin(plugin: IChatPlugin): void {
        this.pluginDirectory.set(plugin.trigger, plugin);
    }

    async parseChat(channel: string, userState: Object, message: string): Promise<IPluginResponse> { 
        let messageTrigger = message.split(' ')[0];
        if (!this.pluginDirectory.has(messageTrigger)){
            return Promise.reject("No command registered to that trigger");
        }
        else {
            let plugin = this.pluginDirectory.get(messageTrigger);
            let filteredMessage = message.substring(messageTrigger.length + 1);
            let result = plugin.execute(channel, userState, filteredMessage);
            return Promise.resolve({isReply: plugin.isReply, data: result});
        }
    } 
}

export class GenericResponsePlugin implements IChatPlugin {

    constructor(public trigger: string, private replyMessage: string, public aliases: string[] = [], public isReply = false) {

    }

    execute(channel: string, userState: Object, message: string) {
        return this.replyMessage;
    }
}
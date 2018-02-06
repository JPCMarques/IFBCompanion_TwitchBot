import { BossVote } from "../pvm/bossVoting";
import { IDataStore } from "./dataStore";

export interface IChatPlugin {
    trigger: string;
    aliases?: string[];

    execute(channel: string, userState: Object, message: string);
}

export class ChatPluginManager {
    private pluginDirectory = new Map<string, IChatPlugin>();

    constructor(private dataStore: IDataStore) {
        this.registerPlugin(new BossVote(dataStore));
    }

    registerPlugin(plugin: IChatPlugin): void {
        this.pluginDirectory.set(plugin.trigger, plugin);
    }

    async parseChat(channel: string, userState: Object, message: string): Promise<any> { 
        let messageTrigger = message.split(' ')[0];
        if (!this.pluginDirectory.has(messageTrigger)){
            return Promise.reject("No command registered to that trigger");
        }
        else {
            let plugin = this.pluginDirectory.get(messageTrigger);
            let filteredMessage = message.substring(messageTrigger.length + 1);
            let result = plugin.execute(channel, userState, filteredMessage);
            return Promise.resolve(result);
        }
    } 
}

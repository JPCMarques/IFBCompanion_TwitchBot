import { IDataStore, ICustomCommand, IMonster, MonsterList, ICommandResponse } from "../../util/dataStore";
import { isChannelMod, isChannelOwner } from "../util";
import { isUserAllowed } from "../../util/permissions";
import { CommandConstants, CommandMessages } from "../../util/staticData/commands";
import { replaceMessageData } from "../../util/utils";

export class BossVote implements ICustomCommand {
    aliases = ['!bossvote', '!bvote', '!bv'];
    isWhisper = false;

    constructor(private dataStore: IDataStore) {}

    ongoingVotes = new Map<string, IChannelVotes>();

    async execute(channel: string, userState: Object, message: string): Promise<ICommandResponse> {
        message = message.substring(message.indexOf(' ') + 1);
        let isAllowed: boolean;

        

        const hasOngoingVote = this.ongoingVotes.has(channel);
        const messageTokens = message.split(' ');
        switch(messageTokens[0]){
            case BossVoteCommands.START:
                await isUserAllowed(channel, userState, this.dataStore).catch ((err) => {
                    return Promise.resolve({
                        result: err,
                        whisper: true
                    });
                })
                if (!hasOngoingVote){
                    this.ongoingVotes.set(channel, {bossVotes: [], voters: []});
                    return Promise.resolve({
                        result: CommandConstants.BOSS_VOTE_START_SUCCESS,
                        whisper: this.isWhisper
                    });
                }
                else{
                    return Promise.resolve({
                        result: CommandConstants.BOSS_VOTE_START_FAIL,
                        whisper: true
                    })
                }
            case BossVoteCommands.STOP:
                await isUserAllowed(channel, userState, this.dataStore).catch((err) => {
                    return Promise.resolve({
                        result: err,
                        whisper: true
                    });
                })
                if (hasOngoingVote){
                    let monsters = [...this.ongoingVotes.get(channel).bossVotes];
                    let voteCounter = new Map<IMonster, number>();
                    
                    let highestVote: IMonster;
                    let highestVoteCount = 0;

                    this.ongoingVotes.delete(channel);
                    for(var i = 0; i < monsters.length; i++){
                        if (!voteCounter.has(monsters[i])) {
                            voteCounter.set(monsters[i], 1);
                        }
                        else {
                            voteCounter.set(monsters[i], voteCounter.get(monsters[i]) + 1)
                        }
                        if(voteCounter.get(monsters[i]) > highestVoteCount){
                            highestVote = monsters[i];
                            highestVoteCount =  voteCounter.get(monsters[i]);
                        }
                    }

                    return Promise.resolve({
                        result: replaceMessageData(CommandMessages.BOSS_VOTE_STOP_SUCCESS, highestVote.displayName, highestVoteCount),
                        whisper: this.isWhisper
                    });
                }
                else{
                    return Promise.resolve({
                        result: CommandConstants.BOSS_VOTE_STOP_FAIL,
                        whisper: true
                    });
                }
                
            default:
                if(hasOngoingVote) {
                    const voterIndex = this.ongoingVotes.get(channel).voters.indexOf(userState['username']);
                    if (voterIndex !== -1) return Promise.resolve({
                        result: replaceMessageData(CommandMessages.BOSS_VOTE_DBLCAST, this.ongoingVotes.get(channel).bossVotes[voterIndex].displayName),
                        whisper: true
                    });

                    for (var i = 0; i < MonsterList.length; i++){
                        const bossToken = message.toLowerCase();
                        if (MonsterList[i].aliases.indexOf(bossToken) !== -1) {
                            this.ongoingVotes.get(channel).voters.push(userState['username']);
                            this.ongoingVotes.get(channel).bossVotes.push(MonsterList[i]);
                            return Promise.resolve({
                                result: replaceMessageData(CommandMessages.BOSS_VOTE_CAST, MonsterList[i].displayName),
                                whisper: this.isWhisper
                            });
                        }
                    }
                    return Promise.resolve({
                        result: replaceMessageData(CommandMessages.MISSING_BOSS, message.toLowerCase()), 
                        whisper: true
                    });
                }
                else {
                    return Promise.resolve({
                        result: CommandConstants.BOSS_VOTE_CLOSED,
                        whisper: true
                    });
                }
                
        }
    }

}

export enum BossVoteCommands {
    START = 'start',
    STOP = 'stop',
    VOTE = 'vote'
}

export interface IChannelVotes {
    bossVotes: IMonster[];
    voters: string[];
}
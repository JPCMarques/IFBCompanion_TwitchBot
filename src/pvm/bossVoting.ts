import { IChatPlugin } from "../shared/chatPlugin";
import { IDataStore } from "../shared/dataStore";

export class BossVote implements IChatPlugin{
    trigger = '!bossVote';

    ongoingVotes = new Map<string, IChannelVotes>();

    execute(channel: string, userState: Object, message: string): string {
        const isChannelOwner = '#' + userState['username'] === channel;
        const hasOngoingVote = this.ongoingVotes.has(channel);
        const messageTokens = message.split(' ');
        switch(messageTokens[0]){
            case BossVoteCommands.START:
                console.log(hasOngoingVote + "\n" + isChannelOwner);
                if (!hasOngoingVote && isChannelOwner){
                    this.ongoingVotes.set(channel, {bossVotes: [], voters: []});
                    return 'Vote started successfully!'
                }
                if (hasOngoingVote && isChannelOwner){
                    return `You already have an ongoing vote, and can't start a new one until you finish the old one - use '${this.trigger} stop' to stop a vote.`    
                }
                if (!isChannelOwner){
                    return 'You are not a channelOwner and therefore can\'t start a vote.';
                }
                break;
            case BossVoteCommands.STOP:
                if (hasOngoingVote && isChannelOwner){
                    let monsters = [...this.ongoingVotes.get(channel).bossVotes];
                    let voteCounter = new Map<string, number>();
                    
                    let highestVote: string;
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
                        }
                    }

                    return 'Vote stopped successfully! The winner was: ' + highestVote;
                }
                if (!hasOngoingVote && isChannelOwner){
                    return `You already don't an ongoing vote - use '${this.trigger} start' to start a new vote.`    
                }
                if (!isChannelOwner){
                    return 'You are not a channelOwner and therefore can\'t stop a vote.';
                }
                else return "Channel has no ongoing vote";
                
            default:
                if(hasOngoingVote) {
                    if (this.dataStore.monsterList.indexOf(message) !== -1){
                        if(this.ongoingVotes.get(channel).voters.indexOf(userState['username']) === -1){
                            this.ongoingVotes.get(channel).voters.push(userState['username']);
                            this.ongoingVotes.get(channel).bossVotes.push(message);
                            return "Vote registered.";
                        }
                        else {
                            return "User already voted.";
                        }
                    }
                    else {
                        return "Boss does not exist.";
                    }
                }
                else {
                    return "The channel does not have an open vote."
                }
                
        }
    }

    constructor(private dataStore: IDataStore) {

    }


}

export enum BossVoteCommands {
    START = 'start',
    STOP = 'stop',
    VOTE = 'vote'
}

export interface IChannelVotes {
    bossVotes: string[];
    voters: string[];
}
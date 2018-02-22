export interface IDataStore {
    channelList?: string[];
    channelData?: IChannelDataStore
}

export interface IChannelDataStore {
    [index: string]: IChannelData;
}

export interface IChannelData {
    modsEnabled: boolean;
    banList: IMonster[];
    normalList: IMonster[];
    preferList: IMonster[];
}

export interface IAliasableEntity {
    aliases: string[];
}

export interface ICommand extends IAliasableEntity {
    isWhisper: boolean;
}

export interface ISimpleCommand extends ICommand {
    data: string;
}

export interface ICustomCommand extends ICommand {
    execute(channel : string, userState: Object, message: string): Promise<ICommandResponse>
}

export interface ICommandResponse {
    whisper: boolean;
    result: string;
}

export type CommandType = ICustomCommand | ISimpleCommand;

export interface IMonster extends IAliasableEntity {
    displayName: string;
}

export const CommandList :  CommandType[] = [
    {
        aliases: ['!ifbcompanion' , '!ifbot', '!ifbot about', '!ifbcompanion about', '!ifbot a', '!ifbcompanion a'],
        isWhisper: true,
        data: 'Hey there! The information to be displayed is too big, so go to my project page for all the info you need: https://goo.gl/21Hojj'
    },
    {
        aliases: ['!ifbcompanion commands', '!ifbot commands', '!ifbot c', '!ifbcompanion c', '!ifbcompanion help', '!ifbot help', '!ifbot h', '!ifbcompanion h',],
        isWhisper: true,
        data: 'Hey there! There are too many commands to display, you can see a quick overview here: https://goo.gl/6FePPE'
    }
]

export const MonsterList : IMonster[] = [
    {
        aliases: ['kree\'arra', 'kree', 'arma', 'idiot bird'],
        displayName: 'Kree\'arra'
    },
    {
        aliases: ['araxxor', 'araxxi', 'rax', 'raxi', 'nope', 'spooder', 'newspaper target practice'],
        displayName: 'Araxxi'
    },
    {
        aliases: ['sara', 'saradomin', 'zilyana', 'commander zilyana', 'zilly', 'zily', 'feathery thingy of ice'],
        displayName: 'Commander Zilyana'
    },
    {
        aliases: ['general graardor', 'bandos', 'graardor', 'dumb fatass goblin'],
        displayName: 'General Graardor'
    },
    {
        aliases: ['k\'ril tsutsaroth', 'k\'ril', 'kril', 'zammy', 'zamorak', 'ouch my prayer'],
        displayName: 'K\'ril Tsutsaroth'
    },
    {
        aliases: ['nex', 'not a nihil', 'nexyboo', 'not aod'],
        displayName: 'Nex'
    },
    {
        aliases: ['giant mole', 'mole', 'bloody thing', 'y jagex', 'giant hole'],
        displayName: 'Giant Mole'    
    },
    {
        aliases: ['har-aken', 'shrimp', 'aids', 'onyx thingy', 'cape thingy', 'not jad'],
        displayName: 'Har-aken'
    },
    {
        aliases: ['king black dragon', 'kbd'],
        displayName: 'King Black Dragon'
    },
    {
        aliases: ['queen black dragon', 'qbd', 'sleeping ugly'],
        displayName: 'Queen Black Dragon'
    },
    {
        aliases: ['kalphite queen', 'kq', 'not kk'],
        displayName: 'Kalphite Queen'
    },
    {
        aliases: ['kalphite king', 'kk', 'not kq'],
        displayName: 'Kalphite King'
    },
    {
        aliases: ['corporeal beast', 'corp', 'puppy', 'pupper', 'sigil farm'],
        displayName: 'Corporeal Beast'
    },
    {
        aliases: ['chaos elemental', 'ellie', 'elly', 'ellen'],
        displayName: 'Chaos Elemental'
    },
    {
        aliases: ['legiones', 'legios'],
        displayName: 'Legiones'
    },
    {
        aliases: ['beastmaster durzag', 'bm', 'bigass airut', 'memezag'],
        displayName: 'Beastmaster Durzag'
    },
    {
        aliases: ['dagannoth kings', 'dks'],
        displayName: 'Dagannoth Kings'
    },
    {
        aliases: ['vorago', 'rago', 'vit camp', 'rocky fat dude', 'crwys wand price manip', 'so fat its tectonic'],
        displayName: 'Vorago'
    },
    {
        aliases: ['gregorovic', 'greg', 'greggo', 'not joker', 'sliske'],
        displayName: 'Gregorovic'
    },
    {
        aliases: ['helwyr', 'hel', 'seren', 'gamebugio', 'manbeardeer', 'not a crystal shapeshifter'],
        displayName: 'Helwyr'
    },
    {
        aliases: ['twin furies', 'tf', 'furies', 'twins', 'hardest gwd2'],
        displayName: 'Twin Furies'
    },
    {
        aliases: ['vindicta', 'vin', 'zaros', 'vindiddy', 'vin daddy', 'vin not diesel'],
        displayName: 'Vindicta'
    },
    {
        aliases: ['telos', 'tiltos', 'tentacle monster', 'hentai boss'],
        displayName: 'Telos, the Warden'
    },
    {
        aliases: ['aod', 'angel of death', 'nexaod', 'nex: aod', 'nex: angel of death', 'angel of loot', 'nex: age of deeps'],
        displayName: 'Nex: Angel of Death'
    },
    {
        aliases: ['yakamaru', 'yaka', 'not bm', 'burst blister', 'beachy boi', 'water worm', 'yakamary'],
        displayName: 'Yakamaru'
    },
    {
        aliases: ['magister', 'tuska wrath boss', 's-crap farm'],
        displayName: 'The Magister'
    },
    {
        aliases: ['rise of the six', 'rots', 'dps memes'],
        displayName: 'Rise of the Six'
    }
]
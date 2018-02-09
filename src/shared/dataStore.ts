export interface IDataStore {
    monsterList?: IMonster[];
    channelList?: string[];
    commandStore?: ICommand[];
}

export interface IAliasableEntity {
    aliases: string[];
}

export interface ICommand extends IAliasableEntity {
    isWhisper: boolean;
    data: string;
}

export interface IMonster extends IAliasableEntity {
    displayName: string;
}

export const MonsterList : IMonster[] = [
    {
        aliases: ['kree\'arra', 'kree', 'arma', 'idiot bird'],
        displayName: 'Kree\'arra'
    },
    {
        aliases: ['araxxor', 'araxxi', 'rax', 'raxi', 'nope', 'spooder', 'notepaper target practice'],
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
    }
]
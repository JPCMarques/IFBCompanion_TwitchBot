import * as firebase from 'firebase';
import * as prompt from 'prompt';
import 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import { IDataStore } from './dataStore';


export class FirebaseHandler {
    private readonly config = {
        apiKey: "AIzaSyA634L5zykBVmIL149mvClARDxfsUWBP9I",
        authDomain: "ifbcompanion.firebaseapp.com",
        databaseURL: "https://ifbcompanion.firebaseio.com",
        projectId: "ifbcompanion",
        storageBucket: "ifbcompanion.appspot.com",
        messagingSenderId: "306391723924"
    };

    private readonly schema = {
        properties: {
            email: {
                required: true
            },
            password: {
                hidden: true,
                required: true
            }
        }
    };

    private firebase: firebase.app.App;
    private dataStore: IDataStore = {};

    constructor() {
        this.firebase = firebase.initializeApp(this.config);
    }
    
    async init() : Promise<IDataStore> {
        prompt.start();
        return new Promise<IDataStore>( (resolve, reject) => {
            prompt.get(this.schema, (err, result) => {
                this.firebase.auth().signInWithEmailAndPassword(result.email, result.password)
                .then(() => {
                    this.loadData().then((dataStore) => {
                        resolve(dataStore)
                    });
                })
                .catch((err) => reject(err));
            });
        });
    }

    async loadData() : Promise<IDataStore> {
        await this.firebase.database().ref(FirebaseConstants.channelListPath).once('value')
            .then((snapshot) => {
                this.dataStore.channelList = snapshot.val();
            }).catch((err) => {
                return Promise.reject(err);
            });
        return Promise.resolve(this.dataStore);
    }

    joinChannel(channelName: string) : void {
        this.dataStore.channelList.push(channelName);
        this.firebase.database().ref(FirebaseConstants.channelListPath).set(this.dataStore.channelList);
    }

    leaveChannel(channelName: string): void {
        let index = this.dataStore.channelList.indexOf(channelName);
        if(index === -1) return;
        this.dataStore.channelList.splice(index, 1);
        this.firebase.database().ref(FirebaseConstants.channelListPath).set(this.dataStore.channelList);
    }

    updateData(data: IRemoteData<any>): void{
        data.onBeforeUpdate();
        this.firebase.database().ref(data.ref).set(data.data);
    }
}

export interface IRemoteData<T> {
    ref: string;
    data: T;

    onBeforeUpdate(): void;
}

export enum FirebaseConstants {
    channelListPath = 'constants/pvm/channelList',
    monsterListPath = 'constants/pvm/monsterList',
    commandListPath = 'constants/textCommands'
}
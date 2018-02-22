import * as firebase from 'firebase';
import * as prompt from 'prompt';
import 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import { IDataStore, MonsterList, IChannelDataStore } from './dataStore';
import { replaceMessageData } from './utils';
import { FirebaseMessages, FirebaseConstants } from './staticData/firebase';
import { isNullOrUndefined, isNull } from 'util';


export class FirebaseHandler {
    static instance: FirebaseHandler;

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
        FirebaseHandler.instance = this;
    }
    
    async init() : Promise<IDataStore> {
        prompt.start();
        RemoteReferenceHandler.init(this.firebase);
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
        return Promise.all([
            RemoteReferenceHandler.GetData<string[]>(ChannelListRemoteReference)
                .then((response: IRemoteDataResponse<string[]>) => {
                    console.log("Channel List start")
                    this.dataStore.channelList = response.payload;
                    console.log("Channel List end")
                }),
            RemoteReferenceHandler.GetData<IChannelDataStore>(ChannelDataRemoteReference)
                .then((response: IRemoteDataResponse<IChannelDataStore>) => {
                    console.log("Channel Data Start")
                    this.dataStore.channelData = response.payload;
                    console.log("Channel Data End")
                })
            ]
        ).then(() => {return Promise.resolve(this.dataStore)}).catch((err) => {return Promise.reject(err)})
    }

    leaveChannel(channelName: string): void {
        let index = this.dataStore.channelList.indexOf(channelName);
        if(index === -1) return;
        
        delete this.dataStore.channelData[channelName.replace('#', '')];
        this.dataStore.channelList.splice(index, 1);
        
        RemoteReferenceHandler.SetData<string[]>(ChannelListRemoteReference, this.dataStore.channelList);
        RemoteReferenceHandler.SetData<IChannelDataStore>(ChannelDataRemoteReference, this.dataStore.channelData);
    }

    updateChannelData(username: string) {
        this.firebase.database().ref(FirebaseConstants.CHANNEL_DATA_PATH + '/' + username).set(this.dataStore.channelData[username]);
    }
}

export interface IRemoteDataResponse<T>{
    isSuccess: boolean;
    message: string;
    payload?: T;
}

export class RemoteReference<T> {
    constructor(public remotePath: string) {}
    
    async handleGet(result: Promise<any>): Promise<IRemoteDataResponse<T>> {
        const response: IRemoteDataResponse<T> = {
            isSuccess: true,
            message: ''
        }
        
        try {
            return result.then((data) => {
                response.message = replaceMessageData(FirebaseMessages.GET_SUCCESS, this.remotePath);
                response.payload = data.val();
                return Promise.resolve(response);
            }).catch((error) => {
                response.isSuccess = false;
                response.message = replaceMessageData(FirebaseMessages.GET_FAIL, this.remotePath, error);
                return Promise.reject(response);
            });
   
        } catch (error) {
            response.isSuccess = false;
            response.message = error.message;
            return Promise.reject(response);
        }
    }
}

export abstract class RemoteReferenceHandler {
    private static firebase: firebase.app.App;

    static init(firebase: firebase.app.App): void {
        RemoteReferenceHandler.firebase = firebase;
    } 

    static async GetData<T> (remoteRef: RemoteReference<T>): Promise<IRemoteDataResponse<T>> {
        return remoteRef.handleGet(RemoteReferenceHandler.firebase.database().ref(remoteRef.remotePath).once('value'));
    }

    static async SetData<T> (remoteRef: RemoteReference<T>, data: T): Promise<IRemoteDataResponse<T>> {
        return RemoteReferenceHandler.firebase.database().ref(remoteRef.remotePath).set(data); //Firebase does not respond to sets, so it will always reject. 
    }
}

export const ChannelListRemoteReference = new RemoteReference<string[]>(FirebaseConstants.CHANNEL_LIST_PATH);
export const ChannelDataRemoteReference = new RemoteReference<IChannelDataStore>(FirebaseConstants.CHANNEL_DATA_PATH);
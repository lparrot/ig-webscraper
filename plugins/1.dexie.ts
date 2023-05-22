import Dexie, {Table} from 'dexie';

export class AppDexie extends Dexie {
    // 'friends' is added by dexie when declaring the stores()
    // We just tell the typing system this is the case
    gameInfos!: Table<GameInfo>;

    constructor() {
        super('ig_webscraper');
        this.version(1).stores({
            gameInfos: '++id, url, prices' // Primary key and indexed props
        });
    }
}


export default defineNuxtPlugin(async nuxt => {
    const db = new AppDexie();

    return {
        provide: {
            db
        }
    }
})
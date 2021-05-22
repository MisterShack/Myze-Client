import * as Realm from "realm-web";
import { ref } from "vue";
import { RealmServiceState } from "../typings/interface";

class RealmService {
  app: Realm.App;
  currentUser: any;
  database: any;
  collections: Object;

  constructor() {
    this.app = new Realm.App({
      id: "myze-mrzsi",
    });

    if (this.app.currentUser) {
      this.currentUser = ref(this.app.currentUser);
      this.initializeDatabase();
    } else {
      this.currentUser = ref(null);
    }
  }

  initializeDatabase() {
    this.database = this.currentUser.value
      .mongoClient("mongodb-atlas")
      .db("myze");

    this.collections = {
      accounts: this.database.collection<any>("accounts"),
      transactions: this.database.collection<any>("transactions"),
      recurring: this.database.collection<any>("recurring"),
      vendors: this.database.collection<any>("vendors"),
    };
  }

  async loginWithEmailAndPassword(email: string, password: string) {
    const credentials = Realm.Credentials.emailPassword(email, password);

    try {
      const user: Realm.User = await this.app.logIn(credentials);
      this.currentUser.value = user;
      this.initializeDatabase();
      return user;
    } catch (err) {
      console.log(err);
    }
  }
}

export const realm = new RealmService();

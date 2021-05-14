import * as Realm from "realm-web";
import { computed, reactive } from "vue";
import { RealmServiceState } from "../typings/interface";

class RealmService {
  state: RealmServiceState;
  currentUser: any;
  database: any;
  collections: Object;

  constructor() {
    this.state = reactive({
      app: new Realm.App({
        id: "myze-mrzsi",
      }),
    });

    this.currentUser = computed(() => this.state.app.currentUser);

    if (this.currentUser.value) {
      this.database = this.state.app.currentUser
        .mongoClient("mongodb-atlas")
        .db("myze");
      this.collections = {
        accounts: this.database.collection<any>("accounts"),
        transactions: this.database.collection<any>("transactions"),
        recurring: this.database.collection<any>("recurring"),
        vendors: this.database.collection<any>("vendors"),
      };
    }
  }

  async loginWithEmailAndPassword(email: string, password: string) {
    const credentials = Realm.Credentials.emailPassword(email, password);

    try {
      const user = (await this.state.app.logIn(credentials)) as Realm.User;

      return user;
    } catch (err) {
      console.error("Failed to log in", err);
    }
  }
}

export const realm = new RealmService();

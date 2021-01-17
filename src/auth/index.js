import firebase from "firebase";
import { ref } from "vue";
import firebaseConfig from "../../firebase_config.json";

export const user = ref(null);

export const initialized = ref(false);

firebase.initializeApp(firebaseConfig);
firebase.analytics();

export const auth = firebase.auth();

auth.onAuthStateChanged((u) => {
  user.value = u;
  initialized.value = true;
});

export async function logout() {
  await auth.signOut();
}


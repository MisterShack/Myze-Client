import firebase from "firebase";
import { ref } from "vue";
import firebaseConfig from "../../firebase_config.json";
import axios from "../api/AuthAxios.js";
import { loadVendors } from "../store/vendor";

export const user = ref(null);

export const initialized = ref(false);

firebase.initializeApp(firebaseConfig);
firebase.analytics();

export const auth = firebase.auth();

auth.onAuthStateChanged(async (u) => {
  user.value = u;
  initialized.value = true;

  axios.defaults.headers.common["Authorization"] = await u.getIdToken();

  loadVendors();
});

export async function logout() {
  await auth.signOut();
}

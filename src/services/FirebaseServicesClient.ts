import { collection, getAuth, getDocs, getFirestore, initializeApp, signInWithEmailAndPassword } from "../deps.ts";

class FirebaseServices{
    firebaseConfig?: JSON;
    firebaseApp?: any;
    auth?: any;
    database?: any;
    userCredential: any;

    constructor(firebaseAppName: string){
        this.firebaseConfig = JSON.parse(Deno.env.get("FIREBASE_APP_CONFIG") as string)
        this.firebaseApp = initializeApp(this.firebaseConfig, firebaseAppName);
        this.auth = getAuth(this.firebaseApp)
        this.database = getFirestore(this.firebaseApp)
    }

    async GetDocuments(collectionName:string){
        await signInWithEmailAndPassword(
            this.auth,
            Deno.env.get("FIREBASE_AUTH_EMAIL") as string,
            Deno.env.get("FIREBASE_AUTH_PASSWORD") as string,
          );
        const firestoreCollection = collection(this.database, collectionName);
        const docs = await getDocs(firestoreCollection);
        const data = docs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        return data;
    }
}

export const FirebaseServicesClient = new FirebaseServices(Deno.env.get("FIREBASE_APP_NAME") as string);

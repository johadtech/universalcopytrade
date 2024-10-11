import {doc, onSnapshot} from "firebase/firestore";
import {db} from "../firebase/firebase";

export async function getData(id) {
    try {
        onSnapshot(doc(db, "users", id), (doc) => {
            const data = doc.data();

            console.log('Firestore-User data: ' + data)
            return data
        });

        // if (isDeletingUser) {
        // isDeletingUser && unsubscribe();
        // }
    } catch (e) {
        console.log(e)
    }
}
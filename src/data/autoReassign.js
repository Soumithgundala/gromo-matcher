import { collection, getDocs, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseconfig";

export const checkAndResetExpiredLeads = async () => {
  const snapshot = await getDocs(collection(db, "leads"));
  const now = new Date();

  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();

    if (data.status === "assigned" && data.timestamp) {
      const assignedAt = data.timestamp.toDate(); // Firestore Timestamp to JS Date
      const hoursPassed = (now - assignedAt) / (1000 * 60 * 60);

      // For demo, use 1 minute instead of 24 hours
      if (hoursPassed >= 0.017) { // ~1 min
        await updateDoc(doc(db, "leads", docSnap.id), {
          assignedTo: null,
          status: "unassigned",
          timestamp: serverTimestamp()
        });

        console.log(`✅ Lead '${data.name}' auto-reset (was inactive for ${hoursPassed.toFixed(2)} hrs)`);
      }
    }
  }
};

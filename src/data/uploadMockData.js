import { db } from "../firebaseconfig";
import { collection, addDoc } from "firebase/firestore";

const occupations = ["Student", "Shop Owner", "Teacher", "Engineer", "Clerk", "Entrepreneur"];
const gpNames = ["Amit", "Bhavna", "Chirag", "Deepa", "Esha"];
const leadNames = ["Ravi", "Neha", "Priya", "Tahir", "Usha"];

export const uploadMockData = async () => {
  // Upload GPs
  for (let i = 0; i < gpNames.length; i++) {
    await addDoc(collection(db, "gpartners"), {
      name: gpNames[i],
      age: Math.floor(Math.random() * 40) + 18,
      occupation: occupations[i % occupations.length],
    });
  }

  // Upload Leads
  for (let i = 0; i < leadNames.length; i++) {
    await addDoc(collection(db, "leads"), {
      name: leadNames[i],
      age: Math.floor(Math.random() * 40) + 18,
      occupation: occupations[i % occupations.length],
      assignedTo: null,
      status: "unassigned",
      timestamp: null,
    });
  }

  alert("Mock GPs and Leads uploaded!");
};

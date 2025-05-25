import "./App.css";
import GPList from "./components/GPList";
import LeadList from "./components/LeadList";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseconfig";
import { uploadMockData } from "./data/uploadMockData";
import { checkAndResetExpiredLeads } from "./data/autoReassign";

function App() {
  const [gpList, setGpList] = useState([]);

  // Fetch all GPs on mount
  useEffect(() => {
    const fetchGPs = async () => {
      const querySnapshot = await getDocs(collection(db, "gpartners"));
      const gpData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setGpList(gpData);
    };
    fetchGPs();
  }, []);

  // Auto-reset leads every 30s (simulate 24h)
  useEffect(() => {
    const interval = setInterval(() => {
      checkAndResetExpiredLeads();
    }, 30000); // 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      <h1>GroMo AI Match Engine</h1>
      <button onClick={uploadMockData} style={{ margin: "10px" }}>
        Upload Mock Data
      </button>
      <GPList />
      <LeadList gpList={gpList} />
    </div>
  );
}

export default App;

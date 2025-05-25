import "./App.css";
import GPList from "./components/GPList";
import LeadList from "./components/LeadList";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseconfig";

function App() {
  const [gpList, setGpList] = useState([]);

  useEffect(() => {
    const fetchGPs = async () => {
      const querySnapshot = await getDocs(collection(db, "gpartners"));
      const gpData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setGpList(gpData);
    };
    fetchGPs();
  }, []);

  return (
    <div className="App">
      <h1>GroMo AI Match Engine</h1>
      <GPList onSelect={() => {}} />
      <LeadList gpList={gpList} />
    </div>
  );
}

export default App;

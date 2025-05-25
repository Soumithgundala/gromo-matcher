import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseconfig";
import { getAISuggestions } from "../utils/ai";

const GPList = () => {
  const [gps, setGps] = useState([]);
  const [aiResults, setAIResults] = useState({});

  useEffect(() => {
    const fetchGPs = async () => {
      const querySnapshot = await getDocs(collection(db, "gpartners"));
      const gpData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setGps(gpData);
    };
    fetchGPs();
  }, []);

  const handleAskAI = async (gp) => {
    const suggestions = await getAISuggestions(gp.age, gp.occupation);
    setAIResults(prev => ({ ...prev, [gp.id]: suggestions }));
  };

  return (
    <div>
      <h2>GroMo Partners (GPs)</h2>
      {gps.map(gp => (
        <div key={gp.id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
          <strong>{gp.name}</strong> (Age: {gp.age}, Occupation: {gp.occupation})<br />
          <button onClick={() => handleAskAI(gp)}>Ask AI</button>
          {aiResults[gp.id] && (
            <p><strong>AI Suggestion:</strong> {aiResults[gp.id]}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default GPList;

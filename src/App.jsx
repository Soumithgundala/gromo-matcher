// App.js (simplified for demonstration)
import "./App.css";
import GPList from "./components/GPList";
import LeadList from "./components/LeadList";
import MatchedList from "./components/MatchedList";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseconfig";
import { uploadMockData } from "./data/uploadMockData";
import { checkAndResetExpiredLeads } from "./data/autoReassign";


function App() {
  const [gpList, setGpList] = useState([]);
  const [age, setAge] = useState('');
  const [occupation, setOccupation] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


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

  const handleGetRecommendations = async () => {
    setLoading(true);
    setError(null);
    setRecommendations(''); // Clear previous recommendations

    if (!age || !occupation) {
      setError("Please enter both age and occupation.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ age: parseInt(age), occupation }), // Ensure age is a number
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setRecommendations(data.suggestions);
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      setError("Failed to fetch recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <MatchedList />
      <h1>GroMo AI Match Engine</h1>
      <button onClick={uploadMockData} style={{ margin: "10px" }}>
        Upload Mock Data
      </button>

      <h2>Financial Product Recommendations (OpenAI)</h2>
      <div>
        <label>
          Age:
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            min="1"
          />
        </label>
        <label style={{ marginLeft: '10px' }}>
          Occupation:
          <input
            type="text"
            value={occupation}
            onChange={(e) => setOccupation(e.target.value)}
          />
        </label>
        <button onClick={handleGetRecommendations} disabled={loading} style={{ marginLeft: '10px' }}>
          {loading ? 'Getting Recommendations...' : 'Get Recommendations'}
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {recommendations && (
        <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '15px' }}>
          <h3>Suggested Financial Products:</h3>
          <p>{recommendations}</p>
        </div>
      )}

      <hr style={{ marginTop: '40px', marginBottom: '20px' }}/>

      {/* Existing Firebase related components */}
      <GPList />
      <LeadList gpList={gpList} />
    </div>
  );
}

export default App;
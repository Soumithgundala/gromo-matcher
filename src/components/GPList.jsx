import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseconfig";

const GPList = ({ onSelect }) => {
  const [gps, setGps] = useState([]);

  useEffect(() => {
    const fetchGPs = async () => {
      const querySnapshot = await getDocs(collection(db, "gpartners"));
      const gpData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setGps(gpData);
    };
    fetchGPs();
  }, []);

  return (
    <div>
      <h2>GroMo Partners (GPs)</h2>
      {gps.map(gp => (
        <div key={gp.id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
          <strong>{gp.name}</strong> (Age: {gp.age}, Occupation: {gp.occupation})
        </div>
      ))}
    </div>
  );
};

export default GPList;

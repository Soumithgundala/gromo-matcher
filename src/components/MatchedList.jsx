import { useEffect, useState } from "react";
import { db } from "../firebaseconfig";
import { collection, getDocs } from "firebase/firestore";
import { suggestProducts } from "../data/match";

const MatchedList = () => {
  const [leads, setLeads] = useState([]);
  const [gps, setGps] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const leadSnap = await getDocs(collection(db, "leads"));
      const gpSnap = await getDocs(collection(db, "gpartners"));

      const gpMap = {};
      gpSnap.docs.forEach(doc => {
        gpMap[doc.id] = doc.data();
      });

      const leadData = leadSnap.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          age: data.age,
          occupation: data.occupation,
          status: data.status,
          assignedTo: data.assignedTo,
          products: suggestProducts(data.age),
          gp: data.assignedTo ? gpMap[data.assignedTo] : null
        };
      });

      setLeads(leadData);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>📋 Matched Leads</h2>
      {leads.map(lead => (
        <div key={lead.id} style={{ border: "1px solid #aaa", margin: "10px", padding: "10px" }}>
          <p><strong>Lead:</strong> {lead.name} ({lead.age}, {lead.occupation})</p>
          <p><strong>Suggested Products:</strong> {lead.products.join(", ")}</p>
          {lead.gp ? (
            <p><strong>Assigned GP:</strong> {lead.gp.name} ({lead.gp.age}, {lead.gp.occupation})</p>
          ) : (
            <p><em>Not yet assigned</em></p>
          )}
          <p><strong>Status:</strong> {lead.status}</p>
        </div>
      ))}
    </div>
  );
};

export default MatchedList;

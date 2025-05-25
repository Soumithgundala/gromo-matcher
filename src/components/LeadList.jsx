import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseconfig";
import LeadCard from "./LeadCard";
const LeadList = ({ gpList }) => {
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    const fetchLeads = async () => {
      const querySnapshot = await getDocs(collection(db, "leads"));
      const leadData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLeads(leadData.filter(lead => lead.status === "unassigned"));
    };
    fetchLeads();
  }, [gpList]);

  return (
    <div>
      <h2>Unassigned Leads</h2>
      {leads.length === 0 ? (
        <p>No available leads right now.</p>
      ) : (
        leads.map(lead => (
          <LeadCard key={lead.id} lead={lead} gpList={gpList} />
        ))
      )}
    </div>
  );
};

export default LeadList;

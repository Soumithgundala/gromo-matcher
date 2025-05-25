import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { suggestProducts, isGoodMatch } from "../data/match";
import { db } from "../firebaseconfig";

const LeadCard = ({ lead, gpList }) => {
  const suggested = suggestProducts(lead.age);

  const handleAssign = async (gp) => {
    const commonProducts = isGoodMatch(lead.age, gp.age);
    if (!commonProducts) {
      alert("No common product fit between GP and Lead.");
      return;
    }

    const leadRef = doc(db, "leads", lead.id);
    await updateDoc(leadRef, {
      assignedTo: gp.id,
      status: "assigned",
      timestamp: serverTimestamp()
    });

    alert(`Assigned ${lead.name} to ${gp.name} for: ${commonProducts.join(", ")}`);
  };

  const handleReject = async () => {
    const leadRef = doc(db, "leads", lead.id);
    await updateDoc(leadRef, {
      assignedTo: null,
      status: "unassigned",
      timestamp: serverTimestamp()
    });
    alert(`Lead ${lead.name} was rejected and returned to pool.`);
  };

  return (
    <div style={{ border: "1px solid #aaa", margin: "10px", padding: "10px" }}>
      <strong>{lead.name}</strong> (Age: {lead.age}, Occupation: {lead.occupation})
      <p>Suggested Products: {suggested.join(", ")}</p>
      <select onChange={(e) => handleAssign(gpList[e.target.value])} defaultValue="">
        <option value="" disabled>Select GP to assign</option>
        {gpList.map((gp, idx) => (
          <option value={idx} key={gp.id}>{gp.name} ({gp.age})</option>
        ))}
      </select>
      <button onClick={handleReject} style={{ marginLeft: "10px" }}>Reject</button>
    </div>
  );
};

export default LeadCard;

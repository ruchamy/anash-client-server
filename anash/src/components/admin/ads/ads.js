import React, { useState, useEffect } from "react";
import "./ads.css";
import axios from "axios";

const AdsAdmin = () => {
  const [ads, setAds] = useState([]);
  const [newAd, setNewAd] = useState({
    image: "",
    name: "",
    phone: "",
  });

  const fetchAds = async () => {
    try {
      const response = await axios.get("https://anash-server.onrender.com/ads");
      setAds(response.data);
    } catch (error) {
        setAds( [    {
            image: "",
            name: "",
            phone: "",
          }]);
      console.error("שגיאה בטעינת פרסומות:", error);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const handleInputChange = (e) => {
    setNewAd({ ...newAd, [e.target.name]: e.target.value });
  };

  const handleAddAd = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://anash-server.onrender.com/ads", newAd);
      setNewAd({ image: "", name: "", phone: "" });
      fetchAds();
    } catch (error) {
      console.error("שגיאה בהוספת פרסומת:", error);
    }
  };

  const toggleAdStatus = async (id) => {
    try {
      await axios.patch(`https://anash-server.onrender.com/ads/${id}/toggle`);
      fetchAds();
    } catch (error) {
      console.error("שגיאה בשינוי סטטוס:", error);
    }
  };

  const deleteAd = async (id) => {
    if (!window.confirm("אתה בטוח שברצונך למחוק את הפרסומת?")) return;
    try {
      await axios.delete(`https://anash-server.onrender.com/ads/${id}`);
      fetchAds();
    } catch (error) {
      console.error("שגיאה במחיקת פרסומת:", error);
    }
  };

  return (
    <div className="ads-admin">
      <h2>ניהול פרסומות</h2>

      {/* טופס הוספת פרסומת */}
      <form onSubmit={handleAddAd} className="ad-form">
        <input
          type="text"
          name="image"
          placeholder="קישור לתמונה"
          value={newAd.image}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="name"
          placeholder="שם המפרסם"
          value={newAd.name}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="טלפון"
          value={newAd.phone}
          onChange={handleInputChange}
          required
        />
        <button type="submit">הוסף פרסומת</button>
      </form>

      {/* רשימת פרסומות קיימות */}
      <div className="ads-list">
        {ads.map((ad) => (
          <div key={ad._id} className="ad-item">
            <img src={ad.image} alt={ad.name} className="ad-image" />
            <div className="ad-details">
              <p><strong>שם:</strong> {ad.name}</p>
              <p><strong>טלפון:</strong> {ad.phone}</p>
              <p><strong>סטטוס:</strong> {ad.active ? "פעיל" : "לא פעיל"}</p>
              <div className="ad-buttons">
                <button onClick={() => toggleAdStatus(ad._id)}>
                  שנה סטטוס
                </button>
                <button onClick={() => deleteAd(ad._id)} className="delete-button">
                  מחק
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdsAdmin;

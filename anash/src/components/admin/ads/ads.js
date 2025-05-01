import React, { useState, useEffect } from "react";
import AlertBox from "../../alertBox"; // נתיב לפי הפרויקט שלך
import "./ads.css"; // נתיב לפי הפרויקט שלך


const AdsAdmin = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [adToDelete, setAdToDelete] = useState(null);
  const [ads, setAds] = useState([]);
  const [newAd, setNewAd] = useState({
    status: "inactive",
    image: null,
    link: "",
    description: "",
    start_date: "",
    end_date: "",
  });

  const fetchAds = async () => {
    try {
      const response = await fetch("https://anash-server.onrender.com/ads");
      const data = await response.json();
      setAds(data);
    } catch (error) {
      console.error("שגיאה בטעינת פרסומות:", error);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAd({ ...newAd, [name]: value });
  };

  const handleFileChange = (e) => {
    setNewAd({ ...newAd, image: e.target.files[0] });
  };

  const handleAddAd = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("status", newAd.status);
    formData.append("Link", newAd.link);
    formData.append("description", newAd.description);
    formData.append("start_date", newAd.start_date);
    formData.append("end_date", newAd.end_date);

    if (newAd.image) {
      formData.append("image", newAd.image);
    }

    try {
      await fetch("https://anash-server.onrender.com/ads", {
        method: "POST",
        body: formData,
      });
      setNewAd({
        status: "inactive",
        image: null,
        link: "",
        description: "",
        start_date: "",
        end_date: "",
      });
      fetchAds();
    } catch (error) {
      console.error("שגיאה בהוספת פרסומת:", error);
    }
  };

  const toggleAdStatus = async (id) => {
    try {
      await fetch(`https://anash-server.onrender.com/ads/${id}/toggle`, {
        method: "PATCH",
      });
      fetchAds();
    } catch (error) {
      console.error("שגיאה בשינוי סטטוס:", error);
    }
  };

  const handleAlertClose = async (confirmed) => {
    if (confirmed && adToDelete) {
      try {
        await fetch(`https://anash-server.onrender.com/ads/${adToDelete}`, {
          method: "DELETE",
        });
        fetchAds();
      } catch (error) {
        console.error("שגיאה במחיקה:", error);
      }
    }
    setShowAlert(false);
    setAdToDelete(null);
  };


  return (
    <div className="ads-admin">
      <h2>ניהול פרסומות</h2>

      <form onSubmit={handleAddAd} className="ad-form" encType="multipart/form-data">
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleFileChange}
          required
        />
        <select name="status" value={newAd.status} onChange={handleInputChange}>
          <option value="active">פעיל</option>
          <option value="inactive">לא פעיל</option>
        </select>
        <input
          type="text"
          name="link"
          placeholder="קישור"
          value={newAd.link}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="תאור"
          value={newAd.description}
          onChange={handleInputChange}
          required
        />
        <input
          type="date"
          name="start_date"
          value={newAd.start_date}
          onChange={handleInputChange}
          required
        />
        <input
          type="date"
          name="end_date"
          value={newAd.end_date}
          onChange={handleInputChange}
          required
        />
        <button type="submit">הוסף פרסומת</button>
      </form>

      <div className="ads-list">
        {ads.map((ad) => (
          <div key={ad.id} className="ad-item">
            <a href={ad.link} target="_blank" rel="noopener noreferrer">
              <img src={ad.image} alt={ad.description} className="ad-image" />
            </a>
            <div className="ad-details">
              <p> {ad.description}</p>
              <p><strong>סטטוס:</strong> {ad.status === "active" ? "פעיל" : "לא פעיל"}</p>
              <p><strong>תוקף:</strong> {ad.start_date} - {ad.end_date}</p>
              <div className="ad-buttons">
                <button onClick={() => toggleAdStatus(ad.id)}>
                  שנה סטטוס
                </button>
                <button onClick={() => {
                  setAdToDelete(ad.id);
                  setShowAlert(true);
                }}>
                  מחק
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {showAlert && (
        <AlertBox
          message="האם אתה בטוח שברצונך למחוק את הפרסומת?"
          showCancel={true}
          onClose={handleAlertClose}
        />
      )}
    </div>
  );
};

export default AdsAdmin;

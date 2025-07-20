import React, { useState, useEffect } from "react";
import AlertBox from "../../alertBox"; // נתיב לפי הפרויקט שלך
import "./ads.css"; // נתיב לפי הפרויקט שלך


const AdsAdmin = () => {
  const [alert, setAlert] = useState(false);
  const [adToDelete, setAdToDelete] = useState(null);
  const [ads, setAds] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [newAd, setNewAd] = useState({
    status: "inactive",
    image: null,
    link: "",
    description: "",
    start_date: new Date().toISOString().split("T")[0],
    end_date: new Date().toISOString().split("T")[0],
  });

  const fetchAds = async () => {
    try {
      const response = await fetch("http://localhost:3000/ads");
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
    if (e.target.files && e.target.files[0]) {
      setNewAd({ ...newAd, image: e.target.files[0] });
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
    else {
      console.log("no file selected");
    }
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
      await fetch("http://localhost:3000/ads", {
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
      await fetch(`http://localhost:3000/ads/${id}/toggle`, {
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
        await fetch(`http://localhost:3000/ads/${adToDelete}`, {
          method: "DELETE",
        });
        fetchAds();
      } catch (error) {
        console.error("שגיאה במחיקה:", error);
      }
    }
    setAlert(false);
    setAdToDelete(null);
  };


  return (
    <div className="ads-admin">
      <h2>ניהול פרסומות</h2>

      <form onSubmit={handleAddAd} className="ad-form" encType="multipart/form-data">
        <div className="form-inputs-container">
          <div
            className="ad-image-upload-container"
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
            onDrop={(e) => {
              e.preventDefault(); e.stopPropagation();
              const file = e.dataTransfer.files[0];
              if (file) { setNewAd({ ...newAd, profilePicture: file }); setImagePreview(URL.createObjectURL(file)); }
            }}
          >
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="image-preview" />
            ) : (
              <label htmlFor="imageUpload" className="upload-label">
                גרור ושחרר תמונה כאן או לחץ להעלאה
              </label>
            )}
            <input
              type="file"
              name="image"
              id="imageUpload"
              accept="image/*"
              onChange={handleFileChange}
              required
              style={{ display: 'none' }}
            />
          </div>
          <div className="inputs">
            <input
              type="text"
              name="link"
              placeholder="קישור"
              value={newAd.link}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="description"
              placeholder="פרטי המפרסם"
              value={newAd.description}
              onChange={handleInputChange}
              required
            />
            <select name="status" value={newAd.status} onChange={handleInputChange}>
              <option value="active">פעיל</option>
              <option value="inactive">לא פעיל</option>
              <option value="date">לפי תאריך</option>
            </select>
            {newAd.status === "date" && <>
             {/* <div className="date-inputs"> */}
              <label>תאריך התחלה</label>
              <input
                min={new Date().toISOString().split("T")[0]}
                type="date"
                name="start_date"
                value={newAd.start_date}
                onChange={handleInputChange}
              />
              <label>תאריך סיום</label>
              <input
                min={new Date(newAd.start_date).toISOString().split("T")[0]}
                type="date"
                name="end_date"
                value={newAd.end_date}
                onChange={handleInputChange}
              />
             
            {/* </div> */} </>
            }
          </div>
        </div>
        <button type="submit">הוסף פרסומת</button>
      </form>

      <div className="ads-list">
        {ads.map((ad) => {
          if (ad.status == "date") {
            //if today is in between start_date and end_date, set status to active
            const today = new Date();
            const start = new Date(ad.start_date);
            const end = new Date(ad.end_date);
            if (today >= start && today <= end) {
              ad.status = "active";
            } else {
              ad.status = "inactive";
            }
          } return ad;
        })
          .map((ad) => (
            <div key={ad.id} className="ad-item">
              <a href={ad.link} target="_blank" rel="noopener noreferrer">
                <img
                  src={`http://localhost:3000${ad.image}` || '/logo512.png'}
                  alt={ad.description}
                  className={`ad-image ${ad.status}`}
                /></a>
              <div className="ad-details">
                <p> {ad.description}</p>
                <p> {ad.status === "active" ? "פעיל" : "לא פעיל"}</p>
                {ad.status === "inactive" && ad.start_date && <p><strong>יתחיל ב:</strong> {ad.start_date} - {ad.end_date}</p>}
                {ad.status === "active" && ad.end_date && <p><strong>עד</strong>{ad.end_date}</p>}
                <div className="ad-buttons">
                  <button onClick={() => toggleAdStatus(ad.id)}>
                    שנה סטטוס
                  </button>
                  <button onClick={() => { setAdToDelete(ad.id); setAlert(true); }}>
                    מחק
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

      {alert && (
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

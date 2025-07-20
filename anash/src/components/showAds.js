import { useState, useEffect } from 'react';
import axios from 'axios';
import './showAds.css'; // קובץ CSS נפרד

const ShowAds = () => {
  const [ads, setAds] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await axios.get('http://localhost:3000/ads');
        setAds(response.data);
      } catch (err) {
        console.error('שגיאה בטעינת פרסומות:', err);
      }
    };
    fetchAds();
  }, []);

  useEffect(() => {
    if (ads.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % ads.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [ads]);

  return (
    <div className="ads-container">
      {ads.length > 0 && ads[currentIndex].status === 'active' && (
        <div className="ad-wrapper">
          <a href={ads[currentIndex].link} target="_blank" rel="noopener noreferrer">
            <img
              className="ad-image-show"
              src={`http://localhost:3000${ads[currentIndex].image}`}
              alt={ads[currentIndex].description}
            />
          </a>
        </div>
      )}
    </div>
  );
};

export default ShowAds;

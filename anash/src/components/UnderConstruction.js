import React from "react";
import "./UnderConstruction.css";

const UnderConstruction = () => {
  return (
    <div className="under-construction">
      <div className="content">
        <h1>האתר בבנייה</h1>
        <p>אנחנו עובדים על משהו מדהים. בקרו שוב בקרוב!</p>
        <div className="gears">
          <div className="gear"></div>
          <div className="gear"></div>
          <div className="gear"></div>
        </div>
      </div>
    </div>
  );
};

export default UnderConstruction;

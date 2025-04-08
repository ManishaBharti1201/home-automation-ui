import React from "react";

const Patna: React.FC<{ url: string }> = ({ url }) => {
    return (
      <iframe
        src={`http://localhost:5000/proxy?url=${encodeURIComponent(url)}`}
        style={{ width: "100%", height: "100%" }}
        title="Patna"
      ></iframe>
    );
  };
  
  export default Patna;
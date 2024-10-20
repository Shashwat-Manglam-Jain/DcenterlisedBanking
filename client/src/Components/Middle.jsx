import React from "react";
import CurrentBalance from "./CurrentBalance";
import Request from "./Request";
import AccDetails from "./AccDetails";
import RecentActivity from "./RecentActivity";


const Middle = () => {


  return (
    <div style={{padding:"0px 40px 0px 40px",overflow:"hidden"}}>
      <div className="row">
   
        <div className="col-md-9 col-lg-5 mb-4 container">
          <CurrentBalance />
          <Request />
          <AccDetails />
        </div>
        
        {/* Right Column for Recent Activity */}
        <div className="col-md-12 col-lg-7 mb-4 my-5">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};

export default Middle;

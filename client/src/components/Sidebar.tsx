import React, { useState } from "react";
import "../styles/sidebar.css";

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  const openSidebar = () => {
    setOpen(!open);
  };

  return (
    <div className="Sidebar">
      {open ? (
        <div className="SidebarOpened">
          <div className="HeaderChatSidebar">
            <h3>Chats</h3>
            <button
              style={{ margin: "10px" }}
              className="OpenButton"
              onClick={openSidebar}
            >
              📂
            </button>
          </div>
          <div className="ChatsList">hi</div>
        </div>
      ) : (
        <button className="OpenButton" onClick={openSidebar}>
          📁
        </button>
      )}
    </div>
  );
};

export default Sidebar;

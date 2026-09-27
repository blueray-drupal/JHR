import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./sidebar.css";

const Sidebar = ({ title, items = [] }) => {
    const location = useLocation();

    return (
        <aside className="sidebar-container">
            {title && <div className="sidebar-header">{title}</div>}
            <ul className="sidebar-menu">
                {items.map((item) => {
                    const isActive = location.pathname === item.link;
                    return (
                        <li key={item.id || item.link} className={`sidebar-item ${isActive ? "active" : ""}`}>
                            <Link to={item.link}>
                                <span>{item.title}</span>
                                <span className="arrow"><img src="../../../assets/learn-more.png" alt="" /></span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </aside>
    );
};

export default Sidebar;
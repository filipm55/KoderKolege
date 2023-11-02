import React from "react";
import './Footer.css'

function Footer() {
    return (
        <footer>
            <div className="container">
            <p>&copy; {new Date().getFullYear()} BytePit</p>
            </div>
        </footer>
    )
}

export default Footer
import React from "react";

export default function Footer({ gameActive }) {
  if (gameActive) return null;

  return (
    <footer id="appFooter">
      <small>
        © 2025 Emil Suuronen // Mölkkis //{" "}
        <a href="https://github.com/EmilSuuronen/molkky-board" target="_blank" rel="noopener noreferrer">
          Github
        </a>
      </small>
    </footer>
  );
}

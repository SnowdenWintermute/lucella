/* eslint-disable react/jsx-curly-brace-presence */
/* eslint-disable react/no-unescaped-entities */
import React from "react";

function PatchNotes({ setViewingPatchNotes }: { setViewingPatchNotes: (value: boolean) => void }) {
  return (
    <div className="patch-notes">
      <div>
        <h4>Version History</h4>
      </div>
      <span className="patch-notes__version-name">alpha 0.4.0 "multi-round battles"</span>
      <ul>
        <li>Ranked game winners are now decided by a best of 5 rounds match</li>
        <li>
          Hosts of casual games can select between best of 1, 3, 5, and 7 round matches using a newly created accessible and styleable select input component
        </li>
        <li>Added a new theme, "Virginia Bluebell", currently accessible by clicking the website logo in the navbar</li>
        <li>Restyled the main menu scorecard element</li>
        <li>
          Fixed a bug that caused the main menu to attempt to load the scorecard for guest users whenever they would activate the user nameplate context menu
        </li>
      </ul>
      <span className="patch-notes__version-name">alpha 0.3.0 "waypoints"</span>
      <ul>
        <li>
          Players can now issue waypoint commands to their orbs by holding <span className="patch-notes__keyboard-key-name">{"[Spacebar]"}</span> when assigning
          orb destinations
        </li>
        <li>Orb destinations and waypoint paths are now displayed for a player's own orbs</li>
      </ul>
      <span className="patch-notes__version-name">alpha 0.2.0 "restyle"</span>
      <ul>
        <li>Major overhaul of frontend styles</li>
        <li>New themes, "VT320" and "HTML", currently accessible by clicking the website logo in the navbar</li>
        <li>Optimized modals and context menus</li>
        <li>Added support for screenreaders</li>
        <li>Fixed tab indexing of UI elements for better keyboard navigation</li>
        <li>Added loading spinners and indicators for several menus</li>
        <li>Changed to a new logo</li>
        <li>Updated the Battle Room colors to match the website themes (VT320 and default themes only)</li>
        <li>Added ability to close lobby menus with the Escape key</li>
        <li>Links can now be posted in chat</li>
      </ul>
      <button type="button" className="button" onClick={() => setViewingPatchNotes(false)}>
        Close
      </button>
    </div>
  );
}

export default PatchNotes;

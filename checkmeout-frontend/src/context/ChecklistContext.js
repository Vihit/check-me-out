import React from "react";

let cls = [];
function setContextChecklists(checklists) {
  cls = checklists;
}

const ChecklistContext = React.createContext({
  checklists: cls,
  setContextChecklists: setContextChecklists,
});

export default ChecklistContext;

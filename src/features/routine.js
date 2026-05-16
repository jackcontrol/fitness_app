// Routine — circadian / hydration helpers.
// Lifted from index.html L24704 (getHydrationSchedule).
//
// Hydration: 8-checkpoint daily schedule. Total derives from profile.waterOz
// (default 96 oz) split into 8 equal pours. Last checkpoint (8 PM) labeled
// optional to nudge an evening taper without breaking the math.
//
// Pure module — no localStorage. State (which checkpoints user has ticked)
// lives in tracker-state under state.hydration[date][checkpointId].

export function getHydrationSchedule(profile) {
  const p = profile || window.profile;
  const totalOz = (p && p.waterOz) ? p.waterOz : 96;
  const perCheckpoint = Math.round(totalOz / 8);

  return [
    { id: 'h1', time: '6:00 AM',  amount: `${perCheckpoint}oz`, oz: perCheckpoint },
    { id: 'h2', time: '8:00 AM',  amount: `${perCheckpoint}oz`, oz: perCheckpoint },
    { id: 'h3', time: '10:00 AM', amount: `${perCheckpoint}oz`, oz: perCheckpoint },
    { id: 'h4', time: '12:00 PM', amount: `${perCheckpoint}oz`, oz: perCheckpoint },
    { id: 'h5', time: '2:00 PM',  amount: `${perCheckpoint}oz`, oz: perCheckpoint },
    { id: 'h6', time: '4:00 PM',  amount: `${perCheckpoint}oz`, oz: perCheckpoint },
    { id: 'h7', time: '6:00 PM',  amount: `${perCheckpoint}oz`, oz: perCheckpoint },
    { id: 'h8', time: '8:00 PM',  amount: `${perCheckpoint}oz (optional)`, oz: perCheckpoint }
  ];
}

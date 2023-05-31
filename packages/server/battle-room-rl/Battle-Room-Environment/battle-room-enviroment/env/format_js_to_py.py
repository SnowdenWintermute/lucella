import javascript

def format_shallow_object_to_py(js):
    to_return = {}
    for key in js:
        to_return[key] = js[key]
    return to_return

def format_js_obs_to_py(agents, js):
    return { a: [
        js[a]['ownEndzoneY'],
        js[a]['gameSpeed'],
        js[a]['orbRadius'], 
        js[a]['ownScore'],
        js[a]['opponentScore'],
        js[a]['ownOrbPositions'][0].x,
        js[a]['ownOrbPositions'][1].x,
        js[a]['ownOrbPositions'][2].x,
        js[a]['ownOrbPositions'][3].x,
        js[a]['ownOrbPositions'][3].y,
        js[a]['opponentOrbPositions'][0].x,
        js[a]['opponentOrbPositions'][0].y,
        js[a]['opponentOrbPositions'][1].x,
        js[a]['opponentOrbPositions'][1].y,
        js[a]['opponentOrbPositions'][2].x,
        js[a]['opponentOrbPositions'][2].y,
        js[a]['opponentOrbPositions'][3].x,
        js[a]['opponentOrbPositions'][3].y,
        js[a]['ownOrbGhostStatus'][0],
        js[a]['ownOrbGhostStatus'][1],
        js[a]['ownOrbGhostStatus'][2],
        js[a]['ownOrbGhostStatus'][3],
        js[a]['opponentOrbGhostStatus'][0],
        js[a]['opponentOrbGhostStatus'][1],
        js[a]['opponentOrbGhostStatus'][2],
        js[a]['opponentOrbGhostStatus'][3]
        ] for a in agents}

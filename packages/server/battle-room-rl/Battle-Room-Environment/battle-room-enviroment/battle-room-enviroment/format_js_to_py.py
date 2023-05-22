import javascript

def format_shallow_object_to_py(js):
    to_return = {}
    for key in js:
        to_return[key] = js[key]
    return to_return

def format_js_obs_to_py(agents, js):
    return { a: {
        "ownEndzoneY": js[a]['ownEndzoneY'],
        "gameSpeed": js[a]['gameSpeed'],
        "orbRadius":js[a]['orbRadius'], 
        "ownScore": js[a]['ownScore'],
        "opponentScore": js[a]['opponentScore'],
        "scoreNeededToWin": js[a]['scoreNeededToWin'],
        "own_orb_positions": (
            (
                js[a]['ownOrbPositions'][0].x,
                js[a]['ownOrbPositions'][0].y
                ),
            (
                js[a]['ownOrbPositions'][1].x,
                js[a]['ownOrbPositions'][1].y
                ),
            (
                js[a]['ownOrbPositions'][2].x,
                js[a]['ownOrbPositions'][2].y
                ),
            (
                js[a]['ownOrbPositions'][3].x,
                js[a]['ownOrbPositions'][3].y
                ),
            ),
        "opponent_orb_positions": (
            (
                js[a]['opponentOrbPositions'][0].x,
                js[a]['opponentOrbPositions'][0].y
                ),
            (
                js[a]['opponentOrbPositions'][1].x,
                js[a]['opponentOrbPositions'][1].y
                ),
            (
                js[a]['opponentOrbPositions'][2].x,
                js[a]['opponentOrbPositions'][2].y
                ),
            (
                js[a]['opponentOrbPositions'][3].x,
                js[a]['opponentOrbPositions'][3].y
                )
            ),
        "ownOrbGhostStatus": (
            js[a]['ownOrbGhostStatus'][0],
            js[a]['ownOrbGhostStatus'][1],
            js[a]['ownOrbGhostStatus'][2],
            js[a]['ownOrbGhostStatus'][3]
            ),
        "opponentOrbGhostStatus": (
            js[a]['opponentOrbGhostStatus'][0],
            js[a]['opponentOrbGhostStatus'][1],
            js[a]['opponentOrbGhostStatus'][2],
            js[a]['opponentOrbGhostStatus'][3]
            )
        } for a in agents}

import javascript
from javascript import require
from gymnasium.spaces import Dict, Discrete, Tuple
from pettingzoo.utils.env import ParallelEnv

jsBattleSchoolEnv = require('../../../../dist/battle-room-rl-environment/index.js')['default']
print(jsBattleSchoolEnv['getObservations']()['host'])

class BattleSchoolEnvironment(ParallelEnv):
    metadata = { "name" : "battle_school_environment_v0" }

    possible_agents = ['host', 'challenger']
    agents = ['host', 'challenger']
    MAX_TIMESTEP = 6000
    timestep = 0

    def reset(self, seed=None, options=None):
        jsFormattedObservations = jsBattleSchoolEnv['getObservations']()
        pyFormatted = self.formatJsObsToPy(jsFormattedObservations)
        return pyFormatted

    def step(self, actions):
        actions = {
                "host": {"cursor_position": (450, 234),"number_key_pressed": 2, "playerRole": "host"},
                "challenger": {"cursor_position": (450, 234),"number_key_pressed": 0, "playerRole": "challenger"},
                }
        jsBattleSchoolEnv.step(actions)

    def render(self):
        pass

    def observation_space(self, agent):
        return Dict({
            "ownEndzoneY": Discrete(750),
            "gameSpeed": Box(low=.2, high=+inf, shape=(1,)),
            "orbRadius": Discrete(40),
            "ownScore": Discrete(+inf),
            "opponentScore": Discrete(+inf),
            "scoreNeededToWin": Discrete(+inf),
            "own_orb_positions": Tuple(
                Tuple(Discrete(450), Discrete(750)),
                Tuple(Discrete(450), Discrete(750)),
                Tuple(Discrete(450), Discrete(750)),
                Tuple(Discrete(450), Discrete(750)),
                ),
            "opponent_orb_positions": Tuple(
                Tuple(Discrete(450), Discrete(750)),
                Tuple(Discrete(450), Discrete(750)),
                Tuple(Discrete(450), Discrete(750)),
                Tuple(Discrete(450), Discrete(750)),
                ),
            "ownOrbGhostStatus": Tuple(Discrete(1), Discrete(1), Discrete(1), Discrete(1)),
            "opponentOrbGhostStatus": Tuple(Discrete(1), Discrete(1), Discrete(1), Discrete(1))
            })
        return self.observation_spaces[agent]

    def action_space(self, agent):
        return Dict({
            "cursor_position": Tuple(Discrete(450), Discrete(750)),
            "number_key_pressed": Discrete(5),
            })

    def formatJsObsToPy(self, js):
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
                    ),
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
            } for a in self.agents}

test = BattleSchoolEnvironment()

print(test.reset())
test.step([])

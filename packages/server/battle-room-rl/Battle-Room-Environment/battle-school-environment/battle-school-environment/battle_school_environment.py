import javascript
from javascript import require
from gymnasium.spaces import Dict, Discrete, Tuple
from pettingzoo.utils.env import ParallelEnv

jsBattleSchoolEnv = require('../../../../dist/battle-room-rl-environment/index.js')['default']
print(jsBattleSchoolEnv['getObservations']()['host'])

class BattleSchoolEnvironment(ParallelEnv):
    metadata = {
            "name" : "battle_school_environment_v0"
            }

    possible_agents = ['host', 'challenger']
    agents = ['host', 'challenger']
    MAX_TIMESTEP = 6000
    timestep = 0
    
    def reset(self, seed=None, options=None):
        jsFormattedObservations = jsBattleSchoolEnv['getObservations']()
        pyFormatted = { a: {
                        "ownEndzoneY": jsFormattedObservations[a]['ownEndzoneY'],
                        "gameSpeed": jsFormattedObservations[a]['gameSpeed'],
                        "orbRadius":jsFormattedObservations[a]['orbRadius'], 
                        "ownScore": jsFormattedObservations[a]['ownScore'],
                        "opponentScore": jsFormattedObservations[a]['opponentScore'],
                        "scoreNeededToWin": jsFormattedObservations[a]['scoreNeededToWin'],
                        "own_orb_positions": (
                                (
                                    jsFormattedObservations[a]['ownOrbPositions'][0].x,
                                    jsFormattedObservations[a]['ownOrbPositions'][0].y
                                ),
                                (
                                    jsFormattedObservations[a]['ownOrbPositions'][1].x,
                                    jsFormattedObservations[a]['ownOrbPositions'][1].y
                                ),
                                (
                                    jsFormattedObservations[a]['ownOrbPositions'][2].x,
                                    jsFormattedObservations[a]['ownOrbPositions'][2].y
                                ),
                                (
                                    jsFormattedObservations[a]['ownOrbPositions'][3].x,
                                    jsFormattedObservations[a]['ownOrbPositions'][3].y
                                ),
                            ),
                        "opponent_orb_positions": (
                                (
                                    jsFormattedObservations[a]['opponentOrbPositions'][0].x,
                                    jsFormattedObservations[a]['opponentOrbPositions'][0].y
                                ),
                                (
                                    jsFormattedObservations[a]['opponentOrbPositions'][1].x,
                                    jsFormattedObservations[a]['opponentOrbPositions'][1].y
                                ),
                                (
                                    jsFormattedObservations[a]['opponentOrbPositions'][2].x,
                                    jsFormattedObservations[a]['opponentOrbPositions'][2].y
                                ),
                                (
                                    jsFormattedObservations[a]['opponentOrbPositions'][3].x,
                                    jsFormattedObservations[a]['opponentOrbPositions'][3].y
                                ),
                            ),
                        "ownOrbGhostStatus": (
                                    jsFormattedObservations[a]['ownOrbGhostStatus'][0],
                                    jsFormattedObservations[a]['ownOrbGhostStatus'][1],
                                    jsFormattedObservations[a]['ownOrbGhostStatus'][2],
                                    jsFormattedObservations[a]['ownOrbGhostStatus'][3]
                                    ),
                        "opponentOrbGhostStatus": (
                                    jsFormattedObservations[a]['opponentOrbGhostStatus'][0],
                                    jsFormattedObservations[a]['opponentOrbGhostStatus'][1],
                                    jsFormattedObservations[a]['opponentOrbGhostStatus'][2],
                                    jsFormattedObservations[a]['opponentOrbGhostStatus'][3]
                                    )
                        } for a in self.agents}
        return pyFormatted

    def step(self, actions):
        pass

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

test = BattleSchoolEnvironment()

print(test.reset())

import javascript
from javascript import require
from gymnasium.spaces import Dict, Discrete, Tuple
from pettingzoo.utils.env import ParallelEnv
import pygame
from format_js_obs_to_py import format_js_obs_to_py
from draw_game import draw_game

# print(jsBattleSchoolEnv['getObservations']()['host'])


class BattleSchoolEnvironment(ParallelEnv):
    metadata = { "name" : "battle_school_environment_v0", "render_modes": ["human"] }
    def __init__(self, render_mode):
        self.jsBattleSchoolEnv = require('../../../../dist/battle-room-rl-environment/index.js')['default']
        self.possible_agents = ['host', 'challenger']
        self.agents = ['host', 'challenger']
        self.MAX_TIMESTEP = 6000
        self.timestep = 0
        self.game_window = None
        self.render_mode = render_mode

    def reset(self, seed=None, options=None):
        jsFormattedObservations = jsBattleSchoolEnv['getObservations']()
        pyFormatted = format_js_obs_to_py(self.agents, jsFormattedObservations)
        return pyFormatted

    def step(self, actions):
        actions = {
                "host": {"cursor_position": (450, 234),"number_key_pressed": 2, "playerRole": "host"},
                "challenger": {"cursor_position": (450, 234),"number_key_pressed": 0, "playerRole": "challenger"},
                }
        results = self.jsBattleSchoolEnv.step(actions)
        # print("RESULTS: ", format_js_obs_to_py(self.agents, results[0]))
        print("RESULTS: ", results)

    def render(self):
        if self.render_mode is None:
            gymnasium.logger.warn(
                    "You are calling render method without specifying any render mode."
                    )
            return

        assert (
                self.render_mode in self.metadata["render_modes"]
                ), f"{self.render_mode} is not a valid render mode"
        if self.render_mode == "human":
            import pygame
            import sys

        clock = pygame.time.Clock()

        if self.game_window is None:
            pygame.init()
            self.frame_size_x = 450
            self.frame_size_y = 750
            self.game_window = pygame.display.set_mode(( self.frame_size_x, self.frame_size_y ))
            print("ayylmao")

        while True:
            draw_game(self.game_window, self.jsBattleSchoolEnv.game)
            clock.tick(33)
            pygame.display.update()

            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    pygame.quit()
                    sys.exit()




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

test = BattleSchoolEnvironment(render_mode="human")

# print(test.reset())

test.step([])
test.render()

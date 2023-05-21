import javascript
from javascript import require
from gymnasium.spaces import Dict, Discrete, Tuple, Box
from numpy import inf
from pettingzoo.utils.env import ParallelEnv
import pygame
import json
from format_js_to_py import format_shallow_object_to_py, format_js_obs_to_py
from draw_game import draw_game

class BattleRoomEnvironment(ParallelEnv):
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
        print('reset called')
        jsFormattedObservations = self.jsBattleSchoolEnv['getObservations']()
        pyFormatted = format_js_obs_to_py(self.agents, jsFormattedObservations)
        print('reset reset ended')
        return pyFormatted, {} 

    def step(self, actions):
        host_cursor_x = actions['host']['cursor_position'][0]
        host_cursor_y = actions['host']['cursor_position'][1]
        challenger_cursor_x = actions['challenger']['cursor_position'][0]
        challenger_cursor_y = actions['challenger']['cursor_position'][1]
        print('host_cursor_x', host_cursor_x)
        jsActions = [
                {
                    "playerRole": "host",
                    "cursor_position": [int(host_cursor_x), int(host_cursor_y)],
                    "number_key_pressed": 0
                    },
                {
                    "playerRole": "challenger",
                    "cursor_position": [int(challenger_cursor_x), int(challenger_cursor_y)],
                    "number_key_pressed": 0
                    },
                ] 
        print("step called with actions: ", actions)
        print(actions["host"]['cursor_position'])

        # testJson = json.dumps([{"A":"b"}]) 
        testJson = json.dumps(jsActions) 
        print("JS ACTIONS PRE BRIDGE: ", testJson)

        # actions = {
        #         "host": {"cursor_position": (450, 234),"number_key_pressed": 2, "playerRole": "host"},
        #         "challenger": {"cursor_position": (450, 234),"number_key_pressed": 0, "playerRole": "challenger"},
        #         }
        results = self.jsBattleSchoolEnv.step(jsActions)
        # print("RESULTS: ", format_js_obs_to_py(self.agents, results[0]))
        formattedResults = format_js_obs_to_py(self.agents, results[0]), format_shallow_object_to_py(results[1]), format_shallow_object_to_py(results[2]),format_shallow_object_to_py(results[3]), {}
        print("step ended")
        return formattedResults

    def render(self):
        print('render called')
        if self.render_mode is None:
            gymnasium.logger.warn("You are calling render method without specifying any render mode.")
            return

        # assert (
        #         self.render_mode in self.metadata["render_modes"]
        #         ), f"{self.render_mode} is not a valid render mode"
        if self.render_mode == "human":
            import pygame
            import sys

            clock = pygame.time.Clock()

            if self.game_window is None:
                pygame.init()
                self.frame_size_x = 450
                self.frame_size_y = 750
                self.game_window = pygame.display.set_mode(( self.frame_size_x, self.frame_size_y ))

            while True:
                draw_game(self.game_window, self.jsBattleSchoolEnv.game)
                clock.tick(33)
                pygame.display.update()

                for event in pygame.event.get():
                    if event.type == pygame.QUIT:
                        pygame.quit()
                        sys.exit()
            print("render ended")

    def observation_space(self, agent):
        print("observation space called")
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
        print("action space called")
        return Dict({
            "cursor_position": Tuple((Discrete(450), Discrete(750))),
            "number_key_pressed": Discrete(5),
            })

# test = BattleSchoolEnvironment(render_mode="human")

# print(test.reset())

# test.step([])
# test.render()
from pettingzoo.test import parallel_api_test

if __name__ == "__main__":
    env = BattleRoomEnvironment(render_mode=None)
    parallel_api_test(env, num_cycles=1_00)

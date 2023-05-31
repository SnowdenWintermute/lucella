from battle_room_environment import BattleRoomEnvironment
from pettingzoo.test import parallel_api_test

if __name__ == "__main__":
    env = BattleRoomEnvironment(render_mode=None)
    parallel_api_test(env, num_cycles=1_00)

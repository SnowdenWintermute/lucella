import supersuit as ss
from ray.rllib.algorithms.ppo import PPOConfig
from ray.tune.logger import pretty_print
from ray.tune.registry import register_env
from battle_room_environment import BattleRoomEnvironment
from ray.rllib.env.wrappers.pettingzoo_env import ParallelPettingZooEnv

env_name = "battle-room-environment_v0"

def env_creator(args):
    env = BattleRoomEnvironment(render_mode=None)
    # print("ENV:-----------------------  ", env)
    env = ss.flatten_v0(env)
    env = ss.frame_stack_v1(env, 3)
    return env

register_env(env_name, lambda config: ParallelPettingZooEnv(env_creator(config)))

algo = (
    PPOConfig()
    .rollouts(num_rollout_workers=1)
    .resources(num_gpus=0)
    # .environment(env="CartPole-v1")
    .environment(env=env_name)
    .build()
)

for i in range(10):
    result = algo.train()
    print(pretty_print(result))

    if i % 5 == 0:
        checkpoint_dir = algo.save()
        print(f"Checkpoint saved in directory {checkpoint_dir}")

import argparse

import ray
from ray import air, tune
from ray.tune.registry import register_env
from ray.rllib.algorithms.apex_ddpg import ApexDDPGConfig
from ray.rllib.env.wrappers.pettingzoo_env import PettingZooEnv
from battle_room_environment import BattleRoomEnvironment

parser = argparse.ArgumentParser()
parser.add_argument(
    "--num-gpus",
    type=int,
    default=0,
    help="Number of GPUs to use for training.",
)

parser.add_argument(
    "--num-cpus",
    type=int,
    default=1,
    help="Number of CPUs to use for training.",
)

parser.add_argument(
    "--as-test",
    action="store_true",
    help="Whether this script should be run as a test: Only one episode will be "
    "sampled.",
)

if __name__ == "__main__":
    # ray.init(num_cpus=5)
    args = parser.parse_args()

    def env_creator(args):
        return PettingZooEnv(BattleRoomEnvironment(render_mode=None))

    env = env_creator({})
    register_env("battle-room-enviroment", env_creator)

    config = (
        ApexDDPGConfig()
        .environment("battle-room-enviroment")
        .resources(num_gpus=args.num_gpus, num_cpus_per_worker=1, num_learner_workers=1, num_cpus_per_learner_worker=1)
        .rollouts(num_rollout_workers=2)
        .multi_agent(
            policies=env.get_agent_ids(),
            policy_mapping_fn=(lambda agent_id, *args, **kwargs: agent_id),
        )
    )

    if args.as_test:
        # Only a compilation test of running waterworld / independent learning.
        stop = {"training_iteration": 1}
    else:
        stop = {"episodes_total": 60000}

    tune.Tuner(
        "APEX_DDPG",
        run_config=air.RunConfig(
            stop=stop,
            checkpoint_config=air.CheckpointConfig(
                checkpoint_frequency=10,
            )
        ),
        param_space=config
    ).fit()

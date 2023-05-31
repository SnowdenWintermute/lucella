# docs and experiment results can be found at https://docs.cleanrl.dev/rl-algorithms/ppo/#ppo_pettingzoo_ma_ataripy
import importlib
import random
import time
from distutils.util import strtobool

import gymnasium as gym
import numpy as np
import supersuit as ss
import torch
import torch.nn as nn
import torch.optim as optim
import sys
from parse_args import parse_args
from continuous_spaces_agent import Agent
from setup_wandb import setup_wandb, update_writer
sys.path.append('../')
from battle_room_environment import BattleRoomEnvironment

if __name__ == "__main__":
    args = parse_args()
    run_name = f"{args.env_id}__{args.exp_name}__{args.seed}__{int(time.time())}"
    writer = setup_wandb(args, run_name)
    # TRY NOT TO MODIFY: seeding
    random.seed(args.seed)
    np.random.seed(args.seed)
    torch.manual_seed(args.seed)
    torch.backends.cudnn.deterministic = args.torch_deterministic

    device = torch.device("cuda" if torch.cuda.is_available() and args.cuda else "cpu")

    # env = importlib.import_module(f"pettingzoo.sisl.multiwalker_v9").parallel_env()
    env = BattleRoomEnvironment(render_mode=None)
    num_agents_per_env = len(env.possible_agents)
    # env = ss.normalize_obs_v0(env)
    # env = ss.reward_lambda_v0(env, change_reward_fn = lambda obs: np.clip(obs, -10, 10))
    # env = ss.clip_reward_v0(env, lower_bound=-1, upper_bound=1)
    # env = ss.pad_observations_v0(env)
    # env = ss.frame_stack_v1(env, 4)
    # env = ss.agent_indicator_v0(env, type_only=False)
    # env = ss.pettingzoo_env_to_vec_env_v1(env)
    # envs = ss.concat_vec_envs_v1(env, args.num_envs // num_agents_per_env, num_cpus=0, base_class="gymnasium")
    # envs.single_observation_space = envs.observation_space
    # envs.single_action_space = envs.action_space # shape of one of the three agents in an environment
    # envs.is_vector_env = True
    # envs = gym.wrappers.RecordEpisodeStatistics(envs)
    # if args.capture_video:
    #     envs = gym.wrappers.RecordVideo(envs, f"videos/{run_name}")

    agent = Agent(envs).to(device)
    optimizer = optim.Adam(agent.parameters(), lr=args.learning_rate, eps=1e-5)

    # ALGO Logic: Storage setup
    obs = torch.zeros((args.num_steps, ) + single_observation_space.shape).to(device)
    torch.set_printoptions(profile="full")
    print("OBS SHAPE: ", obs[0].shape, obs[0])
    actions = torch.zeros((args.num_steps, )  + env.single_action_space.shape).to(device)
    logprobs = torch.zeros((args.num_steps,) ).to(device)
    rewards = torch.zeros((args.num_steps, ) ).to(device)
    dones = torch.zeros((args.num_steps, ) ).to(device)
    values = torch.zeros((args.num_steps,) ).to(device)

    # TRY NOT TO MODIFY: start the game
    global_step = 0
    start_time = time.time()
    next_obs = torch.Tensor(env.reset()[0]).to(device)
    print("RESET INITIAL OBS: ")
    print(next_obs, next_obs.shape)
    next_done = torch.zeros().to(device)
    num_updates = args.total_timesteps // args.batch_size

    for update in range(1, num_updates + 1):
        # Annealing the rate if instructed to do so.
        if args.anneal_lr:
            frac = 1.0 - (update - 1.0) / num_updates
            lrnow = frac * args.learning_rate
            optimizer.param_groups[0]["lr"] = lrnow

        for step in range(0, args.num_steps):
            global_step += 1
            print(f"OBS AT STEP {step}")
            print(obs[step])
            obs[step] = next_obs
            print(obs[step])
            dones[step] = next_done

            # ALGO LOGIC: action logic
            with torch.no_grad():
                action, logprob, _, value = agent.get_action_and_value(next_obs)
                print("VALUES AT STEP: " , values[step])
                print("VALUE: ", value.flatten())
                values[step] = value.flatten()
            actions[step] = action
            logprobs[step] = logprob

            # TRY NOT TO MODIFY: execute the game and log data.
            next_obs, reward, done, truncated, info = env.step(action.cpu().numpy())
            rewards[step] = torch.tensor(reward).to(device).view(-1)
            next_obs, next_done = torch.Tensor(next_obs).to(device), torch.Tensor(done).to(device)

            # for idx, item in enumerate(info):
            #     player_idx = idx % 2
            #     if "episode" in item.keys():
            #         print(f"global_step={global_step}, {player_idx}-episodic_return={item['episode']['r']}")
            #         writer.add_scalar(f"charts/episodic_return-player{player_idx}", item["episode"]["r"], global_step)
            #         writer.add_scalar(f"charts/episodic_length-player{player_idx}", item["episode"]["l"], global_step)

        # bootstrap value if not done
        with torch.no_grad():
            next_value = agent.get_value(next_obs).reshape(1, -1)
            advantages = torch.zeros_like(rewards).to(device)
            lastgaelam = 0
            for t in reversed(range(args.num_steps)):
                if t == args.num_steps - 1:
                    nextnonterminal = 1.0 - next_done
                    nextvalues = next_value
                else:
                    nextnonterminal = 1.0 - dones[t + 1]
                    nextvalues = values[t + 1]
                delta = rewards[t] + args.gamma * nextvalues * nextnonterminal - values[t]
                advantages[t] = lastgaelam = delta + args.gamma * args.gae_lambda * nextnonterminal * lastgaelam
            returns = advantages + values

        # flatten the batch
        b_obs = obs.reshape((-1,) + envs.single_observation_space.shape)
        b_logprobs = logprobs.reshape(-1)
        b_actions = actions.reshape((-1,) + envs.single_action_space.shape)
        b_advantages = advantages.reshape(-1)
        b_returns = returns.reshape(-1)
        b_values = values.reshape(-1)

        # Optimizing the policy and value network
        b_inds = np.arange(args.batch_size)
        clipfracs = []
        for epoch in range(args.update_epochs):
            np.random.shuffle(b_inds)
            for start in range(0, args.batch_size, args.minibatch_size):
                end = start + args.minibatch_size
                mb_inds = b_inds[start:end]

                _, newlogprob, entropy, newvalue = agent.get_action_and_value(b_obs[mb_inds], b_actions[mb_inds])
                logratio = newlogprob - b_logprobs[mb_inds]
                ratio = logratio.exp()

                with torch.no_grad():
                    # calculate approx_kl http://joschu.net/blog/kl-approx.html
                    old_approx_kl = (-logratio).mean()
                    approx_kl = ((ratio - 1) - logratio).mean()
                    clipfracs += [((ratio - 1.0).abs() > args.clip_coef).float().mean().item()]

                mb_advantages = b_advantages[mb_inds]
                if args.norm_adv:
                    mb_advantages = (mb_advantages - mb_advantages.mean()) / (mb_advantages.std() + 1e-8)

                # Policy loss
                pg_loss1 = -mb_advantages * ratio
                pg_loss2 = -mb_advantages * torch.clamp(ratio, 1 - args.clip_coef, 1 + args.clip_coef)
                pg_loss = torch.max(pg_loss1, pg_loss2).mean()

                # Value loss
                newvalue = newvalue.view(-1)
                if args.clip_vloss:
                    v_loss_unclipped = (newvalue - b_returns[mb_inds]) ** 2
                    v_clipped = b_values[mb_inds] + torch.clamp(
                        newvalue - b_values[mb_inds],
                        -args.clip_coef,
                        args.clip_coef,
                    )
                    v_loss_clipped = (v_clipped - b_returns[mb_inds]) ** 2
                    v_loss_max = torch.max(v_loss_unclipped, v_loss_clipped)
                    v_loss = 0.5 * v_loss_max.mean()
                else:
                    v_loss = 0.5 * ((newvalue - b_returns[mb_inds]) ** 2).mean()

                entropy_loss = entropy.mean()
                loss = pg_loss - args.ent_coef * entropy_loss + v_loss * args.vf_coef

                optimizer.zero_grad()
                loss.backward()
                nn.utils.clip_grad_norm_(agent.parameters(), args.max_grad_norm)
                optimizer.step()

            if args.target_kl is not None:
                if approx_kl > args.target_kl:
                    break

        y_pred, y_true = b_values.cpu().numpy(), b_returns.cpu().numpy()
        var_y = np.var(y_true)
        explained_var = np.nan if var_y == 0 else 1 - np.var(y_true - y_pred) / var_y
        update_writer(
            optimizer, global_step, v_loss, pg_loss, entropy_loss,
            old_approx_kl, approx_kl, clipfracs, explained_var, start_time
        )


    envs.close()
    writer.close()

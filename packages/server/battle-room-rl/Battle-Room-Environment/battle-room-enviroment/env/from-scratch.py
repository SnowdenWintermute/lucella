import math
import numpy as np
import gymnasium as gym
from tensorflow.keras.models import Sequential, clone_model
from tensorflow.keras.layers import Dense,Activation,Flatten
from tensorflow.keras.optimizers import Adam
from battle_room_environment import BattleRoomEnvironment
from collections import deque
from dict_to_list import dict_to_list

def sample_action(env, obs, agent):
    agent_obs = obs[agent]
    if isinstance(agent_obs, dict) and "action_mask" in agent_obs:
        legal_actions = np.flatnonzero(agent_obs["action_mask"])
        if len(legal_actions) == 0:
            return 0
        return random.choice(legal_actions)
    return env.action_space(agent).sample()


env = BattleRoomEnvironment(render_mode="human")

num_obs = 31
num_actions = 3

model = Sequential()
model.add(Dense(num_obs, input_shape=(1,num_obs)))
model.add(Activation('relu'))
model.add(Dense(num_obs * 2))
model.add(Activation('relu'))
model.add(Dense(num_actions))
model.add(Activation('linear'))

model.build()

target_model = clone_model(model)

EPOCHS = 50
epsilon = 1.0
EPSILON_REDUCE = 0.995
LEARNING_RATE = 0.001
GAMMA = 0.95

def epsilon_greedy_action_selection(model, epsilon, observation):
    if np.random.random() > epsilon:
        action = model.predict(observation)
    else:
        action = [np.random.uniform(0,1),np.random.uniform(0,1),np.random.uniform(0,1)]
    return action

def scale_actions(actions):
    scaled = { 
        agent: [
            math.floor(actions[agent][0] * 451),
            math.floor(actions[agent][1] * 751),
            math.floor(actions[agent][2] * 5)
            ]
              for agent in env.agents
              }
    # print("scaled: ", scaled)
    return scaled

replay_buffer = deque(maxlen=2000)
target_model_update_interval = 10

def replay(replay_buffer, batch_size, model, target_model):
    if(len(replay_buffer) < batch_size):
        return
    samples = random.sample(replay_buffer, batch_size)
    target_batch = []
    zipped_samples = list(zip(*samples))
    states, actions, rewards, new_states, dones = zipped_samples
    targets = target_model.predict(np.array(states))
    q_values = model.predict(np.array(new_states))
    for i in range(batch_size):
        q_value = max(q_values[i][0])
        target = targets[i].copy()
        if dones[i]:
            target[0][actions[i]] = rewards[i]
        else:
            target[0][actions[i]] = rewards[i] + q_value * GAMMA

    model.fit(np.array(states), np.array(target_batch), epochs=1, verbose=0)

def update_model_handler(epoch, target_model_update_interval, model, target_model):
    if(epoch > 0 and epoch % target_model_update_interval == 0):
        target_model.set_weights(model.get_weights())

model.compile(loss='mse', optimizer=(Adam(learning_rate=LEARNING_RATE)))

best_so_far = 0

for epoch in range(EPOCHS):
    obs, infos = env.reset()
    terminated = {agent: False for agent in env.agents}
    truncated = {agent: False for agent in env.agents}
    obs = { agent: np.array(dict_to_list(obs[agent])) for agent in env.agents }
    obs = { agent: obs[agent].reshape([ 1,num_obs ]) for agent in env.agents }

    for step in range(200):
        actions = {
            agent: epsilon_greedy_action_selection(model, epsilon, obs)
            for agent in env.agents
            if (
                (agent in terminated and not terminated[agent])
                or (agent in truncated and not truncated[agent])
            )
        }
        scaled_actions = scale_actions(actions)
        next_obs, rew, terminated, truncated, info = env.step(scaled_actions)
        next_obs = { agent: np.array(dict_to_list(next_obs[agent])) for agent in env.agents }
        next_obs = { agent: next_obs[agent].reshape([ 1,num_next_obs ]) for agent in env.agents }
        replay_buffer.append((obs, actions, rewards, next_obs, terminations, truncations))
        obs = next_obs

        # env.render()
        # print("obs: ", obs)


# TODO
# - stack frames
# - change from DQN to PPO

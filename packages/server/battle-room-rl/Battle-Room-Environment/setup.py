from setuptools import find_packages, setup

with open("./README.md", "r") as f:
    long_description = f.read()

setup(
        name="battle_room_enviroment",
        version="0.1.0",
        description="battle school environment for pettingzoo",
        long_description=long_description,
        author="mike silverman", 
        author_email="michael.p.silverman@gmail.com",
        maintainer="mike silverman", 
        maintainer_email="same",
        url="battleschool.io",
        download_url="github.com/snowdenwintermute",
        packages="pettingzoo, pygame"
        )

# Toc Messenger

[![Circle CI](https://circleci.com/gh/lewisl9029/toc.svg?style=svg&circle-token=1b2ccd52352469342382def79f8154faf0955c73)](https://circleci.com/gh/lewisl9029/toc)



## Contributing

### Environment Setup

The entire development environment for Toc is fully reproducible using the Vagrantfile and Dockerfile provided in this repository.

The provided Vagrant VM can be used to build the Docker container from the [Dockerfile](Dockerfile) or pull the Docker container from [Docker Hub's automated builds](https://hub.docker.com/r/lewisl9029/toc-dev/).

Setup instructions:

1. Install [Vagrant](https://www.vagrantup.com/) and [VirtualBox](https://www.virtualbox.org/) (VMWare Workstation and Hyper-V have also been configured and tested to work)
2. Clone this repository
3. Open terminal and navigate to this repository
4. Start and provision the development VM and build the docker container:
  ```
  vagrant up
  ```

5. SSH into the development VM:
  ```
  vagrant ssh
  ```

6. To pull the prebuilt container:
  ```
  toc-pull
  ```

  To build a container locally from the Dockerfile:
  ```
  toc-build
  ```

7. You're now ready to develop!

  There are several aliases provided in the Vagrant VM for quick access to common workflows (such as `toc-pull` and `toc-build` above, as well as tasks like serving, building, running the docker container interactively, etc). See their implementations in [vagrant-provision.sh](vagrant-provision.sh).

You can also choose to set up dependencies manually on your machine using the Dockerfile and Vagrantfile in this repository as reference.

## License
```
Copyright (C) 2015 Qi Liu

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
```

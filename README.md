# Toc Messenger

[![Circle CI](https://circleci.com/gh/lewisl9029/toc.svg?style=svg&circle-token=1b2ccd52352469342382def79f8154faf0955c73)](https://circleci.com/gh/lewisl9029/toc)

## Overview

[Toc Messenger]() is a proof-of-concept distributed messaging app designed from the ground up to support user data synchronization for use across multiple devices.

Toc originated as a 4th year Computer Engineering design project at the University of Waterloo, where I worked with, Asif Arman, Danny Yan, and SangHoon Lee, to come up with the original concept for Toc and built the first few prototypes together.

One of the earliest prototypes can be seen in the following repo: https://github.com/lewisl9029/FYDP-2015-010

There, we managed to implement a working UI on top of AngularJS and Bootstrap, and a minimal set of messaging features using [Telehash](). However, we eventually arrived at a dead end when we found out how difficult it was to implement profile synchronization on top of the naive, ad-hoc architecture we had created.




## Contributing

As mentioned earlier, I won't have much time to review and accept pull requests for this project in the foreseeable future. However, you're certainly welcome to fork this repo and hack on it in any way you like, as long as you respect the AGPL license and release the source code with your modifications.

### Environment Setup

The entire development environment for Toc is fully reproducible using the Vagrantfile and Dockerfile provided in this repository.

The provided Vagrant VM can be used to build the Docker container from the [Dockerfile](Dockerfile) or pull the Docker container from [Docker Hub's automated builds](https://hub.docker.com/r/lewisl9029/toc-dev/).

Setup instructions:

1. Install [Vagrant](https://www.vagrantup.com/) and [VirtualBox](https://www.virtualbox.org/) (or VMWare Workstation, which is what I personally use)
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

  There are several aliases provided in the Vagrant VM for quick access to common workflows (such as `toc-pull` and `toc-build` above, as well as tasks like serving, building, running the docker container interactively, etc). See their implementations in [scripts/toc-setup-vagrant.sh](scripts/toc-setup-vagrant.sh).

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

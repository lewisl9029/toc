# Toc Messenger

[![Circle CI](https://circleci.com/gh/lewisl9029/toc.svg?style=svg&circle-token=1b2ccd52352469342382def79f8154faf0955c73)](https://circleci.com/gh/lewisl9029/toc)

## Overview

[Toc Messenger]() is a proof-of-concept distributed messaging app designed from the ground up to support user data synchronization for use across multiple devices. Toc is available as a client-side web application (with a [seed server]() that anyone can easily host) and as a packaged [Cordova](https://cordova.apache.org/) app for Android and iOS (to be submitted to app stores once a few issues have been sorted out).

Toc's interface was built using AngularJS and the Ionic Framework, using bleeding edge JavaScript ES2015 features enabled by JSPM and Babel. We leverage Ramda to apply functional techniques wherever possible in our code, and employ a deliberate, centralized approach to application state management inspired by ClojureScript frameworks like Om, implemented using a wrapper around a single Baobab tree that holds our entire application state.

We then persist and synchronize this central state tree using the open, federated remoteStorage protocol and library, while further implementing a custom encryption layer on top of it, built using Forge, with the intention to allow users to synchronize data without having to trust storage providers to respect their privacy.

Toc's peer-to-peer communication stack was built on top of Telehash (albiet the older V2 version with an integrated DHT). We use the randomly generated, cryptographically-verifiable Telehash hashname as the only identifier for our users, which means they are protected from impersonation without having to supply any personally identifiable information. However, users can still provide a friendly name for other users to recognize them by, and an email with which Toc can use to pull their profile picture using the federated, Gravatar-compatible Libravatar service.

As mentioned in the very beginning, Toc is only a proof-of-concept. Numerous potential issues and limitations prevent us from being able to recommend Toc for long term general use. And due to mainly a lack of time for myself and the rest of the original dev team, these issues will not likely get resolved any time soon. We recommend taking a look at one of the many, more mature open-source projects for that purpose, such as TextSecure, Signal, Matrix, and Tox.

We do hope that, by releasing Toc into the wild, we can generate some renewed interest in the amazing technologies for building decentralized software that Toc makes use of. We also hope that Toc can inspire more developers to strive for building apps that protects users' privacy without compromising on important aspects of their experience.

## Background

Toc originated as a 4th year Computer Engineering design project at the University of Waterloo, where I worked with Asif Arman, Danny Yan, and SangHoon Lee to come up with the original concept for Toc and built the first few prototypes together.

The earliest, most naive prototype can be seen in the linked repo, while all the  releases for the subsequent rewrite can be seen in the releases section of this repo. https://github.com/lewisl9029/FYDP-2015-010

## Tradeoffs and Potential Issues

(i.e. Reasons why you may not want to rely on Toc for anything critical)


## Contributing

As mentioned earlier, I won't have much time to review and accept pull requests for this project in the foreseeable future. However, you're certainly welcome to fork this repo and hack on it in any way you like, as long as you respect the AGPL license and release the source code with your modifications.

### Environment Setup

The entire development environment for Toc is fully reproducible using the [Vagrantfile](Vagrantfile) and [Dockerfile](Dockerfile) provided in this repository. You can choose to follow the steps below and use Vagrant and Docker to replicate our dev environment, or set up dependencies manually on your machine using the Dockerfile and Vagrantfile in this repository as reference.

Setup instructions:

1. Install [Vagrant](https://www.vagrantup.com/) and [VirtualBox](https://www.virtualbox.org/) (or [VMWare Workstation](http://www.vmware.com/ca/en/products/workstation), which is what I personally use)
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

6. To pull the prebuilt container from [Docker Hub's automated builds](https://hub.docker.com/r/lewisl9029/toc-dev/):
  ```
  toc-pull
  ```

  To build a container locally from the [Dockerfile](Dockerfile):
  ```
  toc-build
  ```

7. Populate local dependencies from npm and jspm:
  ```
  tocn install
  tocj install
  ```

  You may need to add the `--no-bin-link` npm flag for `tocn install` if you're using Windows as the host OS.

8. You're now ready to develop!

  There are several aliases provided in the Vagrant VM for quick access to common workflows (such as `toc-pull`, `toc-build`, `tocn` and `tocj` from above, as well as tasks like serving (`tocs`), packaging (`tocp`), running the docker container interactively (`toc`), etc). See their implementations in [scripts/toc-setup-vagrant.sh](scripts/toc-setup-vagrant.sh).


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

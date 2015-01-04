# Toc Messenger
Distributed Instant Messaging

University of Waterloo Computer Engineering FYDP Project Group 010

## Development Workflow

I propose we should generally follow the [GitHub Flow](https://guides.github.com/introduction/flow/index.html).

TL;DR:
- Master should be always in a deployable state (see [Continous Deployment](#continuous-integration-and-deployment)).
- Branches are only merged into master through pull requests reviewed by at least one other dev.

I propose the following naming conventions for branch names:
- Dash separated
- Lower case
- Features go in "feature-*" branches
- Bug fixes go in "bugfix-*" branches
- Refactoring/workflow improvements go in "devops-*" branches

## Development Environment

### Setup

Note: The setup process can be bandwidth intensive as it involves downloading an Ubuntu Server VM and doing a bunch of apt-get install's and npm install's. The repository itself comes with all the non-global dependencies checked in, and thus is also somewhat large. Be prepared to use up at least 1GB of data in total. Bandwidth usage after the initial `vagrant up` should be greatly reduced thanks to the custom toc-cache-apt and toc-cache-npm caching containers.

1. Install [Vagrant](https://www.vagrantup.com/) and [VirtualBox](https://www.virtualbox.org/)
2. Clone the repository
3. Open terminal and navigate to local repository
4. Start and provision the development VM with docker installed:
  ```
  vagrant up
  ```
  
5. SSH into the development VM:
  ```
  vagrant ssh
  ```
  
6. You're now ready to develop!

### Working with Vagrant and Docker

You can edit files, make commits, push your branches on your local OS as you normally do.

Changes will be reflected in the VM and docker container immediately, because the working directory is mounted as a volume in /toc in the VM, which is then mounted as a volume /toc in the docker container.

Terminal commands (other than git commands) need to be run inside specific docker containers, which have various development dependencies already installed and configured.

To run arbitrary commands inside the toc-dev docker container:

1. SSH into the Vagrant VM:
  ```
  vagrant up
  vagrant ssh
  ```

2. Run the docker interactive shell via the following alias:
  ```
  toc
  jspm install angular
  jspm bundle www/app.js
  ```

3. Now you can run any combination of commands inside the toc-dev docker container!

4. You can also append commands after the toc alias to run them inline:
  ```
  toc jspm install angular
  ```

Note that changes to the docker environment will be discarded on exit, and only changes to the mounted source files volume will be persisted (such as installing new dependencies via jspm install).

To make modifications to the dev environment itself, edit the Dockerfiles and rebuild the containers using one of:
  ```
  toce
  tocb
  ```

### Aliases

I have provided several aliases in the Vagrant VM for quick access to common dev workflows:

- Run single command inside toc-dev container:
  ```
  toc *command*
  ```
  
- Open interactive shell session in toc-dev container:
  ```
  toc
  ```

- Build and run the toc-cache-apt, toc-cache-npm, toc-env docker containers:
  ```
  toce
  ```

- Build the toc-dev and toc-test docker containers:
  ```
  tocb
  ```

- Serve the app using ionic serve on port 8100 using the toc-dev container:
  ```
  tocs
  ```
  
  Note that simply running toc ionic serve won't work because it requires ports to be exposed to the host VM and then to the local OS. This alias takes care of all the configuration for you.
  
- Test the app using karma on the toc-test container:
  ```
  toct
  ```
  
  You can debug karma tests on your host machine remotely by pointing any browser to http://localhost:8101.

- Install new dependencies using jspm using the toc-dev container:
  ```
  toci
  ```

- Build the toc-phone container and use it to build an android .apk (iOS remote build workflow on hold):
  ```
  tocp
  ```

Let me know if you have suggestions for any aliases for other common tasks. Or better yet, make a PR for it yourself! (See [vagrant-provision.sh](https://github.com/lewisl9029/toc/blob/master/vagrant-provision.sh))

## Continuous Integration and Deployment

TBD - Writing my work term report on this. Current candidates are:
[wercker](http://wercker.com/)
[drone.io](https://drone.io/)
[Magnum CI](https://magnum-ci.com/)
[Codeship](https://codeship.com/pricing)

Let me know if you know of more that have free tiers for private projects.

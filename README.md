# Toc Messenger
Distributed Instant Messaging

## Environment Setup

Note: The setup process can be somewhat bandwidth intensive as it involves downloading an Ubuntu Server VM and doing a bunch of apt-get install's and npm install's. The repository itself comes with all the non-global dependencies and binary packages checked in, and thus is also quite large. Be prepared to use up at least 2GB of data.

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
  
6. Build the docker container for the app via the following alias:
  ```
  tocb
  ```
  
7. You're now ready to develop!

## Development Workflow

You can edit files, make commits, push your branches on your local OS as you normally do.

Changes will be reflected in the VM and docker container immediately, because the working directory is mounted as a volume in /vagrant in the VM, which is then mounted as a volume /toc in the docker container.

Terminal commands (other than git commands) need to be run inside the docker container, which has all the development dependencies already installed and configured.

To run arbitrary commands inside the docker container:

1. SSH into the Vagrant VM:
  ```
  vagrant up
  vagrant ssh
  ```

2. Run the docker interactive shell via the following alias:
  ```
  toc
  ionic prepare android
  ionic build android
  ```

3. Now you can run any combination of commands inside the docker container!

4. You can also append commands after the toc alias to run them inline:
  ```
  toc ionic build android
  ```

Note that changes to the docker environment will be discarded on exit, and only changes to the mounted source files volume will be persisted (such as installing new dependencies via jspm install, or building an android package using ionic build android).

To make modifications to the environment itself, edit the Dockerfile and rebuild the container:
  ```
  tocb
  ```

## Aliases

I have provided several aliases for quick access to common dev workflows:

- Build the docker container:
  ```
  tocb
  ```

- Serve the app using ionic serve on port 8100:
  ```
  tocs
  ```
  
  Note that simply running toc ionic serve won't work because it requires ports to be exposed to the host VM and then to the local OS. This alias takes care of all the configuration for you.
  
- Test the app using karma (still working on this):
  ```
  toct
  ```

- Install new dependencies using jspm (not implemented yet):
  ```
  toci
  ```

Let me know if you have suggestions for any aliases for other common tasks. Or better yet, make a PR for it yourself!

## Continous Integration

I have a Drone CI server hosted at http://azure.lewisl.net:8101, but this is on hold until I can get karma and docker in docker working properly.

## Continous Deployment

TBD - https://toc.lewisl.io

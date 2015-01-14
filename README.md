# Toc Messenger
Distributed Instant Messaging

University of Waterloo Computer Engineering FYDP Project Group 010

*I'm growing less and less fond of this name. Please consider "Toc" a codename and keep trying to think of better ones. =)*

## Status
###Codeship

[ ![Codeship Status for lewisl9029/toc](https://codeship.com/projects/0121b910-784a-0132-57d8-2a704c6de457/status?branch=master)](https://codeship.com/projects/55660)

###Magnum CI

[ ![Magnum CI Status for lewisl9029/toc](https://magnum-ci.com/status/eecd17ba8e1b29b8b4627481ab878261.png)](https://magnum-ci.com/projects/2139)

###Circle CI
[ ![Circle CI Status for lewisl9029/toc](https://circleci.com/gh/lewisl9029/toc.svg?style=svg&circle-token=dee735d27416c60483b8d4edfa735447d9d0d900)](https://circleci.com/gh/lewisl9029/toc)
## Disclaimer

This document is **EXTREMELY opinionated**, formed from extensive readings but limited real world exposure to the technologies and workflows outlined. So there will inevitably be flaws in the technology choices and established workflows.

I HIGHLY welcome discussion on anything in this document as it will definitely lead to more learning and workflow improvements for all of us. =)

## Development Workflow

I propose we should generally follow the [GitHub Flow](https://guides.github.com/introduction/flow/index.html).

TL;DR:
- Master should be always in a deployable state (see [Continous Deployment](#continuous-integration-and-deployment)).
- Branches are only merged into master through pull requests reviewed by at least one other dev.
- To strike a balance between developer productivity and review time, only a code review is necessary at this point. Functional review can be done during the [Staging -> Master deployment phase](#continuous-integration-and-deployment).

I propose the following naming conventions for branch names:
- Lower case
- Dash separated
- Features go in "feature-*" branches
- Bug fixes go in "bugfix-*" branches
- Refactoring/workflow/environment changes go in "devops-*" branches

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


### Working with ECMAScript 6 (Next version of JavaScript)

Some readings/viewings:
- [Overview of ES6 features](http://es6rocks.com/2014/08/what-is-next-for-javascript/) (Video and accompanying slides)
- [Intro to JSPM](http://javascriptplayground.com/blog/2014/11/js-modules-jspm-systemjs/) (package manager, ES6 Modules based alternative to bower (Globals), npm (CommonJS), and is cross compatible with other module formats)
- [Generator functions!](http://davidwalsh.name/es6-generators) (allows for more expressive control flows for async operations)
- [Native Promises](http://www.html5rocks.com/en/tutorials/es6/promises/) (in angular, we still need to use $q to hook into the digest cycle, but $q itself will be implemented using Native ES6 Promises)
- [Arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) (Lambda function notation)
- [New iteration patterns and collections](http://updates.html5rocks.com/2014/08/Collecting-and-Iterating-the-ES6-Way) (Set and Map)
- [Lexical scoping](http://globaldev.co.uk/2013/09/es6-part-2/) (let keyword, **never use var again**)
- ~~[Class notation]~~ *see [below](#working-with-ramda-and-functional-composition) for why we'll never need this*

### Working with Ramda and functional composition
- [A pragmatic intro into functional programming from the creator of Ramda, with comparisions to OO](http://scott.sauyet.com/Javascript/Talk/FunctionalProgramming/#slide-0)
- [Ramda Docs](http://ramdajs.com/docs/)

### Working with Vagrant and Docker

Read up on [Docker](https://www.docker.com/) if you're not already familiar with it. The project makes heavy use of docker containers to build declarative, reproducible development environments and helper services like npm/apt-get caching.

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

### Docker Aliases

I have provided several aliases in the Vagrant VM for quick access to common docker workflows (such as toc, toce, tocb mentioned above). See their implementations in [vagrant-provision.sh](https://github.com/lewisl9029/toc/blob/master/vagrant-provision.sh).

Let me know if you have suggestions for any aliases for other common tasks. Or better yet, make a PR for it yourself!

## Continuous Integration and Deployment

Ideally we should have a Continuous Integration and Continuous Deployment server set up before we start developing any real features.

Master branch in this repo should be automatically tested, built and deployed onto the staging server, which should then be manually smoke tested before being pushed to the production server.

Data model versioning and migrations should be implemented and tested as a first priority (currently looking for a library to handle this for HTML5 LocalStorage), and mock filled with a library like [Faker](https://github.com/marak/Faker.js/), even during development.

Data model versions should be kept consistent with app versions (read version number from package.json from shell during builds and from browser at runtime). New versions should be marked with git release tags adhering to [semver](http://semver.org/).

TBD - Writing my work term report on CI platforms. Current candidates are:
- [Circle CI](https://circleci.com/)
- [drone.io](https://drone.io/)
- [Magnum CI](https://magnum-ci.com/)
- [Codeship](https://codeship.com/)

Let me know if you know of other ones that have free tiers for private projects.

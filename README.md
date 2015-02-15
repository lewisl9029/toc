# Toc Messenger
Distributed Instant Messaging

University of Waterloo Computer Engineering FYDP Project Group 010

*I'm growing less and less fond of this name. Please consider "Toc" a codename and keep trying to think of better ones. =)*

## Status
[![Drone](http://toc.cloudapp.net:8080/api/badge/github.com/lewisl9029/toc/status.svg?branch=master)](http://toc.cloudapp.net:8080/github.com/lewisl9029/toc)

## Disclaimer
This document is **EXTREMELY opinionated**, formed from extensive readings but limited real world exposure to the technologies and workflows outlined. So there will inevitably be flaws in the technology choices and established workflows.

I HIGHLY welcome discussion on anything in this document as it will definitely lead to more learning and workflow improvements for all of us. =)

## Environment Setup

This repository only contains source files for the project.
See the [lewisl9029/toc-env](https://github.com/lewisl9029/toc-env) repository for environment setup instructions.

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

## Working with ECMAScript 6 (Next version of JavaScript)

Some readings/viewings:
- [Overview of ES6 features](http://es6rocks.com/2014/08/what-is-next-for-javascript/) (Video and accompanying slides)
- [Intro to JSPM](http://javascriptplayground.com/blog/2014/11/js-modules-jspm-systemjs/) (package manager, ES6 Modules based alternative to bower (Globals), npm (CommonJS), and is cross compatible with other module formats)
- [Generator functions!](http://davidwalsh.name/es6-generators) (allows for more expressive control flows for async operations)
- [Native Promises](http://www.html5rocks.com/en/tutorials/es6/promises/) (in angular, we still need to use $q to hook into the digest cycle, but $q itself will be implemented using Native ES6 Promises)
- [Arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) (Lambda function notation)
- [New iteration patterns and collections](http://updates.html5rocks.com/2014/08/Collecting-and-Iterating-the-ES6-Way) (Set and Map)
- [Lexical scoping](http://globaldev.co.uk/2013/09/es6-part-2/) (let keyword, **never use var again**)
- ~~[Class notation]~~ *see [below](#working-with-ramda-and-functional-composition) for why we'll never need this*

## Working with Ramda and functional composition
- [A pragmatic intro into functional programming from the creator of Ramda, with comparisions to OO](http://scott.sauyet.com/Javascript/Talk/FunctionalProgramming/#slide-0)
- [Ramda Docs](http://ramdajs.com/docs/)

## Continuous Integration and Deployment

We have a [drone](https://github.com/drone/drone) CI server running against every push made in the source repo.

Every push is tested, built and deployed onto the staging server at http://toc-staging.azurewebsites.net. Non-master branches are hosted under the subpath /dev/BRANCH_NAME/www.

Data model versioning and migrations should be implemented and tested as a first priority (currently looking for a library to handle this for HTML5 LocalStorage), and mock filled with a library like [Faker](https://github.com/marak/Faker.js/), even during development.

Data model versions should be kept consistent with app versions (read version number from package.json from shell during builds and from browser at runtime). New versions should be marked with git release tags adhering to [semver](http://semver.org/).

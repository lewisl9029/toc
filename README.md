# Toc Messenger

[![Circle CI](https://circleci.com/gh/lewisl9029/toc.svg?style=svg&circle-token=1b2ccd52352469342382def79f8154faf0955c73)](https://circleci.com/gh/lewisl9029/toc)

## Overview

[Toc Messenger](http://toc.im/) is a proof-of-concept distributed messaging app designed from the ground up to support user data synchronization for use across multiple devices. Toc is available as a client-side web application (with a [seed server](https://github.com/lewisl9029/toc-seed) that anyone can easily host) and as a packaged [Cordova](https://cordova.apache.org/) app for Android and iOS (to be submitted to app stores once a few issues have been sorted out).

Toc's interface was built using [AngularJS](https://angularjs.org/) and the [Ionic Framework](http://ionicframework.com/), using bleeding edge JavaScript ES2015 features enabled by the [jspm](http://jspm.io/) dependency manager, the [SystemJS](https://github.com/systemjs/systemjs) module loader, and the [Babel](https://babeljs.io/) transpiler. We leverage [Ramda](http://ramdajs.com) to apply functional techniques wherever possible in our code, and employ a deliberate, centralized approach to application state management inspired by ClojureScript frameworks like [Om](https://github.com/omcljs/om). Our version of Om's central state atom is implemented as a wrapper around a single [Baobab](https://github.com/Yomguithereal/baobab) tree that holds our entire application state.

We then persist and synchronize this central state tree using the open, federated remoteStorage [protocol](https://remotestorage.io/) and [library](https://github.com/remotestorage/remotestorage.js), while further adding a custom encryption layer on top of it, built using [Forge](https://github.com/digitalbazaar/forge), with the intention to allow users to synchronize data without having to trust storage providers to respect their privacy.

Toc's peer-to-peer communication stack was built on top of [Telehash](http://telehash.org/) (albeit the older [V2](https://github.com/telehash/telehash-js/tree/v0.2.14) version with an integrated DHT). We use the randomly generated, cryptographically-verifiable Telehash [hashname](https://github.com/telehash/telehash.org/blob/master/v3/hashname.md) as the only identifier for our users, which means they can be protected from impersonation without having to supply any personally identifiable information. However, users can still provide a friendly name for other users to recognize them by, and an email with which Toc can use to pull their custom profile picture using the federated, [Gravatar](https://en.gravatar.com/)-compatible [Libravatar](https://www.libravatar.org/) service.

As mentioned in the very beginning, Toc is only a proof-of-concept. Numerous [potential issues and limitations](#limitations-and-potential-issues) prevent us from being able to recommend Toc for long-term general use. And due to the fact that we simply won't have any more time to work on Toc in the foreseeable future, these issues will not likely get resolved any time soon. For general use, we recommend taking a look at one of the many, more mature open-source messaging projects, such as [TextSecure/Signal](https://whispersystems.org/), [Telegram](https://telegram.org/), [Matrix](http://matrix.org/), and [Tox](https://tox.chat/) (the name similarity is unfortunate, and we would like to apologize for any confusion this might cause, but we honestly did not find out about Tox until very recently).

That said, we do hope that, by releasing Toc into the world, we can generate some renewed interest in the amazing technologies for building decentralized software that Toc makes use of. We also hope that Toc can inspire more developers to strive for building apps that protect users' privacy without compromising on important aspects of their experience.

## Background

Toc originated as a 4th year Computer Engineering design project at the University of Waterloo, where [I](https://github.com/lewisl9029) worked with [Asif Arman](https://github.com/TheSif), [Danny Yan](https://github.com/d22yan), and [SangHoon Lee](https://www.linkedin.com/in/sanghoonlee9173) to come up with the original concept for Toc and designed, built, and tested Toc together.

The earliest [prototype](https://github.com/lewisl9029/FYDP-2015-010) can be seen in the linked repo. This was the one we had to throw away because its naive architecture could not have supported app state synchronization without a thorough rewrite.

The releases for the subsequent rewrite can be seen in the [releases section](https://github.com/lewisl9029/toc/releases) of this repo. We ended up spending the entire first semester of our 4th year building the original prototype, so we only had our last semester to work on this new rewrite.

The first 2 months of that semester was spent mostly on research, technology evaluation, setting up our (in hindsight, admittedly over-engineered) dev and CI environments, and writing thousands upon thousands of words of technical documentation to satisfy our project requirements.

So in effect, we had 1 month to actually build a [MVP](https://github.com/lewisl9029/toc/releases/tag/v0.1.0-alpha) for Toc, which is my excuse for 1) why we ended up having no tests despite having created a rather elaborate [Docker](https://www.docker.com/)/[Drone](https://github.com/drone/drone) based CI/CD setup, 2) why we chose to continue using Angular 1.x and Ionic rather than something with better support for immutable data like React/Om (we simply couldn't afford any more time for learning, trial and error, and building/styling our own components), and 3) why some earlier parts of the codebase might seem a bit rough along the edges (the [abstractions](https://github.com/lewisl9029/toc/blob/master/toc/app/services/state/state-service.js#L159-L169) we had to write to make Angular 1.x work with what's essentially an immutable data structure like Baobab were especially verbose, leaky, and inefficient).

After we graduated in May, I decided to take a short break before starting my job search in order to polish up Toc and release it. That process definitely took a little bit longer than I had planned, but I'm rather proud of how far Toc has come since the initial release, and I genuinely hope someone out there can benefit from this app and codebase.

With that said, I am now officially looking for work. If you have any openings for a ClojureScript frontend project, I'd love to hear about it. =)

You can reach me through the email on my [GitHub profile](https://github.com/lewisl9029) or through my [Toc account](http://toc.im/?inviteid=9b0d50b86dd596aa8c7a94bd116c2ed4a24ffb0f2d88d44231d3747f655fb27a) (mostly for novelty, I probably won't be on 24/7).

## Limitations and Potential Issues

(i.e. Reasons why you may not want to rely on Toc as your primary means of communication)

- Toc is *not* secure.

  Toc uses an [outdated, modified build](https://github.com/lewisl9029/toc/blob/master/toc/app/libraries/telehash/telehash-library.js) of Telehash V2, which could have several security vulnerabilities that would have been fixed in the current release. Telehash V2 also happens to use a public DHT, and public DHTs have long been known to be susceptible to [Sybil attacks](https://en.wikipedia.org/wiki/Sybil_attack), and can be easily crawled for metadata.

  We also could never figure out how to use a valid SSL certificate with the Telehash V2 seed server, which limits our ability to use HTTPS to securely deliver the client-side code to your browser for the hosted app, which means it can be compromised by an attacker in transit. You can download the code through HTTPS [directly from GitHub](https://github.com/lewisl9029/toc/tree/gh-pages) and host it yourself to work around this, but that obviously clashes with the great user experience we've been striving for with Toc.

  Lastly, our crypto implementation for data persistence has never been reviewed, and we certainly cannot claim to have implemented it perfectly, given our lack of experience in building applications with real-world cryptography. This is compounded by the fact that we had to implement a [custom deterministic encryption algorithm](https://github.com/lewisl9029/toc/blob/master/toc/app/services/cryptography/cryptography-service.js#L164-L171) for securing storage keys in our key-value store, because we couldn't find any existing deterministic encryption implementations for JS. It's a very naive implementation, even from our own perspective, so there's a good chance that it's insecure in some manner. We welcome any critique you may have for any of our [crypto code](https://github.com/lewisl9029/toc/blob/master/toc/app/services/cryptography/cryptography-service.js), as we would like to learn from any mistakes we've made so we can avoid them in the future.

- Toc is missing many features that you might expect from messaging software that people would actually use.

  See our [list of once-planned features](https://github.com/lewisl9029/toc/issues?q=is%3Aopen+is%3Aissue+label%3Aenhancement) for a taste of what's simply not there.

  Some quick examples off the top of my head include group chat, voice/video chat, embeds support, emoticons, simultaneous login, contacts/messages deletion, etc...

- Toc has some serious limitations that can severely impact usability for long-term use.

  For instance, on mobile devices, Toc will often get paused when the app is placed in the background, which means Toc will not be able to send status updates or receive new messages. This can be worked around by writing native plugins and services for the Cordova apps, but that simply falls way out of my area of expertise, and would take even more time that I can no longer afford to spend.

  Also, if we do ever release a new version of Toc, there's no guarantee that it will work properly with your existing profiles for this current version, because we simply haven't had the chance to build a proper data schema versioning and migration mechanism.

  Lastly, Toc will likely use more data than most centralized messaging software, due in part to our very naively designed messaging protocol that's probably not nearly as efficient as it needs to be, and due in part to the simple fact that as a distributed app, we have no access to push messaging, and need to use periodic polling for all status updates. We have done some optimization in this area to make data usage reasonably low for users with a small number of contacts, but in the worst case, we expect network usage to grow exponentially with each additional contact.

## Contributing

As mentioned earlier, we won't have much time to review and accept pull requests for Toc in the foreseeable future. However, you're certainly welcome to fork this repo and hack on it in any way you like, as long as you respect the [AGPL license](LICENSE.txt) and make the the source code available with your modifications if you end up distributing or hosting your own modified version.

We're releasing Toc's source in an effort to give back to the open-source community that made Toc possible, and we would like to ask any derivative projects to do the same.

### Environment Setup

The entire development environment for Toc is fully reproducible using the [Vagrantfile](Vagrantfile) and [Dockerfile](Dockerfile) provided in this repository. You can choose to follow the steps below and use [Vagrant](https://www.vagrantup.com/) and [Docker](https://www.docker.com/) to replicate our dev environment, or set up dependencies manually on your machine using the Dockerfile and Vagrantfile in this repository as reference (it's no longer [as complex as before](https://github.com/lewisl9029/toc/blob/9a5a31d4eed3fb62712e84133d6fec04be6689e4/Dockerfile), now that we've switched to using the [Ionic Package](http://docs.ionic.io/docs/package-overview) service for building the Cordova apps, instead of building locally).

Setup instructions:

1. Install Vagrant and [VirtualBox](https://www.virtualbox.org/) (or [VMWare Workstation](http://www.vmware.com/ca/en/products/workstation), which is what I personally use)
2. Clone this repository
3. Open terminal and navigate to this repository
4. Start and provision the development VM and build the Docker container:
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

8. You're now ready to hack on Toc!

  There are several aliases provided in the Vagrant VM for quick access to common workflows (such as `toc-pull`, `toc-build`, `tocn` and `tocj` from above, as well as tasks like serving (`tocs`), packaging (`tocp`), running the Docker container interactively (`toc`), etc). See these implementations and others in [scripts/toc-setup-vagrant.sh](scripts/toc-setup-vagrant.sh).


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

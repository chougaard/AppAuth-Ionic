# AppAuth-Ionic

This repo contains an implementation of AppAuth for Ionic.
The code wraps the implementation of [AppAuth-JS](https://github.com/openid/AppAuth-JS).

**The repo is very much work in progress!** But he code is working very well

This is our first go at a Open Source repo, so this is very much learning by doing.
For now, we'll rather refer to the implementation as "the code" instead of "the library" since is hasn't been published as a npm package just yet.

**If you have experience with managing an Open Source code base with public pull requests - please reach out!**

## Content
The repo contains two folders:
- src: Contains the implementation for Ionic
- example: Very raw examples of how to use the code. Doesn't compile 


## Features
The implementation supports the OpenID Connect Hybrid Flow to be used mainly by Smartphone Apps.
The code is a wrapper for the openid/AppAuth-JS implementation of OpenID Connect. The code supports both signin and Refresh Tokens.


### Todos

**For repo**:
- [ ] Ensure that package.json contains the correct dependencies
- [ ] Create a working example (At least something that now full of errors)
- [ ] Publish implementation as a public npm package
- [ ] Improve documentation

**For code:**
- [ ] Fallback to InAppBrowser when ChromeTabs or SafariViewController is not available


## About us:
The first part of this code was originally created by the brilliant minds of the company Iterator IT ApS, Denmark. We created this implementation to support signin for current and future clients. Feel free to reach out if you have any questions or need any advise. 

We were getting a lot of requests to share our code through various discussions and GitHub issues. **We are not sharing this code in the hunt for new customers.** This is purely for the sake of sharing!


## Links:

- [AppAuth-JS](https://github.com/openid/AppAuth-JS)
- [Main GitHub issues on the matter](https://github.com/openid/AppAuth-JS/issues/21) 
- [Furhter discussions](https://github.com/openid/AppAuth-JS/issues/2)
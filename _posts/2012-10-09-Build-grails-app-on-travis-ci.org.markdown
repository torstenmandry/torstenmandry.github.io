---
title: "Build grails-app on travis-ci.org"
layout: post
date: 2012-10-09 21:42
image: /assets/images/markdown.jpg
headerImage: false
tag:
- grails
- ci
blog: true
author: torstenmandry
description:  

---

I've just successfully configured a continous integration build of my 
new grails web application using [travis-ci.org](http://travis-ci.org/).

Travis-ci.org is a continuous integration service for the open source 
community. It is free to use and fully integrated with [github]
(https://github.com/). It 
supports multiple programming languages including java and groovy.

To get started with travis-ci.org log in using your github account and 
read the [getting started](http://about.travis-ci.org/docs/user/getting-started/) 
tutorial.

Once you have activated your github repository you need to add a 
.travis.yml file to your repository containing the necessary build 
configuration settings for travis-ci to build your application.

For a grails application you can use the following .travis.yml 
configuration:

{% highlight yml %}
language: groovy

jdk:
- oraclejdk7

before_install:
- sudo add-apt-repository -y ppa:groovy-dev/grails
- sudo apt-get update
- sudo apt-get install grails-2.1.1


script: grails test-app
{% endhighlight %}

Thanks to [berngp@github](https://gist.github.com/berngp) for publishing gist! 


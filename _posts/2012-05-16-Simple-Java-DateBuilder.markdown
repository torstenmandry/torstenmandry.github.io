---
title: "Simple Java DateBuilder"
layout: post
date: 2012-05-16 23:14
image: /assets/images/markdown.jpg
headerImage: false
tag:
- java
- builder
- testing
blog: true
author: torstenmandry
description: DateBuilder wrapper around GregorianCalendar with nice and simple interface 

---

I took some time on a trip to Munich to extract a little DateBuilder 
class from one of my latest Java projects and publish it to github. 
It's no big thing, just a simple wrapper around the default 
GregorianCalendar with a nice and simple interface. Check it out and 
feel free to use it in your projects.

[https://github.com/torstenmandry/testutils](https://github.com/torstenmandry/testutils)

Usage:

{% highlight java %}
// two days ago from today
DateBuilder.today().daysAgo(2);

// 15-09-2012
DateBuilder.givenDate(15, 5, 2012).monthsAhead(4);

// first day of next month
DateBuilder.today().day(1).monthAhead(1);

// or
DateBuilder.today().firstDay().nextMonth();
{% endhighlight %}
---
title: "Configurable entities with fluent interface"
layout: post
date: 2012-11-08 23:30
image: /assets/images/markdown.jpg
headerImage: false
tag:
- java
- builder
- testing
blog: true
author: torstenmandry
description:  

---

When testing Java applications you usually have to create entities with 
some kind of test data. Beside the content you need for your tests you 
often have to define some more stuff, just to get a valid entity. 
Particularly, in an integration test scenario, where you want to store 
your test entity in a database, you may additionally have to create some 
master or referenced entities to be able to save your data. Doing this 
in every single test (class) will pollute your tests very soon and makes 
it hard to read and maintain them.

In my last projects I used "configurable" entity extensions in 
combination with factory classes that create fully configured default 
entities to get my test code clean and readable. The API of the 
configurable entities mainly provides a "fluent interface" as described 
some years ago by Martin Fowler and Eric Evans 
(see [http://martinfowler.com/bliki/FluentInterface.html](http://martinfowler.com/bliki/FluentInterface.html)).

Let's have a look at an example to illustrate the idea.

Imagine you have a Customer entity like the following.

{% highlight java %}
public class Customer {

    private String firstName;
    private String lastName;
    private String eMail;
    private String phoneNumber;

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    ...
}
{% endhighlight %}

If you just use its Java Bean API to create a new customer in your test 
setup you would have to write something like this:

{% highlight java %}
@Test
public void doSomethingWithACustomer() {
    Customer aCustomer = new Customer();
    aCustomer.setFirstName("Donald");
    aCustomer.setLastName("Duck");
    aCustomer.setEMail("donald@ent.net");
    aCustomer.setPhoneNumber("001-1234-98765");
    ...
}
{% endhighlight %}


A ConfigurableCustomer that I usually would write looks as follows:


{% highlight java %}
public class ConfigurableCustomer extends Customer {

    public ConfigurableCustomer withFirstName(String firstName) {
        this.setFirstName(firstName);
        return this;
    }

    public ConfigurableCustomer withLastName(String lastName) {
        this.setLastName(lastName);
        return this;
    }

    public ConfigurableCustomer withEMail(String eMail) {
        this.setEMail(eMail);
        return this;
    }

    public ConfigurableCustomer withPhoneNumber(String phoneNumber) {
        this.setPhoneNumber(phoneNumber);
        return this;
    }
}
{% endhighlight %}

It extends the regular Customer and provides one with-method for each 
property of the entity. Each of these methods just does two things:

* it calls the regulary setter for this property to set the given value
* it returns the ConfigurableCustomer instance itself

With this test extension, we can refactor the formerly written test:

{% highlight java %}
@Test
public void doSomethingWithACustomer() {
    ConfigurableCustomer aCustomer = new ConfigurableCustomer()
        .withFirstName("Donald")
        .withLastName("Duck")
        .withEMail("donald@ent.net")
        .withPhoneNumber("001-1234-98765");
    ...
}
{% endhighlight %}

This code is a little slighter and there's less duplication in it. But 
that's not the most important change. It is also much more readable. It 
can almost be read like a part of a specification.

Now, what if all we need to configure in our test is the E-Mail address 
of our customer? Of course, we  need to define all the other data 
somewhere to get a valid customer to work with. But in our test setup 
we only want to describe the parts that are necessary for the test.

That is when I usually introduce a CustomerFactory in my test sources.


{% highlight java %}
public class CustomerFactory {

    /**
     * Creates a ConfigurableCustomer using some default data.
     * @return the Customer.
     */
    public static ConfigurableCustomer create() {
        return new ConfigurableCustomer()
                .withFirstName("Donald")
                .withLastName("Duck")
                .withEMail("donald@ent.net")
                .withPhoneNumber("001-1234-98765");
    }
}
{% endhighlight %}

It provides one - or sometimes more - methods to create a customer fully 
configured with some default data. It returns a ConfigurableCustomer 
instance, so we can easily overwrite individual properties as needed. 
If we only need an arbitrary customer, not interrested in its details, 
we can just take the default entity as it is. Therefore, the factory 
always should return a fully filled and valid entity.

In our test, where we just need a customer with a known email, we can 
now use the following code:


{% highlight java %}
@Test
public void doSomethingWithACustomer() {
    Customer aCustomer = CustomerFactory.create()
                .withEMail("a.known@email.com");
    ...
}
{% endhighlight %}

We will get a valid customer named "Donald Duck" with the default phone 
number and the defined email. All done with a tiny and readable piece 
of code in our test.

If we later on have to modify the Customer entity, e.g. add some more 
properties, all we have to do is to also extend the CustomerFactory to 
set reasonable default values for the new fields. By extending the 
ConfigurableCustomer class, too, we also make this new fields 
configurable.

That's it. No magic, no rocket science, just some simple patterns that 
make your testing life easier. Feel free to use it in your code and let 
me know your experiences with it.

Remark: If you're using JPA or another object-relational mapping 
technology you may experience some limitations extending your entity 
classes. In this case we have to find another way to implement our 
ConfigurableCustomer, e.g. let it wrap the Customer entity instead of 
extending it. Doing this, we no longer can easily use the 
ConfigurableCustomer everywhere a "normal" Customer is expected. 
Instead, we have to call a toCustomer() method to get the wrapped entity.


{% highlight java %}
public class ConfigurableCustomer {

    private Customer customer;

    public ConfigurableCustomer withFirstName(String firstName) {
        customer.setFirstName(firstName);
        return this;
    }

    public ConfigurableCustomer withLastName(String lastName) {
        customer.setLastName(lastName);
        return this;
    }

    ...

    public Customer toCustomer() {
        return customer;
    }
}
{% endhighlight %}


Our test case using this wrapping ConfigurableCustomer would look like 
this.


{% highlight java %}
@Test
public void doSomethingWithACustomer() {
    Customer aCustomer = CustomerFactory.create()
                .withEMail("a.known@email.com")
                .toCustomer();
    ...
}
{% endhighlight %}

That's a few more characters to type and a little cumbersome to read, 
but still much better than our example at the beginning of this post.


(Thanks to [@stefanscheidt](https://twitter.com/stefanscheidt) for review!)


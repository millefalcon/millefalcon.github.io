---
layout: post
title:  "Find max value from a list of lists"
date:   2022-12-04 12:14:58 +0530
categories: python3 max list
---
Another day of lurking in libera's #python channel, and someone was wondering what's the best way to find the max value from a list of lists.

For example, from a list like `[[1,2,3], [4,3,7], [5,6,6]]`, the expected result would be `7`, because `7` is the max value among all of the lists.

There are a couple of way to do this
# generator expression
{% highlight python %}
>>> x = [[1,2,3], [4,3,7], [5,6,6]]
>>> max(v for y in x for v in y)
7
{% endhighlight %}


# generator expression(but with max)
{% highlight python %}
>>> x = [[1,2,3], [4,3,7], [5,6,6]]
>>> max(max(v) for v in x)
7
{% endhighlight %}

# itertools
Mostly similar to the genexpr without `max` ?
{% highlight python %}
>>> import itertools
>>>
>>> x = [[1,2,3], [4,3,7], [5,6,6]]
>>> max(itertools.chain.from_iterable(x))
7
{% endhighlight %}

# max with max, with key as max
{% highlight python %}
>>> x = [[1,2,3], [4,3,7], [5,6,6]]
>>> max(max(x, key=max))
7
{% endhighlight %}

[`max`][max-docs] can take a `key` function with which we can tell what's the criteria for considering the `max`.

Anyway, that was fun :)

Check out [itertools docs][itertools-docs] for more info on `itertools`.
Check out [genexpr docs][genexpr-docs] for more info on `generator expression`.
Check out [genexpr example][genexpr-example].

[max-docs]: https://docs.python.org/3/library/functions.html#max
[genexpr-docs]: https://docs.python.org/3/reference/expressions.html#generator-expressions
[genexpr-example]: https://docs.python.org/3/howto/functional.html#generator-expressions-and-list-comprehensions
[itertools-docs]: https://docs.python.org/3/library/itertools.html#itertools.chain.from_iterable

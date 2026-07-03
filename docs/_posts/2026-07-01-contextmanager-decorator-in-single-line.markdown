---
layout: post
title:  "Contextmanager decorator in single line"
date:   2026-07-01 18:55:55 +0530
categories: python contextmanager decorator
---
A couple of days ago, I saw a [post](https://www.linkedin.com/posts/khuyen-tran-1401_python-datascience-softwareengineering-activity-7465401884057497600-6T9Y) regarding using context manager as decorator. That prompted me about what the use case for that would be.

Most example seems to be regarding some kind of logigng usage, and also saw it has been mentioned in the [docs](https://docs.python.org/3/library/contextlib.html#contextlib.ContextDecorator)


## Example
tl;dr, it looks something like the following

{% highlight python %}
from contextlib import contextmanager


@contextmanager
def context():
    print("Starting")
    yield
    print("Finishing")


@context()
def function():
    print("The bit in the middle")


function()
>>> function()
Starting
The bit in the middle
Finishing
>>>
>>> with context():
...   print("This bit in the middle")
... 
Starting
This bit in the middle
Finishing
>>> 
{% endhighlight %}

## Normal Implementation
Now that got me thinking, which would be a nice contextmanager that can be used as a decorator.
`redirect_stdout` seems like a good one. I thought, it would already be a contextmanager decorator, but looks like it is not.

We can just wrap the `redirect_stdout` in a `contextmanager` like,

{% highlight python %}
>>> from contextlib import contextmanager, redirect_stdout
>>> import io
>>> 
>>> 
>>> @contextmanager
... def redirect_stdout2(f):
...     with redirect_stdout(f):
...         yield
... 
>>> 
>>> f = io.StringIO()
>>> 
>>> 
>>> @redirect_stdout2(f)
... def func(x, y):
...     print("hello world")
...     return x + y
... 
>>> 
>>> func(1, 2)
3
>>> f.getvalue()
'hello world\n'
>>> 
{% endhighlight %}

But that got me thinking, how would a one liner look like :)


## The One Liner
So I spent an hour or so bruteforcing and reading the [docs](https://github.com/python/cpython/blob/3.14/Lib/contextlib.py) to make it work, and it took more than an hour ':)

It looks something like this,

{% highlight python %}
>>> from contextlib import contextmanager, redirect_stdout
>>> import io
>>> 
>>> 
>>> f = io.StringIO()
>>> 
>>> @(
...     lambda func:
...         lambda *a, **kw:
...             contextmanager(
...                 lambda: (
...                     c := redirect_stdout(f),
...                     c.__enter__(),
...                     (yield (func(*a, **kw), c.__exit__(None, None, None))[0]),
...                     c
...                 )
...             )().__enter__()
... )
... def func(x, y):
...     print("hello world")
...     return x + y
... 
>>> 
>>> func(1, 2)
3
>>> f.getvalue()
'hello world\n'
>>> 
{% endhighlight %}

Now, why would anyone want to do that ? No reason.

Anyway, that was fun :)

Check out [ContextDecorator][ContextDecorator] for more info on `ContextDecorator`.

[ContextDecorator]: https://docs.python.org/3/library/contextlib.html#contextlib.ContextDecorator

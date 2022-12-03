---
layout: post
title:  "Overriding Enum in Python"
date:   2022-12-03 12:14:58 +0530
categories: python3 enum metaclass
---
I was lurking in libera's #python channel one day, and someone was wondering if they could override the callable functionality of `Enum`.

For example, they wanted to be able to
`Enum(key)` to have the same functionality as `Enum[key]`.

The default usage would be
{% highlight python %}
>>> import enum
>>>
>>> class E(enum.Enum):
...   x = 1
...   y = 2
>>> E['x']
<E.x: 1>
>>> E.x
<E.x: 1>
>>>
>>> E(E.x)
<E.x: 1>
>>>
>>> # but we cannot do
>>> E('x')
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
  File "/usr/lib/python3.9/enum.py", line 360, in __call__
    return cls.__new__(cls, value)
  File "/usr/lib/python3.9/enum.py", line 677, in __new__
    raise ve_exc
ValueError: 'x' is not a valid E
{% endhighlight %}

To achieve what they wanted, we could provide a `metaclass` with `__call__` overridden.
{% highlight python %}
>>> class E(enum.Enum, metaclass=type('_', (enum.EnumMeta,), {'__call__': lambda s,n: s[n]})):
...   x = 1
...   y = 2
...
>>> E('x')
<E.x: 1>
>>> # or just write it out the like
>>> class Meta(enum.EnumMeta):
...   def __call__(self, name):
...     return self[name]
...
>>>
>>> class E(enum.Enum, metaclass=Meta):
...   x = 1
...   y = 2
...
>>> E('x')
<E.x: 1>
{% endhighlight %}

Anyway, that was fun. 

Check out [Enum docs][enum-docs] for more info on how to work with enums.

[enum-docs]: https://docs.python.org/3/library/enum.html

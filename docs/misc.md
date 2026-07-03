---
layout: page
title: Misc
permalink: /misc/
---

<ul>
  {% for item in site.misc %}
    <li>
      <a href="{{ item.url | relative_url }}">{{ item.title | default: item.basename }}</a>
    </li>
  {% endfor %}
</ul>

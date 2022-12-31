---
layout: default
---

# Mission Statement
I like languages&mdash;natural languages and programming languages&mdash;and in my career, I strive to combine these passions to build intuitive and useful software.

# Bio
I am a professional linguistics nerd interested in linguistics, software development, and natural language processing. You can check out some of my projects on [GitHub](https://github.com/maxTarlov), or connect with me on [LinkedIn](https://linkedin.com/in/maxtarlov).

<ul>
  {% for post in site.posts %}
    <li>
      <h2><a href="{{ post.url }}">{{ post.title }}</a></h2>
      {{ post.excerpt }}
    </li>
  {% endfor %}
</ul>
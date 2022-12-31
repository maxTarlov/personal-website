---
layout: default
---

# Mission Statement
I like languages&mdash;natural languages and programming languages&mdash;and in my career, I strive to combine these passions to build intuitive and useful software.

# Bio
I am a professional linguistics nerd interested in linguistics, software development, and natural language processing. You can check out some of my projects on [GitHub](https://github.com/maxTarlov), or connect with me on [LinkedIn](https://linkedin.com/in/maxtarlov).

<ul>
  {% for project in site.projects %}
    <li>
      {% if project.redirect %}
        <h2><a href="{{ project.redirect }}">{{ project.title }}</a></h2>
      {% else %}
        <h2><a href="{{ project.url }}">{{ project.title }}</a></h2>
      {% endif %}
      {{ project.excerpt }}
    </li>
  {% endfor %}
</ul>
---
layout: default
---

# About Me
<div class="excerpt truncated">
  {% assign about_page = site.info_pages | first %}
  {{ about_page.excerpt }}
  <a href="/about">Read more</a>
</div>

<div id="projects">
  <h1>Recent Projects</h1>
  {% for project in site.projects %}
    <div class="excerpt">
    {% if project.redirect %}
        <h2><a href="{{ project.redirect }}">{{ project.title }}</a></h2>
      {% else %}
        <h2><a href="{{ project.url }}">{{ project.title }}</a></h2>
    {% endif %}
    {{ project.excerpt }}
    </div>
  {% endfor %}
</div>
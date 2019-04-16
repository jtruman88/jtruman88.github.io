document.addEventListener('DOMContentLoaded', function() {
  const App = (function() {
    return {
      init: function() {
        Page.cacheTemplates();
        Page.bindEvents();
        Page.renderTemplate();
      }
    };
  })();
  
  const Page = (function() {
    const templates = {};
    const main = document.querySelector('main');
    const nav = document.querySelector('nav');
    const navLinks = document.querySelectorAll('nav a');
    
    function handleNavClick(e) {
      e.preventDefault;
      let elem = e.target;
      
      if (elem.tagName === 'A') {
        let id = elem.getAttribute('data-id');
        toggleActive(elem);
        this.renderTemplate(id);
      }
    }
    
    function toggleActive(elem) {
      Array.prototype.slice.call(navLinks).forEach(link => {
        link.classList.remove('active');
      });
      
      elem.classList.add('active');
    }
    
    function handleProjectClick(e) {
      let elem = e.target;
      
      if (elem.getAttribute('data-id') === 'toggle-info') {
        let info = elem.nextElementSibling;
        toggleHidden(info);
      }
    }
    
    function toggleHidden(info) {
      if (info.classList.contains('hidden')) {
        info.classList.remove('hidden');
      } else {
        info.classList.add('hidden');
      }
    }
    
    return {
      renderTemplate: function(temp = 'about') {
        main.innerHTML = templates[temp]();
      },
      
      cacheTemplates: function() {
        let temps = document.querySelectorAll('[type="text/x-handlebars"]');
        Array.prototype.slice.call(temps).forEach(temp => {
          templates[temp.id] = Handlebars.compile(temp.innerHTML);
          temp.remove();
        });
      },
      
      bindEvents: function() {
        nav.addEventListener('click', handleNavClick.bind(this));
        main.addEventListener('click', handleProjectClick);
      }
    };
  })();
  

  App.init();
});
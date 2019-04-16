document.addEventListener('DOMContentLoaded', function() {
  const app = (function() {
    return {
      init: function() {
        page.cacheTemplates();
        page.bindEvents();
        page.render('home')
      }
    };
  })();
  
  const page = (function() {
    const templates = {};
    const main = document.querySelector('main');
    const navLinks = document.querySelector('header ul');
    
    function handleLinkClick(e) {
      e.preventDefault();
      let element = e.target;
      
      if (element.tagName !== 'A') {
        return;
      }
      
      let id = element.getAttribute('data-id');
      
      switch (id) {
        case 'home':
          this.render('home');
          break;
        case 'pokemon':
          let url = 'https://pokeapi.co/api/v2/pokemon';
          xhr.getPokemon(url, this.render.bind(this, id));
          break;
      }
    }
    
    function handleClick(e) {
      let element = e.target;
      let type = element.getAttribute('data-type')
      if (type !== 'api') {
        e.preventDefault();
      }
      
      let url = element.getAttribute('href');
      
      switch (type) {
        case 'pokemon':
          xhr.getPokemonInfo(url, renderPokemonInfo);
          break;
        case 'page':
          xhr.getPokemon(url, this.render.bind(this, 'pokemon'));
          break;
      }
    }
    
    function renderPokemonInfo(data) {
      let template = templates.pokemon_details(data);
      let section = document.getElementById('pokemon_info');
      section.innerHTML = template;
    }
    
    return {
      cacheTemplates: function() {
        let temps = document.querySelectorAll('[type="text/x-handlebars"]');
        
        Array.prototype.slice.call(temps).forEach(temp => {
          templates[temp.getAttribute('id')] = Handlebars.compile(temp.innerHTML);
          temp.remove();
        });
      },
      
      bindEvents: function() {
        navLinks.addEventListener('click', handleLinkClick.bind(this));
        main.addEventListener('click', handleClick.bind(this));
      },
      
      render: function(temp, data = {}) {
        main.innerHTML = templates[temp](data)
      }
    };
  })();
  
  const xhr = (function() {
    function extractData(data) {
      return {
        name: data.name,
        order: padWithZeros(data.order),
        pic: data.sprites.front_default,
        types: getTypes(data.types),
        height: convertHeight(data.height),
        weight: convertWeight(data.weight)
      };
    }
    
    function padWithZeros(number) {
      let numStr = String(number);
      if (numStr.length === 1) {
        return '00' + numStr;
      } else if (numStr.length === 2) {
        return '0' + numStr;
      }
      
      return numStr;
    }
    
    function getTypes(types) {
      return types.map(type => {
        return type.type.name;
      });
    }
    
    function convertHeight(heightMetric) {
      const decimetersToInches = 3.94;
      let totalInches = parseInt(heightMetric) * decimetersToInches;
      let feet = Math.floor(totalInches / 12);
      let inches = Math.round(totalInches % 12);
      return feet + "'" + inches + '"';
    }
    
    function convertWeight(weightMetric) {
      const hectogramsToPounds = 0.220462;
      let pounds = parseInt(weightMetric) * hectogramsToPounds;
      return pounds.toFixed(1);
    }
    
    return {
      getPokemon: function(url, callback) {
        let request = new XMLHttpRequest();
        request.open('GET', url);
        request.responseType = 'json';
        request.send();
        
        request.addEventListener('load', function() {
          let data = request.response;
          console.log(data);
          callback(data);
        });
      },
      
      getPokemonInfo: function(url, callback) {
        let request = new XMLHttpRequest();
        request.open('GET', url);
        request.responseType = 'json';
        request.send();
        
        request.addEventListener('load', function() {
          let data = extractData(request.response);
          callback(data);
        });
      },
    };
  })();
  
  app.init();
});
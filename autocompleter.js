Vue.component('v-autocompleter', {
  template: `
      <div class="vue-autocompleter">  
        <input
          ref="first"
          :value="value"
          type="text"
          class="middle2"
          @input="$emit('input', $event.target.value)"
          @keyup.down="downClick"
          @keyup.up="upClick"
          @keyup.enter="enterClick" />
              <div class="lista1"></div>
                <div class="lista2">
                    <ul v-for="(city, index) in filteredCities" v-on:click="update_input(city.name)">
                    <li :class="{pogrubienie: index == list_counter}">
                    <a v-on:click="choose(index)" v-html="boldCity(city)">{{ city }}</a>
                   </li>
                   </ul>
              </div>
        </div>`,

    props: ['value','options'],
    /**
     * Znajduje się tutaj wartość wpisana w input
     */
  
    data: function () {
      return {
        foc: true,
        filteredCities: [],
        selected_city: '',
        googleSearch_temp: '',
        zmiana2: 0,
        cities: window.cities,
        list_counter: -1,
        cities_update: true,
        
      }
    },

    watch: {
      /**
       * Funkcja ta zajmuje się obserwacja zmian z wykorzystaniem przejsc wykonanymi strzalkami.
       * Wykonujac ruch strzalkami wartosc w inpucie sie nie zmienia
       */

      list_counter: function(){
        this.cities_update = false;

        if (this.list_counter >= 0) {
          this.$emit('input', this.filteredCities[this.list_counter].name);
        }
      },

      /**
       * Funkcja ta zajmuje sie sposobem wyswietlania wlasciwego autocompletera
       */

      value: function(){
        if(this.value.length == 0){
          this.filteredCities = [];
        } else{
          this.createFilteredCities(this.cities_update);
          this.cities_update=true;

          if(this.list_counter == -1){
            this.googleSearch_temp = this.value; 
            this.createFilteredCities(true);     
          }
        }
      },
    },

    methods: {
      /**
       * Funkcja ta tworzy rozsuwana liste 10 miast
       */
      createFilteredCities(bool){
          if(bool){
            let result = this.cities.filter(city => city.name.includes(this.value));
            if(result.length > 10){
              this.filteredCities = result.slice(1, 11);
            }
            else{
              this.filteredCities = result;
            }
          this.list_counter = -1;
        }
      },

      /**
       * Funkcja ta wystawia wlasciwy event po przejsciu z autocompletera
       */

      listClicked(name){
          this.$emit('input', this.value);
          this.enterClick();
      },
      /**
       * Funkcja ta pokazuje event po przejsciu z autocompletera i wskazaniu odpowiedniego miasta
       * @param {wybrane miasto na liscie} i 
       */

      choose(i){
          this.$emit('input', this.filteredCities[i].name);
      },
      /**
       * Funkcja ta pokazuje event po przejsciu z autocompletera i wskazaniu odpowiedniego miasta za pomoca entera
       * @param {*} event 
       */

      enterClick: function(event) {
        if(event) {
          this.cities_update = true;
          this.list_counter = -1;
        }
        this.$emit('enter', this.value);
        this.zmiana2 = 1;
      },
      /**
       * Funkcja ta zmienia wartosc iteratora autocompletera jeśli chodzi o przesuwanie strzalka w gore
       */

      upClick() {
        if(this.list_counter > -1){
          this.list_counter -= 1;
        } else if(this.list_counter == 0) {
          this.list_counter = this.filteredCities.length - 1;
        }
      },
      /**
       * Funkcja ta zmienia wartosc iteratora autocompletera jeśli chodzi o przesuwanie strzalka w dol
       */

      downClick() {
        if(this.list_counter < this.filteredCities.length - 1){
          this.list_counter += 1;
        }
        else if(this.list_counter == this.filteredCities.length - 1){
          this.list_counter = -1;
        }
      },
      /**
       * Funkcja zapisuje część wyrazu, której nie wpisalismy w wyszukiwarke
       * @param {zmieniony wyraz} input_city 
       * @returns wyraz po zmianie 
       */

      boldCity(input_city){
        let regex = new RegExp(this.googleSearch_temp, "gi");
        let bold = "<b>" + 
          input_city.name.replace(regex, match =>
              {return "<span class='thin'>"+ match +"</span>";}) 
                  + "</b>";
        return bold;
      }
    },
  }) 
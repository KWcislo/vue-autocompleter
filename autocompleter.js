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
      list_counter: function(){
        this.cities_update = false;

        if (this.list_counter >= 0) {
          this.$emit('input', this.filteredCities[this.list_counter].name);
        }
      },

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

      listClicked(name){
          this.$emit('input', this.value);
          this.enterClick();
      },

      choose(i){
          this.$emit('input', this.filteredCities[i].name);
      },

      enterClick: function(event) {
        if(event) {
          this.cities_update = true;
          this.list_counter = -1;
        }
        this.$emit('enter', this.value);
        this.zmiana2 = 1;
      },

      upClick() {
        if(this.list_counter > -1){
          this.list_counter -= 1;
        } else if(this.list_counter == 0) {
          this.list_counter = this.filteredCities.length - 1;
        }
      },

      downClick() {
        if(this.list_counter < this.filteredCities.length - 1){
          this.list_counter += 1;
        }
        else if(this.list_counter == this.filteredCities.length - 1){
          this.list_counter = -1;
        }
      },

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
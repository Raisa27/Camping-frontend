<template>
    <div>
        <h2>
            {{ number }}
        </h2>
        <h3>
            initial value: {{ initialValue }}
        </h3>
        <button @click="plusOne()" v-if="this.number < 10">
            +
        </button>
       <button @click="minusOne()" v-if="this.number > 0 ">
        -
       </button>

    </div>
</template>

<script>
export default{

      name:'CounterComponent',
      props: ["initalValue"],
      mounted()
      {
          this.value = parseInt(this.initialValue);
      },
      data() 
      {
        return {
            number:1
        }
      },
      methods: {
        plusOne() {
           if ( this.number < 10)
           {
            this.number++;
           }
            
            
        },
        minusOne(){
            if (this.number > 0)
                {
                   this.number--;
                }
            
        }
    }
    }

</script>
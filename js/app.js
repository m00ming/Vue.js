import CoffeeMenu from "./models/CoffeeMenu.js";
import BeverageMenu from "./models/BeverageMenu.js"
import SearchMenu from "./models/SearchMenu.js"

var coffeeItems=[]          //CoffeeMenu data를 담을 곳
var bvrgItems=[]            //BeverageMenu data를 담을 곳
var searchItems=[]          //SerchMenu data를 담을 곳
var eventBus = new Vue()    //Menu와 Search의 이벤트 통신을 위해 생성
var val                     //input의 value를 담을 곳

document.addEventListener('DOMContentLoaded', () => {   //HTML 문서를 완전히 불러오고 분석했을 때 실행
    CoffeeMenu.list().then(function(res){               //CoffeeMenu data -> coffeeItems
        for(var i=0; i<res.length; i++) {               //res.length만큼 반복
            coffeeItems.push(res[i])                    //coffeeItems에 저장
        }
    }).then(null, function(){   //res 값이 null일 때 실행
        document.querySelector("#c_list").innerHTML=`<li>커피 메뉴가 등록되지 않았습니다.</li>`
    }) 

    BeverageMenu.list().then(function(res){     //BeverageMenu data -> bvrgItems
        for(var i=0; i<res.length; i++) {       //res.length만큼 반복
            bvrgItems.push(res[i])              //bvrgItems에 저장 
        }
    })   

    SearchMenu.list(" ").then(function(res){    //SearchMenu data -> searchItems
        for(var i=0; i<res.length; i++) {       //res.length만큼 반복
            searchItems.push(res[i])            //searchItems에 저장 
        }
    })
})

var Search = new Vue({  //Search Component
    el:"#Search",
    data() {
        return{
            searchItems,    //SearchMenu data
            rShow: false,   //search-result 화면 (v-show)
            resetBtn:false, //resetBtn (v-show) 처음 접속했을 때 false
            drink: []
        }
    },
    mounted: function() {                               //메뉴를 클릭했을 때 실행
        eventBus.$on('click-menu', function(item) {     //Menu로부터 click-menu 이벤트 on
            this.drink=(item.name).replace(/[0-9]/g, "").replace(/,/g, "").trim()   //메뉴 이름만 추출
            this.resetBtn=true      //reset 버튼 보이게 한다.
            this.rShow=true         //검색 결과 화면을 보여준다. 여기서 this는 eventBus 자신이 된다.
        }.bind(this))               //bind(this) 해줘야 적용된다.
    },
    methods: {
        Input: function(e) {                        //v-on:keydown 입력값이 들어왔을 때
            val = e.target.value;                   //input에 들어온 값
            if(val.length>0) {                      //0보다 크면
                this.resetBtn=true                  //reset 버튼 보여준다.
            } else {                                //그렇지 않으면     
                this.resetBtn=false                 //reset 버튼 안 보이게 한다.
                if(this.rShow) {                    //검색 결과 화면이 나타난 상태라면
                    this.rShow= false               //검색 결과 화면을 없애준다.
                    eventBus.$emit('show-menu')     //show-menu 이벤트 emit -> Menu
                }
            }    
        },
        Search: function(e) {                       //v-on:keydown.enter.prevent 엔터키를 눌렀을 때
            eventBus.$emit('show-result')           //show-result 이벤트 emit -> Menu
            this.resetBtn=true                      //reset 버튼을 보이게 한다.
            this.rShow=true                         //search-result 화면 보이게 한다.
        },
        resetInput: function() {            //v-on:click resetBtn 눌렀을 때
            val=[]                          //입력값을 없애준다
            this.resetBtn=false             //resetBtn을 안 보이게 한다.
            this.rShow= false               //검색 결과 화면을 없애준다.
            eventBus.$emit('show-menu')     //show-menu 이벤트 emit -> Menu
        }
    }
})

var cafeMenu ={             //Munu의 하위 Component
    data() {
        return{
            isActive: true  //.tabs li의 class="active"
        }
    },
    template: `<ul class="tabs">
                    <li v-on:click="coffee" v-bind:class="{active: isActive}">커피 메뉴</li>
                    <li v-on:click="bvrg" v-bind:class="{active: !isActive}">음료 메뉴</li>
                </ul>`,
    methods: {
        coffee(){                       //커피 메뉴를 클릭했을 때
            this.isActive=true;         //class="active"
            this.$emit('show-coffee');  //show-coffee 이벤트 emit -> Menu
        },
        bvrg(){                         //음료 메뉴를 클릭했을 때
            this.isActive=false;        //class="active"
            this.$emit('show-bvrg');    //show-bvrg 이벤트 emit -> Menu
        }
    }
}
var Menu =new Vue({         //Menu Component
    el:"#Menu",
    data() {
        return{
            coffeeItems,    //커피 메뉴
            bvrgItems,      //음료 메뉴
            ok: true,       //true일 때 커피 메뉴, false일 때 음료 메뉴를 보여준다. (v-show)
            mShow: true     //menu 화면 (v-show)
        }
    },
    mounted: function() {
        eventBus.$on('show-result', function() {    //Search로 부터 show-result 이벤트 on
            this.mShow=false                        //메뉴 화면이 보이지 않게 한다. 여기서 this는 eventBus 자신이 된다.
        }.bind(this)),                              //bind(this) 해줘야 mShow = false 적용
        eventBus.$on('show-menu', function() {      //Search로 부터 show-menu 이벤트 on
            this.mShow=true                         //메뉴 화면이 보이게 한다.여기서 this는 eventBus 자신이 된다.
        }.bind(this));                              //bind(this) 해줘야 mShow = true 적용
    },
    methods: {
        showCoffee: function() {    //cafeMenu로부터 show-coffee 이벤트를 on하여 실행
            this.ok=true            //커피 메뉴를 보여준다.
        },
        showBvrg: function() {      //cafeMenu로부터 show-bvrg 이벤트를 on하여 실행
            this.ok=false           //음료 메뉴를 보여준다.
        },
        remove: function(item, index) {     //x버튼을 눌렀을 때 실행
            BeverageMenu.remove(item.name)  //선택된 item 삭제
            this.bvrgItems.splice(index, 1) //index부터 값 1개 제거
            if(this.bvrgItems.length==0) {  //item이 모두 삭제됐을 때 실행
                document.querySelector("#b_list").innerHTML=`<li>등록된 음료 메뉴가 없습니다.</li>`
             }
        },
        clickMenu: function(item) {             //메뉴를 클릭했을 때 실행
            eventBus.$emit('click-menu', item)  //click-menu 이벤트 emit -> Search
            this.mShow=false                    //메뉴 화면 없애준다.
        }
    },
    components:{
        'cafe-menu': cafeMenu   //Menu의 하위 Component
    },
})
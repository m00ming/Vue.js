export default {
    data: [
      {name: '에스프레소 4,000'}, 
      {name: '아메리카노 4,500'}, 
      {name: '라떼 5,000'}, 
      {name: '카푸치노 5,500'}
    ],
  
    // 데이터를 외부에서 가져갈때 사용하는 메소드
    list() {
      return new Promise(res => {
        setTimeout(() => {
          res(this.data)
        }, 200)
      })
    }
  }
  
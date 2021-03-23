export default {
    data: [
      { name: '에이드(레몬/망고/자몽)', price: '2,000' },
      { name: '청포도 플라워', price: '2,500'},
      { name: '블렌디드(망고/딸기/망고 바나나)', price: '3,000' },
    ],
  
    // 데이터를 외부에서 가져갈때 사용하는 메소드
    list() {
      return Promise.resolve(this.data)
    },
    
    // 데이터를 삭제할때 사용하는 메소드 
    remove(name) {
      this.data = this.data.filter(item => item.name !== name)
    }
  }
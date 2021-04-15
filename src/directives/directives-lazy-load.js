export const lazyLoad = {
  inserted : el => {
    function loadImage(){
      console.log('IMAGE LOADING')
      el.imageUrl = el.dataset.imageUrl
    }


    function callback(entries, observer){
      entries.forEach(entry => {
        if (entry.isIntersecting){
          loadImage()
          observer.unobserve(el)
        }
      })
    }
    function createIntersectionObserver() {

      const options = {
        root : null,
        threshold :0
      }
      const observer = new IntersectionObserver(callback, options)

      observer.observe(el)
    }
    if (!window['intersectionObserver'])
      loadImage()
    else {
      createIntersectionObserver()
    }
  }
};

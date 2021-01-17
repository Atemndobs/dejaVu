
function startComputing (id) {
  this[`loading${id}`] = true
  this[`percentage${id}`] = 0
  this[`interval${id}`] = setInterval(() => {
    this[`percentage${id}`] += Math.floor(Math.random() * 8 + 10)
    if (this[`percentage${id}`] >= 100) {
      clearInterval(this[`interval${id}`])
      this[`loading${id}`] = false
    }
  }, 700)
}

export {startComputing}

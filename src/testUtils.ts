export default {
  onceAsync: (assert, arg) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          resolve(assert.once(arg))
        }
        catch (err) {
          reject(err)
        }
      }, 1)
    })
  }
}

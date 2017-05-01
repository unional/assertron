export default {
  runAsync: (fn) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          resolve(fn())
        }
        catch (err) {
          reject(err)
        }
      }, 1)
    })
  },
  runSequentialAsync: (...fns) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          let i = 0
          for (; i < fns.length - 1; i++) {
            fns[i]()
          }
          resolve(fns[i]())
        }
        catch (err) {
          reject(err)
        }
      }, 1)
    })
  },
  runParallelAsync: (...fns) => {
    const promises: Promise<any>[] = []
    for (let i = 0; i < fns.length; i++) {
      promises.push(new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            let i = 0
            for (; i < fns.length - 1; i++) {
              fns[i]()
            }
            resolve(fns[i]())
          }
          catch (err) {
            reject(err)
          }
        }, 1)
      }))
    }
    return Promise.all(promises)
  }
}

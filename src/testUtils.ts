export function runAsync(fn) {
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
}

export function runSequentialAsync(...fns) {
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
}

export function runParallelAsync(...fns) {
  return Promise.all(fns.map(fn => runAsync(fn)))
}


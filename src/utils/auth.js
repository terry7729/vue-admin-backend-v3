class storageLib {
  static save(key, items) {
    return window.localStorage.setItem(key, JSON.stringify(items))
  }

  static fetch(key) {
    const item = window.localStorage.getItem(key)
    if (item) {
      return JSON.parse(item)
    }
    return null
  }
  static del(key) {
    return window.localStorage.removeItem(key)
  }
}

export default storageLib

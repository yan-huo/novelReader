import db from './modules/db'
import app from './modules/app'

import { createStore } from 'vuex'
const store = createStore({
  modules: {
    db,
    app
  }
})

export default store

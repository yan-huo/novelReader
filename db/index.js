const dbName = 'novelReader'
const dbPath = '_doc/novelReader.db'
import tableConfig from './tableConfig'

const deleteDatabase = () => {
  const delTableSql = []
  Object.keys(tableConfig).forEach((key) => {
    delTableSql.push(`DROP TABLE IF EXISTS ${key}`)
  })
  return executeSql(delTableSql)
}
const closeDatabase = () => {
  plus.sqlite.closeDatabase({
    name: dbName,
    success: () => {
      console.log('Database closed')
    },
    fail: () => {
      console.log('Database close failed')
    }
  })
}
const createDatabase = () => {
  const isOpen = plus.sqlite.isOpenDatabase({
    name: dbName,
    path: dbPath
  })
  if (isOpen) {
    return Promise.resolve()
  }
  return new Promise((resolve, reject) => {
    plus.sqlite.openDatabase({
      name: dbName,
      path: dbPath,
      success: resolve,
      fail: reject
    })
  })
}
const createDataBaseTable = () => {
  const tableSql = []
  for (const key in tableConfig) {
    tableSql.push(tableConfig[key])
  }
  return executeSql(tableSql)
}
const executeSql = (sql) => {
  return new Promise((resolve, reject) => {
    plus.sqlite.executeSql({
      name: dbName,
      sql: sql,
      success: resolve,
      fail: reject
    })
  })
}
const selectSql = (sql) => {
  return new Promise((resolve, reject) => {
    plus.sqlite.selectSql({
      name: dbName,
      sql: sql,
      success: resolve,
      fail: reject
    })
  })
}
export { deleteDatabase, closeDatabase, createDatabase, createDataBaseTable, executeSql, selectSql }

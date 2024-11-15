import { executeSql, selectSql } from '../db'

const addBook = (params) => {
  const fields = []
  const fieldsValue = []
  for (const key in params) {
    if (
      key !== 'createTime' &&
      key !== 'updateTime' &&
      (params[key] !== null || params[key] !== undefined)
    ) {
      fields.push(key)
      fieldsValue.push(typeof params[key] === 'string' ? `'${params[key]}'` : params[key])
    }
  }
  const createTime = Date.now()
  fields.push('createTime', 'updateTime')
  fieldsValue.push(createTime, createTime)
  const sql = `INSERT INTO book (${fields.join(', ')}) VALUES (${fieldsValue.join(', ')})`
  return executeSql(sql)
}
const deleteBook = (bookId) => {
  const delSql = [
    `DELETE FROM book WHERE id = '${bookId}'`,
    `DELETE FROM chapter WHERE bookId = '${bookId}'`
  ]
  return executeSql(delSql)
}
const clearBook = () => {
  const delSql = [`DELETE FROM book`, `DELETE FROM chapter`]
  return executeSql(delSql)
}
const updateBook = (params) => {
  const { id } = params
  if (!id) {
    Promise.reject('id not null')
  } else {
    let fields = []
    for (const key in params) {
      if (key !== 'id' && key !== 'updateTime') {
        fields.push(
          `${key} = ${typeof params[key] === 'string' ? `'${params[key]}'` : params[key]}`
        )
      }
    }
    if (!fields.length) {
      return Promise.reject('update fields null')
    }
    fields.push(`updateTime = ${Date.now()}`)
    const sql = `UPDATE book SET ${fields.join(', ')} WHERE id = '${id}'`
    return executeSql(sql)
  }
}
const getBookPage = (params) => {
  const { pageNo = 1, pageSize = 12 } = params
  const pageSql = `SELECT *
               FROM book LIMIT ${pageSize}
               OFFSET ${pageSize * (pageNo - 1)}`
  const countSql = `SELECT COUNT(*) as total, CASE WHEN COUNT(*) > ${
    pageSize * pageNo
  } THEN 1 ELSE 0 END as hasNext FROM book`
  return new Promise((resolve, reject) => {
    Promise.all([selectSql(pageSql), selectSql(countSql)])
      .then((results) => {
        resolve({ rows: results[0], total: results[1].total, hasNext: results[1].hasNext })
      })
      .catch((err) => {
        reject()
        console.log(err)
      })
  })
}
const checkBookAddedByPath = (path) => {
  if (!path) {
    return Promise.reject()
  } else {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM book WHERE path = '${path}'`
      selectSql(sql)
        .then((data) => {
          resolve(data && data.length)
        })
        .catch((err) => {
          reject()
        })
    })
  }
}

const getChapterContentByProgressChapterId = (chapterId) => {
  if (!chapterId) {
    return Promise.reject('chapterId not null')
  } else {
    return new Promise((resolve, reject) => {
      const chapterSql = `SELECT * FROM chapter WHERE id = '${chapterId}'`
      selectSql(chapterSql)
        .then((result) => {
          console.log(result)
          if (result[0]) {
            const chapter = result[0]
            let ids = ''
            if (chapter.prevChapterId) {
              ids += `'${chapter.prevChapterId}'`
            }
            if (chapter.nextChapterId) {
              ids += `, '${chapter.nextChapterId}'`
            }
            if (ids) {
              const prevNextSql = `SELECT * FROM chapter WHERE id IN (${ids})`
              selectSql(prevNextSql)
                .then((data) => {
                  const prevChapter =
                    chapter.prevChapterId && data.find((item) => item.id === chapter.prevChapterId)
                  const nextChapter =
                    chapter.nextChapterId && data.find((item) => item.id === chapter.nextChapterId)
                  resolve([prevChapter, chapter, nextChapter])
                })
                .catch((err) => {
                  reject()
                })
            } else {
              resolve([null, chapter, null])
            }
          } else {
            reject(`chapter not find by id ${chapterId}`)
          }
        })
        .catch((err) => {
          reject(`chapter not find by id ${chapterId}`)
          console.log(err)
        })
    })
  }
}
const getChapterContentByChapterId = (chapterId) => {
  if (!chapterId) {
    return Promise.reject('chapterId not null')
  } else {
    const chapterSql = `SELECT * FROM chapter WHERE id = '${chapterId}'`
    return selectSql(chapterSql).then((result) => result[0])
  }
}
const addChapter = (params) => {
  const fields = []
  const fieldsValue = []
  for (const key in params) {
    if (
      key !== 'createTime' &&
      key !== 'updateTime' &&
      (params[key] !== null || params[key] !== undefined)
    ) {
      fields.push(key)
      fieldsValue.push(
        typeof params[key] === 'string'
          ? `'${params[key]}'`
          : typeof params[key] === 'object'
          ? `'${JSON.stringify(params[key])}'`
          : params[key]
      )
    }
  }
  const createTime = Date.now()
  fields.push('createTime', 'updateTime')
  fieldsValue.push(createTime, createTime)
  const sql = `INSERT INTO chapter (${fields.join(', ')}) VALUES (${fieldsValue.join(', ')})`
  return executeSql(sql)
}
const getChapterListByBookId = (bookId, hasContent) => {
  let listSql = `SELECT id, name, bookId, prevChapterId, nextChapterId from chapter WHERE bookId = '${bookId}'`
  if (hasContent) {
    listSql = `SELECT * from chapter WHERE bookId = '${bookId}'`
  }
  return selectSql(listSql)
}
export {
  getBookPage,
  addBook,
  clearBook,
  deleteBook,
  updateBook,
  checkBookAddedByPath,
  getChapterContentByProgressChapterId,
  getChapterContentByChapterId,
  addChapter,
  getChapterListByBookId
}

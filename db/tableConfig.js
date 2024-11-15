const book = `CREATE TABLE IF NOT EXISTS book (
    id VARCHAR(36) PRIMARY KEY NOT NULL,
    name VARCHAR(64) NOT NULL,
    path VARCHAR(128) NOT NULL,
    backgroundColor VARCHAR(7),
    wordsNumber INTEGER,
    pagesNumber INTEGER,
    chapterNumber INTEGER,
    progressPageNumber INTEGER,
    progressChapterId VARCHAR(36),
    progressChapterPageIndex INTEGER,
    progressTime INTEGER,
    fontSize INTEGER,
    lineHeight INTEGER,
    isInit INTEGER,
    createTime INTEGER,
    updateTime INTEGER
  )`
const chapter = `CREATE TABLE IF NOT EXISTS chapter (
    id VARCHAR(36) PRIMARY KEY NOT NULL,
    name VARCHAR(64) NOT NULL,
    bookId VARCHAR(36) NOT NULL,
    prevChapterId VARCHAR(36),
    nextChapterId VARCHAR(36),
    content TEXT,
    createTime INTEGER,
    updateTime INTEGER
  )`
export default { book, chapter }

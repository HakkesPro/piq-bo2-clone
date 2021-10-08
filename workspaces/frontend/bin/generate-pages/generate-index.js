const { pageData, exclude } = require('./pages-data')
const { writeFile, continueCheck } = require('./generate-pages-helpers')
const { createPageTemplate } = require('./pages-template')
const { createTestPageTemplate } = require('./pages-test-template')

const cmdArg = process.argv[2]

const CmdArgs = {
  ALL_PAGES: '--all-pages',
  SINGLE_PAGE: '--single-page',
  ALL_TEST_PAGES: '--all-test-pages',
}

const writeToFile = (fileName, fileData, pageTemplateFunc) => {
  const callback = (pathDestination, template) => {
    writeFile(fileName, pathDestination, template)
  }
  pageTemplateFunc(callback, fileData.name)
}

const stop = () => console.log('Ok, lets stop there')

const generateAllPages = async (createTemplateFunc, typeOfFiles, extension) => {
  // Loop through all pages excluding the one in "exclude"
  console.log('Make sure you have excluded pages in pages-data.js that should not be included in this')
  const allow = await continueCheck(typeOfFiles)
  if (allow.continue) {
    pageData.forEach(fileData => {
      if (!exclude.includes(fileData.name)) {
        writeToFile(`${fileData.name}${extension}`, fileData, createTemplateFunc)
      }
    })
  } else {
    stop()
  }
}

const generateSinglePage = async (createTemplateFunc, fileName, extension) => {
  if (!fileName) {
    console.log('Provide a file name as second argument please')
    return null
  }
  try {
    const fileData = pageData.find(fileData => fileData.name === fileName);
    const allow = await continueCheck(fileName)
    if (allow.continue) {
      writeToFile(`${fileName}${extension}`, fileData, createTemplateFunc)
    } else {
      stop()
    }
  } catch (e) {
    console.log(`Could not find file: ${fileName}`)
  }
}

const allPages = (createTemplateFunc, typeOfFiles) => generateAllPages(createTemplateFunc, typeOfFiles, '.tsx')
const singlePage = (createTemplateFunc, fileName) => generateSinglePage(createTemplateFunc, fileName, '.tsx')
const allTestPages = (createTemplateFunc, typeOfFiles) => generateAllPages(createTemplateFunc, typeOfFiles, '.test.jsx')


const start = async () => {
  switch (cmdArg) {
    case CmdArgs.ALL_PAGES:
      return allPages(createPageTemplate, 'all files');
    case CmdArgs.SINGLE_PAGE:
      return singlePage(createPageTemplate, process.argv[3])
    case CmdArgs.ALL_TEST_PAGES:
      console.log('CmdArgs.ALL_TEST_PAGES')
      return allTestPages(createTestPageTemplate, 'all test files')
    default:
      console.log('Provide an argument, "--all" to overwrite all, "--single {fileName}" WITHOUT THE EXTENSION to overwrite single file only')
      console.log('eg: npm run generate-pages:single AcceptanceRateOverview')
      break
  }
}

start()
// console.log('hej')

const fs = require('fs')
const inquirer = require('inquirer')

exports.writeFile = (filename, path, content) => {
  const fullPath = `${path}/${filename}`
  
  // fs.unlinkSync(fullPath) // This deletes instead

  fs.writeFile(fullPath, content, (err) => {
    // throws an error, you could also catch it here
    if (err) throw err;
    // success case, the file was saved
    console.log(`${filename} saved!`);
  })
}

exports.continueCheck = async (files) => {
  const feedback = inquirer.prompt({
    type: 'confirm',
    name: 'continue',
    message: `This will overwrite ${files}, you sure you wanna continue?`,
    default: false,
  },);
  return feedback
}

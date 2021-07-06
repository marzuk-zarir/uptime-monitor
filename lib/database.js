/**
 * Title: Database
 * Description: all database related work
 * Author: Marzuk Zarir
 * Date: 06-07-2021
 *
 */

const path = require('path')
const fs = require('fs').promises

const db = {}

// Base dir of all data folder
db.basedir = path.join(__dirname, '../.db')

// Create data specific file. if file exist it returns a error
db.createData = async (subDir, fileName, data, callback) => {
    let fileDescriptor
    try {
        // baseDir/{sub_dir}/{file_name}.json
        fileDescriptor = await fs.open(`${db.basedir}/${subDir}/${fileName}.json`, 'wx')

        // Write data on file
        await fs.writeFile(fileDescriptor, JSON.stringify(data))

        // Send success status
        callback(null, 'Create data successfully')
    } catch (error) {
        // Send error status
        callback(error.message, null)
    } finally {
        // After operation close the file
        fileDescriptor ? await fileDescriptor.close() : false
    }
}

// Read data from file. it return json format data with utf-8 encoding
db.readData = async (subDir, fileName, callback) => {
    try {
        const readData = await fs.readFile(`${db.basedir}/${subDir}/${fileName}.json`, 'utf-8')
        callback(null, readData)
    } catch (error) {
        callback(error.message, null)
    }
}

// Update data for existing file
db.updateData = async (subDir, fileName, data, callback) => {
    let fileDescriptor

    try {
        // Open exiting file
        fileDescriptor = await fs.open(`${db.basedir}/${subDir}/${fileName}.json`, 'r+')

        // Truncate or remove all data of existing file
        await fileDescriptor.truncate()

        // Write new data on truncated file
        await fs.writeFile(fileDescriptor, JSON.stringify(data))

        // Send success status
        callback(null, 'Update data successfully')
    } catch (error) {
        // Send error status
        callback(error.message, null)
    } finally {
        // After operation close the file
        fileDescriptor ? await fileDescriptor.close() : false
    }
}

// Delete existing file
db.deleteFile = async (subDir, fileName, callback) => {
    try {
        await fs.unlink(`${db.basedir}/${subDir}/${fileName}.json`)
        callback(null, 'Delete file successfully')
    } catch (error) {
        callback(error.message, null)
    }
}

module.exports = db

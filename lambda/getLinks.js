/* eslint-disable */
const AWS = require('aws-sdk'),
    uuid = require('uuid'),
    documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const params = {
        TableName: process.env.TABLE_NAME
    };
    try {
        const links = await documentClient.scan(params).promise();
        return {
            table: process.env.TABLE_NAME,
            statusCode: 200,
            body: links,
        };
    } catch (e) {
        return {
            statusCode: 500,
            body: e
        }
    }

}
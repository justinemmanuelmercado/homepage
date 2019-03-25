/* eslint-disable */
const AWS = require('aws-sdk'),
    uuid = require('uuid'),
    documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    let response = {
        table: process.env.TABLE_NAME,
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
    const params = {
        Item: {
            ...event,
            "id": uuid.v1(),
            "dateCreated": new Date().toISOString()
        },
        TableName: process.env.TABLE_NAME
    };
    try {
        await documentClient.put(params).promise();
        return response;
    } catch (e) {
        return {
            statusCode: 500,
            body: e
        }
    }

}
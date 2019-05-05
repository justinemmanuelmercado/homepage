import AWS from "aws-sdk";

// Why doesn't this work still?
const dynamodb = new AWS.DynamoDB({ region: process.env.AWS_REGION || "us-east-1" });
const documentClient = new AWS.DynamoDB.DocumentClient({
    service: dynamodb,
    convertEmptyValues: true
});


export const getLinks = async (type: number): Promise<AWS.DynamoDB.DocumentClient.QueryOutput> => {
    const params: AWS.DynamoDB.DocumentClient.QueryInput = {
        TableName: process.env.TABLE_NAME as string,
        IndexName: "TypeIndex",
        ScanIndexForward: false,
        KeyConditions: {
            type: {
                ComparisonOperator: "EQ",
                AttributeValueList: [type]
            }
        }
    };

    const links = await documentClient.query(params).promise();
    return links;
};

export const putLink = async (params: AWS.DynamoDB.DocumentClient.PutItemInput): Promise<AWS.DynamoDB.DocumentClient.PutItemOutput> => {
    const response = await documentClient.put(params).promise();
    return response;
};

export const deleteLinks = async (ids: string[], dates: string[]): Promise<AWS.DynamoDB.DocumentClient.BatchWriteItemOutput> => {
    const requestItems: AWS.DynamoDB.DocumentClient.WriteRequests = [];
    ids.forEach((v: string, idx: number) => {
        requestItems.push({
            DeleteRequest: {
                Key: {
                    'id': v,
                    'dateCreated': dates[idx]
                }
            }
        })
    });
    const params = {
        RequestItems: {
            [process.env.TABLE_NAME as string]: requestItems
        }
    };

    const response = await documentClient.batchWrite(params).promise();
    return response;
}
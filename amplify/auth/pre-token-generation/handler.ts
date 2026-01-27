import type { PreTokenGenerationTriggerHandler } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

// Initiailize DynamoDB
const db = DynamoDBDocumentClient.from(
    new DynamoDBClient({ region: "us-east-2"})
);

export const handler: PreTokenGenerationTriggerHandler = async (event) => {
    const userSub = event.request.userAttributes.sub;

    try {
        const res = await db.send(
            new GetCommand({
                TableName: "LeadManager",
                Key: {
                    PK: `USER#${userSub}`,
                    SK: `METADATA`,
                },
            })
        );

        const orgId = res.Item?.orgID
        const role = res.Item?.role

        // Add custom claims to the token
        event.response = {
            claimsOverrideDetails: {
                claimsToAddOrOverride: {
                    "custom:orgID": orgId,
                    "custom:role": role,
                },
            },
        };
    } catch (error) {
        console.error("Error fetching user data from DynamoDB", error);
        throw error;
    }
    return event;
};
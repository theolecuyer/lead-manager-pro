import type { PostConfirmationTriggerHandler } from "aws-lambda";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

// Initiailize DynamoDB
const db = DynamoDBDocumentClient.from(
    new DynamoDBClient({ region: "us-east-2"})
);

export const handler: PostConfirmationTriggerHandler = async (event) => {
    const userSub = event.request.userAttributes.sub;
    const email = event.request.userAttributes.email;
    const inviteCode = event.request.userAttributes["custom:inviteCode"];

    try {
        // Check if user is already created
        const userExists = await db.send(
            new GetCommand({
                TableName: "LeadManager",
                Key: {
                    PK: `USER#${userSub}`,
                    SK: "METADATA",
                },
            })
        )

        if (userExists.Item) {
            console.log(`User ${userSub} already has metadata, skipping setup`);
            return event;
        }

        // Check if invite code is valid or used
        const inviteRes = await db.send(
            new GetCommand({
                TableName: "LeadManager",
                Key: {
                    PK: `INVITE#${inviteCode}`,
                    SK: "METADATA"
                }
            })
        )

        if (!inviteRes.Item) {
            console.error(`Invalid invite code: ${inviteCode}`);
            throw new Error("Invalid invite code");
        }

        if (inviteRes.Item.used) {
            console.error(`Invite code already used: ${inviteCode} by ${inviteRes.Item.usedBy}`);
            throw new Error("Invite code has already been used");
        }

        const role = inviteRes.Item.role;
        const orgID = inviteRes.Item.orgID;

        if (!role || !orgID) {
            console.error(`Invalid invite data: missing role or orgID for ${inviteCode}`);
            throw new Error("Invite code is malformed");
        }

        // Mark invite code as used
        await db.send(
            new UpdateCommand({
                TableName: "LeadManager",
                Key: {
                    PK: `INVITE#${inviteCode}`,
                    SK: "METADATA",
                },
                UpdateExpression: "SET #used = :used, #usedBy = :usedBy, #usedAt = :usedAt",
                ExpressionAttributeNames: {
                    "#used": "used",
                    "#usedBy": "usedBy",
                    "#usedAt": "usedAt",
                },
                ExpressionAttributeValues: {
                    ":used": true,
                    ":usedBy": userSub,
                    ":usedAt": new Date().toISOString(),
                },
            })
        );

        // Create user metadata
        await db.send(
            new PutCommand({
                TableName: "LeadManager",
                Item: {
                    PK: `USER#${userSub}`,
                    SK: "METADATA",
                    role: role,
                    orgID: orgID,
                    email: email,
                    createdAt: new Date().toISOString(),
                }
            })
        )

    } catch(error) {
        console.error(`Error in post-confirmation trigger: ${error}`);
        throw error;
    }
    return event;
};
const { app } = require("@azure/functions");
const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");
const { SecretClient } = require("@azure/keyvault-secrets");
const { DefaultAzureCredential } = require("@azure/identity");

const AZ_OPENAI_API_KEY = process.env.AZ_OPENAI_API_KEY
const AZ_OPENAI_API_ENDPOINT = process.env.AZ_OPENAI_API_ENDPOINT
const AZ_OPENAI_MODEL_DEPLOYMENT_ID = process.env.AZ_OPENAI_MODEL_DEPLOYMENT_ID

const AZ_SEARCH_API_KEY = process.env.AZ_SEARCH_API_KEY;
const AZ_SEARCH_ENDPOINT=process.env.AZ_SEARCH_ENDPOINT;
const AZ_SEARCH_INDEX_NAME=process.env.AZ_SEARCH_INDEX_NAME;

app.http("SmartQuestionsAnswer", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    const payload = await request?.json(); 

    if (!payload?.question) {
      return { status: 400, body: "Please provide question text in the request body" };
    }

    const credential = new DefaultAzureCredential({
      managedIdentityClientId: process.env["MANAGED_IDENTITY_CLIENT_ID"],
    });
    const keyVaultName = "functions-credentials";

    const url = "https://" + keyVaultName + ".vault.azure.net";
    const vaultClient = new SecretClient(url, credential);
    
    try {
      const client = new OpenAIClient(
        AZ_OPENAI_API_ENDPOINT,
        new AzureKeyCredential(AZ_OPENAI_API_KEY)
      );

      let resultSentenceStream = "";

      const messages = [
        {
          role: "user",
          content: payload.question,
        },
      ];

      const events = await client.streamChatCompletions(
        AZ_OPENAI_MODEL_DEPLOYMENT_ID,
        messages,
        {
          azureExtensionOptions: {
            extensions: [
              {
                type: "azure_search",
                endpoint: AZ_SEARCH_ENDPOINT,
                indexName: AZ_SEARCH_INDEX_NAME,
                authentication: {
                  type: "api_key",
                  key: AZ_SEARCH_API_KEY,
                },
              },
            ],
          },
        }
      );

      for await (const event of events) {
        // console.log(event);


        for (const choice of event.choices) {          
          if (choice.delta?.content) {
            resultSentenceStream += choice.delta?.content;
          }
        }
      }

      return { body: JSON.stringify({ data: resultSentenceStream }) };
    } catch (error) {
      console.log("ERROR", error);
    }
  },
});

# Azure OpenAI Chat Completion 

This project uses the Azure OpenAI service with a deployed legacy GPT-35-turbo base model to implement the prototype of a basic intelligent search functionality which enables users to search for key information in a document using chat prompts. Using the Bring Your Own Data (BYOD) feature of OpenAI models, this model connects to an Azure Search service and answers questions using an embedded [How_to_Drive_a_Car_with_Pictures_wikiHow.pdf](https://victoryaistorageaccount.blob.core.windows.net/fileupload-files/How_to_Drive_a_Car_with_Pictures_wikiHow.pdf?sp=r&st=2024-10-22T16:07:06Z&se=2026-12-01T01:07:06Z&sv=2022-11-02&sr=b&sig=eeVoxRq%2FU5xZmXA6WssPbG4NhsK%2BqExmn9zb2xpim%2Bs%3D) document. 

Navigate to 

<img src="./images/Screenshot-1.png" style="height: 600px; width: 70%; object-fit: cover;" />

### Azure Services; 

The project uses the following services within Azure; 

- Azure OpenAI to deploy and train the GPT-35-turbo model.
- Azure Search. 
- Azure KeyVault to the sensitive connection details of the OpenAI and Search services.  
- Azure Functions to connect to my OpenAI model and pass in chat prompts. 


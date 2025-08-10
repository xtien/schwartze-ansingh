## Aunt Thérèse's niece ##

This is a frontend for my [Schwartze-Ansingh project](https://www.schwartze-ansingh.com).

I have 500 letters from the families Schwartze and Ansingh, written between 1880 and 1940. I have scanned all letters, then I read them and transcribed them (to ascii files), which is time consuming. This application serves to enter the data on the letters, to show the scanned letters and transcripts. After finishing the preparations, I'll continue the research and write a book. The backend is in Java/Spring Boot, the frontend is in React/typescript/vite.

The backend software is at https://www.github.com/xtien/schwartze-backend

The web site is at https://www.schwartze-ansingh.com


The project uses openapi-generator to generate the api calls from the swagger page of the api.
https://openapi-generator.tech/docs/installation/


```bash
java -jar ./openapi-generator-cli.jar generate -i http://localhost:8084/v3/api-docs -g typescript-axios -pwithSeparateModelsAndApi=true -papiPackage=api -pmodelPackage=model -o ./src/generated-api 
```

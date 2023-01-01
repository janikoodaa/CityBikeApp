# Helsinki city bike app

This project is created to show data of journeys made with Helsinki City Bikes and this is inspired by https://github.com/solita/dev-academy-2023-exercise

## Tech stack

- As a database I'm using Azure SQL Emulator running in Docker, because this offers easy way to build and tear down the database.
- Backend is built with .NET 6
- Client is made with React and styled with Material UI.

## Getting started, build up the database

To follow these instructions, you need to have Docker Desktop and Azure Data Studio (or VS Code) installed. See [Microsoft documentation](https://learn.microsoft.com/en-us/azure/azure-sql/database/local-dev-experience-set-up-dev-environment?view=azuresql&tabs=vscode).
Below steps describe the workflow with Azure Data Studio.

1. Open Azure Data Studio and make sure, you have "SQL Database Projects" -extension installed.
   ![SQL Database Projects -extension](Images/SQL%20Database%20Projects.png)
2. In "Database Projects" -tab open existing project "CityBikeDB" which is located in the root of cloned project folder.
3. Build project and check, that there are no errors.
   ![Build project](Images/build_db-project.png)
4. Publish project to Docker (creates new container, where the database will be running)
      - Choose "Publish to new Azure SQL server local development container".
      - Use default port 1433
      - Define server admin password (later you need to connect to database for inserting data, so remember the password)
      - Choose "Azure SQL Database emulator Lite" as Docker image
      - Make sure, that the database name is "CityBikeDB"
        ![Publish project](Images/publish_db-project.png)
5. Copy source data files to Docker container
      - Using terminal cd to the projects root folder
      - Copy the whole "DataToImport" -directory to the Docker container (created in the previous step) using command `docker cp DataToImport <CONTAINER_ID>:/var/opt`
           - `<CONTAINER_ID>` is the 12-character container-id
      - The original csv-files are included in project files to prevent any conflicts while inserting their data to database. Files are split in half because of the Github's limitations for file size.
6. Connect to database as server admin (sa) using the password defined earlier
   ![Connect to database](Images/Connect_to_database.png)
7. Run script in file InsertData.sql
      - Script will validate and insert data from csv-files to Stations- and Trips-tables. Explanation on validation is given as comment in [InsertData.sql](DataToImport/InsertData.sql)

Now the database is ready :+1:

## To run the project

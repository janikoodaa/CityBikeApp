# Helsinki city bike app

This project is created to show data of journeys made with Helsinki City Bikes and this is inspired by https://github.com/solita/dev-academy-2023-exercise

## Tech stack

As database I'm using Azure SQL Emulator running in Docker.
Backend is built with .NET 6
Client is made with React and styled with Material UI.

## Getting started, build up the database

1. Open Azure Data Studio and make sure, you have "SQL Database Projects" -extension installed.
   [SQL Database Projects -extension](Images/SQL%20Database%20Projects.png)
2. In "Database Projects" -tab open existing project "CityBikeDB" which is located in the root of cloned project folder.
3. Build project and check, that there are no errors.
   [Build project](Images/build_db-project.png)
4. Publish project to Docker

- Choose "Publish to new Azure SQL server local development container".
- Use default port 1433
- Define server admin password (this won't be needed to run the app)
- Choose "Azure SQL Database emulator Lite" as Docker image
- Make sure, that the database name is "CityBikeDB"
  [Publish project](Images/publish_db-project.png)

5.

## To run the project

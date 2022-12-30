-- This file contains SQL statements that will be executed after the build script.
USE master;
GO
ALTER DATABASE CityBikeDB COLLATE Finnish_Swedish_CI_AS;
GO

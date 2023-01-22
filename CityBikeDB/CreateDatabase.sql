-- This script will be executed when the database is built.
-- It creates schema, login/user (limited rights for API application), needed tables and views.

CREATE SCHEMA citybike;
GO

CREATE LOGIN citybikeapp WITH PASSWORD='bikeapp12&';
GO

CREATE USER citybikeapp FOR LOGIN citybikeapp WITH DEFAULT_SCHEMA=citybike;
GO

GRANT CONNECT TO [citybikeapp];
GO

-- Colums in the source CSV-file:
-- FID,ID,Nimi,Namn,Name,Osoite,Adress,Kaupunki,Stad,Operaattor,Kapasiteet,x,y
CREATE TABLE [citybike].[Stations]
(
    [Id] INT NOT NULL PRIMARY KEY,
    [NameFin] VARCHAR(100) NOT NULL,
    [NameSwe] VARCHAR(100) NOT NULL,
    [NameEng] VARCHAR(100) NOT NULL,
    [AddressFin] VARCHAR(100) NOT NULL,
    [AddressSwe] VARCHAR(100) NOT NULL,
    [CityFin] VARCHAR(50) NOT NULL,
    [CitySwe] VARCHAR(50) NOT NULL,
    [Operator] VARCHAR(100),
    [Capacity] INT NOT NULL,
    [XCoordinate] DECIMAL(15, 13) NOT NULL,
    [YCoordinate] DECIMAL(15, 13) NOT NULL,
)
GO

-- Colums in the source CSV-files:
-- Departure,Return,Departure station id,Departure station name,Return station id,Return station name,Covered distance (m),Duration (sec.)
-- No point importing station names, as there are Ids, which can be used as foreign keys.
CREATE TABLE [citybike].[Trips]
(
    [Id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [DepartureDate] DATETIME NOT NULL,
    [ReturnDate] DATETIME NOT NULL,
    [DepartureStationId] INT NOT NULL,
    [ReturnStationId] INT NOT NULL,
    [CoveredDistanceInMeters] INT NOT NULL,
    [DurationInSeconds] INT NOT NULL,
    CONSTRAINT FK_Trips_DepartureStation FOREIGN KEY ([DepartureStationId])
  REFERENCES [citybike].[Stations] ([Id])
  ON DELETE NO ACTION
  ON UPDATE NO ACTION,
    CONSTRAINT FK_Trips_ReturnStation FOREIGN KEY ([ReturnStationId])
  REFERENCES [citybike].[Stations] ([Id])
  ON DELETE NO ACTION
  ON UPDATE NO ACTION
)
GO

CREATE VIEW [citybike].[Trips_v]
AS
    select t.Id, t.DepartureDate, t.DepartureStationId, sd.NameFin DepartureStationNameFin, sd.NameSwe DepartureStationNameSwe, sd.NameEng DepartureStationNameEng, sd.AddressFin DepartureStationAddressFin,
        sd.AddressSwe DepartureStationAddressSwe, sd.CityFin DepartureStationCityFin, sd.CitySwe DepartureStationCitySwe, sd.Operator DepartureStationOperator, sd.XCoordinate DepartureStationXCoordinate,
        sd.YCoordinate DepartureStationYCoordinate, sd.Capacity DepartureStationCapacity, t.ReturnDate, t.ReturnStationId, sr.NameFin ReturnStationNameFin, sr.NameSwe ReturnStationNameSwe,
        sr.NameEng ReturnStationNameEng, sr.AddressFin ReturnStationAddressFin, sr.AddressSwe ReturnStationAddressSwe, sr.CityFin ReturnStationCityFin, sr.CitySwe ReturnStationCitySwe,
        sr.Operator ReturnStationOperator, sr.XCoordinate ReturnStationXCoordinate, sr.YCoordinate ReturnStationYCoordinate, sr.Capacity ReturnStationCapacity, t.DurationInSeconds, t.CoveredDistanceInMeters
    from [citybike].[Trips] t
        join [citybike].[Stations] sd on sd.Id = t.DepartureStationId
        join [citybike].[Stations] sr on sr.Id = t.ReturnStationId;
GO

CREATE VIEW [citybike].[Stations_v]
AS
    select s.Id, s.NameFin, s.NameSwe, s.NameEng, s.AddressFin, s.AddressSwe, s.CityFin, s.CitySwe, s.Operator, s.Capacity, s.XCoordinate, s.YCoordinate
    from [citybike].[Stations] s;
GO

CREATE PROCEDURE [citybike].[InsertNewTrip]
    @departure_date datetime,
    @return_date datetime,
    @departure_station_id int,
    @return_station_id int,
    @distance int,
    @duration int,
    @new_id int output
as
BEGIN
    SET NOCOUNT ON;
    insert into citybike.Trips
        (DepartureDate, ReturnDate, DepartureStationId, ReturnStationId, CoveredDistanceInMeters, DurationInSeconds)
    VALUES
        (@departure_date, @return_date, @departure_station_id, @return_station_id, @distance, @duration);
    set @new_id=SCOPE_IDENTITY();
END
GO

GRANT SELECT ON [citybike].[Trips_v] TO citybikeapp;
GO

GRANT SELECT ON [citybike].[Stations_v] TO citybikeapp;
GO

GRANT EXECUTE on [citybike].[InsertNewTrip] TO citybikeapp;
GO
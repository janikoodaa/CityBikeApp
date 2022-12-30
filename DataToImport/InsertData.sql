-- Run this script, which bulk inserts data from csv-files to temporary tables,
-- validates data before inserting it into actual tables, and finally drops the temporary tables.
-- **Note: DataToImport-folder must be copied to Docker-container before running the script**

BULK INSERT citybike.TmpTrips
FROM '\var\opt\DataToImport\2021-05a.csv'
WITH (
    firstrow = 2,
    FORMAT='CSV',
    fieldquote='"',
    codepage='RAW',
    datafiletype='widechar',
    keepnulls,
    formatfile='\var\opt\DataToImport\TripsFormat.xml'
);
GO

BULK INSERT citybike.TmpTrips
FROM '\var\opt\DataToImport\2021-05b.csv'
WITH (
    firstrow = 2,
    FORMAT='CSV',
    fieldquote='"',
    codepage='RAW',
    datafiletype='widechar',
    keepnulls,
    formatfile='\var\opt\DataToImport\TripsFormat.xml'
);
GO

BULK INSERT citybike.TmpTrips
FROM '\var\opt\DataToImport\2021-06a.csv'
WITH (
    firstrow = 2,
    FORMAT='CSV',
    fieldquote='"',
    codepage='RAW',
    datafiletype='widechar',
    keepnulls,
    formatfile='\var\opt\DataToImport\TripsFormat.xml'
);
GO

BULK INSERT citybike.TmpTrips
FROM '\var\opt\DataToImport\2021-06b.csv'
WITH (
    firstrow = 2,
    FORMAT='CSV',
    fieldquote='"',
    codepage='RAW',
    datafiletype='widechar',
    keepnulls,
    formatfile='\var\opt\DataToImport\TripsFormat.xml'
);
GO

BULK INSERT citybike.TmpTrips
FROM '\var\opt\DataToImport\2021-07a.csv'
WITH (
    firstrow = 2,
    FORMAT='CSV',
    fieldquote='"',
    codepage='RAW',
    datafiletype='widechar',
    keepnulls,
    formatfile='\var\opt\DataToImport\TripsFormat.xml'
);
GO

BULK INSERT citybike.TmpTrips
FROM '\var\opt\DataToImport\2021-07b.csv'
WITH (
    firstrow = 2,
    FORMAT='CSV',
    fieldquote='"',
    codepage='RAW',
    datafiletype='widechar',
    keepnulls,
    formatfile='\var\opt\DataToImport\TripsFormat.xml'
);
GO

BULK INSERT citybike.TmpStations
FROM '\var\opt\DataToImport\Helsingin_ja_Espoon_kaupunkipy%C3%B6r%C3%A4asemat_avoin.csv'
WITH (
    firstrow = 2,
    FORMAT='CSV',
    fieldquote='"',
    codepage='RAW',
    datafiletype='widechar',
    keepnulls,
    formatfile='\var\opt\DataToImport\StationsFormat.xml'
);
GO

-- Insert validated data of stations from temporary table to actual stations-table
insert into citybike.Stations
    (id, NameFin, NameSwe, NameEng, AddressFin, AddressSwe, CityFin, CitySwe, Operator, Capacity, XCoordinate, YCoordinate)
select distinct s.ID, s.nimi, s.namn, s.name, s.osoite, s.adress,
    case when s.kaupunki = ' ' then 'Helsinki' else s.kaupunki end kaupunki,
    case when s.stad = ' ' then 'Helsingfors' else s.stad end stad,
    case when s.operaattor = ' ' then 'CityBike Finland' else s.operaattor end operaattor,
    s.kapasiteet, s.x, s.y
from citybike.TmpStations s
order by s.id asc;
GO

-- Insert validated data of trips from temporary table to actual trips-table
insert into citybike.Trips
    (Departure, [Return], DepartureStationId, ReturnStationId, CoveredDistance, Duration)
select distinct t.Departure, t.[Return], t.[Departure station id], t.[Return station id], t.[Covered distance (m)], t.[Duration (sec.)]
from citybike.TmpTrips t
where t.[Covered distance (m)] >= 10
    and t.[Duration (sec.)] >= 10
    and t.[Departure station id] in (select distinct id
    from citybike.Stations)
    and t.[Return station id] in (select distinct id
    from citybike.Stations)
ORDER by t.[Departure] asc, t.[Return] asc;
GO

DROP TABLE citybike.TmpTrips;
GO

DROP TABLE citybike.TmpStations;
GO
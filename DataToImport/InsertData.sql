/*
Run this script, which validates and inserts data from csv-files to Stations- and Trips-tables.
** Note: DataToImport-folder must be copied to Docker-container before running the script **
Data validation rules:
- No duplicate rows are inserted
- In the Stations-data, if no city (fin/swe) is defined, it's assumed to be Helsinki/Helsingfors, and added that way.
- In the Stations-data, if no operator is defined, it's assumed to be CityBike Finland, and added that way.
- In the Stations-data FID-column is not inserted, as it doesn't seem necessary.
- In the Trips-data, if departure or return date doesn't contain correct date and time, row is not inserted.
- In the Trips-data, departure- and return station ids are checked to be in Stations-data, if not, row is not inserted.
- In the Trips-data, if covered distance < 10 m and/or duration < 10 s, row is not inserted.
- In the Trips-data the departure- and return station's names are not inserted. Instead, there's foreign key reference to Stations-table by station ids.
*/

INSERT into citybike.Stations
    (Id, NameFin, NameSwe, NameEng, AddressFin, AddressSwe, CityFin, CitySwe, Operator, Capacity, XCoordinate, YCoordinate)
select distinct cast(a.[ID] as int) ID, a.[Nimi], a.[Namn], a.[Name], a.[Osoite], a.[Adress],
    case when a.[Kaupunki] = ' ' then 'Helsinki' else a.[Kaupunki] end Kaupunki,
    case when a.[Stad] = ' ' then 'Helsingfors' else a.[Stad] end Stad,
    case when a.[Operaattor] = ' ' then 'CityBike Finland' else a.[Operaattor] end Operaattor,
    cast(a.[Kapasiteet] as int) Kapasiteet, cast(a.[x] as decimal(15,13)) x, cast(a.[y] as decimal(15,13)) y
from openrowset(
    BULK '\var\opt\DataToImport\Helsingin_ja_Espoon_kaupunkipy%C3%B6r%C3%A4asemat_avoin.csv',
        formatfile='\var\opt\DataToImport\StationsFormat.xml',
        firstrow=2,
        FORMAT='CSV',
        fieldquote='"',
        codepage='RAW'
) a
order by 1;
GO

INSERT into citybike.Trips
    (DepartureDate, ReturnDate, DepartureStationId, ReturnStationId, CoveredDistanceInMeters, DurationInSeconds)
select distinct t.DepartureDate, t.ReturnDate, t.DepartureStationId, t.ReturnStationId, t.CoveredDistance CoveredDistanceInMeters, t.Duration DurationInSeconds
from (
                                                                                                                            select
            case when isdate(right(a.[Departure], 19)) = 1 then cast(right(a.[Departure], 19) as datetime2) end DepartureDate,
            case when isdate(right(a.[Return], 19)) = 1 then cast(right(a.[Return], 19) as datetime2) end ReturnDate,
            cast(a.[Departure station id] as int) DepartureStationId, cast(a.[Return station id] as int) ReturnStationId,
            cast(round(cast(a.[Covered distance (m)] as decimal(12,4)),0) as int) CoveredDistance, cast(a.[Duration (sec.)] as int) Duration
        from openrowset(
    BULK '\var\opt\DataToImport\2021-05a.csv',
        formatfile='\var\opt\DataToImport\TripsFormat.xml',
        firstrow=2,
        FORMAT='CSV',
        fieldquote='"',
        codepage='RAW'
    ) a
    UNION
        select
            case when isdate(right(a.[Departure], 19)) = 1 then cast(right(a.[Departure], 19) as datetime2) end DepartureDate,
            case when isdate(right(a.[Return], 19)) = 1 then cast(right(a.[Return], 19) as datetime2) end ReturnDate,
            cast(a.[Departure station id] as int) DepartureStationId, cast(a.[Return station id] as int) ReturnStationId,
            cast(round(cast(a.[Covered distance (m)] as decimal(12,4)),0) as int) CoveredDistance, cast(a.[Duration (sec.)] as int) Duration
        from openrowset(
    BULK '\var\opt\DataToImport\2021-05b.csv',
        formatfile='\var\opt\DataToImport\TripsFormat.xml',
        firstrow=2,
        FORMAT='CSV',
        fieldquote='"',
        codepage='RAW'
    ) a
    UNION
        select
            case when isdate(right(a.[Departure], 19)) = 1 then cast(right(a.[Departure], 19) as datetime2) end DepartureDate,
            case when isdate(right(a.[Return], 19)) = 1 then cast(right(a.[Return], 19) as datetime2) end ReturnDate,
            cast(a.[Departure station id] as int) DepartureStationId, cast(a.[Return station id] as int) ReturnStationId,
            cast(round(cast(a.[Covered distance (m)] as decimal(12,4)),0) as int) CoveredDistance, cast(a.[Duration (sec.)] as int) Duration
        from openrowset(
    BULK '\var\opt\DataToImport\2021-06a.csv',
        formatfile='\var\opt\DataToImport\TripsFormat.xml',
        firstrow=2,
        FORMAT='CSV',
        fieldquote='"',
        codepage='RAW'
    ) a
    UNION
        select
            case when isdate(right(a.[Departure], 19)) = 1 then cast(right(a.[Departure], 19) as datetime2) end DepartureDate,
            case when isdate(right(a.[Return], 19)) = 1 then cast(right(a.[Return], 19) as datetime2) end ReturnDate,
            cast(a.[Departure station id] as int) DepartureStationId, cast(a.[Return station id] as int) ReturnStationId,
            cast(round(cast(a.[Covered distance (m)] as decimal(12,4)),0) as int) CoveredDistance, cast(a.[Duration (sec.)] as int) Duration
        from openrowset(
    BULK '\var\opt\DataToImport\2021-06b.csv',
        formatfile='\var\opt\DataToImport\TripsFormat.xml',
        firstrow=2,
        FORMAT='CSV',
        fieldquote='"',
        codepage='RAW'
    ) a
    UNION
        select
            case when isdate(right(a.[Departure], 19)) = 1 then cast(right(a.[Departure], 19) as datetime2) end DepartureDate,
            case when isdate(right(a.[Return], 19)) = 1 then cast(right(a.[Return], 19) as datetime2) end ReturnDate,
            cast(a.[Departure station id] as int) DepartureStationId, cast(a.[Return station id] as int) ReturnStationId,
            cast(round(cast(a.[Covered distance (m)] as decimal(12,4)),0) as int) CoveredDistance, cast(a.[Duration (sec.)] as int) Duration
        from openrowset(
    BULK '\var\opt\DataToImport\2021-07a.csv',
        formatfile='\var\opt\DataToImport\TripsFormat.xml',
        firstrow=2,
        FORMAT='CSV',
        fieldquote='"',
        codepage='RAW'
    ) a
    UNION
        select
            case when isdate(right(a.[Departure], 19)) = 1 then cast(right(a.[Departure], 19) as datetime2) end DepartureDate,
            case when isdate(right(a.[Return], 19)) = 1 then cast(right(a.[Return], 19) as datetime2) end ReturnDate,
            cast(a.[Departure station id] as int) DepartureStationId, cast(a.[Return station id] as int) ReturnStationId,
            cast(round(cast(a.[Covered distance (m)] as decimal(12,4)),0) as int) CoveredDistance, cast(a.[Duration (sec.)] as int) Duration
        from openrowset(
    BULK '\var\opt\DataToImport\2021-07b.csv',
        formatfile='\var\opt\DataToImport\TripsFormat.xml',
        firstrow=2,
        FORMAT='CSV',
        fieldquote='"',
        codepage='RAW'
    ) a
) t
where t.DepartureDate is not null
    and t.ReturnDate is not null
    and t.CoveredDistance >= 10
    and t.Duration >= 10
    and t.DepartureStationId in (select distinct s.Id
    from citybike.Stations s)
    and t.ReturnStationId in (select distinct s.Id
    from citybike.Stations s)
order by t.DepartureDate asc, t.ReturnDate asc;
GO
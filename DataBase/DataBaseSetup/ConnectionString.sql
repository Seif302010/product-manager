USE Market

DECLARE @Username NVARCHAR(50) = 'sa'; -- Replace with your username
DECLARE @Password NVARCHAR(50) = ''; -- Replace with your password
DECLARE @Port NVARCHAR(5) = '1433'; -- Replace with your port if different from default

SELECT
    'mssql://' + @Username + ':' + @Password + '@' + CAST(SERVERPROPERTY('MachineName') AS NVARCHAR) + ':' + @Port + '/' + DB_NAME() AS ConnectionString;

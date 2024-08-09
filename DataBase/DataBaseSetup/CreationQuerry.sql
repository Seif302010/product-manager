DECLARE @DataBaseName NVARCHAR(50) = 'Market'; -- Replace with your database name
DECLARE @SQL NVARCHAR(MAX);
DECLARE @FileName NVARCHAR(100) = 'C:\' + @DataBaseName; -- Construct the file name path

SET @SQL = 'CREATE DATABASE [' + @DataBaseName + ']
ON 
(NAME = [' + @DataBaseName + '_data], FILENAME = ''' + @FileName + '.mdf'', SIZE = 8MB, MAXSIZE = UNLIMITED, FILEGROWTH = 10%)
LOG ON 
(NAME = [' + @DataBaseName + '_log], FILENAME = ''' + @FileName + '.ldf'', SIZE = 8MB, MAXSIZE = UNLIMITED, FILEGROWTH = 5MB);';

EXEC sp_executesql @SQL;
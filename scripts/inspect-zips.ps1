Add-Type -AssemblyName System.IO.Compression.FileSystem
$z1 = [System.IO.Compression.ZipFile]::OpenRead('C:\Users\ander\OneDrive\Desktop\lago drone\IMG PR EDIT\drive-download-20261106T200258Z-1-001.zip')
$z1.Entries | ForEach-Object { Write-Host "ZIP1:" $_.FullName }
$z1.Dispose()

$z2 = [System.IO.Compression.ZipFile]::OpenRead('C:\Users\ander\OneDrive\Desktop\lago drone\IMG PR EDIT\drive-download-20261106T201100Z-1-001.zip')
$z2.Entries | ForEach-Object { Write-Host "ZIP2:" $_.FullName }
$z2.Dispose()

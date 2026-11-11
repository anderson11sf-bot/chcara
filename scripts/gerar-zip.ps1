$destDir = "C:\Users\ander\OneDrive\Desktop\ZIPS_HOSTINGER"
if (-not (Test-Path $destDir)) { New-Item -ItemType Directory -Path $destDir -Force | Out-Null }

$destZip1 = Join-Path $destDir "Paraiso_das_Aguas_Hostinger_Completo.zip"
$destZip2 = "C:\Users\ander\OneDrive\Desktop\lagoa site.zip"

if (Test-Path $destZip1) { Remove-Item -Force $destZip1 }
if (Test-Path $destZip2) { Remove-Item -Force $destZip2 }

Write-Host "Criando ZIP 1 em: $destZip1..."
Compress-Archive -Path "C:\Users\ander\OneDrive\Desktop\SITES\chcara\dist\*" -DestinationPath $destZip1 -CompressionLevel Optimal

Write-Host "Copiando ZIP para Desktop: $destZip2..."
Copy-Item -Path $destZip1 -Destination $destZip2 -Force

Get-Item $destZip1, $destZip2 | Select-Object FullName, Length, LastWriteTime | Format-Table -AutoSize
Write-Host "ZIPS gerados com sucesso!"

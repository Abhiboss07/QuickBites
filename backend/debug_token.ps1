$ErrorActionPreference = "Stop"
$baseUrl = "http://localhost:8080/api"
$email = "debug_$(Get-Random)@example.com"
$regBody = '{"fullName": "Debug User", "email": "' + $email + '", "password": "password123", "role": "ADMIN"}'
$response = Invoke-RestMethod -Method Post -Uri "$baseUrl/auth/register" -ContentType "application/json" -Body $regBody
Write-Host $response.token

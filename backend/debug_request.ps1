$ErrorActionPreference = "Continue" # Don't stop on error, show it
$baseUrl = "http://localhost:8080/api"
$email = "debug_req_$(Get-Random)@example.com"
Write-Host "Registering..."
$regResponse = Invoke-RestMethod -Method Post -Uri "$baseUrl/auth/register" -ContentType "application/json" -Body "{`"fullName`": `"Debug`", `"email`": `"$email`", `"password`": `"password123`", `"role`": `"ADMIN`"}"
$token = $regResponse.token
Write-Host "Token: $token"

$headers = @{ "Authorization" = "Bearer $token" }

Write-Host "POST Categories..."
try {
    $response = Invoke-WebRequest -Method Post -Uri "$baseUrl/categories" -ContentType "application/json" -Body "{`"name`": `"DebugCat`", `"imageUrl`": `"http://url`"}" -Headers $headers
    Write-Host "Status: $($response.StatusCode)"
    Write-Host "Content: $($response.Content)"
}
catch {
    Write-Host "FAILED"
    Write-Host "Status: $($_.Exception.Response.StatusCode)"
    $reader = New-Object System.IO.StreamReader $_.Exception.Response.GetResponseStream()
    Write-Host "Body: $($reader.ReadToEnd())"
}

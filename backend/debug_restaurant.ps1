$ErrorActionPreference = "Stop"
$baseUrl = "http://localhost:9090/api"
$email = "debug_rest_$(Get-Random)@example.com"

function Log-Step { param($Msg) Write-Host "`n=== $Msg ===" -ForegroundColor Cyan }

try {
    # Register
    $regRes = Invoke-RestMethod -Method Post -Uri "$baseUrl/auth/register" -ContentType "application/json" -Body "{`"fullName`": `"DebugUser`", `"email`": `"$email`", `"password`": `"password123`", `"role`": `"ADMIN`"}"
    $headers = @{ "Authorization" = "Bearer $($regRes.token)" }

    # Create & Fetch
    $catId = (Invoke-RestMethod -Method Post -Uri "$baseUrl/categories" -ContentType "application/json" -Body "{`"name`": `"Cat_$(Get-Random)`", `"imageUrl`": `"url`"}" -Headers $headers).id
    $restId = (Invoke-RestMethod -Method Post -Uri "$baseUrl/restaurants" -ContentType "application/json" -Body "{`"name`": `"Rest`", `"cuisineType`": `"T`", `"address`": `"A`", `"latitude`": 1, `"longitude`": 1, `"categoryId`": $catId}" -Headers $headers).id
    Invoke-RestMethod -Method Post -Uri "$baseUrl/restaurants/$restId/menu" -ContentType "application/json" -Body "{`"name`": `"Item`", `"price`": 10, `"isVeg`": true, `"imageUrl`": `"url`"}" -Headers $headers | Out-Null
    
    Log-Step "Fetching Restaurant $restId"
    $rest = Invoke-RestMethod -Method Get -Uri "$baseUrl/restaurants/$restId" -Headers $headers
    Write-Host ($rest | ConvertTo-Json -Depth 5)

    $itemId = $rest.menuItems[0].id
    Write-Host "Item ID: $itemId"

}
catch {
    Write-Host "FAILED"
    Write-Host $_.Exception.Message
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader $_.Exception.Response.GetResponseStream()
        Write-HostBody: $($reader.ReadToEnd())
    }
}

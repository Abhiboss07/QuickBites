$ErrorActionPreference = "Stop"

function Test-Endpoint {
    param($Method, $Uri, $Body, $Headers)
    try {
        if ($Body) {
            $response = Invoke-RestMethod -Method $Method -Uri $Uri -ContentType "application/json" -Body $Body -Headers $Headers
        } else {
            $response = Invoke-RestMethod -Method $Method -Uri $Uri -Headers $Headers
        }
        Write-Host "✅ Success: $Uri" -ForegroundColor Green
        return $response
    } catch {
        Write-Host "❌ Failed: $Uri" -ForegroundColor Red
        Write-Host $_.Exception.Message
        return $null
    }
}

$baseUrl = "http://localhost:8080/api"

# 1. Register
$email = "testphase1_$(Get-Random)@example.com"
Write-Host "Registering $email..."
$regBody = '{"fullName": "Phase1 User", "email": "' + $email + '", "password": "password123", "role": "USER"}'
$regResponse = Test-Endpoint -Method Post -Uri "$baseUrl/auth/register" -Body $regBody

if ($regResponse) {
    $token = $regResponse.token
    $refreshToken = $regResponse.refreshToken
    $headers = @{ "Authorization" = "Bearer $token" }

    # 2. Get Profile
    Write-Host "Getting Profile..."
    Test-Endpoint -Method Get -Uri "$baseUrl/users/profile" -Headers $headers

    # 3. Add Address
    Write-Host "Adding Address..."
    $addrBody = '{"street": "123 Main St", "city": "Metro", "state": "NY", "zipCode": "10001", "country": "USA"}'
    Test-Endpoint -Method Post -Uri "$baseUrl/addresses" -Body $addrBody -Headers $headers

    # 4. Refresh Token
    Write-Host "Refreshing Token..."
    $refreshBody = '{"token": "' + $refreshToken + '"}'
    Test-Endpoint -Method Post -Uri "$baseUrl/auth/refresh-token" -Body $refreshBody
}

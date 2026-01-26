$ErrorActionPreference = "Stop"

function Test-Endpoint {
    param($Method, $Uri, $Body, $Headers)
    try {
        if ($Body) {
            $response = Invoke-RestMethod -Method $Method -Uri $Uri -ContentType "application/json" -Body $Body -Headers $Headers
        }
        else {
            $response = Invoke-RestMethod -Method $Method -Uri $Uri -Headers $Headers
        }
        Write-Host "✅ Success: $Uri" -ForegroundColor Green
        return $response
    }
    catch {
        Write-Host "❌ Failed: $Uri" -ForegroundColor Red
        Write-Host $_.Exception.Message
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader $_.Exception.Response.GetResponseStream()
            $errBody = $reader.ReadToEnd()
            Write-Host "Response: $errBody"
        }
        return $null
    }
}

$baseUrl = "http://localhost:8080/api"

# Login to get Token (Assuming previous user exists or create new)
$email = "phase3_admin_$(Get-Random)@example.com"
Write-Host "Registering Admin User $email..."
$regBody = '{"fullName": "Phase3 Admin", "email": "' + $email + '", "password": "password123", "role": "ADMIN"}'
$regResponse = Test-Endpoint -Method Post -Uri "$baseUrl/auth/register" -Body $regBody

if ($regResponse) {
    $token = $regResponse.token
    $headers = @{ "Authorization" = "Bearer $token" }

    # 1. Create Categories
    Write-Host "Creating Categories..."
    $cat1 = Test-Endpoint -Method Post -Uri "$baseUrl/categories" -Body '{"name": "Pizza", "imageUrl": "https://img.icons8.com/color/96/pizza.png"}' -Headers $headers
    $cat2 = Test-Endpoint -Method Post -Uri "$baseUrl/categories" -Body '{"name": "Burger", "imageUrl": "https://img.icons8.com/color/96/hamburger.png"}' -Headers $headers

    # 2. Create Restaurant
    Write-Host "Creating Restaurant..."
    $restBody = '{"name": "Luigi Pizza", "description": "Best pizza in town", "cuisineType": "Italian", "address": "123 Olive St", "rating": 4.8, "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591"}'
    $rest = Test-Endpoint -Method Post -Uri "$baseUrl/restaurants" -Body $restBody -Headers $headers

    if ($rest) {
        # 3. Add Menu Items
        Write-Host "Adding Menu Items..."
        $menu1 = '{"name": "Margherita", "description": "Cheese & Tomato", "price": 12.99, "isVeg": true, "imageUrl": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002"}'
        Test-Endpoint -Method Post -Uri "$baseUrl/restaurants/$($rest.id)/menu" -Body $menu1 -Headers $headers
        
        $menu2 = '{"name": "Pepperoni", "description": "Spicy delight", "price": 14.99, "isVeg": false, "imageUrl": "https://images.unsplash.com/photo-1628840042765-356cda07504e"}'
        Test-Endpoint -Method Post -Uri "$baseUrl/restaurants/$($rest.id)/menu" -Body $menu2 -Headers $headers
    }
    
    # 4. Verify Fetch
    Write-Host "Verifying Home Data..."
    Test-Endpoint -Method Get -Uri "$baseUrl/categories" -Headers $headers
    Test-Endpoint -Method Get -Uri "$baseUrl/restaurants" -Headers $headers
}

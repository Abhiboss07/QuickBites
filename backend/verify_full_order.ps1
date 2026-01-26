$ErrorActionPreference = "Stop"
$baseUrl = "http://localhost:8080/api"
$email = "order_flow_$(Get-Random)@example.com"

function Log-Step { param($Msg) Write-Host "`n=== $Msg ===" -ForegroundColor Cyan }

try {
    # 1. Register
    Log-Step "Registering User ($email)"
    $regRes = Invoke-RestMethod -Method Post -Uri "$baseUrl/auth/register" -ContentType "application/json" -Body "{`"fullName`": `"OrderUser`", `"email`": `"$email`", `"password`": `"password123`", `"role`": `"ADMIN`"}"
    $token = $regRes.token
    $headers = @{ "Authorization" = "Bearer $token" }
    Write-Host "Token obtained."

    # 2. Category
    Log-Step "Creating Category"
    $catRes = Invoke-RestMethod -Method Post -Uri "$baseUrl/categories" -ContentType "application/json" -Body "{`"name`": `"OrderCat_$(Get-Random)`", `"imageUrl`": `"http://img`"}" -Headers $headers
    $catId = $catRes.id
    Write-Host "Category ID: $catId"

    # 3. Restaurant
    Log-Step "Creating Restaurant"
    $restBody = "{`"name`": `"OrderRest_$(Get-Random)`", `"cuisineType`": `"Test`", `"address`": `"123 St`", `"latitude`": 10.0, `"longitude`": 20.0, `"categoryId`": $catId}"
    $restRes = Invoke-RestMethod -Method Post -Uri "$baseUrl/restaurants" -ContentType "application/json" -Body $restBody -Headers $headers
    $restId = $restRes.id
    Write-Host "Restaurant ID: $restId"

    # 4. Menu Item
    Log-Step "Adding Menu Item"
    $menuBody = "{`"name`": `"Burger`", `"description`": `"Tasty`", `"price`": 15.0, `"isVeg`": false, `"imageUrl`": `"http://img`"}"
    Invoke-RestMethod -Method Post -Uri "$baseUrl/restaurants/$restId/menu" -ContentType "application/json" -Body $menuBody -Headers $headers | Out-Null
    Write-Host "Menu Item Added."

    # 5. Get Item ID (Need to fetch restaurant details)
    $restDetails = Invoke-RestMethod -Method Get -Uri "$baseUrl/restaurants/$restId" -Headers $headers
    Write-Host "Restaurant Items: $($restDetails | ConvertTo-Json -Depth 5)"
    $itemId = $restDetails.menuItems[0].id
    Write-Host "Menu Item ID: $itemId"

    # 6. Add to Cart
    Log-Step "Adding to Cart"
    $cartBody = "{`"menuItemId`": $itemId, `"quantity`": 2}"
    Invoke-RestMethod -Method Post -Uri "$baseUrl/cart/add" -ContentType "application/json" -Body $cartBody -Headers $headers | Out-Null
    Write-Host "Added to Cart."

    # 7. Add Address
    Log-Step "Adding Address"
    $addrBody = "{`"label`": `"Home`", `"addressLine`": `"Orders St`", `"latitude`": 10.0, `"longitude`": 20.0}"
    $addrRes = Invoke-RestMethod -Method Post -Uri "$baseUrl/addresses" -ContentType "application/json" -Body $addrBody -Headers $headers
    $addrId = $addrRes.id
    Write-Host "Address ID: $addrId"

    # 8. Place Order
    Log-Step "Placing Order"
    $orderBody = "{`"addressId`": $addrId}"
    $orderRes = Invoke-RestMethod -Method Post -Uri "$baseUrl/orders" -ContentType "application/json" -Body $orderBody -Headers $headers
    Write-Host "Order Placed! Order ID: $($orderRes.id)"
    Write-Host "Status: $($orderRes.status)"
    Write-Host "Total: $($orderRes.totalPrice)"

    if ($orderRes.status -eq "PAID" -or $orderRes.status -eq "PENDING") {
        Write-Host "✅ VERIFICATION SUCCESS" -ForegroundColor Green
    }
    else {
        Write-Error "Order status unexpected: $($orderRes.status)"
    }

}
catch {
    Write-Host "❌ FATAL ERROR" -ForegroundColor Red
    Write-Host $_.Exception.Message
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader $_.Exception.Response.GetResponseStream()
        Write-Host "Body: $($reader.ReadToEnd())"
    }
    exit 1
}

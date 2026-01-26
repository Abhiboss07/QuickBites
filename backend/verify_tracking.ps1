$ErrorActionPreference = "Stop"
$baseUrl = "http://localhost:9090/api"
$email = "tracking_$(Get-Random)@example.com"

function Log-Step { param($Msg) Write-Host "`n=== $Msg ===" -ForegroundColor Cyan }

try {
    # 1. Register & Setup (Short-circuit for speed, assuming verifying full order script passes)
    Log-Step "Setup User & Order"
    $regRes = Invoke-RestMethod -Method Post -Uri "$baseUrl/auth/register" -ContentType "application/json" -Body "{`"fullName`": `"TrackUser`", `"email`": `"$email`", `"password`": `"password123`", `"role`": `"ADMIN`"}"
    $headers = @{ "Authorization" = "Bearer $($regRes.token)" }

    # create cat, rest, item, address
    $catId = (Invoke-RestMethod -Method Post -Uri "$baseUrl/categories" -ContentType "application/json" -Body "{`"name`": `"TrackCat_$(Get-Random)`", `"imageUrl`": `"url`"}" -Headers $headers).id
    Log-Step "Category Created: $catId"
    $restId = (Invoke-RestMethod -Method Post -Uri "$baseUrl/restaurants" -ContentType "application/json" -Body "{`"name`": `"TrackRest`", `"cuisineType`": `"T`", `"address`": `"A`", `"latitude`": 1, `"longitude`": 1, `"categoryId`": $catId}" -Headers $headers).id
    Log-Step "Restaurant Created: $restId"
    Invoke-RestMethod -Method Post -Uri "$baseUrl/restaurants/$restId/menu" -ContentType "application/json" -Body "{`"name`": `"Item`", `"price`": 10, `"isVeg`": true, `"imageUrl`": `"url`"}" -Headers $headers | Out-Null
    Log-Step "Menu Item Added"
    $itemId = (Invoke-RestMethod -Method Get -Uri "$baseUrl/restaurants/$restId" -Headers $headers).menuItems[0].id
    Log-Step "Item ID: $itemId"
    Log-Step "Adding to Cart (Item $itemId)"
    try {
        $cartRes = Invoke-RestMethod -Method Post -Uri "$baseUrl/cart/add" -ContentType "application/json" -Body "{`"menuItemId`": $itemId, `"quantity`": 1}" -Headers $headers
        Log-Step "Added to Cart"
    }
    catch {
        Write-Host "CART ADD FAILED: $_"
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader $_.Exception.Response.GetResponseStream()
            Write-Host "Cart Error Body: $($reader.ReadToEnd())"
        }
        throw $_
    }
    $addrId = (Invoke-RestMethod -Method Post -Uri "$baseUrl/addresses" -ContentType "application/json" -Body "{`"label`": `"H`", `"addressLine`": `"A`", `"latitude`": 1, `"longitude`": 1}" -Headers $headers).id
    Log-Step "Address Created: $addrId"
    $orderId = (Invoke-RestMethod -Method Post -Uri "$baseUrl/orders" -ContentType "application/json" -Body "{`"addressId`": $addrId}" -Headers $headers).id
    
    Log-Step "Order Placed: $orderId"

    # 2. Trigger Simulation
    Log-Step "Triggering Simulation"
    Invoke-RestMethod -Method Post -Uri "$baseUrl/orders/$orderId/track" -Headers $headers | Out-Null
    
    # 3. Monitor Status
    Log-Step "Monitoring Status (30s)"
    
    for ($i = 0; $i -lt 7; $i++) {
        $status = (Invoke-RestMethod -Method Get -Uri "$baseUrl/orders" -Headers $headers)[0].status
        Write-Host "[$((Get-Date).ToString('HH:mm:ss'))] Status: $status"
        if ($status -eq "DELIVERED") {
            Write-Host "✅ Verified: Order Delivered!" -ForegroundColor Green
            exit 0
        }
        Start-Sleep -Seconds 5
    }

    Write-Error "Timeout waiting for DELIVERED status"

}
catch {
    Write-Host "❌ FAILED" -ForegroundColor Red
    Write-Host $_.Exception.Message
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader $_.Exception.Response.GetResponseStream()
        Write-Host "Response Body: $($reader.ReadToEnd())"
    }
    exit 1
}

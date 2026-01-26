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
        if ($_.Exception.Response) {
            Write-Host "Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Yellow
            $reader = New-Object System.IO.StreamReader $_.Exception.Response.GetResponseStream()
            $errBody = $reader.ReadToEnd()
            Write-Host "Response: $errBody"
        }
        else {
            Write-Host $_.Exception.Message
        }
        return $null
    }
}

$baseUrl = "http://localhost:8080/api"

# Login
$email = "phase5_user_$(Get-Random)@example.com"
Write-Host "Registering User $email..."
$regBody = '{"fullName": "Phase5 User", "email": "' + $email + '", "password": "password123", "role": "ADMIN"}'
$regResponse = Test-Endpoint -Method Post -Uri "$baseUrl/auth/register" -Body $regBody

if ($regResponse) {
    $token = $regResponse.token
    $headers = @{ "Authorization" = "Bearer $token" }

    # 0. Pre-check
    Write-Host "Checking Categories Access..."
    $check = Test-Endpoint -Method Get -Uri "$baseUrl/categories" -Headers $headers
    
    # 0. Seed Data (Category + Restaurant)
    Write-Host "Seeding Data..."
    $catBody = '{"name": "Orders Test Cat", "imageUrl": "http://test.com/img"}'
    $cat = Test-Endpoint -Method Post -Uri "$baseUrl/categories" -Body $catBody -Headers $headers
    if (-not $cat) { Write-Error "Category creation failed"; return }
    
    $restBody = '{"name": "Order Test Rest", "cuisineType": "Test", "address": "123 Food St", "latitude": 10.0, "longitude": 20.0, "categoryId": ' + $cat.id + '}'
    $rest = Test-Endpoint -Method Post -Uri "$baseUrl/restaurants" -Body $restBody -Headers $headers
    if (-not $rest) { Write-Error "Restaurant creation failed"; return }
    
    # 0.1 Add Menu Item
    $menuBody = '{"name": "Test Burger", "description": "Yum", "price": 10.0, "isVeg": false, "imageUrl": "http://img"}'
    Test-Endpoint -Method Post -Uri "$baseUrl/restaurants/$($rest.id)/menu" -Body $menuBody -Headers $headers | Out-Null

    # 1. Fetch Restaurants
    $rests = Test-Endpoint -Method Get -Uri "$baseUrl/restaurants" -Headers $headers
    if ($rests.Count -gt 0) {
        $rest = $rests[0] # Should be our new one
        # Need to re-fetch full details to get menu items if list doesn't include them deep
        $fullRest = Test-Endpoint -Method Get -Uri "$baseUrl/restaurants/$($rest.id)" -Headers $headers
        $item = $fullRest.menuItems[0]
        
        # 2. Add to Cart
        Write-Host "Adding to Cart..."
        $addBody = '{"menuItemId": ' + $item.id + ', "quantity": 1}'
        Test-Endpoint -Method Post -Uri "$baseUrl/cart/add" -Body $addBody -Headers $headers | Out-Null
        
        # 3. Add Address (Mock ID or real? Service allows null address for now or we must create one)
        # Let's create one first
        $addrBody = '{"label": "Home", "addressLine": "123 Test St", "latitude": 10.0, "longitude": 20.0}'
        $addr = Test-Endpoint -Method Post -Uri "$baseUrl/addresses" -Body $addrBody -Headers $headers
        Write-Host "Address Created: $($addr.id)"

        # 4. Place Order
        Write-Host "Placing Order..."
        $orderBody = '{"addressId": ' + $addr.id + '}'
        $order = Test-Endpoint -Method Post -Uri "$baseUrl/orders" -Body $orderBody -Headers $headers
        
        if ($order) {
            Write-Host "Order Placed. ID: $($order.id) Status: $($order.status) Total: $($order.totalPrice)"
            
            if ($order.status -eq "PAID" -or $order.status -eq "PENDING") {
                Write-Host "✅ Order Creation Verified" -ForegroundColor Green
            }
            else {
                Write-Host "❌ Order Status Unexpected" -ForegroundColor Red
            }

            # 5. Check History
            Write-Host "Checking Order History..."
            $history = Test-Endpoint -Method Get -Uri "$baseUrl/orders" -Headers $headers
            if ($history.Count -ge 1) {
                Write-Host "✅ Order History Verified" -ForegroundColor Green
            }
        }
    }
}

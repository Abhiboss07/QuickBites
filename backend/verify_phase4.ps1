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
$email = "phase3_admin_$(Get-Random)@example.com"
Write-Host "Registering User $email..."
$regBody = '{"fullName": "Phase4 User", "email": "' + $email + '", "password": "password123", "role": "USER"}'
$regResponse = Test-Endpoint -Method Post -Uri "$baseUrl/auth/register" -Body $regBody

if ($regResponse) {
    $token = $regResponse.token
    $headers = @{ "Authorization" = "Bearer $token" }

    # 1. Fetch Restaurants (Ensure we have data)
    $rests = Test-Endpoint -Method Get -Uri "$baseUrl/restaurants" -Headers $headers
    if ($rests.Count -gt 0) {
        $rest = $rests[0]
        Write-Host "Using Restaurant: $($rest.name)"
        
        if ($rest.menuItems.Count -gt 0) {
            $item = $rest.menuItems[0]
            
            # 2. Add to Cart
            Write-Host "Adding Item to Cart..."
            $addBody = '{"menuItemId": ' + $item.id + ', "quantity": 2}'
            $cart = Test-Endpoint -Method Post -Uri "$baseUrl/cart/add" -Body $addBody -Headers $headers
            Write-Host "Cart Total: $($cart.totalPrice)"
            
            if ($cart.items.Count -eq 1 -and $cart.totalPrice -gt 0) {
                Write-Host "✅ Cart Add Verified" -ForegroundColor Green
            }
            else {
                Write-Host "❌ Cart Add Failed" -ForegroundColor Red
            }
            
            # 3. Fetch Cart
            Write-Host "Fetching Cart..."
            $fetchedCart = Test-Endpoint -Method Get -Uri "$baseUrl/cart" -Headers $headers
            
            # 4. Remove Item
            Write-Host "Removing Item $($item.id)..."
            # Since remove API takes itemId (which might be MenuItemId or CartItemId? Controller said itemId is MenuItemId? No controller calls removeIf equal to itemId. Wait, let's check controller. Controller param is "itemId", logic removes if item.getMenuItem().getId().equals(itemId). So it is MenuItem ID. Good.)
            Test-Endpoint -Method Delete -Uri "$baseUrl/cart/items/$($item.id)" -Headers $headers
            
            $emptyCart = Test-Endpoint -Method Get -Uri "$baseUrl/cart" -Headers $headers
            if ($emptyCart.items.Count -eq 0) {
                Write-Host "✅ Cart Remove Verified" -ForegroundColor Green
            }
            else {
                Write-Host "❌ Cart Remove Failed" -ForegroundColor Red
            }
        }
        else {
            Write-Host "⚠️ No Menu Items found to test cart" -ForegroundColor Yellow
        }
        
        # 5. Wishlist
        Write-Host "Toggling Wishlist..."
        $wish1 = Test-Endpoint -Method Post -Uri "$baseUrl/wishlist/toggle/$($rest.id)" -Headers $headers
        Write-Host "Wishlist Status: $($wish1.status)"
        
        $wishList = Test-Endpoint -Method Get -Uri "$baseUrl/wishlist" -Headers $headers
        if ($wishList.Count -eq 1) {
            Write-Host "✅ Wishlist Add Verified" -ForegroundColor Green
        }
        
        $wish2 = Test-Endpoint -Method Post -Uri "$baseUrl/wishlist/toggle/$($rest.id)" -Headers $headers
        Write-Host "Wishlist Status: $($wish2.status)"
    }
}

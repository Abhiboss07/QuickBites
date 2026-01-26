package com.quickbite.controller;

import com.quickbite.model.Address;
import com.quickbite.model.User;
import com.quickbite.repository.AddressRepository;
import com.quickbite.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
public class AddressController {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public AddressController(AddressRepository addressRepository, UserRepository userRepository) {
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<Address>> getUserAddresses(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return ResponseEntity.ok(addressRepository.findAllByUserId(user.getId()));
    }

    @PostMapping
    public ResponseEntity<Address> addAddress(@AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Address address) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        address.setUser(user);
        return ResponseEntity.ok(addressRepository.save(address));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAddress(@AuthenticationPrincipal UserDetails userDetails, @PathVariable Long id) {
        Address address = addressRepository.findById(id).orElseThrow();
        if (!address.getUser().getEmail().equals(userDetails.getUsername())) {
            return ResponseEntity.status(403).build();
        }
        addressRepository.delete(address);
        return ResponseEntity.ok().build();
    }
}

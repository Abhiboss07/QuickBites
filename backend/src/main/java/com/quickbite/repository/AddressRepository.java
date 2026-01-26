package com.quickbite.repository;

import com.quickbite.model.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AddressRepository extends JpaRepository<Address, Long> {
    List<Address> findAllByUserId(Long userId);
}

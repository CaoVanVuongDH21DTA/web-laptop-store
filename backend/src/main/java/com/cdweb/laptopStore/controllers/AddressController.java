package com.cdweb.laptopStore.controllers;

import com.cdweb.laptopStore.dto.AddressRequest;
import com.cdweb.laptopStore.entities.Address;
import com.cdweb.laptopStore.services.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.UUID;

@RestController
@RequestMapping("/api/address")
@CrossOrigin
public class AddressController {

    @Autowired
    private AddressService addressService;

    @PostMapping
    public ResponseEntity<Address> createAddress(@RequestBody AddressRequest addressRequest, Principal principal){
        Address address = addressService.createAddress(addressRequest,principal);
        return new ResponseEntity<>(address, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAddress(@PathVariable UUID id){
        addressService.deleteAddress(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Address> updateAddress(@PathVariable UUID id,
                                                @RequestBody AddressRequest addressRequest,
                                                Principal principal) {
        Address updatedAddress = addressService.updateAddress(id, addressRequest, principal);
        return new ResponseEntity<>(updatedAddress, HttpStatus.OK);
    }

}

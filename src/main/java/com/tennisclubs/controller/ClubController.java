package com.tennisclubs.controller;

import com.tennisclubs.dto.*;
import com.tennisclubs.entity.pkeys.OwnsPK;
import com.tennisclubs.service.ClubService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/clubs")
public class ClubController {
    private final ClubService clubService;

    public ClubController(ClubService clubService) {
        this.clubService = clubService;
    }

    @GetMapping
    public List<GetClubDTO> getAllClubs() {
        return clubService.getAllClubs();
    }

    @PostMapping
    public ResponseEntity<Object> addNewClub(@ModelAttribute AddClubDTO dto) {
        return clubService.addNewClub(dto);
    }

    @GetMapping("/{clubId}")
    public GetClubDTO seeClubInfo(@PathVariable("clubId") Long clubId) {
        return clubService.seeClubInfo(clubId);
    }

    @PutMapping("/{clubId}")
    public ResponseEntity<Object> changeClubInfo(@PathVariable("clubId") Long clubId, @ModelAttribute AddClubDTO dto) {
        return clubService.changeClubInfo(clubId, dto);
    }

    @DeleteMapping("/{clubId}")
    public ResponseEntity<Object> deleteClub(@PathVariable("clubId") Long clubId) {
        clubService.deleteClub(clubId);
        return ResponseEntity.ok().body("Club deleted successfully!");
    }

    // club transactions
    @GetMapping("/{clubId}/transactions")
    public List<GetTransactionDTO> getClubTransactions(@PathVariable("clubId") Long clubId) {
        return clubService.getClubTransactions(clubId); }

    @GetMapping("/person")
    public List<PersonDTO> getPerson() {
        return clubService.getPerson(); }

    @PostMapping("/{clubId}/transactions")
    public ResponseEntity<Object> addNewTransaction(@ModelAttribute AddTransactionDTO dto, @PathVariable("clubId") Long clubId) {
        return clubService.addNewTransaction(dto, clubId);
    }

    @GetMapping("/{clubId}/transactions/{transactionId}")
    public GetTransactionDTO seeTransactionInfo(@PathVariable("transactionId") Long transactionId, @PathVariable("clubId") Long clubId) {
        return clubService.seeTransactionInfo(transactionId, clubId);
    }

    @PutMapping("/{clubId}/transactions/{transactionId}")
    public ResponseEntity<Object> changeTransactionInfo(@PathVariable("transactionId") Long transactionId, @ModelAttribute AddTransactionDTO dto, @PathVariable("clubId") Long clubId) {
        return clubService.changeTransactionInfo(transactionId, dto, clubId);
    }

    @DeleteMapping("/{clubId}/transactions/{transactionId}")
    public ResponseEntity<Object> deleteTransaction(@PathVariable("transactionId") Long transactionId, @PathVariable("clubId") Long clubId) {
        clubService.deleteTransaction(transactionId, clubId);
        return ResponseEntity.ok().body("Transaction deleted successfully!");
    }

    // club equipment
    @GetMapping("/{clubId}/equipment")
    public List<GetEquipmentDTO> getClubEquipment(@PathVariable("clubId") Long clubId) {
        return clubService.getClubEquipment(clubId); }

    @PostMapping("/{clubId}/equipment")
    public ResponseEntity<Object> addNewEquipment(@ModelAttribute AddEquipmentDTO dto, @PathVariable("clubId") Long clubId) {
        return clubService.addNewEquipment(dto, clubId);
    }

    @GetMapping("/{clubId}/equipment/{equipmentId}")
    public GetEquipmentDTO seeEquipmentInfo(@PathVariable("equipmentId") Long equipmentId, @PathVariable("clubId") Long clubId) {
        return clubService.seeEquipmentInfo(equipmentId, clubId);
    }

    @PutMapping("/{clubId}/equipment/{equipmentId}")
    public ResponseEntity<Object> changeEquipmentInfo(@PathVariable("equipmentId") Long equipmentId, @ModelAttribute AddEquipmentDTO dto, @PathVariable("clubId") Long clubId) {
        return clubService.changeEquipmentInfo(equipmentId, dto, clubId);
    }

    @DeleteMapping("/{clubId}/equipment/{equipmentId}")
    public ResponseEntity<Object> deleteEquipment(@PathVariable("equipmentId") Long equipmentId, @PathVariable("clubId") Long clubId) {
        clubService.deleteEquipment(equipmentId, clubId);
        return ResponseEntity.ok().body("Equipment deleted successfully!");
    }

    // club meetings
    @GetMapping("/{clubId}/meetings")
    public List<GetMeetingDTO> getClubMeetings(@PathVariable("clubId") Long clubId) {
        return clubService.getClubMeetings(clubId); }

    @PostMapping("/{clubId}/meetings")
    public ResponseEntity<Object> addNewMeeting(@ModelAttribute AddMeetingDTO dto, @PathVariable("clubId") Long clubId) {
        return clubService.addNewMeeting(dto, clubId);
    }

    @GetMapping("/{clubId}/meetings/{meetingId}")
    public GetMeetingDTO seeMeetingInfo(@PathVariable("meetingId") Long meetingId, @PathVariable("clubId") Long clubId) {
        return clubService.seeMeetingInfo(meetingId, clubId);
    }

    @PutMapping("/{clubId}/meetings/{meetingId}")
    public ResponseEntity<Object> changeMeetingInfo(@PathVariable("meetingId") Long meetingId, @ModelAttribute AddMeetingDTO dto, @PathVariable("clubId") Long clubId) {
        return clubService.changeMeetingInfo(meetingId, dto, clubId);
    }

    @DeleteMapping("/{clubId}/meetings/{meetingId}")
    public ResponseEntity<Object> deleteMeeting(@PathVariable("meetingId") Long meetingId, @PathVariable("clubId") Long clubId) {
        clubService.deleteMeeting(meetingId, clubId);
        return ResponseEntity.ok().body("Meeting deleted successfully!");
    }

    // club courts
    @GetMapping("/{clubId}/courts")
    public List<GetCourtDTO> getClubCourts(@PathVariable("clubId") Long clubId) {
        return clubService.getClubCourts(clubId); }

    @PostMapping("/{clubId}/courts")
    public ResponseEntity<Object> addNewCourt(@ModelAttribute AddCourtDTO dto, @PathVariable("clubId") Long clubId) {
        return clubService.addNewCourt(dto, clubId);
    }

    @GetMapping("/{clubId}/courts/{courtId}")
    public GetCourtDTO seeCourtInfo(@PathVariable("courtId") Long courtId, @PathVariable("clubId") Long clubId) {
        return clubService.seeCourtInfo(courtId, clubId);
    }

    @PutMapping("/{clubId}/courts/{courtId}")
    public ResponseEntity<Object> changeCourtInfo(@PathVariable("courtId") Long courtId, @ModelAttribute AddCourtDTO dto, @PathVariable("clubId") Long clubId) {
        return clubService.changeCourtInfo(courtId, dto, clubId);
    }

    @DeleteMapping("/{clubId}/courts/{courtId}")
    public ResponseEntity<Object> deleteCourt(@PathVariable("courtId") Long courtId, @PathVariable("clubId") Long clubId) {
        clubService.deleteCourt(courtId, clubId);
        return ResponseEntity.ok().body("Court deleted successfully!");
    }
}

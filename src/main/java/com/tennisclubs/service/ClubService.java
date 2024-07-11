package com.tennisclubs.service;

import com.tennisclubs.dao.*;
import com.tennisclubs.dto.*;
import com.tennisclubs.entity.*;
import com.tennisclubs.entity.pkeys.OwnsPK;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ClubService {
    private final ClubRepository clubRepository;
    private final PlaceRepository placeRepository;
    private final HoldsTrainingSessionsRepository holdsTrainingSessionsRepository;
    private final RepresentsRepository representsRepository;
    private final TransactionRepository transactionRepository;
    private final OwnsRepository ownsRepository;
    private final EquipmentRepository equipmentRepository;
    private final MeetingRepository meetingRepository;
    private final CourtRepository courtRepository;
    private final TournamentRepository tournamentRepository;
    private final PersonRepository personRepository;

    public ClubService(ClubRepository clubRepository, PlaceRepository placeRepository, HoldsTrainingSessionsRepository holdsTrainingSessionsRepository, RepresentsRepository representsRepository, TransactionRepository transactionRepository, OwnsRepository ownsRepository, EquipmentRepository equipmentRepository, MeetingRepository meetingRepository, CourtRepository courtRepository, TournamentRepository tournamentRepository, PersonRepository personRepository) {
        this.clubRepository = clubRepository;
        this.placeRepository = placeRepository;
        this.holdsTrainingSessionsRepository = holdsTrainingSessionsRepository;
        this.representsRepository = representsRepository;
        this.transactionRepository = transactionRepository;
        this.ownsRepository = ownsRepository;
        this.equipmentRepository = equipmentRepository;
        this.meetingRepository = meetingRepository;
        this.courtRepository = courtRepository;
        this.tournamentRepository = tournamentRepository;
        this.personRepository = personRepository;
    }

    public List<GetClubDTO> getAllClubs() {
        return clubRepository.findAll().stream().
                map(club -> new GetClubDTO(club.getClubId(), club.getName(), club.getFoundationYear(),
                        club.getEmail(), club.getPhoneNumber(), club.getWebAddress(), club.getBudget(),
                        club.getPlace().getZipCode(), club.getPlace().getName())).toList();
    }

    public ResponseEntity<Object> addNewClub(AddClubDTO dto) {
        Place place;
        if (placeRepository.findByZipCode(dto.getZipCode()).isEmpty()) {
            place = placeRepository.save(new Place(dto.getZipCode(), dto.getPlaceName()));
        } else {
            place = placeRepository.findByZipCode(dto.getZipCode()).orElseThrow();
        }
        Club newClub = new Club(dto.getName(), dto.getFoundationYear(),
                dto.getEmail(), dto.getPhoneNumber(), dto.getWebAddress(), dto.getBudget(),
                place);
        newClub = clubRepository.save(newClub);

        return ResponseEntity.ok().header(HttpHeaders.LOCATION, "/clubs/" + newClub.getClubId()).body("Club added successfully!");
    }

    public GetClubDTO seeClubInfo(Long clubId) {
        Club club = clubRepository.findByClubId(clubId).orElseThrow();
        return new GetClubDTO(club.getClubId(), club.getName(), club.getFoundationYear(),
                club.getEmail(), club.getPhoneNumber(), club.getWebAddress(), club.getBudget(),
                club.getPlace().getZipCode(), club.getPlace().getName());
    }

    public ResponseEntity<Object> changeClubInfo(Long clubId, AddClubDTO dto) {
        if (!clubRepository.existsByClubId(clubId)) {
            throw new NoSuchElementException();
        }

        Place place;
        if (placeRepository.findByZipCode(dto.getZipCode()).isEmpty()) {
            place = placeRepository.save(new Place(dto.getZipCode(), dto.getPlaceName()));
        } else {
            place = placeRepository.findByZipCode(dto.getZipCode()).orElseThrow();
        }

        Club changedClub = clubRepository.findByClubId(clubId).orElseThrow();
        changedClub.setName(dto.getName());
        changedClub.setFoundationYear(dto.getFoundationYear());
        changedClub.setEmail(dto.getEmail());
        changedClub.setPhoneNumber(dto.getPhoneNumber());
        changedClub.setWebAddress(dto.getWebAddress());
        changedClub.setBudget(dto.getBudget());
        changedClub.setPlace(place);
        clubRepository.save(changedClub);

        return ResponseEntity.ok().body("Club info changed successfully!");
    }

    public void deleteClub(Long clubId) {
        Club club = clubRepository.findByClubId(clubId).orElseThrow();
        List<HoldsTrainingSessions> hts = holdsTrainingSessionsRepository.findAll().stream().
                filter(h -> h.getClub().equals(club)).toList();
        holdsTrainingSessionsRepository.deleteAll(hts);
        List<Represents> r = representsRepository.findAll().stream().filter(re -> re.getClub().equals(club)).toList();
        representsRepository.deleteAll(r);
        List<Transaction> transactions = transactionRepository.findAll().stream().filter(t -> t.getClub().equals(club)).toList();
        transactionRepository.deleteAll(transactions);
        List<Owns> owns = ownsRepository.findAll().stream().filter(o -> o.getClub().equals(club)).toList();
        ownsRepository.deleteAll(owns);
        List<Court> courts = courtRepository.findAll().stream().filter(c -> c.getClub().equals(club)).toList();
        courtRepository.deleteAll(courts);
        List<Meeting> meetings = meetingRepository.findAll().stream().filter(m -> m.getClub().equals(club)).toList();
        meetingRepository.deleteAll(meetings);
        List<Tournament> tournaments = tournamentRepository.findAll().stream().filter(t -> t.getClub().equals(club)).toList();
        tournamentRepository.deleteAll(tournaments);
        clubRepository.delete(club);
    }

    // transactions
    public List<GetTransactionDTO> getClubTransactions(Long clubId) {
        return transactionRepository.findAll().stream().filter(t -> t.getClub().getClubId().equals(clubId)).
                map(transaction -> new GetTransactionDTO(transaction.getTransactionId(),
                        transaction.getPerson().getName(), transaction.getPerson().getSurname(),
                        transaction.getPerson().getOib(), transaction.getClub().getName(),
                        transaction.getTransactionTimestamp(), transaction.getPrice(), transaction.getPaymentMethod(),
                        transaction.getDescription())).toList();
    }

    public ResponseEntity<Object> addNewTransaction(AddTransactionDTO dto, Long clubId) {
        Transaction newTransaction = new Transaction(personRepository.findByOib(dto.getOib()).orElseThrow(),
                clubRepository.findByClubId(dto.getClubId()).orElseThrow(), dto.getTransactionTimestamp(), dto.getPrice(),
                dto.getPaymentMethod(), dto.getDescription());
        newTransaction = transactionRepository.save(newTransaction);
        return ResponseEntity.ok().header(HttpHeaders.LOCATION, "/clubs/" + clubId + "/transactions/" + newTransaction.getTransactionId()).body("Transaction added successfully!");
    }

    public GetTransactionDTO seeTransactionInfo(Long transactionId, Long clubId) {
        Transaction transaction = transactionRepository.findByTransactionId(transactionId).orElseThrow();
        return new GetTransactionDTO(transaction.getTransactionId(), transaction.getPerson().getName(),
                transaction.getPerson().getSurname(), transaction.getPerson().getOib(), transaction.getClub().getName(),
                transaction.getTransactionTimestamp(), transaction.getPrice(),
                transaction.getPaymentMethod(), transaction.getDescription());
    }

    public ResponseEntity<Object> changeTransactionInfo(Long transactionId, AddTransactionDTO dto, Long clubId) {
        if (!transactionRepository.existsByTransactionId(transactionId)) {
            throw new NoSuchElementException();
        }

        Transaction changedTransaction = transactionRepository.findByTransactionId(transactionId).orElseThrow();
        changedTransaction.setPerson(personRepository.findByOib(dto.getOib()).orElseThrow());
        changedTransaction.setClub(clubRepository.findByClubId(dto.getClubId()).orElseThrow());
        changedTransaction.setTransactionTimestamp(dto.getTransactionTimestamp());
        changedTransaction.setPrice(dto.getPrice());
        changedTransaction.setPaymentMethod(dto.getPaymentMethod());
        changedTransaction.setDescription(dto.getDescription());
        transactionRepository.save(changedTransaction);

        return ResponseEntity.ok().body("Transaction info changed successfully!");
    }

    public void deleteTransaction(Long transactionId, Long clubId) {
        Transaction transaction = transactionRepository.findByTransactionId(transactionId).orElseThrow();
        transactionRepository.delete(transaction);
    }

    // equipment
    public List<GetEquipmentDTO> getClubEquipment(Long clubId) {
        return ownsRepository.findAll().stream().filter(o -> o.getClub().getClubId().equals(clubId))
                .map(equipment -> new GetEquipmentDTO(equipment.getOwnsId().getEquipmentId(), equipment.getClub().getName(),
                        equipment.getQuantity(), equipment.getEquipment().getName(), equipment.getEquipment().getPrice())).toList();
    }


    public ResponseEntity<Object> addNewEquipment(AddEquipmentDTO dto, Long clubId) {
        Equipment equipment;
        if (equipmentRepository.findByName(dto.getName()).isEmpty()) {
            equipment = equipmentRepository.save(new Equipment(dto.getName(), dto.getPrice()));
        } else {
            equipment = equipmentRepository.findByName(dto.getName()).orElseThrow();
        }
        Owns newOwns = new Owns(equipment, clubRepository.findByClubId(clubId).orElseThrow(), dto.getQuantity());
        newOwns = ownsRepository.save(newOwns);
        return ResponseEntity.ok().header(HttpHeaders.LOCATION, "/clubs/" + clubId + "/equipment/" + newOwns.getOwnsId().getEquipmentId()).body("Equipment added successfully!");
    }

    public GetEquipmentDTO seeEquipmentInfo(Long equipmentId, Long clubId) {
        Owns owns = ownsRepository.findByOwnsId(new OwnsPK(equipmentId, clubId)).orElseThrow();
        return new GetEquipmentDTO(owns.getEquipment().getEquipmentId(), owns.getClub().getName(),
                owns.getQuantity(), owns.getEquipment().getName(), owns.getEquipment().getPrice());
    }

    public ResponseEntity<Object> changeEquipmentInfo(Long equipmentId, AddEquipmentDTO dto, Long clubId) {
        if (!ownsRepository.existsByOwnsId(new OwnsPK(equipmentId, clubId))) {
            throw new NoSuchElementException();
        }

        Equipment equipment = new Equipment(dto.getName(), dto.getPrice());
        if (equipmentRepository.findByEquipmentId(equipmentId).isPresent()) {
            equipment = equipmentRepository.findByName(dto.getName()).orElseThrow();
            equipment.setName(dto.getName());
            equipment.setPrice(dto.getPrice());
        }
        equipmentRepository.save(equipment);

        Owns changedEquipment = ownsRepository.findByOwnsId(new OwnsPK(equipmentId, clubId)).orElseThrow();
        ownsRepository.delete(ownsRepository.findByOwnsId(new OwnsPK(equipmentId, clubId)).orElseThrow());
        changedEquipment.setOwnsId(new OwnsPK(equipment.getEquipmentId(), clubId));
        changedEquipment.setEquipment(equipment);
        changedEquipment.setClub(clubRepository.findByClubId(clubId).orElseThrow());
        changedEquipment.setQuantity(dto.getQuantity());
        ownsRepository.save(changedEquipment);

        return ResponseEntity.ok().body("Equipment info changed successfully!");
    }

    public void deleteEquipment(Long equipmentId, Long clubId) {
        Owns owns = ownsRepository.findByOwnsId(new OwnsPK(equipmentId, clubId)).orElseThrow();
        ownsRepository.delete(owns);
        if (!ownsRepository.existsByEquipment(owns.getEquipment())) {
            equipmentRepository.delete(owns.getEquipment());
        }
    }

    // meetings
    public List<GetMeetingDTO> getClubMeetings(Long clubId) {
        Club club = clubRepository.findByClubId(clubId).orElseThrow();
        return meetingRepository.findAll().stream().filter(m -> m.getClub().getClubId().equals(clubId)).
                map(meeting -> new GetMeetingDTO(
                meeting.getMeetingId(), meeting.getMeetingTimestamp(), meeting.getAgenda(), meeting.getNotes(),
                meeting.getClub().getName(), meeting.getAttendees().stream().map(person -> person.getName() + " "
                        + person.getSurname() + ", " + person.getOib()).collect(Collectors.toSet()))).toList();
    }

    public ResponseEntity<Object> addNewMeeting(AddMeetingDTO dto, Long clubId) {
        Meeting newMeeting = new Meeting(dto.getMeetingTimestamp(), dto.getAgenda(), dto.getNotes(),
                clubRepository.findByClubId(dto.getClubId()).orElseThrow());
        newMeeting.setAttendees(dto.getOibs().stream().map(oib -> personRepository.findByOib(oib).orElseThrow()).
                collect(Collectors.toSet()));
        meetingRepository.save(newMeeting);
        return ResponseEntity.ok().header(HttpHeaders.LOCATION, "/clubs/" + clubId + "/meetings/" + newMeeting.getMeetingId()).body("Meeting added successfully!");
    }

    public GetMeetingDTO seeMeetingInfo(Long meetingId, Long clubId) {
        Meeting meeting = meetingRepository.findByMeetingId(meetingId).orElseThrow();
        return new GetMeetingDTO(meeting.getMeetingId(), meeting.getMeetingTimestamp(), meeting.getAgenda(), meeting.getNotes(),
                meeting.getClub().getName(),meeting.getAttendees().stream().map(person -> person.getName() + " "
                + person.getSurname() + ", " + person.getOib()).collect(Collectors.toSet()));
    }

    public ResponseEntity<Object> changeMeetingInfo(Long meetingId, AddMeetingDTO dto, Long clubId) {
        if (!meetingRepository.existsByMeetingId(meetingId)) {
            throw new NoSuchElementException();
        }

        Meeting changedMeeting = meetingRepository.findByMeetingId(meetingId).orElseThrow();
        changedMeeting.setClub(clubRepository.findByClubId(dto.getClubId()).orElseThrow());
        changedMeeting.setMeetingTimestamp(dto.getMeetingTimestamp());
        changedMeeting.setAgenda(dto.getAgenda());
        changedMeeting.setAttendees(dto.getOibs().stream().map(oib -> personRepository.findByOib(oib).orElseThrow()).
                collect(Collectors.toSet()));
        changedMeeting.setNotes(dto.getNotes());
        meetingRepository.save(changedMeeting);

        return ResponseEntity.ok().body("Meeting info changed successfully!");
    }

    public void deleteMeeting(Long meetingId, Long clubId) {
        Meeting meeting = meetingRepository.findByMeetingId(meetingId).orElseThrow();
        meetingRepository.delete(meeting);
    }

    // courts
    public List<GetCourtDTO> getClubCourts(Long clubId) {
        Club club = clubRepository.findByClubId(clubId).orElseThrow();
        return courtRepository.findAll().stream().filter(c -> c.getClub().getClubId().equals(clubId)).
                map(court -> new GetCourtDTO(court.getCourtId(),
                court.getName(), court.getClub().getName(), court.getSurface()
        )).toList();
    }

    public ResponseEntity<Object> addNewCourt(AddCourtDTO dto, Long clubId) {
        Court newCourt = new Court(dto.getName(), clubRepository.findByClubId(dto.getClubId()).orElseThrow(),
                dto.getSurface());
        courtRepository.save(newCourt);
        return ResponseEntity.ok().header(HttpHeaders.LOCATION, "/clubs/" + clubId + "/courts/" + newCourt.getCourtId()).body("Court added successfully!");
    }

    public GetCourtDTO seeCourtInfo(Long courtId, Long clubId) {
        Court court = courtRepository.findByCourtId(courtId).orElseThrow();
        return new GetCourtDTO(court.getCourtId(), court.getName(), court.getClub().getName(), court.getSurface());
    }

    public ResponseEntity<Object> changeCourtInfo(Long courtId, AddCourtDTO dto, Long clubId) {
        if (!courtRepository.existsByCourtId(courtId)) {
            throw new NoSuchElementException();
        }

        Court changedCourt = courtRepository.findByCourtId(courtId).orElseThrow();
        changedCourt.setClub(clubRepository.findByClubId(dto.getClubId()).orElseThrow());
        changedCourt.setName(dto.getName());
        changedCourt.setSurface(dto.getSurface());
        courtRepository.save(changedCourt);

        return ResponseEntity.ok().body("Court info changed successfully!");
    }

    public void deleteCourt(Long courtId, Long clubId) {
        Court court = courtRepository.findByCourtId(courtId).orElseThrow();
        courtRepository.delete(court);
    }
}

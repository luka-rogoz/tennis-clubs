package com.tennisclubs.service;

import com.tennisclubs.dao.*;
import com.tennisclubs.dto.AddCoachDTO;
import com.tennisclubs.dto.AddTrainingDTO;
import com.tennisclubs.dto.GetCoachDTO;
import com.tennisclubs.dto.GetTrainingDTO;
import com.tennisclubs.entity.*;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class CoachService {
    private final CoachRepository coachRepository;
    private final PlaceRepository placeRepository;
    private final HoldsTrainingSessionsRepository holdsTrainingSessionsRepository;
    private final TrainingRepository trainingRepository;
    private final ClubRepository clubRepository;
    private final PlayerRepository playerRepository;

    public CoachService(CoachRepository coachRepository, PlaceRepository placeRepository, HoldsTrainingSessionsRepository holdsTrainingSessionsRepository, TrainingRepository trainingRepository, ClubRepository clubRepository, PlayerRepository playerRepository) {
        this.coachRepository = coachRepository;
        this.placeRepository = placeRepository;
        this.holdsTrainingSessionsRepository = holdsTrainingSessionsRepository;
        this.trainingRepository = trainingRepository;
        this.clubRepository = clubRepository;
        this.playerRepository = playerRepository;
    }

    public List<GetCoachDTO> getAllCoaches() {
        return coachRepository.findAll().stream().
                map(coach -> new GetCoachDTO(coach.getPersonId(), coach.getOib(), coach.getName(), coach.getSurname(), coach.getDateOfBirth(),
                        coach.getSex(), coach.getPlace().getZipCode(), coach.getPlace().getName(),
                        coach.getYearsOfExperience(), coach.getSpecialization(),
                        coach.getClubsCoachedAt().stream().filter(h -> h.getToDate() == null).map(HoldsTrainingSessions::getClub).
                                toList().getLast().getName(), coach.getClubsCoachedAt()
                        .stream().filter(h -> h.getToDate() != null).map(h -> h.getClub().getName() + ": " + h.getFromDate().getDayOfMonth() + ". " + h.getFromDate().getMonthValue() +
                                ". " + h.getFromDate().getYear() + ". - " + h.getToDate().getDayOfMonth() + ". " + h.getToDate().getMonthValue()
                                + ". " + h.getToDate().getYear() + ".").collect(Collectors.toSet()))).toList();
    }

    public ResponseEntity<Object> addNewCoach(AddCoachDTO dto) {
        Place place;
        if (placeRepository.findByZipCode(dto.getZipCode()).isEmpty()) {
            place = placeRepository.save(new Place(dto.getZipCode(), dto.getPlaceName()));
        } else {
            place = placeRepository.findByZipCode(dto.getZipCode()).orElseThrow();
        }
        Coach newCoach = new Coach(dto.getOib(), dto.getName(), dto.getSurname(), dto.getDateOfBirth(),
                dto.getSex(), place, dto.getYearsOfExperience(),
                dto.getSpecialization());
        newCoach = coachRepository.save(newCoach);
        HoldsTrainingSessions hts = new HoldsTrainingSessions(newCoach, clubRepository.findByName
                (dto.getClubName()).orElseThrow(), dto.getFrom() != null ? dto.getFrom() : LocalDate.now(), null);
        holdsTrainingSessionsRepository.save(hts);
        return ResponseEntity.ok().header(HttpHeaders.LOCATION, "/coaches/" + newCoach.getPersonId()).body("Coach added successfully!");
    }

    public GetCoachDTO seeCoachInfo(Long coachId) {
        Coach coach = coachRepository.findByPersonId(coachId).orElseThrow();
        Club club = coach.getClubsCoachedAt().stream().filter(h -> h.getToDate() == null).
                map(HoldsTrainingSessions::getClub).toList().getLast();
        Set<String> previousClubs = coach.getClubsCoachedAt().stream().filter(h -> h.getToDate() != null)
                .map(h -> h.getClub().getName() + ": " + h.getFromDate().getDayOfMonth() + ". " + h.getFromDate().getMonthValue() +
                        ". " + h.getFromDate().getYear() + ". - " + h.getToDate().getDayOfMonth() + ". " + h.getToDate().getMonthValue()
                + ". " + h.getToDate().getYear() + ".").collect(Collectors.toSet());
        return new GetCoachDTO(coach.getPersonId(), coach.getOib(), coach.getName(), coach.getSurname(), coach.getDateOfBirth(),
                coach.getSex(), coach.getPlace().getZipCode(), coach.getPlace().getName(), coach.getYearsOfExperience(),
                coach.getSpecialization(), club.getName(), previousClubs);
    }

    public ResponseEntity<Object> changeCoachInfo(Long coachId, AddCoachDTO dto) {
        if (!coachRepository.existsByPersonId(coachId)) {
            throw new NoSuchElementException();
        }
        Place place;
        if (placeRepository.findByZipCode(dto.getZipCode()).isEmpty()) {
            place = placeRepository.save(new Place(dto.getZipCode(), dto.getPlaceName()));
        } else {
            place = placeRepository.findByZipCode(dto.getZipCode()).orElseThrow();
        }

        Coach coach = coachRepository.findByPersonId(coachId).orElseThrow();

        Coach changedCoach = coachRepository.findByPersonId(coachId).orElseThrow();
        changedCoach.setSpecialization(dto.getSpecialization());
        changedCoach.setYearsOfExperience(dto.getYearsOfExperience());
        changedCoach.setName(dto.getName());
        changedCoach.setSurname(dto.getSurname());
        changedCoach.setSex(dto.getSex());
        changedCoach.setDateOfBirth(dto.getDateOfBirth());
        changedCoach.setOib(dto.getOib());
        changedCoach.setPlace(place);
        coachRepository.save(changedCoach);

        if (coach.getClubsCoachedAt().stream().map(h -> h.getClub().getName()).collect(Collectors.toSet()).contains(dto.getClubName())) {
            HoldsTrainingSessions h1 = coach.getClubsCoachedAt().stream().filter(h -> h.getClub().getName().equals(dto.getClubName())).
                    findFirst().orElseThrow();
            holdsTrainingSessionsRepository.delete(h1);
            h1.setFromDate(dto.getFrom());
            holdsTrainingSessionsRepository.save(h1);
        } else {
            HoldsTrainingSessions h1 = coach.getClubsCoachedAt().stream().filter(h -> h.getToDate() == null).findFirst().orElseThrow();
            holdsTrainingSessionsRepository.delete(h1);
            h1.setToDate(dto.getFrom());
            HoldsTrainingSessions h2 = new HoldsTrainingSessions(changedCoach, clubRepository.findByName(dto.getClubName())
                    .orElseThrow(), dto.getFrom(), null);
            holdsTrainingSessionsRepository.saveAll(Set.of(h1, h2));
        }

        return ResponseEntity.ok().body("Coach info changed successfully!");
    }

    public void deleteCoach(Long coachId) {
        Coach coach = coachRepository.findByPersonId(coachId).orElseThrow();
        List<HoldsTrainingSessions> hts = holdsTrainingSessionsRepository.findAll().stream().
                filter(h -> h.getCoach().equals(coach)).toList();
        holdsTrainingSessionsRepository.deleteAll(hts);
        List<Training> trainings = trainingRepository.findAll().stream().filter(t -> t.getCoach().equals(coach)).toList();
        trainingRepository.deleteAll(trainings);
        coachRepository.delete(coach);
    }

    // coach training sessions
    public List<GetTrainingDTO> getCoachTrainingSessions(Long coachId) {
        return trainingRepository.findAll().stream().filter(ts -> ts.getCoach().getPersonId().equals(coachId))
                .map(ts -> new GetTrainingDTO(ts.getTrainingId(), ts.getTrainingTimestamp(), ts.getDuration(),
                        ts.getDescription(), ts.getNotes(), ts.getCoach().getName() + " " +
                        ts.getCoach().getSurname() + ", " + ts.getCoach().getOib(), ts.getPlayers().stream()
                        .map(player -> player.getName() + " " + player.getSurname() + ", " + player.getOib()).
                        collect(Collectors.toSet()))).toList();
    }

    public ResponseEntity<Object> addNewTrainingSession(AddTrainingDTO dto, Long coachId) {
        Training newTraining = new Training(dto.getTrainingTimestamp(), dto.getDuration(), dto.getDescription(),
                dto.getNotes(), dto.getPlayers().stream().map(oib -> playerRepository.findByOib(oib).orElseThrow())
                .collect(Collectors.toSet()), coachRepository.findByOib(dto.getCoach()).orElseThrow());
        trainingRepository.save(newTraining);
        return ResponseEntity.ok().header(HttpHeaders.LOCATION, "/coaches/" + coachId + "/training_sessions/" + newTraining.getTrainingId()).body("Training added successfully!");
    }

    public GetTrainingDTO seeTrainingSessionInfo(Long trainingId, Long coachId) {
        Training training = trainingRepository.findByTrainingId(trainingId).orElseThrow();
        return new GetTrainingDTO(training.getTrainingId(), training.getTrainingTimestamp(), training.getDuration(),
                training.getDescription(), training.getNotes(), training.getCoach().getName() + " " +
                training.getCoach().getSurname() + ", " + training.getCoach().getOib(), training.getPlayers().stream()
                .map(p -> p.getName() + " " + p.getSurname() + ", " + p.getOib()).collect(Collectors.toSet()));
    }

    public ResponseEntity<Object> changeTrainingSessionInfo(Long trainingId, AddTrainingDTO dto, Long coachId) {
        if (!trainingRepository.existsByTrainingId(trainingId)) {
            throw new NoSuchElementException();
        }

        Training changedTraining = trainingRepository.findByTrainingId(trainingId).orElseThrow();
        changedTraining.setCoach(coachRepository.findByOib(dto.getCoach()).orElseThrow());
        changedTraining.setTrainingTimestamp(dto.getTrainingTimestamp());
        changedTraining.setPlayers(dto.getPlayers().stream().map(oib -> playerRepository.findByOib(oib).orElseThrow())
                .collect(Collectors.toSet()));
        changedTraining.setNotes(dto.getNotes());
        changedTraining.setDescription(dto.getDescription());
        changedTraining.setDuration(dto.getDuration());
        trainingRepository.save(changedTraining);

        return ResponseEntity.ok().body("Training info changed successfully!");
    }

    public void deleteTrainingSession(Long trainingId, Long coachId) {
        Training training = trainingRepository.findByTrainingId(trainingId).orElseThrow();
        trainingRepository.delete(training);
    }
}

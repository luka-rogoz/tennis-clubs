package com.tennisclubs.service;

import com.tennisclubs.dao.*;
import com.tennisclubs.dto.AddPlayerDTO;
import com.tennisclubs.dto.GetMatchDTO;
import com.tennisclubs.dto.GetPlayerDTO;
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
import java.util.stream.Stream;

@Service
public class PlayerService {
    private final PlayerRepository playerRepository;
    private final PlaceRepository placeRepository;
    private final RepresentsRepository representsRepository;
    private final MatchRepository matchRepository;
    private final ClubRepository clubRepository;

    public PlayerService(PlayerRepository playerRepository, PlaceRepository placeRepository, RepresentsRepository representsRepository, MatchRepository matchRepository, ClubRepository clubRepository) {
        this.playerRepository = playerRepository;
        this.placeRepository = placeRepository;
        this.representsRepository = representsRepository;
        this.matchRepository = matchRepository;
        this.clubRepository = clubRepository;
    }

    public List<GetPlayerDTO> getAllPlayers() {
        return playerRepository.findAll().stream().
                map(player -> new GetPlayerDTO(player.getPersonId(), player.getOib(), player.getName(), player.getSurname(),
                        player.getDateOfBirth(), player.getSex(), player.getPlace().getZipCode(),
                        player.getPlace().getName(), player.getHeight(), player.getWeight(),
                        player.getPreferredHand(), player.getRank(), player.getInjury(),
                        player.getClubsPlayedAt().stream().
                                filter(r -> r.getToDate() == null).map(Represents::getClub).
                                toList().getLast().getName(), player.getClubsPlayedAt().stream()
                        .filter(r -> r.getToDate() != null).map(r -> r.getClub().getName() + ": " + r.getFromDate().getDayOfMonth() + "." + r.getFromDate().getMonthValue() +
                        "." + r.getFromDate().getYear() + ". - " + r.getToDate().getDayOfMonth() + "." + r.getToDate().getMonthValue()
                        + "." + r.getToDate().getYear() + ".").collect(Collectors.toSet()))).toList();
    }

    public ResponseEntity<Object> addNewPlayer(AddPlayerDTO dto) {
        Place place;
        if (placeRepository.findByZipCode(dto.getZipCode()).isEmpty()) {
            place = placeRepository.save(new Place(dto.getZipCode(), dto.getPlaceName()));
        } else {
            place = placeRepository.findByZipCode(dto.getZipCode()).orElseThrow();
        }
        Player newPlayer = new Player(dto.getOib(), dto.getName(), dto.getSurname(), dto.getDateOfBirth(),
                dto.getSex(), place, dto.getHeight(), dto.getWeight(), dto.getPreferredHand(),
                dto.getRank(), dto.getInjury());
        newPlayer = playerRepository.save(newPlayer);
        Represents represents = new Represents(newPlayer, clubRepository.findByName(dto.getClubName()).orElseThrow(),
                dto.getFrom() != null ? dto.getFrom() : LocalDate.now(), null);
        representsRepository.save(represents);
        return ResponseEntity.ok().header(HttpHeaders.LOCATION, "/players/" + newPlayer.getPersonId()).body("Player added successfully!");
    }

    public GetPlayerDTO seePlayerInfo(Long playerId) {
        Player player = playerRepository.findByPersonId(playerId).orElseThrow();
        Club club = player.getClubsPlayedAt().stream().filter(r -> r.getToDate() == null).
                map(Represents::getClub).toList().getLast();
        Set<String> previousClubs = player.getClubsPlayedAt().stream().filter(r -> r.getToDate() != null)
                .map(r -> r.getClub().getName() + ": " + r.getFromDate().getDayOfMonth() + "." + r.getFromDate().getMonthValue() +
                        "." + r.getFromDate().getYear() + ". - " + r.getToDate().getDayOfMonth() + "." + r.getToDate().getMonthValue()
                        + "." + r.getToDate().getYear() + ".").collect(Collectors.toSet());
        return new GetPlayerDTO(player.getPersonId(), player.getOib(), player.getName(), player.getSurname(), player.getDateOfBirth(),
                player.getSex(), player.getPlace().getZipCode(), player.getPlace().getName(), player.getHeight(),
                player.getWeight(), player.getPreferredHand(), player.getRank(), player.getInjury(), club.getName(), previousClubs);
    }

    public ResponseEntity<Object> changePlayerInfo(Long playerId, AddPlayerDTO dto) {
        if (!playerRepository.existsByPersonId(playerId)) {
            throw new NoSuchElementException();
        }

        Place place;
        if (placeRepository.findByZipCode(dto.getZipCode()).isEmpty()) {
            place = placeRepository.save(new Place(dto.getZipCode(), dto.getPlaceName()));
        } else {
            place = placeRepository.findByZipCode(dto.getZipCode()).orElseThrow();
        }

        Player player = playerRepository.findByPersonId(playerId).orElseThrow();

        Player changedPlayer = playerRepository.findByPersonId(playerId).orElseThrow();
        changedPlayer.setHeight(dto.getHeight());
        changedPlayer.setInjury(dto.getInjury());
        changedPlayer.setRank(dto.getRank());
        changedPlayer.setWeight(dto.getWeight());
        changedPlayer.setName(dto.getName());
        changedPlayer.setPreferredHand(dto.getPreferredHand());
        changedPlayer.setDateOfBirth(dto.getDateOfBirth());
        changedPlayer.setSex(dto.getSex());
        changedPlayer.setOib(dto.getOib());
        changedPlayer.setPlace(place);
        playerRepository.save(changedPlayer);

        if (player.getClubsPlayedAt().stream().map(r -> r.getClub().getName()).collect(Collectors.toSet()).contains(dto.getClubName())) {
            Represents r1 = player.getClubsPlayedAt().stream().filter(r -> r.getClub().getName().equals(dto.getClubName())).
                    findFirst().orElseThrow();
            representsRepository.delete(r1);
            r1.setFromDate(dto.getFrom());
            representsRepository.save(r1);
        } else {
            Represents r1 = player.getClubsPlayedAt().stream().filter(r -> r.getToDate() == null).findFirst().orElseThrow();
            representsRepository.delete(r1);
            r1.setToDate(dto.getFrom());
            Represents r2 = new Represents(changedPlayer, clubRepository.findByName(dto.getClubName())
                    .orElseThrow(), dto.getFrom(), null);
            representsRepository.saveAll(Set.of(r1, r2));
        }

        return ResponseEntity.ok().body("Player info changed successfully!");
    }

    public void deletePlayer(Long playerId) {
        Player player = playerRepository.findByPersonId(playerId).orElseThrow();
        List<Represents> represents = representsRepository.findAll().stream()
                .filter(r -> r.getPlayer().equals(player)).toList();
        representsRepository.deleteAll(represents);
        List<Match> matches = Stream.concat(matchRepository.findAll().stream().filter(p -> p.getPlayer1().equals(player)),
                matchRepository.findAll().stream().filter(p -> p.getPlayer2().equals(player))).toList();
        matchRepository.deleteAll(matches);
        playerRepository.delete(player);
    }

    public List<GetMatchDTO> getPlayerMatches(Long playerId) {
        return Stream.concat(
                playerRepository.findByPersonId(playerId).orElseThrow().getSinglesMatchesPlayedAsHost().stream(),
                playerRepository.findByPersonId(playerId).orElseThrow().getSinglesMatchesPlayedAsGuest().stream()
        ).map(m -> {
            String[] scores = m.getMatchResult().split("-");
            int hostScore = Integer.parseInt(scores[0]);
            int guestScore = Integer.parseInt(scores[1]);

            boolean isHost = m.getPlayer1().getPersonId().equals(playerId);
            boolean playerWon = (isHost && hostScore > guestScore) || (!isHost && guestScore > hostScore);

            return new GetMatchDTO(
                    m.getMatchId(),
                    m.getMatchTimestamp(),
                    m.getMatchResult(),
                    m.getDuration(),
                    m.getStage(),
                    m.getPlayer1().getName() + " " + m.getPlayer1().getSurname() + ", " + m.getPlayer1().getOib(),
                    m.getPlayer2().getName() + " " + m.getPlayer2().getSurname() + ", " + m.getPlayer2().getOib(),
                    m.getCourt().getName(),
                    m.getTournament().getName(),
                    m.getTournament().getCategory().getType(),
                    m.getTournament().getCategory().getAgeLimit(),
                    m.getTournament().getCategory().getSexLimit(),
                    playerWon ? 1 : 0
            );
        }).toList();
    }

}

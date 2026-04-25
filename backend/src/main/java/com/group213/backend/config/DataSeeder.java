package com.group213.backend.config;

import com.group213.backend.model.*;
import com.group213.backend.repository.BookingRepository;
import com.group213.backend.repository.ResourceRepository;
import com.group213.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedData(
            ResourceRepository resources,
            BookingRepository bookings,
            UserRepository users
    ) {
        return args -> {
            if (resources.count() == 0) {
                seedResources(resources);
            }
            if (bookings.count() == 0) {
                users.findAll().stream().findFirst().ifPresent(user ->
                        seedBookings(bookings, resources.findAll(), user.getId())
                );
            }
        };
    }

    private void seedResources(ResourceRepository repo) {
        // columns: name, type, capacity, location, status, from, to, imageUrl
        List<Object[]> data = List.of(
            new Object[]{"Lecture Hall A",       ResourceType.ROOM,      120, "Block A, Level 1",  ResourceStatus.ACTIVE,            "08:00","22:00","https://picsum.photos/seed/lecturehall1/600/400"},
            new Object[]{"Lecture Hall B",       ResourceType.ROOM,      100, "Block A, Level 2",  ResourceStatus.ACTIVE,            "08:00","22:00","https://picsum.photos/seed/lecturehall2/600/400"},
            new Object[]{"Seminar Room 1",       ResourceType.ROOM,       40, "Block B, Level 1",  ResourceStatus.ACTIVE,            "08:00","20:00","https://picsum.photos/seed/seminar1/600/400"},
            new Object[]{"Seminar Room 2",       ResourceType.ROOM,       40, "Block B, Level 1",  ResourceStatus.ACTIVE,            "08:00","20:00","https://picsum.photos/seed/seminar2/600/400"},
            new Object[]{"Seminar Room 3",       ResourceType.ROOM,       30, "Block B, Level 2",  ResourceStatus.ACTIVE,            "08:00","20:00","https://picsum.photos/seed/seminar3/600/400"},
            new Object[]{"Conference Room",      ResourceType.ROOM,       20, "Block C, Level 3",  ResourceStatus.ACTIVE,            "09:00","18:00","https://picsum.photos/seed/conference1/600/400"},
            new Object[]{"Discussion Pod 1",     ResourceType.ROOM,        8, "Library, Level 2",  ResourceStatus.ACTIVE,            "08:00","22:00","https://picsum.photos/seed/pod1/600/400"},
            new Object[]{"Discussion Pod 2",     ResourceType.ROOM,        8, "Library, Level 2",  ResourceStatus.OUT_OF_SERVICE,    "08:00","22:00","https://picsum.photos/seed/pod2/600/400"},
            new Object[]{"Computer Lab 1",       ResourceType.LAB,        50, "Block D, Level 1",  ResourceStatus.ACTIVE,            "08:00","21:00","https://picsum.photos/seed/computerlab1/600/400"},
            new Object[]{"Computer Lab 2",       ResourceType.LAB,        50, "Block D, Level 2",  ResourceStatus.ACTIVE,            "08:00","21:00","https://picsum.photos/seed/computerlab2/600/400"},
            new Object[]{"Computer Lab 3",       ResourceType.LAB,        30, "Block D, Level 3",  ResourceStatus.UNDER_MAINTENANCE, "08:00","21:00","https://picsum.photos/seed/computerlab3/600/400"},
            new Object[]{"Science Lab A",        ResourceType.LAB,        25, "Block E, Level 1",  ResourceStatus.ACTIVE,            "08:00","18:00","https://picsum.photos/seed/sciencelab1/600/400"},
            new Object[]{"Science Lab B",        ResourceType.LAB,        25, "Block E, Level 2",  ResourceStatus.ACTIVE,            "08:00","18:00","https://picsum.photos/seed/sciencelab2/600/400"},
            new Object[]{"Electronics Lab",      ResourceType.LAB,        20, "Block F, Level 1",  ResourceStatus.ACTIVE,            "09:00","17:00","https://picsum.photos/seed/electronics/600/400"},
            new Object[]{"Networking Lab",       ResourceType.LAB,        20, "Block F, Level 2",  ResourceStatus.OUT_OF_SERVICE,    "09:00","17:00","https://picsum.photos/seed/networking/600/400"},
            new Object[]{"Projector (Portable)", ResourceType.EQUIPMENT,   1, "Equipment Store",   ResourceStatus.ACTIVE,            "08:00","20:00","https://picsum.photos/seed/projector1/600/400"},
            new Object[]{"Projector (Fixed) A",  ResourceType.EQUIPMENT,   1, "Block A, Level 1",  ResourceStatus.ACTIVE,            "08:00","20:00","https://picsum.photos/seed/projector2/600/400"},
            new Object[]{"DSLR Camera Kit",      ResourceType.EQUIPMENT,   1, "Equipment Store",   ResourceStatus.ACTIVE,            "08:00","18:00","https://picsum.photos/seed/camera1/600/400"},
            new Object[]{"PA System",            ResourceType.EQUIPMENT,   1, "Equipment Store",   ResourceStatus.UNDER_MAINTENANCE, "09:00","17:00","https://picsum.photos/seed/pasystem/600/400"},
            new Object[]{"3D Printer",           ResourceType.EQUIPMENT,   1, "Maker Lab",         ResourceStatus.ACTIVE,            "09:00","17:00","https://picsum.photos/seed/3dprinter/600/400"}
        );

        for (Object[] row : data) {
            Resource r = new Resource();
            r.setName((String) row[0]);
            r.setType((ResourceType) row[1]);
            r.setCapacity((int) row[2]);
            r.setLocation((String) row[3]);
            r.setStatus((ResourceStatus) row[4]);
            r.setAvailableFrom((String) row[5]);
            r.setAvailableTo((String) row[6]);
            r.setImageUrl((String) row[7]);
            repo.save(r);
        }
    }

    private void seedBookings(BookingRepository repo, List<Resource> resourceList, Long userId) {
        if (resourceList.isEmpty()) return;

        // bookingDate, resourceIndex, startTime, endTime, purpose, attendees, status
        List<Object[]> data = List.of(
            new Object[]{LocalDate.now().minusMonths(11).withDayOfMonth(5),  0, "09:00","11:00","Guest lecture preparation",     30, BookingStatus.APPROVED},
            new Object[]{LocalDate.now().minusMonths(11).withDayOfMonth(12), 2, "14:00","16:00","Year 1 orientation session",     40, BookingStatus.APPROVED},
            new Object[]{LocalDate.now().minusMonths(10).withDayOfMonth(3),  1, "10:00","12:00","Research committee meeting",     15, BookingStatus.APPROVED},
            new Object[]{LocalDate.now().minusMonths(10).withDayOfMonth(18), 8, "08:00","10:00","Programming practical",          50, BookingStatus.APPROVED},
            new Object[]{LocalDate.now().minusMonths(10).withDayOfMonth(22), 3, "13:00","15:00","Project group discussion",       10, BookingStatus.REJECTED},
            new Object[]{LocalDate.now().minusMonths(9).withDayOfMonth(7),   9, "09:00","11:00","Database lab session",           48, BookingStatus.APPROVED},
            new Object[]{LocalDate.now().minusMonths(9).withDayOfMonth(14),  5, "14:00","16:00","Faculty board meeting",          18, BookingStatus.APPROVED},
            new Object[]{LocalDate.now().minusMonths(9).withDayOfMonth(25),  0, "08:00","10:00","Workshop: Machine Learning",     80, BookingStatus.CANCELLED},
            new Object[]{LocalDate.now().minusMonths(8).withDayOfMonth(4),   2, "10:00","12:00","Final year project presentation",35, BookingStatus.APPROVED},
            new Object[]{LocalDate.now().minusMonths(8).withDayOfMonth(11),  11,"09:00","11:00","Chemistry lab session",          24, BookingStatus.APPROVED},
            new Object[]{LocalDate.now().minusMonths(8).withDayOfMonth(20),  15,"10:00","12:00","Tech talk: Cloud computing",     60, BookingStatus.APPROVED},
            new Object[]{LocalDate.now().minusMonths(7).withDayOfMonth(6),   8, "13:00","15:00","AI programming lab",             45, BookingStatus.APPROVED},
            new Object[]{LocalDate.now().minusMonths(7).withDayOfMonth(15),  4, "09:00","10:30","Department heads meeting",       20, BookingStatus.REJECTED},
            new Object[]{LocalDate.now().minusMonths(7).withDayOfMonth(23),  6, "14:00","16:00","Study group session",            7,  BookingStatus.APPROVED},
            new Object[]{LocalDate.now().minusMonths(6).withDayOfMonth(8),   1, "08:00","10:00","Hackathon kickoff",              95, BookingStatus.APPROVED},
            new Object[]{LocalDate.now().minusMonths(6).withDayOfMonth(16),  9, "10:00","12:00","Networking lab practical",       30, BookingStatus.APPROVED},
            new Object[]{LocalDate.now().minusMonths(6).withDayOfMonth(24),  17,"09:00","11:00","Video production session",        3, BookingStatus.CANCELLED},
            new Object[]{LocalDate.now().minusMonths(5).withDayOfMonth(3),   0, "13:00","15:00","IEEE student chapter event",     70, BookingStatus.APPROVED},
            new Object[]{LocalDate.now().minusMonths(5).withDayOfMonth(12),  2, "09:00","11:00","Postgrad research seminar",      38, BookingStatus.APPROVED},
            new Object[]{LocalDate.now().minusMonths(5).withDayOfMonth(21),  5, "14:00","16:00","Industry partnership meeting",   12, BookingStatus.APPROVED},
            new Object[]{LocalDate.now().minusMonths(4).withDayOfMonth(9),   8, "08:00","10:00","Python bootcamp",                50, BookingStatus.APPROVED},
            new Object[]{LocalDate.now().minusMonths(4).withDayOfMonth(17),  11,"10:00","12:00","Biology lab",                    22, BookingStatus.APPROVED},
            new Object[]{LocalDate.now().minusMonths(4).withDayOfMonth(26),  19,"09:00","11:00","3D printing workshop",            8, BookingStatus.REJECTED},
            new Object[]{LocalDate.now().minusMonths(3).withDayOfMonth(5),   1, "14:00","16:00","Cybersecurity seminar",          85, BookingStatus.APPROVED},
            new Object[]{LocalDate.now().minusMonths(3).withDayOfMonth(14),  9, "08:00","10:00","Web development lab",            47, BookingStatus.APPROVED},
            new Object[]{LocalDate.now().minusMonths(3).withDayOfMonth(22),  6, "13:00","15:00","Group study session",             6, BookingStatus.APPROVED},
            new Object[]{LocalDate.now().minusMonths(2).withDayOfMonth(7),   0, "09:00","11:00","Annual tech symposium",         110, BookingStatus.APPROVED},
            new Object[]{LocalDate.now().minusMonths(2).withDayOfMonth(15),  2, "14:00","16:00","Capstone project showcase",      40, BookingStatus.APPROVED},
            new Object[]{LocalDate.now().minusMonths(1).withDayOfMonth(10),  8, "08:00","10:00","Data structures lab",            50, BookingStatus.APPROVED},
            new Object[]{LocalDate.now().minusMonths(1).withDayOfMonth(20),  5, "10:00","12:00","Accreditation review meeting",   16, BookingStatus.APPROVED},
            new Object[]{LocalDate.now().minusDays(10),                      1, "13:00","15:00","Final exam review session",      90, BookingStatus.APPROVED},
            new Object[]{LocalDate.now().minusDays(5),                       2, "09:00","11:00","Guest speaker: Industry trends", 35, BookingStatus.PENDING},
            new Object[]{LocalDate.now().minusDays(3),                       9, "14:00","16:00","Cloud computing lab",            48, BookingStatus.PENDING},
            new Object[]{LocalDate.now().minusDays(1),                       6, "10:00","12:00","Thesis group meeting",            8, BookingStatus.PENDING},
            new Object[]{LocalDate.now().plusDays(3),                        0, "08:00","10:00","Upcoming workshop",              60, BookingStatus.PENDING}
        );

        for (Object[] row : data) {
            int ri = (int) row[1];
            Resource resource = resourceList.get(ri % resourceList.size());

            Booking b = new Booking();
            b.setBookingDate((LocalDate) row[0]);
            b.setResourceId(resource.getId());
            b.setUserId(userId);
            b.setStartTime(LocalTime.parse((String) row[2]));
            b.setEndTime(LocalTime.parse((String) row[3]));
            b.setPurpose((String) row[4]);
            b.setExpectedAttendees((int) row[5]);
            b.setStatus((BookingStatus) row[6]);
            repo.save(b);
        }
    }
}

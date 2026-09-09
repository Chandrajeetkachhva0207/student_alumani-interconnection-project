const { sequelize, User, Student, Alumni, Admin, Job, Event, Mentorship, Webinar, Discussion } = require('../models');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    // Sync database
    await sequelize.query('PRAGMA foreign_keys = OFF;');
    await sequelize.sync({ force: true });
    await sequelize.query('PRAGMA foreign_keys = ON;');
    console.log('Database synced');

    // Create Admin User
    const adminUser = await User.create({
      email: 'admin@sai.com',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      isApproved: true,
      isActive: true
    });
    await Admin.create({ userId: adminUser.id, adminLevel: 'super' });
    console.log('Admin user created');

    // Create Students
    const students = [
      {
        user: {
          email: 'student1@sai.com',
          password: 'student123',
          firstName: 'John',
          lastName: 'Doe',
          role: 'student',
          isApproved: true
        },
        profile: {
          studentId: 'STU001',
          major: 'Computer Science',
          year: 'Junior',
          gpa: 3.8,
          skills: ['JavaScript', 'React', 'Node.js', 'Python'],
          interests: ['Web Development', 'AI', 'Machine Learning'],
          bio: 'Passionate about web development and looking for mentorship opportunities.',
          linkedin: 'https://linkedin.com/in/johndoe',
          github: 'https://github.com/johndoe'
        }
      },
      {
        user: {
          email: 'student2@sai.com',
          password: 'student123',
          firstName: 'Jane',
          lastName: 'Smith',
          role: 'student',
          isApproved: true
        },
        profile: {
          studentId: 'STU002',
          major: 'Business Administration',
          year: 'Senior',
          gpa: 3.9,
          skills: ['Marketing', 'Finance', 'Management'],
          interests: ['Entrepreneurship', 'Startups', 'Consulting'],
          bio: 'Business student interested in entrepreneurship and startups.',
          linkedin: 'https://linkedin.com/in/janesmith'
        }
      },
      {
        user: {
          email: 'student3@sai.com',
          password: 'student123',
          firstName: 'Mike',
          lastName: 'Johnson',
          role: 'student',
          isApproved: true
        },
        profile: {
          studentId: 'STU003',
          major: 'Electrical Engineering',
          year: 'Sophomore',
          gpa: 3.7,
          skills: ['Circuit Design', 'Embedded Systems', 'C++'],
          interests: ['IoT', 'Robotics', 'Hardware'],
          bio: 'Engineering student passionate about embedded systems.'
        }
      }
    ];

    const createdStudents = [];
    for (const studentData of students) {
      const user = await User.create(studentData.user);
      const student = await Student.create({ ...studentData.profile, userId: user.id });
      createdStudents.push({ user, student });
    }
    console.log(`${students.length} students created`);

    // Create Alumni
    const alumni = [
      {
        user: {
          email: 'alumni1@sai.com',
          password: 'alumni123',
          firstName: 'Sarah',
          lastName: 'Williams',
          role: 'alumni',
          isApproved: true
        },
        profile: {
          graduationYear: 2020,
          company: 'Google',
          role: 'Senior Software Engineer',
          experience: 4,
          skills: ['Full Stack Development', 'Cloud Computing', 'Team Leadership'],
          bio: 'Senior engineer at Google, passionate about mentoring students.',
          linkedin: 'https://linkedin.com/in/sarahwilliams',
          github: 'https://github.com/sarahwilliams',
          isAvailableForMentorship: true
        }
      },
      {
        user: {
          email: 'alumni2@sai.com',
          password: 'alumni123',
          firstName: 'David',
          lastName: 'Brown',
          role: 'alumni',
          isApproved: true
        },
        profile: {
          graduationYear: 2018,
          company: 'Microsoft',
          role: 'Product Manager',
          experience: 6,
          skills: ['Product Management', 'Strategy', 'Leadership'],
          bio: 'Product manager with experience in tech startups and enterprise.',
          linkedin: 'https://linkedin.com/in/davidbrown',
          isAvailableForMentorship: true
        }
      },
      {
        user: {
          email: 'alumni3@sai.com',
          password: 'alumni123',
          firstName: 'Emily',
          lastName: 'Davis',
          role: 'alumni',
          isApproved: true
        },
        profile: {
          graduationYear: 2019,
          company: 'Amazon',
          role: 'Data Scientist',
          experience: 5,
          skills: ['Machine Learning', 'Data Analysis', 'Python', 'SQL'],
          bio: 'Data scientist working on recommendation systems.',
          linkedin: 'https://linkedin.com/in/emilydavis',
          isAvailableForMentorship: true
        }
      },
      {
        user: {
          email: 'alumni4@sai.com',
          password: 'alumni123',
          firstName: 'Robert',
          lastName: 'Miller',
          role: 'alumni',
          isApproved: true
        },
        profile: {
          graduationYear: 2017,
          company: 'Apple',
          role: 'iOS Developer',
          experience: 7,
          skills: ['Swift', 'iOS Development', 'Mobile UI/UX'],
          bio: 'iOS developer with expertise in mobile app development.',
          linkedin: 'https://linkedin.com/in/robertmiller',
          isAvailableForMentorship: false
        }
      }
    ];

    const createdAlumni = [];
    for (const alumniData of alumni) {
      const user = await User.create(alumniData.user);
      const alumniProfile = await Alumni.create({ ...alumniData.profile, userId: user.id });
      createdAlumni.push({ user, alumni: alumniProfile });
    }
    console.log(`${alumni.length} alumni created`);

    // Create Jobs
    const jobs = [
      {
        title: 'Software Engineering Intern',
        company: 'Google',
        description: 'Join our team as a software engineering intern. Work on cutting-edge projects and learn from industry experts.',
        location: 'Mountain View, CA',
        type: 'Internship',
        requirements: ['Computer Science major', 'Knowledge of Python or Java', 'Strong problem-solving skills'],
        postedBy: createdAlumni[0].user.id,
        applicationLink: 'https://careers.google.com/jobs/123',
        deadline: new Date('2024-06-01'),
        isActive: true
      },
      {
        title: 'Full Stack Developer',
        company: 'Microsoft',
        description: 'We are looking for a full stack developer to join our team. Experience with React and Node.js required.',
        location: 'Seattle, WA',
        type: 'Full-time',
        requirements: ['3+ years experience', 'React', 'Node.js', 'SQL'],
        postedBy: createdAlumni[1].user.id,
        applicationLink: 'https://careers.microsoft.com/jobs/456',
        deadline: new Date('2024-05-15'),
        isActive: true
      },
      {
        title: 'Data Science Intern',
        company: 'Amazon',
        description: 'Internship opportunity for data science students. Work on machine learning projects.',
        location: 'Seattle, WA',
        type: 'Internship',
        requirements: ['Python', 'Machine Learning basics', 'SQL'],
        postedBy: createdAlumni[2].user.id,
        applicationLink: 'https://amazon.jobs/789',
        deadline: new Date('2024-05-20'),
        isActive: true
      }
    ];

    for (const jobData of jobs) {
      await Job.create(jobData);
    }
    console.log(`${jobs.length} jobs created`);

    // Create Events
    const events = [
      {
        title: 'Tech Networking Night',
        description: 'Join us for an evening of networking with industry professionals. Food and drinks provided.',
        date: new Date('2024-04-15T18:00:00'),
        location: 'University Campus - Main Hall',
        eventType: 'Networking',
        createdBy: createdAlumni[0].user.id,
        maxAttendees: 100,
        registrationLink: 'https://events.sai.com/networking-night',
        isActive: true
      },
      {
        title: 'Career Development Workshop',
        description: 'Learn how to build your resume and ace interviews. Workshop includes mock interviews.',
        date: new Date('2024-04-20T14:00:00'),
        location: 'Career Center',
        eventType: 'Workshop',
        createdBy: createdAlumni[1].user.id,
        maxAttendees: 50,
        registrationLink: 'https://events.sai.com/career-workshop',
        isActive: true
      },
      {
        title: 'Data Science Seminar',
        description: 'Introduction to machine learning and data science. Perfect for beginners.',
        date: new Date('2024-04-25T16:00:00'),
        location: 'Online',
        eventType: 'Seminar',
        createdBy: createdAlumni[2].user.id,
        registrationLink: 'https://events.sai.com/data-science-seminar',
        isActive: true
      }
    ];

    for (const eventData of events) {
      await Event.create(eventData);
    }
    console.log(`${events.length} events created`);

    // Create Mentorships
    const mentorships = [
      {
        studentId: createdStudents[0].user.id,
        alumniId: createdAlumni[0].user.id,
        status: 'accepted',
        message: 'I would love to learn about software engineering at Google.',
        startDate: new Date('2024-03-01'),
        endDate: new Date('2024-06-01')
      },
      {
        studentId: createdStudents[1].user.id,
        alumniId: createdAlumni[1].user.id,
        status: 'pending',
        message: 'Interested in product management mentorship.'
      },
      {
        studentId: createdStudents[2].user.id,
        alumniId: createdAlumni[2].user.id,
        status: 'accepted',
        message: 'Looking for guidance in data science career path.'
      }
    ];

    for (const mentorshipData of mentorships) {
      await Mentorship.create(mentorshipData);
    }
    console.log(`${mentorships.length} mentorship requests created`);

    // Create Webinars
    const webinars = [
      {
        title: 'Introduction to React Hooks',
        description: 'Learn the fundamentals of React Hooks and modern React development.',
        date: new Date('2024-04-10T19:00:00'),
        duration: 60,
        organizerId: createdAlumni[0].user.id,
        meetingLink: 'https://zoom.us/j/123456789',
        maxParticipants: 50,
        topics: ['React', 'Hooks', 'Frontend Development'],
        isActive: true
      },
      {
        title: 'Product Management 101',
        description: 'An introduction to product management for students interested in PM roles.',
        date: new Date('2024-04-12T18:00:00'),
        duration: 90,
        organizerId: createdAlumni[1].user.id,
        meetingLink: 'https://zoom.us/j/987654321',
        maxParticipants: 30,
        topics: ['Product Management', 'Career Development'],
        isActive: true
      },
      {
        title: 'Machine Learning Basics',
        description: 'Introduction to machine learning concepts and applications.',
        date: new Date('2024-04-14T17:00:00'),
        duration: 75,
        organizerId: createdAlumni[2].user.id,
        meetingLink: 'https://zoom.us/j/456789123',
        maxParticipants: 40,
        topics: ['Machine Learning', 'Data Science', 'Python'],
        isActive: true
      }
    ];

    for (const webinarData of webinars) {
      await Webinar.create(webinarData);
    }
    console.log(`${webinars.length} webinars created`);

    // Create Discussions
    const discussions = [
      {
        title: 'Best Practices for Technical Interviews',
        content: 'What are your tips for acing technical interviews? Share your experiences and advice.',
        authorId: createdAlumni[0].user.id,
        category: 'Career',
        isPinned: true
      },
      {
        title: 'Summer Internship Opportunities',
        content: 'Has anyone found good summer internship opportunities? Let\'s share resources.',
        authorId: createdStudents[0].user.id,
        category: 'Jobs'
      },
      {
        title: 'Study Groups for CS Courses',
        content: 'Looking for study partners for Data Structures and Algorithms course.',
        authorId: createdStudents[0].user.id,
        category: 'Academic'
      },
      {
        title: 'Networking Tips',
        content: 'How do you effectively network at events? Share your strategies.',
        authorId: createdAlumni[1].user.id,
        category: 'Networking'
      },
      {
        title: 'Upcoming Career Fair',
        content: 'Who\'s attending the career fair next week? Let\'s connect there!',
        authorId: createdStudents[1].user.id,
        category: 'Events'
      }
    ];

    for (const discussionData of discussions) {
      await Discussion.create(discussionData);
    }
    console.log(`${discussions.length} discussions created`);

    console.log('\n✅ Database seeded successfully!');
    console.log('\nLogin Credentials:');
    console.log('Admin: admin@sai.com / admin123');
    console.log('Student: student1@sai.com / student123');
    console.log('Alumni: alumni1@sai.com / alumni123');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await sequelize.close();
  }
};

seedDatabase();

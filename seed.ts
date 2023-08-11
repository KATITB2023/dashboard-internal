import {
  PrismaClient,
  type UserRole,
  type Gender,
  type Campus
} from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

const groups = [
  {
    group: 1,
    zoomLink: 'http://zoom-kelompok-1'
  },
  {
    group: 2,
    zoomLink: 'http://zoom-kelompok-2'
  },
  {
    group: 3,
    zoomLink: 'http://zoom-kelompok-3'
  }
];

const students = [
  {
    nim: '13523001',
    passwordHash: '13523001',
    role: 'STUDENT',
    name: 'Virginia Watkins',
    pin: '000001',
    faculty: 'FTI',
    gender: 'FEMALE',
    campus: 'GANESHA',
    email: 'tigawu@noirko.sn',
    bio: 'BIO 13523001'
  },
  {
    nim: '13523002',
    passwordHash: '13523002',
    role: 'STUDENT',
    name: 'Victor McBride',
    pin: '000002',
    faculty: 'STEI',
    gender: 'MALE',
    campus: 'JATINANGOR',
    email: 'itevow@pivhetwel.fo',
    bio: 'BIO 13523002'
  },
  {
    nim: '13523003',
    passwordHash: '13523003',
    role: 'STUDENT',
    name: 'Milton Daniels',
    pin: '000003',
    faculty: 'SAPPK',
    gender: 'MALE',
    campus: 'CIREBON',
    email: 'reb@emiwfu.lv',
    bio: 'BIO 13523003'
  },
  {
    nim: '13523004',
    passwordHash: '13523004',
    role: 'STUDENT',
    name: 'Gary Padilla',
    pin: '000004',
    faculty: 'SITH',
    gender: 'MALE',
    campus: 'JATINANGOR',
    email: 'buswutec@mof.si',
    bio: 'BIO 13523004'
  },
  {
    nim: '13523005',
    passwordHash: '13523005',
    role: 'STUDENT',
    name: 'Gerald Diaz',
    pin: '000005',
    faculty: 'FTTM',
    gender: 'MALE',
    campus: 'JATINANGOR',
    email: 'keviceru@mazuvpa.kz',
    bio: 'BIO 13523005'
  },
  {
    nim: '13523006',
    passwordHash: '13523006',
    role: 'STUDENT',
    name: 'Loretta Gardner',
    pin: '000006',
    faculty: 'SBM',
    gender: 'FEMALE',
    campus: 'GANESHA',
    email: 'anibuco@alme.bv',
    bio: 'BIO 13523006'
  },
  {
    nim: '13523007',
    passwordHash: '13523007',
    role: 'STUDENT',
    name: 'Gavin Black',
    pin: '000007',
    faculty: 'FTMD',
    gender: 'MALE',
    campus: 'JATINANGOR',
    email: 'tonbuv@pepujvun.sl',
    bio: 'BIO 13523007'
  },
  {
    nim: '13523008',
    passwordHash: '13523008',
    role: 'STUDENT',
    name: 'Clayton Brady',
    pin: '000008',
    faculty: 'STEI',
    gender: 'MALE',
    campus: 'GANESHA',
    email: 'fi@vauzoro.pg',
    bio: 'BIO 13523008'
  },
  {
    nim: '13523009',
    passwordHash: '13523009',
    role: 'STUDENT',
    name: 'Raymond Elliott',
    pin: '000009',
    faculty: 'FTSL',
    gender: 'MALE',
    campus: 'CIREBON',
    email: 'dubi@anuominiw.er',
    bio: 'BIO 13523009'
  },
  {
    nim: '13523010',
    passwordHash: '13523010',
    role: 'STUDENT',
    name: 'Ray Salazar',
    pin: '000010',
    faculty: 'STEI',
    gender: 'MALE',
    campus: 'JATINANGOR',
    email: 'denboligu@pisciblu.dz',
    bio: 'BIO 13523010'
  }
];

const mentors = [
  {
    nim: '13520101',
    passwordHash: '13520101',
    role: 'MENTOR',
    name: 'Winifred McLaughlin',
    pin: '000011',
    faculty: 'FTI',
    gender: 'FEMALE',
    campus: 'GANESHA',
    email: 'gotsadot@ip.bi',
    bio: 'BIO 13523101'
  },
  {
    nim: '13520102',
    passwordHash: '13520102',
    role: 'MENTOR',
    name: 'Jerome Jones',
    pin: '000012',
    faculty: 'FTI',
    gender: 'FEMALE',
    campus: 'GANESHA',
    email: 'kevek@osiwi.bh',
    bio: 'BIO 13523102'
  },
  {
    nim: '13520103',
    passwordHash: '13520103',
    role: 'MENTOR',
    name: 'Gabriel Manning',
    pin: '000013',
    faculty: 'FTI',
    gender: 'FEMALE',
    campus: 'GANESHA',
    email: 'meholenu@paob.kp',
    bio: 'BIO 13523103'
  },
  {
    nim: '13520104',
    passwordHash: '13520104',
    role: 'MENTOR',
    name: 'Jorge Fitzgerald',
    pin: '000014',
    faculty: 'FTI',
    gender: 'FEMALE',
    campus: 'GANESHA',
    email: 'cotelec@sic.as',
    bio: 'BIO 13520104'
  },
  {
    nim: '13520105',
    passwordHash: '13520105',
    role: 'MENTOR',
    name: 'Paul Richards',
    pin: '000015',
    faculty: 'FTI',
    gender: 'FEMALE',
    campus: 'GANESHA',
    email: 'zitako@dutadwav.pn',
    bio: 'BIO 13520105'
  }
];

const admins = [
  {
    nim: '13520001',
    passwordHash: '13520001',
    role: 'ADMIN',
    name: 'Lulu Byrd',
    pin: '000016',
    faculty: 'FTI',
    gender: 'FEMALE',
    campus: 'GANESHA',
    email: 'bo@lohdas.ar',
    bio: 'BIO 13520001'
  },
  {
    nim: '13520002',
    passwordHash: '13520002',
    role: 'ADMIN',
    name: 'Lulu Woods',
    pin: '000017',
    faculty: 'FTI',
    gender: 'FEMALE',
    campus: 'GANESHA',
    email: 'luc@izgadbu.ws',
    bio: 'BIO 13520002'
  },
  {
    nim: '13520003',
    passwordHash: '13520003',
    role: 'ADMIN',
    name: 'Carlos Holmes',
    pin: '000018',
    faculty: 'FTI',
    gender: 'FEMALE',
    campus: 'GANESHA',
    email: 'jilapip@lajir.bo',
    bio: 'BIO 13520003'
  }
];

const eos = [
  {
    nim: '13521001',
    passwordHash: '13521001',
    role: 'EO',
    name: 'Cecilia Matthews',
    pin: '000019',
    faculty: 'FTI',
    gender: 'FEMALE',
    campus: 'GANESHA',
    email: 'ipto@dow.ee',
    bio: 'BIO 13521001'
  },
  {
    nim: '13521002',
    passwordHash: '13521002',
    role: 'EO',
    name: 'Alma Franklin',
    pin: '000020',
    faculty: 'FTI',
    gender: 'FEMALE',
    campus: 'GANESHA',
    email: 'lohew@bi.gm',
    bio: 'BIO 13521002'
  },
  {
    nim: '13521003',
    passwordHash: '13521003',
    role: 'EO',
    name: 'Carlos Walters',
    pin: '000021',
    faculty: 'FTI',
    gender: 'FEMALE',
    campus: 'GANESHA',
    email: 'pize@fiwuka.tp',
    bio: 'BIO 13521003'
  }
];

async function main() {
  const getRandomInt = (max: number) => {
    return Math.floor(Math.random() * max);
  };

  await Promise.all(
    groups.map(async (group) => {
      return await prisma.group.create({
        data: {
          group: group.group
        }
      });
    })
  );

  await Promise.all(
    students.map(async (student) => {
      return await prisma.user.create({
        data: {
          nim: student.nim,
          passwordHash: await hash(student.passwordHash, 10),
          role: student.role as UserRole,
          profile: {
            create: {
              name: student.name,
              pin: student.pin,
              faculty: student.faculty,
              gender: student.gender as Gender,
              campus: student.campus as Campus,
              email: student.email,
              bio: student.bio
            }
          }
        }
      });
    })
  );

  await Promise.all(
    mentors.map(async (mentor) => {
      return await prisma.user.create({
        data: {
          nim: mentor.nim,
          passwordHash: await hash(mentor.passwordHash, 10),
          role: mentor.role as UserRole,
          profile: {
            create: {
              name: mentor.name,
              pin: mentor.pin,
              faculty: mentor.faculty,
              gender: mentor.gender as Gender,
              campus: mentor.campus as Campus,
              email: mentor.email,
              bio: mentor.bio
            }
          }
        }
      });
    })
  );

  await Promise.all(
    admins.map(async (admin) => {
      return await prisma.user.create({
        data: {
          nim: admin.nim,
          passwordHash: await hash(admin.passwordHash, 10),
          role: admin.role as UserRole,
          profile: {
            create: {
              name: admin.name,
              pin: admin.pin,
              faculty: admin.faculty,
              gender: admin.gender as Gender,
              campus: admin.campus as Campus,
              email: admin.email,
              bio: admin.bio
            }
          }
        }
      });
    })
  );

  await Promise.all(
    eos.map(async (eo) => {
      return await prisma.user.create({
        data: {
          nim: eo.nim,
          passwordHash: await hash(eo.passwordHash, 10),
          role: eo.role as UserRole,
          profile: {
            create: {
              name: eo.name,
              pin: eo.pin,
              faculty: eo.faculty,
              gender: eo.gender as Gender,
              campus: eo.campus as Campus,
              email: eo.email,
              bio: eo.bio
            }
          }
        }
      });
    })
  );

  const studentsData = await prisma.user.findMany({
    where: {
      role: 'STUDENT'
    },
    select: {
      id: true
    }
  });

  const mentorsData = await prisma.user.findMany({
    where: {
      role: 'MENTOR'
    },
    select: {
      id: true
    }
  });

  const groupsData = await prisma.group.findMany({
    select: {
      id: true
    }
  });

  await Promise.all(
    studentsData.map(async (data) => {
      return await prisma.groupRelation.create({
        data: {
          userId: data.id,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          groupId: groupsData[getRandomInt(3)]!.id
        }
      });
    })
  );

  await Promise.all(
    mentorsData.map(async (data) => {
      return await prisma.groupRelation.create({
        data: {
          userId: data.id,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          groupId: groupsData[getRandomInt(3)]!.id
        }
      });
    })
  );

  const studentGroup1 = await prisma.groupRelation.findMany({
    where: {
      group: {
        group: 1
      },
      user: {
        role: 'STUDENT'
      }
    },
    select: {
      userId: true
    }
  });

  const mentorGroup1 = await prisma.groupRelation.findMany({
    where: {
      group: {
        group: 1
      },
      user: {
        role: 'MENTOR'
      }
    },
    select: {
      userId: true
    }
  });

  await Promise.all(
    studentGroup1.map((student) => {
      return mentorGroup1.map(async (mentor) => {
        return await prisma.studentMentor.create({
          data: {
            studentId: student.userId,
            mentorId: mentor.userId
          }
        });
      });
    })
  );

  const studentGroup2 = await prisma.groupRelation.findMany({
    where: {
      group: {
        group: 2
      },
      user: {
        role: 'STUDENT'
      }
    },
    select: {
      userId: true
    }
  });

  const mentorGroup2 = await prisma.groupRelation.findMany({
    where: {
      group: {
        group: 2
      },
      user: {
        role: 'MENTOR'
      }
    },
    select: {
      userId: true
    }
  });

  await Promise.all(
    studentGroup2.map((student) => {
      return mentorGroup2.map(async (mentor) => {
        return await prisma.studentMentor.create({
          data: {
            studentId: student.userId,
            mentorId: mentor.userId
          }
        });
      });
    })
  );

  const studentGroup3 = await prisma.groupRelation.findMany({
    where: {
      group: {
        group: 3
      },
      user: {
        role: 'STUDENT'
      }
    },
    select: {
      userId: true
    }
  });

  const mentorGroup3 = await prisma.groupRelation.findMany({
    where: {
      group: {
        group: 3
      },
      user: {
        role: 'MENTOR'
      }
    },
    select: {
      userId: true
    }
  });

  await Promise.all(
    studentGroup3.map((student) => {
      return mentorGroup3.map(async (mentor) => {
        return await prisma.studentMentor.create({
          data: {
            studentId: student.userId,
            mentorId: mentor.userId
          }
        });
      });
    })
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

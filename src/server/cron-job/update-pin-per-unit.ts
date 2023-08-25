import { schedule } from 'node-cron';
import { randomBytes } from 'crypto';
import { prisma } from '~/server/db';

// Update pin per unit every 5 minutes
export const updatePinPerUnitSchedule = schedule(
  '*/5 * * * *',
  () => {
    void prisma.$transaction(async (tx) => {
      const units = await tx.unitProfile.findMany({
        select: {
          pin: true
        }
      });

      const pinPerUnit = units.reduce((acc, unit) => {
        let newPin: string;

        do {
          newPin = randomBytes(3).toString('hex').toUpperCase();
        } while (Object.values(acc).includes(newPin));

        acc[unit.pin] = newPin;

        return acc;
      }, {} as Record<string, string>);

      await Promise.allSettled(
        Object.keys(pinPerUnit).map((pin) => {
          return tx.unitProfile.update({
            where: {
              pin
            },
            data: {
              pin: pinPerUnit[pin]
            }
          });
        })
      );

      console.log('Update pin per unit');
    });
  },
  {
    scheduled: true,
    timezone: 'Asia/Jakarta'
  }
);

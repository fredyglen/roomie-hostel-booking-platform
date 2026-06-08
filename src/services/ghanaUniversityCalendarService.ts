export interface BookingDuration {
  moveInDate: Date;
  moveOutDate: Date;
  durationInMonths: number;
}

export function calculateIntelligentBookingDuration(
  moveInDate: Date,
  durationType: string
): BookingDuration {
  const moveOutDate = new Date(moveInDate);

  switch (durationType) {
    case "full_academic_year":
      moveOutDate.setMonth(moveOutDate.getMonth() + 9);
      break;

    case "one_semester":
    default:
      moveOutDate.setMonth(moveOutDate.getMonth() + 4);
      break;
  }

  return {
    moveInDate,
    moveOutDate,
    durationInMonths:
      durationType === "full_academic_year" ? 9 : 4,
  };
}

export function getAvailableDurationOptions() {
  return [
    {
      value: "one_semester",
      label: "One Semester",
    },
    {
      value: "full_academic_year",
      label: "Full Academic Year",
    },
  ];
}

export function getSemesterInfo(date: Date) {
  const now = new Date();

  const semesterStart = new Date(
    date.getFullYear(),
    7,
    1
  ); // Aug 1

  const semesterEnd = new Date(
    date.getFullYear(),
    11,
    15
  ); // Dec 15

  const isActive =
    now >= semesterStart &&
    now <= semesterEnd;

  return {
    semester: {
      name: "Current Semester",
      startDate: semesterStart,
      endDate: semesterEnd,
    },
    isActive,
    daysUntilStart: Math.max(
      0,
      Math.ceil(
        (semesterStart.getTime() - now.getTime()) /
          (1000 * 60 * 60 * 24)
      )
    ),
    daysUntilEnd: Math.max(
      0,
      Math.ceil(
        (semesterEnd.getTime() - now.getTime()) /
          (1000 * 60 * 60 * 24)
      )
    ),
  };
}
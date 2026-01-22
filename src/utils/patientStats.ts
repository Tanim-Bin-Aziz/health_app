export interface Patient {
  createdAt: string;
}

export function getPatientStats(patients: Patient[]) {
  const now = new Date();

  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();

  const lastMonthDate = new Date(thisYear, thisMonth - 1, 1);
  const lastMonth = lastMonthDate.getMonth();
  const lastMonthYear = lastMonthDate.getFullYear();

  const thisMonthPatients = patients.filter((p) => {
    const d = new Date(p.createdAt);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  });

  const lastMonthPatients = patients.filter((p) => {
    const d = new Date(p.createdAt);
    return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
  });

  let growth = 0;
  if (lastMonthPatients.length > 0) {
    growth = Math.round(
      ((thisMonthPatients.length - lastMonthPatients.length) /
        lastMonthPatients.length) *
        100,
    );
  }

  return {
    total: patients.length,
    thisMonth: thisMonthPatients.length,
    growth,
  };
}
